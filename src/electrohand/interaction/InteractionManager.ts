import * as THREE from 'three';
import { SceneManager } from '../scene/SceneManager';
import { Cable } from '../scene/Cable';
import { Terminal } from '../scene/Terminal';
import { GestureDetectionResult, CableId, TerminalId, ToastMessage } from '../types';
import { soundEffects } from '../audio/SoundEffects';

export interface InteractionCallbacks {
  onToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  onConnectionChange: (completedCount: number, isFullyConnected: boolean) => void;
  onHoverTerminalChange?: (terminal: Terminal | null) => void;
}

export class InteractionManager {
  private sceneManager: SceneManager;
  private callbacks: InteractionCallbacks;

  // Active dragged cable
  public activeCable: Cable | null = null;
  private wasPinching: boolean = false;

  // Interaction thresholds
  public pickupRadius: number = 1.35; // Maximum distance to pick up connector in 3D
  public snapRadius: number = 1.25;   // Maximum distance to snap into terminal
  public approachRadius: number = 1.6; // Distance to preview terminal highlight

  private hoveredTerminal: Terminal | null = null;

  constructor(sceneManager: SceneManager, callbacks: InteractionCallbacks) {
    this.sceneManager = sceneManager;
    this.callbacks = callbacks;
  }

  /**
   * Process incoming hand gesture frame
   */
  public handleGestureFrame(result: GestureDetectionResult) {
    if (!result.isHandDetected) {
      // If hand lost while dragging, release cable gracefully
      if (this.activeCable) {
        this.releaseActiveCable(null);
      }
      this.wasPinching = false;
      this.sceneManager.updateHandCursor(null, false, false);
      return;
    }

    const worldPoint = this.sceneManager.projectScreenToWorld(
      result.screenPoint.x,
      result.screenPoint.y
    );

    // Update 3D hand reticle
    this.sceneManager.updateHandCursor(worldPoint, result.isPinching, true);

    if (!worldPoint) {
      this.wasPinching = result.isPinching;
      return;
    }

    // Edge-triggered pinch start
    if (result.isPinching && !this.wasPinching) {
      this.tryPickupNearestCable(worldPoint);
    }
    // Continuous drag
    else if (result.isPinching && this.wasPinching && this.activeCable) {
      this.updateDragPosition(worldPoint);
    }
    // Edge-triggered pinch release
    else if (!result.isPinching && this.wasPinching && this.activeCable) {
      this.releaseActiveCable(worldPoint);
    }

    this.wasPinching = result.isPinching;
  }

  /**
   * Mouse / Pointer fallback: Start drag
   */
  public handlePointerDown(screenX: number, screenY: number) {
    const worldPoint = this.sceneManager.projectScreenToWorld(screenX, screenY);
    if (!worldPoint) return;
    this.tryPickupNearestCable(worldPoint);
    this.sceneManager.updateHandCursor(worldPoint, true, true);
  }

  /**
   * Mouse / Pointer fallback: Move drag
   */
  public handlePointerMove(screenX: number, screenY: number) {
    const worldPoint = this.sceneManager.projectScreenToWorld(screenX, screenY);
    if (!worldPoint) return;
    if (this.activeCable) {
      this.updateDragPosition(worldPoint);
      this.sceneManager.updateHandCursor(worldPoint, true, true);
    } else {
      this.sceneManager.updateHandCursor(worldPoint, false, true);
    }
  }

  /**
   * Mouse / Pointer fallback: Release drag
   */
  public handlePointerUp(screenX: number, screenY: number) {
    const worldPoint = this.sceneManager.projectScreenToWorld(screenX, screenY);
    if (this.activeCable) {
      this.releaseActiveCable(worldPoint);
    }
    this.sceneManager.updateHandCursor(worldPoint, false, true);
  }

  /**
   * Find and grab the closest cable connector if within selection radius
   */
  private tryPickupNearestCable(worldPoint: THREE.Vector3) {
    let closestCable: Cable | null = null;
    let minDistance = Infinity;

    for (const cable of this.sceneManager.cables.values()) {
      // Calculate distance from pinch point to connector position
      const dist = worldPoint.distanceTo(cable.currentPos);
      if (dist < minDistance && dist <= this.pickupRadius) {
        minDistance = dist;
        closestCable = cable;
      }
    }

    if (closestCable) {
      this.activeCable = closestCable;
      
      // If was previously connected to a terminal, disconnect that terminal
      if (this.activeCable.connectedTerminalId) {
        const prevTerm = this.sceneManager.terminals.get(this.activeCable.connectedTerminalId);
        if (prevTerm) {
          prevTerm.setConnected(null);
        }
      }

      this.activeCable.startDrag();
      soundEffects.playGrab();

      this.callbacks.onToast({
        textUz: `Ushlandi: ${this.activeCable.definition.nameUz}`,
        type: 'info'
      });

      this.checkCircuitStatus();
    }
  }

