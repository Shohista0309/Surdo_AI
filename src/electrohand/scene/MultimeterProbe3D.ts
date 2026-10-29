import * as THREE from 'three';

/**
 * 3D Multimeter Test Probe Lead (Red or Black)
 * Realistic needle tip, insulated barrel, ribbed safety guard, and strain-relief cable.
 */
export class MultimeterProbe3D {
  public group: THREE.Group;
  public needleTipPos: THREE.Vector3 = new THREE.Vector3();
  public isRed: boolean;

  private bodyMesh: THREE.Mesh;
  private tipMesh: THREE.Mesh;
  private contactHalo: THREE.Mesh;
  private contactHaloMat: THREE.MeshBasicMaterial;

  constructor(isRed: boolean = true) {
    this.isRed = isRed;
    this.group = new THREE.Group();

    const colorHex = isRed ? 0xef4444 : 0x1e293b;
    const bodyColor = new THREE.Color(colorHex);

    // 1. Sharp Metallic Needle Tip (Stainless Steel)
    const tipGeo = new THREE.ConeGeometry(0.04, 0.45, 16);
    tipGeo.rotateX(Math.PI); // Point down towards Z- / breadboard
    tipGeo.translate(0, 0, 0.225);
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15
    });
    this.tipMesh = new THREE.Mesh(tipGeo, tipMat);
    this.tipMesh.castShadow = true;
    this.group.add(this.tipMesh);

    // 2. Insulated Probe Body Handle (Tilted for realistic ergonomic hold)
    const bodyGeo = new THREE.CylinderGeometry(0.12, 0.08, 1.4, 16);
    bodyGeo.rotateX(Math.PI / 2);
    bodyGeo.translate(0, 0, 1.15);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.4,
      metalness: 0.1
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // 3. Ribbed Finger Guard Collar
    const guardGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    guardGeo.rotateX(Math.PI / 2);
    guardGeo.translate(0, 0, 0.6);
    const guardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7
    });
    const guard = new THREE.Mesh(guardGeo, guardMat);
    this.group.add(guard);

    // 4. Contact Glow Halo Ring (appears when touching a test point)
    const haloGeo = new THREE.RingGeometry(0.08, 0.22, 24);
    this.contactHaloMat = new THREE.MeshBasicMaterial({
      color: isRed ? 0xff4d4d : 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.contactHalo = new THREE.Mesh(haloGeo, this.contactHaloMat);
    this.contactHalo.position.z = 0.02;
    this.group.add(this.contactHalo);

    // Initial slight angle tilt for realistic probe stance (35 degrees)
    this.group.rotation.x = -Math.PI / 7;
    this.group.position.set(0, 0, -20); // initially hidden
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
    this.needleTipPos.set(x, y, z);
  }

  public setContact(active: boolean) {
    this.contactHaloMat.opacity = active ? 0.9 : 0;
  }

  public setVisible(visible: boolean) {
    this.group.visible = visible;
  }
}
