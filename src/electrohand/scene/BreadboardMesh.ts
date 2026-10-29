import * as THREE from 'three';
import { BreadboardModel } from '../breadboard/BreadboardModel';

export class BreadboardMesh {
  public group: THREE.Group;
  public breadboardModel: BreadboardModel;

  constructor(breadboardModel: BreadboardModel) {
    this.breadboardModel = breadboardModel;
    this.group = new THREE.Group();
    this.buildMesh();
  }

  private buildMesh() {
    const W = BreadboardModel.BOARD_WIDTH;
    const H = BreadboardModel.BOARD_HEIGHT;
    const D = BreadboardModel.BOARD_DEPTH;

    // 1. Main Plastic Body (Off-white / Cream ABS plastic)
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf3f0e6, // Realistic solderless breadboard plastic
      roughness: 0.5,
      metalness: 0.05
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.receiveShadow = true;
    bodyMesh.position.z = D / 2;
    this.group.add(bodyMesh);

    // 2. Center Divider Trough (Center DIP IC channel)
    const troughGeo = new THREE.BoxGeometry(W - 0.4, 0.22, 0.08);
    const troughMat = new THREE.MeshStandardMaterial({
      color: 0xdcd6c5,
      roughness: 0.8
    });
    const troughMesh = new THREE.Mesh(troughGeo, troughMat);
    troughMesh.position.set(0, 0, D + 0.01);
    this.group.add(troughMesh);

    // 3. Power Rail Colored Stripe Lines (+ Red line and - Blue line)
    this.createRailLines(W, D);

    // 4. Instanced Mesh for Hole Sockets (High Performance Rendering of ~420 holes)
    const holes = this.breadboardModel.getAllHoles();
    const holeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Dark interior of contact clips
      metalness: 0.8,
      roughness: 0.3
    });

    const instancedHoles = new THREE.InstancedMesh(holeGeo, holeMat, holes.length);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < holes.length; i++) {
      const h = holes[i];
      dummy.position.set(h.position.x, h.position.y, D + 0.01);
      dummy.updateMatrix();
      instancedHoles.setMatrixAt(i, dummy.matrix);
    }
    instancedHoles.instanceMatrix.needsUpdate = true;
    this.group.add(instancedHoles);

    // 5. Printed Text / Markings (Canvas Texture)
    const markingsSprite = this.createMarkingsSprite(W, H);
    markingsSprite.position.set(0, 0, D + 0.02);
    this.group.add(markingsSprite);
  }

  private createRailLines(W: number, D: number) {
    const P = BreadboardModel.PITCH;

    // Top rails
    const lineMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const lineMatBlue = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

    const lineGeo = new THREE.BoxGeometry(W - 0.8, 0.04, 0.01);

    // Top + (Red)
    const topRed = new THREE.Mesh(lineGeo, lineMatRed);
    topRed.position.set(0, P * 6.7, D + 0.01);
    this.group.add(topRed);

    // Top - (Blue)
    const topBlue = new THREE.Mesh(lineGeo, lineMatBlue);
    topBlue.position.set(0, P * 4.7, D + 0.01);
    this.group.add(topBlue);

    // Bottom - (Blue)
    const botBlue = new THREE.Mesh(lineGeo, lineMatBlue);
    botBlue.position.set(0, -P * 4.7, D + 0.01);
    this.group.add(botBlue);

    // Bottom + (Red)
    const botRed = new THREE.Mesh(lineGeo, lineMatRed);
    botRed.position.set(0, -P * 6.7, D + 0.01);
    this.group.add(botRed);
  }

  private createMarkingsSprite(W: number, H: number): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Numbers along columns (1, 5, 10, 15, 20, 25, 30)
    for (let c = 1; c <= 30; c++) {
      if (c === 1 || c % 5 === 0) {
        const normX = (c - 0.5) / 30;
        const px = 60 + normX * (canvas.width - 120);

        // Top numbers
        ctx.fillText(c.toString(), px, 70);
        // Bottom numbers
        ctx.fillText(c.toString(), px, canvas.height - 70);
      }
    }

    // Row letters on left & right: A, B, C, D, E and F, G, H, I, J
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    rows.forEach((r, idx) => {
      let py = 125 + idx * 28;
      if (idx >= 5) py += 30; // gap for center trough

      ctx.fillText(r, 35, py);
      ctx.fillText(r, canvas.width - 35, py);
    });

    // Plus and Minus labels
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('+', 35, 26);
    ctx.fillText('+', 35, canvas.height - 26);

    ctx.fillStyle = '#0284c7';
    ctx.fillText('-', canvas.width - 35, 26);
    ctx.fillText('-', canvas.width - 35, canvas.height - 26);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.85
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    return mesh;
  }
}
