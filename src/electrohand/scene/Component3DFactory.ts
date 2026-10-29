import * as THREE from 'three';
import { ComponentType, ComponentSpecification } from '../types';
import { COMPONENT_CATALOG } from '../data/componentCatalog';

export class Component3DFactory {
  /**
   * Generates a realistic, correctly scaled procedural Three.js 3D model for any electronic component
   */
  public static createModel(spec: ComponentSpecification): { group: THREE.Group; dynamicLedLight?: THREE.PointLight; dynamicLedMaterial?: THREE.MeshStandardMaterial } {
    const type = spec.type;

    if (type.startsWith('led_')) {
      return Component3DFactory.createLed(spec);
    } else if (type.startsWith('resistor_')) {
      return Component3DFactory.createResistor(spec);
    } else if (type.startsWith('diode_')) {
      return Component3DFactory.createDiode(spec);
    } else if (type.startsWith('transistor_')) {
      return Component3DFactory.createTransistor(spec);
    } else if (type.startsWith('ic_')) {
      return Component3DFactory.createDipIc(spec);
    } else if (type.startsWith('dc_battery_') || type.startsWith('dc_supply_') || type.startsWith('ac_') || type === 'dc_adjustable') {
      return Component3DFactory.createPowerSource(spec);
    } else if (type.startsWith('capacitor_')) {
      return Component3DFactory.createCapacitor(spec);
    } else if (type === 'potentiometer_10k') {
      return Component3DFactory.createPotentiometer(spec);
    } else if (type.startsWith('switch_')) {
      return Component3DFactory.createSwitch(spec);
    } else if (type === 'buzzer_piezo') {
      return Component3DFactory.createBuzzer(spec);
    } else if (type === 'transformer_stepdown') {
      return Component3DFactory.createTransformer(spec);
    } else {
      return Component3DFactory.createGenericComponent(spec);
    }
  }

