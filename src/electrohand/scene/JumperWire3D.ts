import * as THREE from 'three';
import { JumperWire } from '../types';

export class JumperWire3D {
  public data: JumperWire;
  public group: THREE.Group;

  private tubeMesh: THREE.Mesh;
  private tubeMaterial: THREE.MeshStandardMaterial;
  private startPinMesh: THREE.Mesh;
  private endPinMesh: THREE.Mesh;
  private _isHovered: boolean = false;

  constructor(data: JumperWire) {
    this.data = data;
    this.group = new THREE.Group();

    const colorHex = parseInt(data.color.replace('#', '0x'), 16);

    // 1. Tube Material
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.15
    });

    // 2. Initial Curve & Tube
    const curve = this.createCurve(
      new THREE.Vector3(data.startPos.x, data.startPos.y, data.startPos.z),
      new THREE.Vector3(data.endPos.x, data.endPos.y, data.endPos.z)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.045, 10, false);
    this.tubeMesh = new THREE.Mesh(tubeGeo, this.tubeMaterial);
    this.tubeMesh.castShadow = true;
    this.group.add(this.tubeMesh);

    // 3. Molded end plugs / headers
    const plugGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12);
    const plugMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    this.startPinMesh = new THREE.Mesh(plugGeo, plugMat);
    this.startPinMesh.rotation.x = Math.PI / 2;
    this.startPinMesh.position.set(data.startPos.x, data.startPos.y, data.startPos.z + 0.12);
    this.group.add(this.startPinMesh);

    this.endPinMesh = new THREE.Mesh(plugGeo, plugMat);
    this.endPinMesh.rotation.x = Math.PI / 2;
    this.endPinMesh.position.set(data.endPos.x, data.endPos.y, data.endPos.z + 0.12);
    this.group.add(this.endPinMesh);
  }

  /** Highlight on hover for delete mode */
  public setHovered(hovered: boolean) {
    if (this._isHovered === hovered) return;
    this._isHovered = hovered;
    const colorHex = parseInt(this.data.color.replace('#', '0x'), 16);
    if (hovered) {
      this.tubeMaterial.color.setHex(0xff4444);
      this.tubeMaterial.emissive.setHex(0x440000);
      this.tubeMaterial.emissiveIntensity = 0.6;
    } else {
      this.tubeMaterial.color.setHex(colorHex);
      this.tubeMaterial.emissive.setHex(0x000000);
      this.tubeMaterial.emissiveIntensity = 0;
    }
  }

  /** Returns the midpoint of the wire for proximity detection */
  public getMidpoint(): THREE.Vector3 {
    const s = this.data.startPos;
    const e = this.data.endPos;
    return new THREE.Vector3(
      (s.x + e.x) / 2,
      (s.y + e.y) / 2,
      (s.z + e.z) / 2
    );
  }

  public updateEndpoints(start: THREE.Vector3, end: THREE.Vector3) {
    this.data.startPos = { x: start.x, y: start.y, z: start.z };
    this.data.endPos = { x: end.x, y: end.y, z: end.z };

    const curve = this.createCurve(start, end);
    this.tubeMesh.geometry.dispose();
    this.tubeMesh.geometry = new THREE.TubeGeometry(curve, 32, 0.045, 10, false);

    this.startPinMesh.position.set(start.x, start.y, start.z + 0.12);
    this.endPinMesh.position.set(end.x, end.y, end.z + 0.12);
  }

  private createCurve(p0: THREE.Vector3, p3: THREE.Vector3): THREE.CatmullRomCurve3 {
    const dist = p0.distanceTo(p3);
    const arcHeight = Math.max(0.35, Math.min(1.4, 0.35 + dist * 0.15));

    const p1 = new THREE.Vector3(
      p0.x + (p3.x - p0.x) * 0.25,
      p0.y + (p3.y - p0.y) * 0.25,
      p0.z + arcHeight * 0.85
    );

    const p2 = new THREE.Vector3(
      p0.x + (p3.x - p0.x) * 0.75,
      p0.y + (p3.y - p0.y) * 0.75,
      p3.z + arcHeight * 0.85
    );

    return new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
  }
}
