import * as THREE from 'three';
import { WorkbenchScene } from '../scene/WorkbenchScene';
import { ComponentObject3D } from '../scene/ComponentObject3D';
import { BreadboardModel } from '../breadboard/BreadboardModel';
import { ComponentInstance, JumperWire, HandTrackingState, BreadboardHole } from '../types';
import { soundEffects } from '../audio/SoundEffects';

export interface LabInteractionCallbacks {
  onSelectComponent: (comp: ComponentInstance | null) => void;
  onComponentMoved: (comp: ComponentInstance) => void;
  onWireCreated: (wire: JumperWire) => void;
  onWireDeleted: (wireId: string) => void;
  onToast: (textUz: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onProbeTouch?: (hole: BreadboardHole, worldPos: THREE.Vector3) => void;
}

export class LabInteractionManager {
  private scene: WorkbenchScene;
  private breadboardModel: BreadboardModel;
  private callbacks: LabInteractionCallbacks;

  // Active dragged component
  public draggedComponent: ComponentObject3D | null = null;
  private dragOffset: THREE.Vector3 = new THREE.Vector3();

  // Active wire drawing state
  public isDrawingWire: boolean = false;
  private wireStartHoleOrPin: { id: string; pos: THREE.Vector3 } | null = null;
  public activeWireColor: string = '#ef4444'; // Red default

  // Hand tracking state
  private wasPinching: boolean = false;
  public activeMode: 'select' | 'wire' | 'multimeter' | 'delete_wire' = 'select';

  constructor(scene: WorkbenchScene, breadboardModel: BreadboardModel, callbacks: LabInteractionCallbacks) {
    this.scene = scene;
    this.breadboardModel = breadboardModel;
    this.callbacks = callbacks;
  }

  public setMode(mode: 'select' | 'wire' | 'multimeter' | 'delete_wire') {
    this.activeMode = mode;
    if (this.isDrawingWire) {
      this.cancelWireDrawing();
    }
    // Clear wire hovers when leaving delete mode
    if (mode !== 'delete_wire') {
      this.scene.wireObjects.forEach(w => w.setHovered(false));
    }
    this.scene.setMultimeterVisible(mode === 'multimeter');
  }

  public setWireColor(color: string) {
    this.activeWireColor = color;
  }

  /**
   * Process webcam hand gesture frame
   */
  public handleGestureFrame(tracking: HandTrackingState) {
    if (!tracking.isHandDetected) {
      if (this.draggedComponent) {
        this.dropComponent();
      }
      if (this.isDrawingWire) {
        this.cancelWireDrawing();
      }
      this.wasPinching = false;
      this.scene.updateHandCursor(null, false, false);
      return;
    }

    const worldPoint = this.scene.projectScreenToBoard(tracking.screenPoint.x, tracking.screenPoint.y);
    this.scene.updateHandCursor(worldPoint, tracking.isPinching, true);

    if (!worldPoint) {
      this.wasPinching = tracking.isPinching;
      return;
    }

    // 1. Pinch Start
    if (tracking.isPinching && !this.wasPinching) {
      this.handlePinchStart(worldPoint);
    }
    // 2. Pinch Drag
    else if (tracking.isPinching && this.wasPinching) {
      this.handlePinchDrag(worldPoint);
    }
    // 3. Pinch Release
    else if (!tracking.isPinching && this.wasPinching) {
      this.handlePinchRelease(worldPoint);
    }

    this.wasPinching = tracking.isPinching;
  }

  /**
   * Mouse pointer down
   */
  public handlePointerDown(screenX: number, screenY: number) {
    const worldPoint = this.scene.projectScreenToBoard(screenX, screenY);
    if (!worldPoint) return;
    this.handlePinchStart(worldPoint);
  }

  /**
   * Mouse pointer move
   */
  public handlePointerMove(screenX: number, screenY: number) {
    const worldPoint = this.scene.projectScreenToBoard(screenX, screenY);
    if (!worldPoint) return;

    if (this.draggedComponent || this.isDrawingWire) {
      this.handlePinchDrag(worldPoint);
    } else {
      // Hover check
      this.checkHover(worldPoint);
    }
  }

