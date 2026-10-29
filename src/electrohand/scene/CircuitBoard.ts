import * as THREE from 'three';

export class CircuitBoard {
  public group: THREE.Group;
  public mainLedMesh: THREE.Mesh;
  public mainLedLight: THREE.PointLight;
  public isPowered: boolean = false;

  private ledMaterial: THREE.MeshStandardMaterial;
  private traceMaterial: THREE.MeshStandardMaterial;
  private statusDisplaySprite: THREE.Sprite;
  private statusCanvas: HTMLCanvasElement;
  private statusCtx: CanvasRenderingContext2D;

  constructor() {
    this.group = new THREE.Group();

    // 1. PCB Main Slab
    const pcbGeo = new THREE.BoxGeometry(11.2, 7.8, 0.3);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0a1120, // High-tech dark PCB
      metalness: 0.25,
      roughness: 0.4
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.set(0, 0, -0.15);
    pcbMesh.receiveShadow = true;
    this.group.add(pcbMesh);

    // PCB Border Rim (Cyan accent line around perimeter)
    const rimGeo = new THREE.BoxGeometry(11.4, 8.0, 0.05);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.2
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.set(0, 0, -0.32);
    this.group.add(rimMesh);

    // 2. Corner Gold Mounting Screws & Washers
    const cornerOffsets = [
      [-5.2, -3.5],
      [5.2, -3.5],
      [-5.2, 3.5],
      [5.2, 3.5]
    ];
    cornerOffsets.forEach(([cx, cy]) => {
      const screwGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16);
      const screwMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // Gold brass
        metalness: 0.9,
        roughness: 0.2
      });
      const screw = new THREE.Mesh(screwGeo, screwMat);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(cx, cy, 0.02);
      this.group.add(screw);
    });

    // 3. Power Supply Enclosure on the Left
    const psuGeo = new THREE.BoxGeometry(2.4, 5.8, 0.65);
    const psuMat = new THREE.MeshStandardMaterial({
      color: 0x111e38,
      metalness: 0.7,
      roughness: 0.3
    });
    const psuMesh = new THREE.Mesh(psuGeo, psuMat);
    psuMesh.position.set(-4.0, 0, 0.3);
    psuMesh.castShadow = true;
    this.group.add(psuMesh);

    // PSU Label Plate
    const psuLabel = this.createPsuLabel();
    psuLabel.position.set(-4.0, 2.2, 0.65);
    this.group.add(psuLabel);

    // 4. Central Microcontroller IC (ELECTROHAND MCU)
    const icGeo = new THREE.BoxGeometry(2.0, 2.0, 0.35);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.3
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(0, 0.6, 0.16);
    this.group.add(icMesh);

    // IC Metallic Pins on sides
    for (let i = -0.8; i <= 0.8; i += 0.4) {
      const pinGeo = new THREE.BoxGeometry(0.4, 0.1, 0.08);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 });
      
      const pinL = new THREE.Mesh(pinGeo, pinMat);
      pinL.position.set(-1.1, 0.6 + i, 0.06);
      this.group.add(pinL);

      const pinR = new THREE.Mesh(pinGeo, pinMat);
      pinR.position.set(1.1, 0.6 + i, 0.06);
      this.group.add(pinR);
    }

    // IC Laser Etched Text
    const icTextSprite = this.createIcTextSprite();
    icTextSprite.position.set(0, 0.6, 0.35);
    this.group.add(icTextSprite);

    // 5. Electrolytic Capacitors (Cylinders)
    const cap1 = this.createCapacitor(0.3, 0.7, 0x1e293b);
    cap1.position.set(-1.6, 2.2, 0.35);
    this.group.add(cap1);

    const cap2 = this.createCapacitor(0.24, 0.55, 0x0284c7);
    cap2.position.set(-1.6, -1.8, 0.28);
    this.group.add(cap2);

    // 6. Resistors
    const res1 = this.createResistor();
    res1.position.set(1.4, 2.2, 0.1);
    this.group.add(res1);

    const res2 = this.createResistor();
    res2.position.set(1.4, -1.8, 0.1);
    this.group.add(res2);

    // 7. Central Main LED (Circuit completion indicator)
    const ledBaseGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.2, 24);
    const ledBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const ledBase = new THREE.Mesh(ledBaseGeo, ledBaseMat);
    ledBase.rotation.x = Math.PI / 2;
    ledBase.position.set(0, -1.6, 0.1);
    this.group.add(ledBase);

    const ledDomeGeo = new THREE.SphereGeometry(0.3, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    this.ledMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      emissive: 0x0f172a,
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 0.1
    });
    this.mainLedMesh = new THREE.Mesh(ledDomeGeo, this.ledMaterial);
    this.mainLedMesh.rotation.x = Math.PI / 2;
    this.mainLedMesh.position.set(0, -1.6, 0.2);
    this.group.add(this.mainLedMesh);

    // LED Point Light (illuminates board when powered)
    this.mainLedLight = new THREE.PointLight(0x10b981, 0, 8);
    this.mainLedLight.position.set(0, -1.6, 0.8);
    this.group.add(this.mainLedLight);

    // 8. Copper / Cyan Printed Traces on PCB
    this.traceMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.8
    });
    this.createCircuitTraces();

    // 9. Digital Status Display (Shows status in Uzbek)
    const { sprite, canvas, ctx } = this.createStatusDisplay();
    this.statusDisplaySprite = sprite;
    this.statusCanvas = canvas;
    this.statusCtx = ctx;
    this.statusDisplaySprite.position.set(0, 3.0, 0.08);
    this.group.add(this.statusDisplaySprite);

    // 10. Title banner at the bottom
    const titleSprite = this.createTitleSprite();
    titleSprite.position.set(0, -3.2, 0.08);
    this.group.add(titleSprite);
  }

  private createCapacitor(radius: number, height: number, color: number): THREE.Group {
    const group = new THREE.Group();
    const canGeo = new THREE.CylinderGeometry(radius, radius, height, 20);
    const canMat = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.3 });
    const can = new THREE.Mesh(canGeo, canMat);
    can.rotation.x = Math.PI / 2;
    group.add(can);

    const topGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.04, 20);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.rotation.x = Math.PI / 2;
    top.position.z = height / 2;
    group.add(top);

    return group;
  }

  private createResistor(): THREE.Group {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.6, 0.24, 0.16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const endGeo = new THREE.BoxGeometry(0.12, 0.26, 0.18);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const end1 = new THREE.Mesh(endGeo, endMat);
    end1.position.x = -0.3;
    const end2 = new THREE.Mesh(endGeo, endMat);
    end2.position.x = 0.3;
    group.add(end1);
    group.add(end2);

    return group;
  }

  private createCircuitTraces() {
    const traces = [
      // From PSU to Microcontroller
      [[-2.7, 1.2], [-1.4, 1.2], [-1.0, 0.9]],
      [[-2.7, 0.0], [-1.5, 0.0], [-1.0, 0.3]],
      [[-2.7, -1.2], [-1.4, -1.2], [-1.0, 0.0]],

      // From Microcontroller to LED
      [[0.0, -0.4], [0.0, -1.2]],

      // From MCU to Terminals on the Right (at x=3.8)
      [[1.0, 0.9], [2.2, 1.8], [3.2, 1.8]],
      [[1.0, 0.3], [2.4, 0.0], [3.2, 0.0]],
      [[1.0, -0.3], [2.2, -1.8], [3.2, -1.8]]
    ];

    traces.forEach(points => {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = new THREE.Vector3(points[i][0], points[i][1], 0.02);
        const p2 = new THREE.Vector3(points[i + 1][0], points[i + 1][1], 0.02);
        const dist = p1.distanceTo(p2);
        const lineGeo = new THREE.CylinderGeometry(0.04, 0.04, dist, 8);
        const lineMesh = new THREE.Mesh(lineGeo, this.traceMaterial);

        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        lineMesh.position.copy(mid);

        // Orient cylinder along segment
        const dir = p2.clone().sub(p1).normalize();
        lineMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        this.group.add(lineMesh);
      }
    });
  }

  private createPsuLabel(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(7, 13, 25, 0.9)';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUVVAT MANBAI', 128, 48);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillText('DC 5.0V / 2.0A', 128, 88);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.8, 0.9, 1);
    return sprite;
  }

  private createIcTextSprite(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ELECTROHAND', 128, 90);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText('AT32-MCU', 128, 140);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '500 20px monospace';
    ctx.fillText('AI GESTURE CORE', 128, 180);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.6, 1.6, 1);
    return sprite;
  }

  private createStatusDisplay(): { sprite: THREE.Sprite; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    this.renderStatusText(ctx, canvas, false);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4.0, 0.8, 1);
    return { sprite, canvas, ctx };
  }

  private renderStatusText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isLive: boolean) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark screen bezel
    ctx.fillStyle = '#050a14';
    ctx.beginPath();
    ctx.roundRect(8, 8, canvas.width - 16, canvas.height - 16, 12);
    ctx.fill();
    ctx.strokeStyle = isLive ? '#10b981' : '#1e325c';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (isLive) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 26px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ 5.00V [ZANJIR ISHGA TUSHDI - TIZIM FAOL]', canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ HOLAT: OCHIQ ZANJIR (Barcha 3 ta kabelni ulang)', canvas.width / 2, canvas.height / 2);
    }
  }

  private createTitleSprite(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ELECTROHAND INTERACTIVE 3D LAB TRAINER', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4.4, 0.7, 1);
    return sprite;
  }

  /**
   * Set power state when all 3 connections are completed!
   */
  public setPowered(powered: boolean) {
    this.isPowered = powered;

    if (powered) {
      // Light up LED brightly
      this.ledMaterial.color.setHex(0x10b981);
      this.ledMaterial.emissive.setHex(0x10b981);
      this.ledMaterial.emissiveIntensity = 2.5;
      this.mainLedLight.intensity = 3.5;

      // Glow traces
      this.traceMaterial.emissive.setHex(0x10b981);
      this.traceMaterial.emissiveIntensity = 1.0;
    } else {
      this.ledMaterial.color.setHex(0x475569);
      this.ledMaterial.emissive.setHex(0x0f172a);
      this.ledMaterial.emissiveIntensity = 0.2;
      this.mainLedLight.intensity = 0;

      this.traceMaterial.emissive.setHex(0x0284c7);
      this.traceMaterial.emissiveIntensity = 0.25;
    }

    this.renderStatusText(this.statusCtx, this.statusCanvas, powered);
    (this.statusDisplaySprite.material.map as THREE.CanvasTexture).needsUpdate = true;
  }

  /**
   * Animation update (pulsing effects)
   */
  public update(time: number) {
    if (this.isPowered) {
      const pulse = 2.0 + Math.sin(time * 6) * 0.8;
      this.ledMaterial.emissiveIntensity = pulse;
      this.mainLedLight.intensity = pulse * 1.4;

      const tracePulse = 0.8 + Math.sin(time * 4) * 0.4;
      this.traceMaterial.emissiveIntensity = tracePulse;
    }
  }
}
