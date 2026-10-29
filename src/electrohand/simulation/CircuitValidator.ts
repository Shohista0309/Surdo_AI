import {
  ComponentInstance,
  JumperWire,
  SimulationResult,
  DiagnosticIssue,
  BranchCurrentResult,
  ComponentType
} from '../types';
import { MnaSolver, MnaComponent } from './MnaSolver';
import { COMPONENT_CATALOG } from '../data/componentCatalog';
import { BreadboardModel } from '../breadboard/BreadboardModel';

export class CircuitValidator {
  private breadboardModel: BreadboardModel;

  constructor(breadboardModel: BreadboardModel) {
    this.breadboardModel = breadboardModel;
  }

  /**
   * Validate and simulate complete user circuit
   */
  public analyzeCircuit(components: ComponentInstance[], wires: JumperWire[]): SimulationResult {
    const issues: DiagnosticIssue[] = [];
    const branchCurrents: Record<string, BranchCurrentResult> = {};

    if (components.length === 0) {
      return {
        status: 'idle',
        statusTextUz: 'Zanjirda hech qanday komponent joylashtirilmagan.',
        nodeVoltages: {},
        branchCurrents: {},
        issues: [],
        timestamp: Date.now()
      };
    }

    // 1. Build Electrical Net Equivalence Map using Disjoint Set (Union-Find)
    const netParent = new Map<string, string>();
    const findNet = (n: string): string => {
      if (!netParent.has(n)) netParent.set(n, n);
      if (netParent.get(n) !== n) {
        netParent.set(n, findNet(netParent.get(n)!));
      }
      return netParent.get(n)!;
    };
    const unionNets = (n1: string, n2: string) => {
      const root1 = findNet(n1);
      const root2 = findNet(n2);
      if (root1 !== root2) {
        netParent.set(root1, root2);
      }
    };

    // 2. Map component pins to breadboard holes or wires
    const compPinToNet = new Map<string, string>(); // 'comp_id:pin_id' -> canonical Net Name

    components.forEach(comp => {
      const spec = COMPONENT_CATALOG[comp.type];
      if (!spec) return;

      spec.pins.forEach(pin => {
        const pinKey = `${comp.id}:${pin.id}`;
        const connectedHoleOrWire = comp.pinConnections[pin.id];

        if (connectedHoleOrWire) {
          if (connectedHoleOrWire.startsWith('rail_') || connectedHoleOrWire.startsWith('col_')) {
            const hole = this.breadboardModel.getHoleById(connectedHoleOrWire);
            if (hole) {
              unionNets(pinKey, hole.nodeId);
            } else {
              unionNets(pinKey, connectedHoleOrWire);
            }
          } else {
            unionNets(pinKey, connectedHoleOrWire);
          }
        } else {
          // If pin is near a breadboard hole, automatically detect insertion
          const worldPinPos = this.getComponentPinWorldPos(comp, pin.relativePosition);
          const nearestHole = this.breadboardModel.findNearestHole(worldPinPos.x, worldPinPos.y, 0.28);
          if (nearestHole) {
            unionNets(pinKey, nearestHole.nodeId);
          }
        }
      });
    });

    // 3. Union nets connected by Jumper Wires
    wires.forEach(wire => {
      let startNet = wire.startNode;
      let endNet = wire.endNode;

      const startHole = this.breadboardModel.getHoleById(wire.startNode);
      if (startHole) startNet = startHole.nodeId;

      const endHole = this.breadboardModel.getHoleById(wire.endNode);
      if (endHole) endNet = endHole.nodeId;

      if (startNet && endNet) {
        unionNets(startNet, endNet);
      }
    });

    // 4. Prepare MNA components list
    const mnaComponents: MnaComponent[] = [];
    let hasPowerSource = false;
    let powerCompId = '';

    components.forEach(comp => {
      const spec = COMPONENT_CATALOG[comp.type];
      if (!spec) return;

      const nodes = spec.pins.map(pin => {
        const pinKey = `${comp.id}:${pin.id}`;
        return findNet(pinKey);
      });

      if (comp.type.startsWith('dc_') || comp.type.includes('battery') || comp.type.includes('supply')) {
        hasPowerSource = true;
        powerCompId = comp.id;
      }

      mnaComponents.push({
        id: comp.id,
        type: comp.type,
        nodes,
        params: comp.parameters
      });
    });

    // Check if any power source exists
    if (!hasPowerSource) {
      issues.push({
        id: 'no_power_source',
        severity: 'warning',
        titleUz: 'Quvvat manbai mavjud emas',
        descriptionUz: 'Zanjirda quvvat manbai (masalan 9V batareya yoki 5V DC manba) o‘rnatilmagan.',
        componentIds: [],
        nodeIds: []
      });

      return {
        status: 'cannot_determine',
        statusTextUz: 'Quvvat manbai ulanmagan.',
        nodeVoltages: {},
        branchCurrents: {},
        issues,
        timestamp: Date.now()
      };
    }

    // 5. Solve circuit using MnaSolver
    const mnaSolution = MnaSolver.solve(mnaComponents);
    const nodeVoltages = mnaSolution.nodeVoltages;

    // 6. Check for Short Circuits across power source
    const powerComp = mnaComponents.find(c => c.id === powerCompId);
    let isShortCircuit = false;
    if (powerComp && powerComp.nodes.length >= 2) {
      const posNet = powerComp.nodes[0];
      const negNet = powerComp.nodes[1];

      if (findNet(posNet) === findNet(negNet)) {
        isShortCircuit = true;
        issues.push({
          id: 'critical_short_circuit',
          severity: 'critical',
          titleUz: 'Kritik qisqa tutashuv!',
          descriptionUz: 'Manbaning musbat (+) va manfiy (-) qutblari to‘g‘ridan-to‘g‘ri yuklamasiz tutashtirilgan. Haqiqiy laboratoriyada bu batareya yoki o‘tkazgichlarning qizib erishi va shikastlanishiga olib keladi.',
          componentIds: [powerComp.id],
          nodeIds: [posNet, negNet]
        });
      }
    }

    // 7. Inspect each component's electrical operation
    let activeLedCount = 0;
    let totalLedCount = 0;
    let anyCurrentFlow = false;

    mnaComponents.forEach(comp => {
      const spec = COMPONENT_CATALOG[comp.type as ComponentType];
      if (!spec) return;

      const v1 = nodeVoltages[comp.nodes[0]] ?? 0;
      const v2 = nodeVoltages[comp.nodes[1]] ?? 0;
      const vDrop = Math.abs(v1 - v2);

      // Resistor checks
      if (comp.type.startsWith('resistor_') || comp.type === 'photoresistor_ldr') {
        const r = (comp.params.resistance as number) || 220;
        const current = vDrop / Math.max(0.01, r);
        const power = current * vDrop;

        if (current > 1e-4) anyCurrentFlow = true;

        branchCurrents[comp.id] = {
          componentId: comp.id,
          current,
          power,
          state: current > 0.001 ? 'CONDUCTING' : 'OFF'
        };

        // Resistor power rating warning (P > 0.25W)
        if (power > 0.25) {
          issues.push({
            id: `resistor_overheat_${comp.id}`,
            severity: 'warning',
            titleUz: `Rezistor qizishi xavfi (${spec.nameUz})`,
            descriptionUz: `Rezistordan ajralayotgan quvvat (${power.toFixed(2)}W) ruxsat etilgan 0.25W dan yuqori. Yuqoriroq quvvatli yoki kattaroq qarshilikli rezistor tanlang.`,
            componentIds: [comp.id],
            nodeIds: comp.nodes
          });
        }
      }

      // LED checks
      else if (comp.type.startsWith('led_')) {
        totalLedCount++;
        const vAnode = nodeVoltages[comp.nodes[0]] ?? 0;
        const vCathode = nodeVoltages[comp.nodes[1]] ?? 0;
        const vForward = vAnode - vCathode;

        // Approximate LED current
        let ledCurrent = 0;
        if (vForward > 1.6) {
          ledCurrent = Math.max(0, (vForward - 1.8) / 15.0); // dynamic curve
        }

        if (ledCurrent > 1e-4) anyCurrentFlow = true;

        // Check if LED is connected directly across 5V or 9V with NO resistor
        if (vForward > 2.8) {
          // Destructive overcurrent!
          const simulatedI = Math.min(0.5, (vForward - 1.8) / 4.0);
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: simulatedI,
            power: simulatedI * vForward,
            state: 'BURNT'
          };

          issues.push({
            id: `led_burnt_${comp.id}`,
            severity: 'critical',
            titleUz: `LED kuyish xavfi! (${spec.nameUz})`,
            descriptionUz: `LED orqali oqayotgan kuchlanish (${vForward.toFixed(2)}V) juda yuqori va tok cheklovchi rezistor yo‘q. Haqiqiy diod soniyalar ichida yonib ketadi. Ketma-ket 220Ω yoki 330Ω rezistor ulang.`,
            componentIds: [comp.id],
            nodeIds: comp.nodes
          });
        } else if (vForward >= 1.7 && ledCurrent >= 0.002) {
          // Normal glowing LED
          activeLedCount++;
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: ledCurrent,
            power: ledCurrent * vForward,
            state: 'ON'
          };
        } else if (vForward < -0.5) {
          // Reverse polarity
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'REVERSE_BIASED'
          };

          issues.push({
            id: `led_reverse_${comp.id}`,
            severity: 'warning',
            titleUz: `LED teskari ulangan (${spec.nameUz})`,
            descriptionUz: `Anod potensiali (${vAnode.toFixed(2)}V) Katoddan (${vCathode.toFixed(2)}V) past. LED tok o‘tkazmaydi va yonmaydi. Oyoqlarini almashtiring yoki 180° ga buring.`,
            componentIds: [comp.id],
            nodeIds: comp.nodes
          });
        } else {
          // Off
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'OFF'
          };
        }
      }

      // Diode checks
      else if (comp.type.startsWith('diode_')) {
        const vAnode = nodeVoltages[comp.nodes[0]] ?? 0;
        const vCathode = nodeVoltages[comp.nodes[1]] ?? 0;
        const vF = vAnode - vCathode;
        if (vF > 0.5) {
          anyCurrentFlow = true;
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: (vF - 0.7) / 1.0,
            power: 0.1,
            state: 'FORWARD'
          };
        } else {
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'REVERSE'
          };
        }
      }

      // Transistor checks
      else if (comp.type === 'transistor_npn_2n2222') {
        const ve = nodeVoltages[comp.nodes[0]] ?? 0;
        const vb = nodeVoltages[comp.nodes[1]] ?? 0;
        const vc = nodeVoltages[comp.nodes[2]] ?? 0;

        const vbe = vb - ve;
        const vce = vc - ve;

        if (vbe > 0.65) {
          anyCurrentFlow = true;
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0.05,
            power: 0.05 * vce,
            state: vce < 0.2 ? 'SATURATED' : 'ACTIVE'
          };
        } else {
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'CUTOFF'
          };
        }
      }

      // Capacitor polarity check
      else if (comp.type.includes('electrolytic')) {
        const vPos = nodeVoltages[comp.nodes[0]] ?? 0;
        const vNeg = nodeVoltages[comp.nodes[1]] ?? 0;
        if (vNeg - vPos > 0.5) {
          issues.push({
            id: `cap_reverse_${comp.id}`,
            severity: 'critical',
            titleUz: `Elektrolitik kondensator teskari qutblangan!`,
            descriptionUz: `Elektrolitik kondensator manfiy qutbi musbat potensialga ulab qo‘yilgan. Haqiqiy hayotda bu kondensatorning qizishi, shishishi va portlashiga sabab bo‘ladi!`,
            componentIds: [comp.id],
            nodeIds: comp.nodes
          });
        }
      }

      // Piezo Buzzer check
      else if (comp.type === 'buzzer_piezo') {
        const vPos = nodeVoltages[comp.nodes[0]] ?? 0;
        const vNeg = nodeVoltages[comp.nodes[1]] ?? 0;
        const vDiff = vPos - vNeg;

        if (vDiff >= 2.0) {
          anyCurrentFlow = true;
          const current = vDiff / 150.0;
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current,
            power: current * vDiff,
            state: 'ACTIVE'
          };
        } else if (vDiff < -0.5) {
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'REVERSE_BIASED'
          };
          issues.push({
            id: `buzzer_reverse_${comp.id}`,
            severity: 'warning',
            titleUz: 'Buzzer teskari ulangan',
            descriptionUz: 'Pyezo buzzer musbat qutbi manfiy potensialga ulab qo‘yilgan. Anod (+) va katod (-) oyoqlarini to‘g‘ri ulang.',
            componentIds: [comp.id],
            nodeIds: comp.nodes
          });
        } else {
          branchCurrents[comp.id] = {
            componentId: comp.id,
            current: 0,
            power: 0,
            state: 'OFF'
          };
        }
      }
    });

    // 8. Open Circuit check
    if (!isShortCircuit && !anyCurrentFlow && components.length >= 2) {
      issues.push({
        id: 'open_circuit',
        severity: 'warning',
        titleUz: 'Ochiq zanjir (Tok oqmayapti)',
        descriptionUz: 'Zanjirda yopiq elektr konturi hosil qilinmagan yoki simlar ulanmagan. Tok manbadan chiqib zaminga yetib borishi uchun barcha uzilishlarni bartaraf qiling.',
        componentIds: [],
        nodeIds: []
      });
    }

    // 9. Determine overall status
    let status: SimulationResult['status'] = 'idle';
    let statusTextUz = '';

    const hasCritical = issues.some(i => i.severity === 'critical');
    const hasWarning = issues.some(i => i.severity === 'warning');

    if (hasCritical) {
      status = 'error';
      statusTextUz = 'Xatolik aniqlandi: Zanjirda xavfli qisqa tutashuv yoki komponent shikastlanishi mavjud!';
    } else if (hasWarning && !anyCurrentFlow) {
      status = 'error';
      statusTextUz = 'Zanjir to‘liq yig‘ilmagan yoki ochiq kontur mavjud.';
    } else if (hasWarning) {
      status = 'error';
      statusTextUz = 'Ogohlantirish: Zanjir ishlayapti, lekin ba’zi komponentlar noto‘g‘ri rejimda.';
    } else if (anyCurrentFlow) {
      status = 'success';
      statusTextUz = 'To‘g‘ri va ishlamoqda: Zanjir to‘liq to‘g‘ri yig‘ilgan va barcha parametrlar me’yorda!';
    } else {
      status = 'cannot_determine';
      statusTextUz = 'Zanjir holati aniqlanmadi.';
    }

    return {
      status,
      statusTextUz,
      nodeVoltages,
      branchCurrents,
      issues,
      timestamp: Date.now()
    };
  }

  /**
   * Helper to compute rotated world position of a component pin
   */
  private getComponentPinWorldPos(
    comp: ComponentInstance,
    relPos: { x: number; y: number; z: number }
  ): { x: number; y: number; z: number } {
    const rad = (comp.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotX = relPos.x * cos - relPos.y * sin;
    const rotY = relPos.x * sin + relPos.y * cos;

    return {
      x: comp.position.x + rotX,
      y: comp.position.y + rotY,
      z: comp.position.z + relPos.z
    };
  }
}