  /**
   * Mouse pointer up
   */
  public handlePointerUp(screenX: number, screenY: number) {
    const worldPoint = this.scene.projectScreenToBoard(screenX, screenY);
    this.handlePinchRelease(worldPoint);
  }

  // --- Internal Gesture Actions ---

  private handlePinchStart(worldPoint: THREE.Vector3) {
    // Mode D: Delete wire mode
    if (this.activeMode === 'delete_wire') {
      this.tryDeleteNearestWire(worldPoint);
      return;
    }

    // Mode C: Multimeter probe touch
    if (this.activeMode === 'multimeter') {
      const nearestHole = this.breadboardModel.findNearestHole(worldPoint.x, worldPoint.y, 0.45);
      if (nearestHole) {
        const pos = new THREE.Vector3(nearestHole.position.x, nearestHole.position.y, 0.35);
        this.callbacks.onProbeTouch?.(nearestHole, pos);
        return;
      }
    }

    // Mode A: Wire drawing mode
    if (this.activeMode === 'wire') {
      const nearestHole = this.breadboardModel.findNearestHole(worldPoint.x, worldPoint.y, 0.4);
      if (nearestHole) {
        this.startWireDrawing(nearestHole.id, new THREE.Vector3(nearestHole.position.x, nearestHole.position.y, 0.35));
        return;
      }
    }

    // Mode B: Select or Drag Component
    let closestComp: ComponentObject3D | null = null;
    let minDist = 0.85;

    for (const compObj of this.scene.componentObjects.values()) {
      const dist = worldPoint.distanceTo(compObj.group.position);
      if (dist < minDist) {
        minDist = dist;
        closestComp = compObj;
      }
    }

    if (closestComp) {
      this.draggedComponent = closestComp;
      this.dragOffset.copy(closestComp.group.position).sub(worldPoint);
      this.scene.controls.enabled = false; // Disable orbit while dragging

      this.scene.componentObjects.forEach(c => c.setSelected(false));
      closestComp.setSelected(true);
      this.callbacks.onSelectComponent(closestComp.instance);
      soundEffects.playGrab();
    } else {
      // Clicked on empty space: deselect
      this.scene.componentObjects.forEach(c => c.setSelected(false));
      this.callbacks.onSelectComponent(null);
    }
  }

  private handlePinchDrag(worldPoint: THREE.Vector3) {
    // 1. Dragging a component
    if (this.draggedComponent) {
      const targetX = worldPoint.x + this.dragOffset.x;
      const targetY = worldPoint.y + this.dragOffset.y;

      // Snapping to breadboard pitch
      const snapped = this.breadboardModel.snapPositionToHole(targetX, targetY);
      this.draggedComponent.setPosition(snapped.x, snapped.y, 0.1);
    }

    // 2. Drawing a wire
    if (this.isDrawingWire && this.wireStartHoleOrPin) {
      if (!this.scene.tempWireObject) {
        const dummyWire: JumperWire = {
          id: 'temp_wire',
          color: this.activeWireColor,
          startNode: this.wireStartHoleOrPin.id,
          startPos: { x: this.wireStartHoleOrPin.pos.x, y: this.wireStartHoleOrPin.pos.y, z: 0.35 },
          endNode: 'temp',
          endPos: { x: worldPoint.x, y: worldPoint.y, z: 0.35 }
        };
        this.scene.tempWireObject = this.scene.addWire(dummyWire);
      } else {
        this.scene.tempWireObject.updateEndpoints(this.wireStartHoleOrPin.pos, worldPoint);
      }
    }
  }

  private handlePinchRelease(worldPoint: THREE.Vector3 | null) {
    this.scene.controls.enabled = true; // Re-enable orbit controls

    // 1. Drop component
    if (this.draggedComponent) {
      this.dropComponent();
    }

    // 2. Complete wire drawing
    if (this.isDrawingWire && this.wireStartHoleOrPin && worldPoint) {
      const nearestHole = this.breadboardModel.findNearestHole(worldPoint.x, worldPoint.y, 0.45);
      if (nearestHole && nearestHole.id !== this.wireStartHoleOrPin.id) {
        // Create permanent jumper wire
        const newWire: JumperWire = {
          id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          color: this.activeWireColor,
          startNode: this.wireStartHoleOrPin.id,
          startPos: { x: this.wireStartHoleOrPin.pos.x, y: this.wireStartHoleOrPin.pos.y, z: 0.35 },
          endNode: nearestHole.id,
          endPos: { x: nearestHole.position.x, y: nearestHole.position.y, z: 0.35 }
        };

        this.cancelWireDrawing();
        this.scene.addWire(newWire);
        this.callbacks.onWireCreated(newWire);
        soundEffects.playConnect();
        this.callbacks.onToast(`Sim ulandi: ${this.wireStartHoleOrPin.id} ➔ ${nearestHole.id}`, 'success');
      } else {
        this.cancelWireDrawing();
      }
    }
  }

