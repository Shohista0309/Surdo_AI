import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BreadboardModel } from '../breadboard/BreadboardModel';
import { BreadboardMesh } from './BreadboardMesh';
import { ComponentObject3D } from './ComponentObject3D';
import { JumperWire3D } from './JumperWire3D';
import { MultimeterProbe3D } from './MultimeterProbe3D';
import { ComponentInstance, JumperWire } from '../types';

export class WorkbenchScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public breadboardModel: BreadboardModel;
  public breadboardMesh: BreadboardMesh;

  public componentObjects: Map<string, ComponentObject3D> = new Map();
  public wireObjects: Map<string, JumperWire3D> = new Map();

  // Temporary wire while drawing
  public tempWireObject: JumperWire3D | null = null;

  // Virtual Multimeter Probes
  public redProbe: MultimeterProbe3D;
  public blackProbe: MultimeterProbe3D;

  // 3D Hand Cursor
  public handCursor: THREE.Group;
  private handCursorRingMat!: THREE.MeshBasicMaterial;

  private interactionPlane: THREE.Plane;
  private raycaster: THREE.Raycaster;
  private container: HTMLElement;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -BreadboardModel.BOARD_DEPTH);

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060b17); // Dark laboratory room
    this.scene.fog = new THREE.FogExp2(0x060b17, 0.035);

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.resetCameraView();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2.05; // Don't flip below desk
    this.controls.minDistance = 3.0;
    this.controls.maxDistance = 22.0;
    this.controls.target.set(0, 0, 0.35);

    // 5. Lighting
    this.setupLighting();

    // 6. Workbench Desk
    this.setupDeskSurface();

    // 7. Breadboard
    this.breadboardModel = new BreadboardModel();
    this.breadboardMesh = new BreadboardMesh(this.breadboardModel);
    this.scene.add(this.breadboardMesh.group);

    // 8. 3D Hand Reticle
    this.handCursor = this.createHandCursor();
    this.scene.add(this.handCursor);

    // 9. Multimeter 3D Probes
    this.redProbe = new MultimeterProbe3D(true);
    this.blackProbe = new MultimeterProbe3D(false);
    this.scene.add(this.redProbe.group);
    this.scene.add(this.blackProbe.group);

    // Default black probe to bottom ground rail
    this.blackProbe.setPosition(0, -3.81, BreadboardModel.BOARD_DEPTH + 0.05);
    this.blackProbe.setContact(true);
    this.setMultimeterVisible(false);

    // Resize listener
    window.addEventListener('resize', this.onResize);

    // Start render loop
    this.startLoop();
  }

  private setupLighting() {
    // Ambient soft navy fill
    const ambient = new THREE.AmbientLight(0x1e293b, 1.4);
    this.scene.add(ambient);

    // Key Light from top-front
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, -7, 12);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    // Electric Cyan Rim Light
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.2);
    cyanRim.position.set(-8, 6, 6);
    this.scene.add(cyanRim);

    // Amber Rim Light
    const amberRim = new THREE.DirectionalLight(0xf59e0b, 0.8);
    amberRim.position.set(8, -4, 5);
    this.scene.add(amberRim);
  }

  private setupDeskSurface() {
    // Workbench mat slab
    const deskGeo = new THREE.BoxGeometry(24, 18, 0.4);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark ESD-safe anti-static rubber mat
      roughness: 0.8,
      metalness: 0.1
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0, -0.2);
    desk.receiveShadow = true;
    this.scene.add(desk);

    // Mat border trim (Cyan accent)
    const trimGeo = new THREE.BoxGeometry(24.4, 18.4, 0.1);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.5, roughness: 0.3 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0, -0.35);
    this.scene.add(trim);
  }

  private createHandCursor(): THREE.Group {
    const group = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.3, 0.38, 32);
    this.handCursorRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, this.handCursorRingMat);
    group.add(ring);

    const dotGeo = new THREE.CircleGeometry(0.06, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.z = 0.01;
    group.add(dot);

    group.position.set(0, 0, -10); // hidden initially
    return group;
  }

  public resetCameraView() {
    this.camera.position.set(0, -7.5, 9.5);
    this.camera.lookAt(0, 0, 0.35);
    if (this.controls) {
      this.controls.target.set(0, 0, 0.35);
      this.controls.update();
    }
  }

  /**
   * Project screen [0, 1] to 3D world on breadboard surface plane
   */
  public projectScreenToBoard(screenX: number, screenY: number): THREE.Vector3 | null {
    const ndcX = screenX * 2 - 1;
    const ndcY = -(screenY * 2 - 1);

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const target = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.interactionPlane, target);

    if (hit) {
      target.z = BreadboardModel.BOARD_DEPTH + 0.05;
      return target;
    }
    return null;
  }

  public updateHandCursor(worldPos: THREE.Vector3 | null, isPinching: boolean, isVisible: boolean) {
    if (!isVisible || !worldPos) {
      this.handCursorRingMat.opacity = 0;
      this.handCursor.position.set(0, 0, -10);
      return;
    }

    this.handCursor.position.copy(worldPos);
    this.handCursor.position.z += 0.08;
    this.handCursorRingMat.opacity = 0.85;

    if (isPinching) {
      this.handCursorRingMat.color.setHex(0x10b981); // Green pinch
      this.handCursor.scale.set(0.65, 0.65, 1);
    } else {
      this.handCursorRingMat.color.setHex(0x00f0ff); // Cyan open
      this.handCursor.scale.set(1.0, 1.0, 1);
    }
  }

  /**
   * Add a component to 3D scene
   */
  public addComponent(instance: ComponentInstance): ComponentObject3D {
    const obj = new ComponentObject3D(instance);
    this.componentObjects.set(instance.id, obj);
    this.scene.add(obj.group);
    return obj;
  }

  /**
   * Remove a component from 3D scene
   */
  public removeComponent(id: string) {
    const obj = this.componentObjects.get(id);
    if (obj) {
      this.scene.remove(obj.group);
      this.componentObjects.delete(id);
    }
  }

  /**
   * Add a wire to 3D scene
   */
  public addWire(wire: JumperWire): JumperWire3D {
    const wireObj = new JumperWire3D(wire);
    this.wireObjects.set(wire.id, wireObj);
    this.scene.add(wireObj.group);
    return wireObj;
  }

  /**
   * Remove a wire from 3D scene
   */
  public removeWire(id: string) {
    const wireObj = this.wireObjects.get(id);
    if (wireObj) {
      this.scene.remove(wireObj.group);
      this.wireObjects.delete(id);
    }
  }

  /**
   * Clear all components and wires
   */
  public clearAll() {
    this.componentObjects.forEach(obj => this.scene.remove(obj.group));
    this.componentObjects.clear();
    this.wireObjects.forEach(obj => this.scene.remove(obj.group));
    this.wireObjects.clear();
    if (this.tempWireObject) {
      this.scene.remove(this.tempWireObject.group);
      this.tempWireObject = null;
    }
  }

  private onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private startLoop() {
    const loop = () => {
      const time = this.clock.getElapsedTime();

      // Controls update for damping
      this.controls.update();

      // Update component animations & selection halos
      this.componentObjects.forEach(obj => obj.update(time));

      // Render
      this.renderer.render(this.scene, this.camera);

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public setMultimeterVisible(visible: boolean) {
    this.redProbe.setVisible(visible);
    this.blackProbe.setVisible(visible);
  }

  public setRedProbePosition(pos: THREE.Vector3 | null, contact: boolean = true) {
    if (!pos) {
      this.redProbe.setPosition(0, 0, -20);
      this.redProbe.setContact(false);
      return;
    }
    this.redProbe.setPosition(pos.x, pos.y, pos.z);
    this.redProbe.setContact(contact);
  }

  public setBlackProbePosition(pos: THREE.Vector3 | null, contact: boolean = true) {
    if (!pos) {
      this.blackProbe.setPosition(0, 0, -20);
      this.blackProbe.setContact(false);
      return;
    }
    this.blackProbe.setPosition(pos.x, pos.y, pos.z);
    this.blackProbe.setContact(contact);
  }

  public dispose() {
    window.removeEventListener('resize', this.onResize);
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
