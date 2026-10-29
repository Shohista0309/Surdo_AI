import * as THREE from 'three';
import { CableDefinition, CableId, CableState, TerminalId } from '../types';

export class Cable {
  public definition: CableDefinition;
  public group: THREE.Group;
  public connectorGroup: THREE.Group;
  public state: CableState = 'RESTING';
  public connectedTerminalId: TerminalId | null = null;

  // Key 3D coordinates
  public sourcePos: THREE.Vector3;
  public restPos: THREE.Vector3;
  public currentPos: THREE.Vector3;
  public targetPos: THREE.Vector3;

  private tubeMesh: THREE.Mesh;
  private tubeMaterial: THREE.MeshStandardMaterial;
  private haloMesh: THREE.Mesh;
  private haloMaterial: THREE.MeshBasicMaterial;
  private connectorBodyMesh: THREE.Mesh;

  // Spring animation parameters for returning
  private returnSpeed: number = 7.0;

  constructor(definition: CableDefinition) {
    this.definition = definition;
    this.sourcePos = new THREE.Vector3(definition.sourcePos.x, definition.sourcePos.y, definition.sourcePos.z);
    this.restPos = new THREE.Vector3(definition.restPos.x, definition.restPos.y, definition.restPos.z);
    this.currentPos = this.restPos.clone();
    this.targetPos = this.restPos.clone();

    this.group = new THREE.Group();

    const colorHex = parseInt(definition.colorHex.replace('#', '0x'), 16);

    // 1. Source fixed terminal plug on the power supply side
    const sourcePlugGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.35, 16);
    const sourcePlugMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.7,
      roughness: 0.3
    });
    const sourcePlug = new THREE.Mesh(sourcePlugGeo, sourcePlugMat);
    sourcePlug.rotation.x = Math.PI / 2;
    sourcePlug.position.copy(this.sourcePos);
    this.group.add(sourcePlug);

    // Colored ring on source plug
    const ringGeo = new THREE.TorusGeometry(0.22, 0.05, 12, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.3
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(this.sourcePos);
    ringMesh.position.z += 0.15;
    this.group.add(ringMesh);

    // 2. Moveable Connector Head Group
    this.connectorGroup = new THREE.Group();
    this.connectorGroup.position.copy(this.currentPos);

    // Pin (Gold / Metallic tip)
    const pinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold
      metalness: 0.95,
      roughness: 0.15
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.rotation.x = Math.PI / 2;
    pinMesh.position.z = -0.15; // Extends downward into socket
    this.connectorGroup.add(pinMesh);

    // Connector molded rubber body
    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.7, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.2,
      roughness: 0.4,
      emissive: colorHex,
      emissiveIntensity: 0.15
    });
    this.connectorBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.connectorBodyMesh.rotation.x = Math.PI / 2;
    this.connectorBodyMesh.position.z = 0.25;
    this.connectorBodyMesh.castShadow = true;
    this.connectorGroup.add(this.connectorBodyMesh);

    // Grip ribs on rubber body
    for (let i = 0; i < 3; i++) {
      const ribGeo = new THREE.TorusGeometry(0.24, 0.025, 8, 20);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.z = 0.12 + i * 0.12;
      this.connectorGroup.add(rib);
    }

    // Glow halo ring when selected/hovered
    const haloGeo = new THREE.RingGeometry(0.35, 0.52, 24);
    this.haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.haloMesh = new THREE.Mesh(haloGeo, this.haloMaterial);
    this.haloMesh.position.z = 0.02;
    this.connectorGroup.add(this.haloMesh);

    this.group.add(this.connectorGroup);

    // 3. Flexible Cable Tube
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.15
    });

    const initialCurve = this.generateCurve(this.sourcePos, this.currentPos);
    const initialGeo = new THREE.TubeGeometry(initialCurve, 32, 0.07, 10, false);
    this.tubeMesh = new THREE.Mesh(initialGeo, this.tubeMaterial);
    this.tubeMesh.castShadow = true;
    this.group.add(this.tubeMesh);
  }

  /**
   * Generates a 3D Catmull-Rom spline with natural cable physics/sag
   */
  private generateCurve(start: THREE.Vector3, end: THREE.Vector3): THREE.CatmullRomCurve3 {
    const dist = start.distanceTo(end);

    // Intermediate points for natural cable hang
    const p0 = start.clone().add(new THREE.Vector3(0, 0, 0.2));
    const p1 = new THREE.Vector3(
      start.x + (end.x - start.x) * 0.25,
      start.y + (end.y - start.y) * 0.25,
      Math.max(0.2, 0.8 + dist * 0.15)
    );
    const p2 = new THREE.Vector3(
      start.x + (end.x - start.x) * 0.55,
      start.y + (end.y - start.y) * 0.55,
      Math.max(0.3, 0.6 + dist * 0.1)
    );
    const p3 = new THREE.Vector3(
      start.x + (end.x - start.x) * 0.85,
      start.y + (end.y - start.y) * 0.85,
      end.z + 0.35
    );
    const p4 = end.clone().add(new THREE.Vector3(0, 0, 0.25));

    return new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
  }

  /**
   * Update tube geometry when connector position moves
   */
  public updateGeometry() {
    const curve = this.generateCurve(this.sourcePos, this.currentPos);
    this.tubeMesh.geometry.dispose();
    this.tubeMesh.geometry = new THREE.TubeGeometry(curve, 32, 0.07, 10, false);
    this.connectorGroup.position.copy(this.currentPos);
  }

  /**
   * Begin dragging by hand or mouse
   */
  public startDrag() {
    this.state = 'DRAGGING';
    this.connectedTerminalId = null;
    this.haloMaterial.color.setHex(0x00f0ff);
    this.haloMaterial.opacity = 0.9;
    (this.connectorBodyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
  }

  /**
   * Set target position during drag (with height elevation while carried)
   */
  public setTargetPosition(x: number, y: number, z: number = 0.4) {
    this.targetPos.set(x, y, z);
  }

  /**
   * Snap to terminal socket
   */
  public snapToTerminal(terminalId: TerminalId, terminalPos: THREE.Vector3) {
    this.state = 'CONNECTED';
    this.connectedTerminalId = terminalId;
    // Plug pin sits inside socket (z = 0.15)
    this.currentPos.set(terminalPos.x, terminalPos.y, 0.15);
    this.targetPos.copy(this.currentPos);
    this.haloMaterial.color.setHex(0x10b981);
    this.haloMaterial.opacity = 0.5;
    (this.connectorBodyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
    this.updateGeometry();
  }

  /**
   * Return back to rest position (spring animation)
   */
  public returnToRest() {
    this.state = 'RETURNING';
    this.connectedTerminalId = null;
    this.targetPos.copy(this.restPos);
    this.haloMaterial.opacity = 0;
    (this.connectorBodyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
  }

  /**
   * Disconnect and leave at rest
   */
  public disconnect() {
    this.returnToRest();
  }

  /**
   * Per-frame animation update
   */
  public update(time: number, delta: number) {
    if (this.state === 'DRAGGING') {
      // Smooth interpolation to target
      this.currentPos.lerp(this.targetPos, Math.min(1, delta * 18));
      this.updateGeometry();

      // Pulsing halo
      const pulse = 0.7 + Math.sin(time * 12) * 0.3;
      this.haloMaterial.opacity = pulse;
    } else if (this.state === 'RETURNING') {
      this.currentPos.lerp(this.targetPos, Math.min(1, delta * this.returnSpeed));
      this.updateGeometry();

      if (this.currentPos.distanceTo(this.targetPos) < 0.05) {
        this.currentPos.copy(this.restPos);
        this.state = 'RESTING';
        this.updateGeometry();
      }
    } else if (this.state === 'CONNECTED') {
      const pulse = 0.3 + Math.sin(time * 3) * 0.1;
      this.haloMaterial.opacity = pulse;
    }
  }
}