  // 1. LED (Light Emitting Diode)
  private static createLed(spec: ComponentSpecification): { group: THREE.Group; dynamicLedLight: THREE.PointLight; dynamicLedMaterial: THREE.MeshStandardMaterial } {
    const group = new THREE.Group();
    const colorHex = (spec.defaultParameters.color as string) || '#ef4444';
    const numColor = parseInt(colorHex.replace('#', '0x'), 16);

    // Colored Translucent Epoxy Dome (5mm LED)
    const domeMat = new THREE.MeshStandardMaterial({
      color: numColor,
      emissive: 0x000000,
      emissiveIntensity: 0.1,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    const domeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.45, 20);
    const cylinder = new THREE.Mesh(domeGeo, domeMat);
    cylinder.position.z = 0.45;
    cylinder.rotation.x = Math.PI / 2;
    group.add(cylinder);

    // Rounded Top Cap
    const capGeo = new THREE.SphereGeometry(0.25, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, domeMat);
    cap.position.z = 0.68;
    cap.rotation.x = -Math.PI / 2;
    group.add(cap);

    // Base Rim with Cathode Flat Notch
    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20);
    const rim = new THREE.Mesh(rimGeo, domeMat);
    rim.position.z = 0.22;
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // Metallic Pins (Anode longer, Cathode shorter)
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.25);
      group.add(pinMesh);
    });

    // Dynamic Point Light inside the LED
    const pointLight = new THREE.PointLight(numColor, 0, 3.5);
    pointLight.position.set(0, 0, 0.5);
    group.add(pointLight);

    return { group, dynamicLedLight: pointLight, dynamicLedMaterial: domeMat };
  }

  // 2. Resistor with IEC color bands
  private static createResistor(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    // Ceramic Body (Beige/Tan)
    const bodyGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd9cba8, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    body.position.z = 0.22;
    group.add(body);

    // Bulbed ends
    const endCapGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const end1 = new THREE.Mesh(endCapGeo, bodyMat);
    end1.position.set(-0.3, 0, 0.22);
    group.add(end1);

    const end2 = new THREE.Mesh(endCapGeo, bodyMat);
    end2.position.set(0.3, 0, 0.22);
    group.add(end2);

    // Color bands according to resistance
    const r = (spec.defaultParameters.resistance as number) || 220;
    const bandColors = Component3DFactory.getResistorBands(r);

    bandColors.forEach((col, idx) => {
      const bandGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.06, 16);
      const bandMat = new THREE.MeshBasicMaterial({ color: col });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.rotation.z = Math.PI / 2;
      band.position.set(-0.2 + idx * 0.13, 0, 0.22);
      group.add(band);
    });

    // Bent metallic leads descending to breadboard
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.22);
      group.add(pinMesh);

      // Horizontal lead wire connecting body to pin
      const horizGeo = new THREE.CylinderGeometry(0.025, 0.025, Math.abs(p.relativePosition.x), 8);
      const leadMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.15 });
      const horiz = new THREE.Mesh(horizGeo, leadMat);
      horiz.rotation.z = Math.PI / 2;
      horiz.position.set(p.relativePosition.x / 2, 0, 0.22);
      group.add(horiz);
    });

    return { group };
  }

  // 3. Diode (1N4007 / Zener / Schottky)
  private static createDiode(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    const isZener = spec.type === 'diode_zener';
    const bodyColor = isZener ? 0xc2410c : 0x111827; // Glass orange for Zener, Black for 1N4007
    const bandColor = isZener ? 0x000000 : 0xe2e8f0; // Black band for Zener, Silver for 1N4007

    // Cylinder Body
    const bodyGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    body.position.z = 0.22;
    group.add(body);

    // Cathode silver band on the right side
    const bandGeo = new THREE.CylinderGeometry(0.125, 0.125, 0.1, 16);
    const bandMat = new THREE.MeshBasicMaterial({ color: bandColor });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.z = Math.PI / 2;
    band.position.set(0.2, 0, 0.22);
    group.add(band);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.22);
      group.add(pinMesh);

      const horizGeo = new THREE.CylinderGeometry(0.025, 0.025, Math.abs(p.relativePosition.x), 8);
      const leadMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.15 });
      const horiz = new THREE.Mesh(horizGeo, leadMat);
      horiz.rotation.z = Math.PI / 2;
      horiz.position.set(p.relativePosition.x / 2, 0, 0.22);
      group.add(horiz);
    });

    return { group };
  }

  // 4. Transistor (TO-92 NPN / PNP / MOSFET)
  private static createTransistor(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    // TO-92 D-shaped casing
    const casingGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.5, 16, 1, false, 0, Math.PI * 1.5);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.z = 0.45;
    casing.rotation.x = Math.PI / 2;
    group.add(casing);

    // Flat front face
    const flatGeo = new THREE.BoxGeometry(0.48, 0.02, 0.5);
    const flat = new THREE.Mesh(flatGeo, casingMat);
    flat.position.set(0, -0.01, 0.45);
    group.add(flat);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.4);
      group.add(pinMesh);
    });

    return { group };
  }

  // 5. DIP IC (Dual In-line Package: NE555, LM358, 74HC04...)
  private static createDipIc(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();
    const pinCount = spec.pins.length; // 8 or 14
    const length = (pinCount / 2) * 0.28 + 0.2;

    // Black plastic DIP body
    const bodyGeo = new THREE.BoxGeometry(0.8, length, 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.z = 0.32;
    group.add(body);

    // Pin 1 Index Notch at top
    const notchGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.36, 12, 1, false, 0, Math.PI);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, length / 2, 0.32);
    group.add(notch);

    // Silver gull-wing pins on both sides
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.28);
      group.add(pinMesh);
    });

    // Chip text sprite
    const sprite = Component3DFactory.createTextSprite(spec.code);
    sprite.position.set(0, 0, 0.52);
    group.add(sprite);

    return { group };
  }

  // 6. Power Sources (9V Battery, 5V DC Supply...)
  private static createPowerSource(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    if (spec.type === 'dc_battery_9v') {
      // 9V Battery casing (Blue / Gold metallic)
      const battGeo = new THREE.BoxGeometry(1.4, 0.9, 1.8);
      const battMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.6, roughness: 0.3 });
      const batt = new THREE.Mesh(battGeo, battMat);
      batt.position.z = 0.95;
      group.add(batt);

      // Gold top collar
      const topGeo = new THREE.BoxGeometry(1.4, 0.9, 0.25);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.z = 1.9;
      group.add(topMesh);

      // Snap terminals
      const termGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);
      const termMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 });
      const t1 = new THREE.Mesh(termGeo, termMat);
      t1.rotation.x = Math.PI / 2;
      t1.position.set(-0.35, 0, 2.05);
      group.add(t1);

      const t2 = new THREE.Mesh(termGeo, termMat);
      t2.rotation.x = Math.PI / 2;
      t2.position.set(0.35, 0, 2.05);
      group.add(t2);
    } else {
      // Benchtop DC Power Module
      const psuGeo = new THREE.BoxGeometry(1.6, 1.2, 0.85);
      const psuMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.4, roughness: 0.4 });
      const psu = new THREE.Mesh(psuGeo, psuMat);
      psu.position.z = 0.45;
      group.add(psu);

      // Screen label
      const sprite = Component3DFactory.createTextSprite(`${spec.defaultParameters.voltage || 5}V DC`);
      sprite.position.set(0, 0, 0.9);
      group.add(sprite);
    }

    // Lead pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.3);
      group.add(pinMesh);
    });

    return { group };
  }

  // 7. Capacitor (Ceramic / Electrolytic)
  private static createCapacitor(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    if (spec.type.includes('electrolytic')) {
      // Aluminum electrolytic can (Blue cylinder)
      const canGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.7, 16);
      const canMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
      const can = new THREE.Mesh(canGeo, canMat);
      can.rotation.x = Math.PI / 2;
      can.position.z = 0.55;
      group.add(can);

      // Negative stripe (White line on side)
      const stripeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.68);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0.23, 0, 0.55);
      group.add(stripe);
    } else {
      // Ceramic disc (Orange disc)
      const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16);
      const discMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.z = 0.45;
      group.add(disc);
    }

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.35);
      group.add(pinMesh);
    });

    return { group };
  }

  // 8. Potentiometer
  private static createPotentiometer(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.4, 20);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    body.position.z = 0.35;
    group.add(body);

    // Rotary Knob (Cyan top)
    const knobGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.z = 0.65;
    group.add(knob);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.3);
      group.add(pinMesh);
    });

    return { group };
  }

  // 9. Switch (Push button / Slide switch)
  private static createSwitch(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    // Square casing
    const boxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.35);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.z = 0.28;
    group.add(box);

    // Round button plunger
    const btnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.z = 0.5;
    group.add(btn);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.25);
      group.add(pinMesh);
    });

    return { group };
  }

  // 10. Buzzer
  private static createBuzzer(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    const canGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.65, 24);
    const canMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
    const can = new THREE.Mesh(canGeo, canMat);
    can.rotation.x = Math.PI / 2;
    can.position.z = 0.45;
    group.add(can);

    // Sound hole
    const holeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = Math.PI / 2;
    hole.position.z = 0.78;
    group.add(hole);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.3);
      group.add(pinMesh);
    });

    return { group };
  }

  // 11. Transformer
  private static createTransformer(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();

    // E-I core (dark iron block)
    const coreGeo = new THREE.BoxGeometry(1.4, 1.4, 0.85);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.z = 0.55;
    group.add(core);

    // Copper Windings
    const windGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16);
    const windMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 });
    const wind = new THREE.Mesh(windGeo, windMat);
    wind.rotation.x = Math.PI / 2;
    wind.position.z = 0.55;
    group.add(wind);

    // Pins
    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.35);
      group.add(pinMesh);
    });

    return { group };
  }

  // 12. Generic / Fallback
  private static createGenericComponent(spec: ComponentSpecification): { group: THREE.Group } {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.6, 0.6, 0.4);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.z = 0.3;
    group.add(box);

    spec.pins.forEach(p => {
      const pinMesh = Component3DFactory.createLeadPin(p.relativePosition, 0.25);
      group.add(pinMesh);
    });

    return { group };
  }

  /**
   * Helper to create metallic solder lead pin plunging vertically into breadboard hole
   */
  private static createLeadPin(relPos: { x: number; y: number; z: number }, height: number): THREE.Mesh {
    const pinGeo = new THREE.CylinderGeometry(0.035, 0.035, height + 0.25, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Silver tin-plated copper lead
      metalness: 0.95,
      roughness: 0.15
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(relPos.x, relPos.y, (height - 0.25) / 2);
    return pin;
  }

  /**
   * Generates IEC resistor color code bands based on resistance value
   */
  private static getResistorBands(r: number): number[] {
    const colorMap: Record<number, number> = {
      0: 0x000000, // Black
      1: 0x78350f, // Brown
      2: 0xef4444, // Red
      3: 0xf97316, // Orange
      4: 0xeab308, // Yellow
      5: 0x22c55e, // Green
      6: 0x3b82f6, // Blue
      7: 0xa855f7, // Violet
      8: 0x64748b, // Gray
      9: 0xffffff  // White
    };
    const gold = 0xd97706;

    if (r === 220) return [colorMap[2], colorMap[2], colorMap[1], gold]; // Red-Red-Brown-Gold
    if (r === 330) return [colorMap[3], colorMap[3], colorMap[1], gold]; // Orange-Orange-Brown-Gold
    if (r === 1000) return [colorMap[1], colorMap[0], colorMap[2], gold]; // Brown-Black-Red-Gold
    if (r === 10000) return [colorMap[1], colorMap[0], colorMap[3], gold]; // Brown-Black-Orange-Gold
    if (r === 100000) return [colorMap[1], colorMap[0], colorMap[4], gold]; // Brown-Black-Yellow-Gold

    return [colorMap[1], colorMap[0], colorMap[2], gold];
  }

  private static createTextSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.6, 0.3, 1);
    return sprite;
  }
}
