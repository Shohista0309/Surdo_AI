import * as THREE from 'three';
import { CircuitBoard } from './CircuitBoard';
import { Cable } from './Cable';
import { Terminal } from './Terminal';
import { CableDefinition, TerminalDefinition, CableId, TerminalId } from '../types';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public circuitBoard: CircuitBoard;
  public cables: Map<CableId, Cable> = new Map();
  public terminals: Map<TerminalId, Terminal> = new Map();

  // Hand cursor in 3D
  public handCursorMesh: THREE.Group;
  private handCursorRing!: THREE.Mesh;
  private handCursorCore!: THREE.Mesh;
  private handCursorRingMat!: THREE.MeshBasicMaterial;

  // Interaction plane for unprojecting screen coordinates
  public interactionPlane: THREE.Plane;
  private raycaster: THREE.Raycaster;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;
  private containerElement: HTMLElement;

  // Spark particles
  private sparkParticles!: THREE.Points;
  private sparkPositions!: Float32Array;
  private sparkVelocities!: Float32Array;
  private sparkLifetimes!: Float32Array;
  private sparkCount: number = 60;

  constructor(container: HTMLElement) {
    this.containerElement = container;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060b17); // Dark navy room background
    this.scene.fog = new THREE.FogExp2(0x060b17, 0.04);

    // 2. Camera: Angled perspective looking down at the training board
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, -6.5, 9.8);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Circuit Board
    this.circuitBoard = new CircuitBoard();
    this.scene.add(this.circuitBoard.group);

    // 6. Terminals
    this.setupTerminals();

    // 7. Cables
    this.setupCables();

    // 8. 3D Hand Cursor
    this.handCursorMesh = this.createHandCursor();
    this.scene.add(this.handCursorMesh);

    // 9. Sparks
    this.setupSparkParticles();

    // Resize listener
    window.addEventListener('resize', this.onWindowResize);

    // Start loop
    this.startLoop();
  }

  private setupLighting() {
    // Ambient light (navy fill)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambientLight);

    // Main Key Light from top-front
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, -5, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Electric Cyan Rim Light from top-left
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.2);
    cyanRim.position.set(-6, 4, 5);
    this.scene.add(cyanRim);

    // Amber Rim Light from right
    const amberRim = new THREE.DirectionalLight(0xf59e0b, 0.8);
    amberRim.position.set(6, -2, 4);
    this.scene.add(amberRim);
  }

  private setupTerminals() {
    const terminalDefs: TerminalDefinition[] = [
      {
        id: 'term-vcc',
        name: 'VCC (+5V)',
        nameUz: 'VCC (+5V Kirish)',
        label: '+5V VCC',
        colorHex: '#ef4444',
        position: { x: 3.6, y: 1.8, z: 0.15 },
        acceptedCableId: 'cable-red',
        voltageText: '5.0V DC',
        descriptionUz: 'Manba musbat qutbi'
      },
      {
        id: 'term-gnd',
        name: 'GND (0V)',
        nameUz: 'GND (Zamin / 0V)',
        label: 'GND YER',
        colorHex: '#334155',
        position: { x: 3.6, y: 0.0, z: 0.15 },
        acceptedCableId: 'cable-black',
        voltageText: '0.0V REF',
        descriptionUz: 'Umumiy zamin ulagichi'
      },
      {
        id: 'term-signal',
        name: 'LED SIGNAL',
        nameUz: 'LED Signal Kirish',
        label: 'LED SIGNAL',
        colorHex: '#00f0ff',
        position: { x: 3.6, y: -1.8, z: 0.15 },
        acceptedCableId: 'cable-blue',
        voltageText: 'PWM SIG',
        descriptionUz: 'LED indikator boshqaruv signali'
      }
    ];

    terminalDefs.forEach(def => {
      const term = new Terminal(def);
      this.terminals.set(def.id, term);
      this.scene.add(term.group);
    });
  }

  private setupCables() {
    const cableDefs: CableDefinition[] = [
      {
        id: 'cable-red',
        name: 'Red Cable',
        nameUz: 'Qizil kabel (+5V Manba)',
        colorHex: '#ef4444',
        colorNumber: 0xef4444,
        expectedTerminalId: 'term-vcc',
        sourcePos: { x: -3.2, y: 1.8, z: 0.4 },
        restPos: { x: -1.6, y: 1.8, z: 0.2 },
        descriptionUz: 'Mikrokontroller quvvati uchun +5V kabel'
      },
      {
        id: 'cable-black',
        name: 'Black Cable',
        nameUz: 'Qora kabel (GND Zamin)',
        colorHex: '#1e293b',
        colorNumber: 0x1e293b,
        expectedTerminalId: 'term-gnd',
        sourcePos: { x: -3.2, y: 0.0, z: 0.4 },
        restPos: { x: -1.6, y: 0.0, z: 0.2 },
        descriptionUz: 'Zanjirni yerga ulash (0V) kabeli'
      },
      {
        id: 'cable-blue',
        name: 'Blue Cable',
        nameUz: 'Moviy kabel (Signal)',
        colorHex: '#00f0ff',
        colorNumber: 0x00f0ff,
        expectedTerminalId: 'term-signal',
        sourcePos: { x: -3.2, y: -1.8, z: 0.4 },
        restPos: { x: -1.6, y: -1.8, z: 0.2 },
        descriptionUz: 'LED boshqaruv signali kabeli'
      }
    ];

    cableDefs.forEach(def => {
      const cable = new Cable(def);
      this.cables.set(def.id, cable);
      this.scene.add(cable.group);
    });
  }

  private createHandCursor(): THREE.Group {
    const group = new THREE.Group();

    // Outer reticle ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    this.handCursorRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    this.handCursorRing = new THREE.Mesh(ringGeo, this.handCursorRingMat);
    group.add(this.handCursorRing);

    // Inner center dot
    const coreGeo = new THREE.CircleGeometry(0.08, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    this.handCursorCore = new THREE.Mesh(coreGeo, coreMat);
    this.handCursorCore.position.z = 0.01;
    group.add(this.handCursorCore);

    // Initial position hidden below board
    group.position.set(0, 0, -10);
    return group;
  }

  private setupSparkParticles() {
    const geo = new THREE.BufferGeometry();
    this.sparkPositions = new Float32Array(this.sparkCount * 3);
    this.sparkVelocities = new Float32Array(this.sparkCount * 3);
    this.sparkLifetimes = new Float32Array(this.sparkCount);

    for (let i = 0; i < this.sparkCount; i++) {
      this.sparkPositions[i * 3 + 2] = -100; // Offscreen
      this.sparkLifetimes[i] = 0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sparkParticles = new THREE.Points(geo, mat);
    this.scene.add(this.sparkParticles);
  }

  /**
   * Trigger spark explosion at connection point
   */
  public triggerSparks(pos: THREE.Vector3, colorHex: number = 0x00f0ff) {
    (this.sparkParticles.material as THREE.PointsMaterial).color.setHex(colorHex);

    for (let i = 0; i < this.sparkCount; i++) {
      this.sparkPositions[i * 3] = pos.x;
      this.sparkPositions[i * 3 + 1] = pos.y;
      this.sparkPositions[i * 3 + 2] = pos.z + 0.1;

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      this.sparkVelocities[i * 3] = Math.cos(angle) * speed;
      this.sparkVelocities[i * 3 + 1] = Math.sin(angle) * speed;
      this.sparkVelocities[i * 3 + 2] = 0.8 + Math.random() * 2.0;

      this.sparkLifetimes[i] = 0.5 + Math.random() * 0.4;
    }
    this.sparkParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Project screen coordinate (0 to 1) to 3D world plane on circuit board
   */
  public projectScreenToWorld(screenX: number, screenY: number): THREE.Vector3 | null {
    // Convert [0, 1] to Normalized Device Coordinates [-1, 1]
    const ndcX = screenX * 2 - 1;
    const ndcY = -(screenY * 2 - 1);

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const target = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.interactionPlane, target);

    if (hit) {
      // Clamp inside board boundaries so connectors stay playable
      target.x = Math.max(-5.0, Math.min(5.0, target.x));
      target.y = Math.max(-3.4, Math.min(3.4, target.y));
      target.z = 0.3; // Slight hover elevation
      return target;
    }
    return null;
  }

  /**
   * Update 3D Hand Cursor position & visual state
   */
  public updateHandCursor(worldPos: THREE.Vector3 | null, isPinching: boolean, isVisible: boolean) {
    if (!isVisible || !worldPos) {
      this.handCursorMesh.position.set(0, 0, -10);
      return;
    }

    this.handCursorMesh.position.copy(worldPos);
    this.handCursorMesh.position.z += 0.05;

    if (isPinching) {
      this.handCursorRingMat.color.setHex(0x10b981); // Green pinch
      this.handCursorRing.scale.set(0.65, 0.65, 1);
    } else {
      this.handCursorRingMat.color.setHex(0x00f0ff); // Cyan open
      this.handCursorRing.scale.set(1.0, 1.0, 1);
    }
  }

  /**
   * Reset all cables and board state
   */
  public resetCircuit() {
    this.cables.forEach(cable => cable.returnToRest());
    this.terminals.forEach(term => term.setConnected(null));
    this.circuitBoard.setPowered(false);
  }

  private onWindowResize = () => {
    if (!this.containerElement) return;
    const width = this.containerElement.clientWidth || window.innerWidth;
    const height = this.containerElement.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private startLoop() {
    const loop = () => {
      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Update circuit board
      this.circuitBoard.update(time);

      // Update terminals
      this.terminals.forEach(term => term.update(time));

      // Update cables
      this.cables.forEach(cable => cable.update(time, delta));

      // Update sparks
      this.updateSparks(delta);

      // Render
      this.renderer.render(this.scene, this.camera);

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private updateSparks(delta: number) {
    let hasActive = false;
    for (let i = 0; i < this.sparkCount; i++) {
      if (this.sparkLifetimes[i] > 0) {
        hasActive = true;
        this.sparkLifetimes[i] -= delta;

        this.sparkPositions[i * 3] += this.sparkVelocities[i * 3] * delta;
        this.sparkPositions[i * 3 + 1] += this.sparkVelocities[i * 3 + 1] * delta;
        this.sparkPositions[i * 3 + 2] += this.sparkVelocities[i * 3 + 2] * delta;
        // Gravity on particles
        this.sparkVelocities[i * 3 + 2] -= 4.0 * delta;

        if (this.sparkLifetimes[i] <= 0) {
          this.sparkPositions[i * 3 + 2] = -100;
        }
      }
    }
    if (hasActive) {
      this.sparkParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
