import * as THREE from 'three';
import { ComponentInstance, ComponentSpecification, PinDefinition } from '../types';
import { Component3DFactory } from './Component3DFactory';
import { COMPONENT_CATALOG } from '../data/componentCatalog';

export class ComponentObject3D {
  public instance: ComponentInstance;
  public specification: ComponentSpecification;
  public group: THREE.Group;
  public modelGroup: THREE.Group;
  public isSelected: boolean = false;
  public isHovered: boolean = false;
  public hasError: boolean = false;

  private selectionRing: THREE.Mesh;
  private selectionRingMat: THREE.MeshBasicMaterial;
  private dynamicLedLight?: THREE.PointLight;
  private dynamicLedMaterial?: THREE.MeshStandardMaterial;

  constructor(instance: ComponentInstance) {
    this.instance = instance;
    this.specification = COMPONENT_CATALOG[instance.type];

    this.group = new THREE.Group();
    this.group.position.set(instance.position.x, instance.position.y, instance.position.z);
    this.group.rotation.z = (instance.rotation * Math.PI) / 180;

    // Build 3D model
    const { group: model, dynamicLedLight, dynamicLedMaterial } = Component3DFactory.createModel(this.specification);
    this.modelGroup = model;
    this.dynamicLedLight = dynamicLedLight;
    this.dynamicLedMaterial = dynamicLedMaterial;
    this.group.add(this.modelGroup);

    // Selection / Error Highlight Ring
    const ringGeo = new THREE.RingGeometry(0.5, 0.65, 32);
    this.selectionRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.selectionRing = new THREE.Mesh(ringGeo, this.selectionRingMat);
    this.selectionRing.position.z = 0.05;
    this.group.add(this.selectionRing);
  }

  public setPosition(x: number, y: number, z: number = 0) {
    this.instance.position = { x, y, z };
    this.group.position.set(x, y, z);
  }

  public setRotation(degrees: number) {
    this.instance.rotation = (degrees % 360 + 360) % 360;
    this.group.rotation.z = (this.instance.rotation * Math.PI) / 180;
  }

  public rotateClockwise() {
    this.setRotation(this.instance.rotation + 90);
  }

  public setSelected(selected: boolean) {
    this.isSelected = selected;
    this.updateHighlightState();
  }

  public setHovered(hovered: boolean) {
    this.isHovered = hovered;
    this.updateHighlightState();
  }

  public setError(hasError: boolean) {
    this.hasError = hasError;
    this.updateHighlightState();
  }

  private updateHighlightState() {
    if (this.hasError) {
      this.selectionRingMat.color.setHex(0xef4444); // Red warning
      this.selectionRingMat.opacity = 0.95;
    } else if (this.isSelected) {
      this.selectionRingMat.color.setHex(0x00f0ff); // Cyan active
      this.selectionRingMat.opacity = 0.85;
    } else if (this.isHovered) {
      this.selectionRingMat.color.setHex(0x38bdf8);
      this.selectionRingMat.opacity = 0.45;
    } else {
      this.selectionRingMat.opacity = 0;
    }
  }

  /**
   * Updates physical state (e.g. LED emission based on simulated current)
   */
  public updateSimulationVisuals(state?: string, current?: number) {
    if (this.dynamicLedMaterial && this.dynamicLedLight) {
      if (state === 'ON') {
        const i = current || 0.015;
        const brightness = Math.min(2.5, Math.max(0.5, (i / 0.015) * 1.5));
        this.dynamicLedMaterial.emissiveIntensity = brightness;
        this.dynamicLedLight.intensity = brightness * 1.8;
      } else if (state === 'BURNT') {
        // Burnt out: dim black/red smoky look
        this.dynamicLedMaterial.emissive.setHex(0x7f1d1d);
        this.dynamicLedMaterial.emissiveIntensity = 0.2;
        this.dynamicLedLight.intensity = 0.1;
      } else {
        // Off
        this.dynamicLedMaterial.emissiveIntensity = 0.05;
        this.dynamicLedLight.intensity = 0;
      }
    }
  }

  /**
   * Get world coordinates of all pins after applying position and rotation
   */
  public getPinWorldPositions(): Array<{ pin: PinDefinition; worldPos: THREE.Vector3 }> {
    const rad = (this.instance.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return this.specification.pins.map(pin => {
      const rx = pin.relativePosition.x * cos - pin.relativePosition.y * sin;
      const ry = pin.relativePosition.x * sin + pin.relativePosition.y * cos;

      const worldPos = new THREE.Vector3(
        this.instance.position.x + rx,
        this.instance.position.y + ry,
        this.instance.position.z + pin.relativePosition.z
      );

      return { pin, worldPos };
    });
  }

  public update(time: number) {
    if (this.isSelected || this.hasError) {
      const pulse = 0.75 + Math.sin(time * 8) * 0.25;
      this.selectionRingMat.opacity = pulse;
    }
  }
}