  /**
   * Update connector position and highlight approaching terminals
   */
  private updateDragPosition(worldPoint: THREE.Vector3) {
    if (!this.activeCable) return;

    this.activeCable.setTargetPosition(worldPoint.x, worldPoint.y, 0.45);

    // Check proximity to all terminals
    let nearTerm: Terminal | null = null;
    let minTermDist = Infinity;

    for (const term of this.sceneManager.terminals.values()) {
      const dist = worldPoint.distanceTo(term.position);
      if (dist < minTermDist && dist <= this.approachRadius) {
        minTermDist = dist;
        nearTerm = term;
      }
    }

    // Reset previous hover if changed
    if (this.hoveredTerminal && this.hoveredTerminal !== nearTerm) {
      this.hoveredTerminal.setHoverState(false);
      this.hoveredTerminal = null;
    }

    if (nearTerm) {
      this.hoveredTerminal = nearTerm;
      const isCompatible = this.activeCable.definition.expectedTerminalId === nearTerm.definition.id;
      nearTerm.setHoverState(true, isCompatible);
    }

    if (this.callbacks.onHoverTerminalChange) {
      this.callbacks.onHoverTerminalChange(this.hoveredTerminal);
    }
  }

  /**
   * When user releases pinch, validate connection or reject
   */
  private releaseActiveCable(worldPoint: THREE.Vector3 | null) {
    if (!this.activeCable) return;

    const cable = this.activeCable;
    this.activeCable = null;

    // Reset terminal hover halos
    if (this.hoveredTerminal) {
      this.hoveredTerminal.setHoverState(false);
      this.hoveredTerminal = null;
    }

    if (!worldPoint) {
      cable.returnToRest();
      this.callbacks.onToast({
        textUz: 'Kabel ulanmagan',
        type: 'warning'
      });
      return;
    }

    // Find closest terminal to release point
    let targetTerm: Terminal | null = null;
    let minDistance = Infinity;

    for (const term of this.sceneManager.terminals.values()) {
      const dist = worldPoint.distanceTo(term.position);
      if (dist < minDistance && dist <= this.snapRadius) {
        minDistance = dist;
        targetTerm = term;
      }
    }

    // Case 1: Close to terminal
    if (targetTerm) {
      const isCorrect = cable.definition.expectedTerminalId === targetTerm.definition.id;

      if (isCorrect) {
        // Success! Snap connector into terminal
        targetTerm.setConnected(cable.definition.id);
        cable.snapToTerminal(targetTerm.definition.id, targetTerm.position);

        soundEffects.playConnect();
        this.sceneManager.triggerSparks(targetTerm.position, 0x10b981);

        this.callbacks.onToast({
          textUz: `Ulandi! ${cable.definition.nameUz} ➔ ${targetTerm.definition.nameUz}`,
          type: 'success'
        });

        this.checkCircuitStatus();
      } else {
        // Incorrect terminal: Reject and spring back to rest
        cable.returnToRest();
        soundEffects.playError();
        this.sceneManager.triggerSparks(targetTerm.position, 0xef4444);

        this.callbacks.onToast({
          textUz: `Noto‘g‘ri port! ${cable.definition.nameUz} bu portga to‘g‘ri kelmaydi.`,
          type: 'error'
        });

        this.checkCircuitStatus();
      }
    }
    // Case 2: Released in empty space
    else {
      cable.returnToRest();
      soundEffects.playError();

      this.callbacks.onToast({
        textUz: 'Kabel ulanmagan',
        type: 'warning'
      });

      this.checkCircuitStatus();
    }
  }

  /**
   * Check how many cables are properly connected and activate circuit if 100%
   */
  public checkCircuitStatus() {
    let connectedCount = 0;
    const totalCount = this.sceneManager.cables.size;

    this.sceneManager.cables.forEach(cable => {
      if (cable.state === 'CONNECTED' && cable.connectedTerminalId === cable.definition.expectedTerminalId) {
        connectedCount++;
      }
    });

    const isFullyConnected = connectedCount === totalCount;

    if (isFullyConnected) {
      this.sceneManager.circuitBoard.setPowered(true);
      soundEffects.playVictory();
    } else {
      this.sceneManager.circuitBoard.setPowered(false);
    }

    this.callbacks.onConnectionChange(connectedCount, isFullyConnected);
  }
}
