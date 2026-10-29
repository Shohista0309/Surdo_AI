import * as THREE from 'three';
import { TerminalDefinition, CableId, TerminalId } from '../types';

export class Terminal {
  public definition: TerminalDefinition;
  public group: THREE.Group;
  public position: THREE.Vector3;
  public socketMesh: THREE.Mesh;
  public haloRingMesh: THREE.Mesh;
  public ledIndicatorMesh: THREE.Mesh;
  public isConnected: boolean = false;
  public connectedCableId: CableId | null = null;
  public isHovered: boolean = false;
  public isCompatibleHover: boolean = false;

  private haloMaterial: THREE.MeshBasicMaterial;
  private ledMaterial: THREE.MeshStandardMaterial;

  constructor(definition: TerminalDefinition) {
    this.definition = definition;
    this.position = new THREE.Vector3(
      definition.position.x,
      definition.position.y,
      definition.position.z
    );

    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    // 1. Metal base socket cylinder
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.28, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    this.group.add(baseMesh);

    // 2. Colored socket ring (Red / Black / Cyan)
    const socketGeo = new THREE.TorusGeometry(0.28, 0.08, 16, 32);
    const socketColor = parseInt(definition.colorHex.replace('#', '0x'), 16);
    const socketMat = new THREE.MeshStandardMaterial({
      color: socketColor,
      metalness: 0.4,
      roughness: 0.3,
      emissive: socketColor,
      emissiveIntensity: 0.2
    });
    this.socketMesh = new THREE.Mesh(socketGeo, socketMat);
    this.socketMesh.position.z = 0.15;
    this.group.add(this.socketMesh);

    // 3. Inner metallic hole (where the pin enters)
    const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 16);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.9,
      roughness: 0.5
    });
    const holeMesh = new THREE.Mesh(holeGeo, holeMat);
    holeMesh.rotation.x = Math.PI / 2;
    holeMesh.position.z = 0.12;
    this.group.add(holeMesh);

    // 4. Outer pulsating glow halo ring
    const haloGeo = new THREE.RingGeometry(0.48, 0.62, 32);
    this.haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.haloRingMesh = new THREE.Mesh(haloGeo, this.haloMaterial);
    this.haloRingMesh.position.z = 0.02;
    this.group.add(this.haloRingMesh);

    // 5. LED Status Dot next to terminal
    const ledGeo = new THREE.SphereGeometry(0.09, 16, 16);
    this.ledMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x111827,
      emissiveIntensity: 0.1,
      roughness: 0.2
    });
    this.ledIndicatorMesh = new THREE.Mesh(ledGeo, this.ledMaterial);
    this.ledIndicatorMesh.position.set(0, 0.52, 0.08);
    this.group.add(this.ledIndicatorMesh);

    // 6. 3D Canvas Label (e.g. "+5V VCC", "GND", "SIGNAL")
    const labelSprite = this.createLabelSprite(definition.label, definition.voltageText);
    labelSprite.position.set(0, -0.56, 0.05);
    this.group.add(labelSprite);
  }

  private createLabelSprite(label: string, sub: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = this.definition.colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 236, 108, 16);
    ctx.fill();
    ctx.stroke();

    // Main text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 128, 50);

    // Sub text
    ctx.fillStyle = this.definition.colorHex;
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.fillText(sub, 128, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.9, 0.45, 1);
    return sprite;
  }

  /**
   * Set hover / proximity feedback state
   */
  public setHoverState(hovered: boolean, isCompatible: boolean = true) {
    this.isHovered = hovered;
    this.isCompatibleHover = isCompatible;

    if (!hovered) {
      if (!this.isConnected) {
        this.haloMaterial.opacity = 0;
      }
    } else {
      if (isCompatible) {
        this.haloMaterial.color.setHex(0x10b981); // Bright green
        this.haloMaterial.opacity = 0.85;
      } else {
        this.haloMaterial.color.setHex(0xef4444); // Red warning
        this.haloMaterial.opacity = 0.85;
      }
    }
  }

  /**
   * Mark as successfully connected
   */
  public setConnected(cableId: CableId | null) {
    this.connectedCableId = cableId;
    this.isConnected = !!cableId;

    if (this.isConnected) {
      this.ledMaterial.color.setHex(0x10b981);
      this.ledMaterial.emissive.setHex(0x10b981);
      this.ledMaterial.emissiveIntensity = 1.0;
      this.haloMaterial.color.setHex(0x10b981);
      this.haloMaterial.opacity = 0.4;
    } else {
      this.ledMaterial.color.setHex(0x334155);
      this.ledMaterial.emissive.setHex(0x111827);
      this.ledMaterial.emissiveIntensity = 0.1;
      this.haloMaterial.opacity = 0;
    }
  }

  /**
   * Update pulse animations
   */
  public update(time: number) {
    if (this.isHovered) {
      const pulse = 0.7 + Math.sin(time * 10) * 0.3;
      this.haloMaterial.opacity = pulse;
      const s = 1.0 + Math.sin(time * 8) * 0.08;
      this.haloRingMesh.scale.set(s, s, 1);
    } else if (this.isConnected) {
      const pulse = 0.35 + Math.sin(time * 3) * 0.15;
      this.haloMaterial.opacity = pulse;
      this.haloRingMesh.scale.set(1, 1, 1);
    }
  }
}