  private dropComponent() {
    if (!this.draggedComponent) return;

    const comp = this.draggedComponent;
    this.draggedComponent = null;

    // Pin connections update
    const pinWorldPositions = comp.getPinWorldPositions();
    pinWorldPositions.forEach(({ pin, worldPos }) => {
      const nearestHole = this.breadboardModel.findNearestHole(worldPos.x, worldPos.y, 0.3);
      if (nearestHole) {
        comp.instance.pinConnections[pin.id] = nearestHole.id;
      } else {
        comp.instance.pinConnections[pin.id] = null;
      }
    });

    soundEffects.playGrab();
    this.callbacks.onComponentMoved(comp.instance);
  }

  private startWireDrawing(startId: string, startPos: THREE.Vector3) {
    this.isDrawingWire = true;
    this.wireStartHoleOrPin = { id: startId, pos: startPos };
    this.scene.controls.enabled = false;
    soundEffects.playGrab();
    this.callbacks.onToast('Simni kerakli ikkinchi teshikka torting va qo‘yib yuboring', 'info');
  }

  private cancelWireDrawing() {
    this.isDrawingWire = false;
    this.wireStartHoleOrPin = null;
    this.scene.controls.enabled = true;
    if (this.scene.tempWireObject) {
      this.scene.removeWire('temp_wire');
      this.scene.tempWireObject = null;
    }
  }

  private checkHover(worldPoint: THREE.Vector3) {
    if (this.activeMode === 'multimeter') {
      const nearestHole = this.breadboardModel.findNearestHole(worldPoint.x, worldPoint.y, 0.45);
      if (nearestHole) {
        this.scene.setRedProbePosition(new THREE.Vector3(nearestHole.position.x, nearestHole.position.y, 0.35), true);
      } else {
        this.scene.setRedProbePosition(new THREE.Vector3(worldPoint.x, worldPoint.y, 0.45), false);
      }
      return;
    }

    // Delete wire mode: highlight closest wire
    if (this.activeMode === 'delete_wire') {
      let closestWire = null;
      let minDist = 0.6;
      this.scene.wireObjects.forEach(w => {
        if (w.data.id === 'temp_wire') return;
        const mid = w.getMidpoint();
        const dist = worldPoint.distanceTo(mid);
        if (dist < minDist) {
          minDist = dist;
          closestWire = w;
        }
      });
      this.scene.wireObjects.forEach(w => w.setHovered(false));
      if (closestWire) (closestWire as (typeof this.scene.wireObjects extends Map<string, infer V> ? V : never)).setHovered(true);
      return;
    }

    for (const compObj of this.scene.componentObjects.values()) {
      const dist = worldPoint.distanceTo(compObj.group.position);
      compObj.setHovered(dist < 0.85);
    }
  }

  /** Delete the wire closest to the given world point */
  private tryDeleteNearestWire(worldPoint: THREE.Vector3) {
    let closestId: string | null = null;
    let minDist = 0.7;

    this.scene.wireObjects.forEach((w, id) => {
      if (id === 'temp_wire') return;
      const mid = w.getMidpoint();
      const dist = worldPoint.distanceTo(mid);
      if (dist < minDist) {
        minDist = dist;
        closestId = id;
      }
    });

    if (closestId) {
      this.scene.removeWire(closestId);
      this.callbacks.onWireDeleted(closestId);
      soundEffects.playReset();
      this.callbacks.onToast('Sim o\'chirildi.', 'info');
    } else {
      this.callbacks.onToast('Sim topilmadi. Silmoqchi bo\'lgan simingizga yaqinroq bosing.', 'warning');
    }
  }
}
