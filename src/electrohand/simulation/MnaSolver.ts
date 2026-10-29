/**
 * Modified Nodal Analysis (MNA) Engine for ElectroHand
 * Solves DC linear and non-linear electrical circuits (SPICE-grade MNA)
 */

export interface MnaComponent {
  id: string;
  type: string;
  nodes: string[]; // Electrical node names for each pin
  params: Record<string, number | string>;
}

export interface MnaSolution {
  nodeVoltages: Record<string, number>;
  branchCurrents: Record<string, number>;
  converged: boolean;
  iterations: number;
}

export class MnaSolver {
  /**
   * Solves DC Operating Point using Modified Nodal Analysis and Newton-Raphson
   */
  public static solve(components: MnaComponent[], referenceGndNode: string = 'NET_GND'): MnaSolution {
    // 1. Collect all unique nodes
    const nodeSet = new Set<string>();
    components.forEach(c => {
      c.nodes.forEach(n => {
        if (n && n !== 'NONE' && n !== '') {
          nodeSet.add(n);
        }
      });
    });

    // Determine reference ground
    let gndNode = referenceGndNode;
    if (!nodeSet.has(gndNode)) {
      // Find a node that has "GND", "MINUS", or "0V"
      for (const n of nodeSet) {
        if (n.includes('GND') || n.includes('MINUS') || n.includes('neg') || n.includes('BOTTOM_MINUS')) {
          gndNode = n;
          break;
        }
      }
      if (!nodeSet.has(gndNode) && nodeSet.size > 0) {
        // Pick first node as reference if none specified
        gndNode = Array.from(nodeSet)[0];
      }
    }

    // Assign integer index 0..N-1 to non-ground nodes
    const nodeMap = new Map<string, number>();
    let nodeIdx = 0;
    nodeSet.forEach(n => {
      if (n !== gndNode) {
        nodeMap.set(n, nodeIdx++);
      }
    });

    const N = nodeIdx; // Number of non-ground nodes

    // Find independent voltage sources to determine number of auxiliary equations M
    const vSources: Array<{ comp: MnaComponent; posNode: string; negNode: string; voltage: number }> = [];
    components.forEach(c => {
      if (c.type.startsWith('dc_') || c.type.startsWith('ac_') || c.type.includes('battery') || c.type.includes('supply')) {
        const posNode = c.nodes[0] || '';
        const negNode = c.nodes[1] || '';
        const voltage = typeof c.params.voltage === 'number' ? c.params.voltage : (c.params.amplitude as number) || 5.0;
        if (posNode && negNode) {
          vSources.push({ comp: c, posNode, negNode, voltage });
        }
      }
    });

    const M = vSources.length;
    const totalSize = N + M;

    if (totalSize === 0) {
      return { nodeVoltages: {}, branchCurrents: {}, converged: true, iterations: 0 };
    }

    // Initial guess: all node voltages = 0
    let v_prev = new Float64Array(totalSize);

    // Initial diode parameters
    const IS = 1e-12; // Diode saturation current
    const VT = 0.026; // Thermal voltage (kT/q) at room temp
    const N_IDEAL = 1.6;

    let converged = false;
    let iterations = 0;
    const maxIterations = 40;

    // Newton-Raphson loop
    while (!converged && iterations < maxIterations) {
      iterations++;

      // Construct MNA matrix A (size totalSize x totalSize) and vector Z
      const A: number[][] = Array.from({ length: totalSize }, () => Array(totalSize).fill(0));
      const Z: number[] = Array(totalSize).fill(0);

      // Helper to stamp conductance between node p and node q
      const stampConductance = (pName: string, qName: string, g: number) => {
        const p = pName === gndNode ? -1 : nodeMap.get(pName) ?? -1;
        const q = qName === gndNode ? -1 : nodeMap.get(qName) ?? -1;

        if (p >= 0) A[p][p] += g;
        if (q >= 0) A[q][q] += g;
        if (p >= 0 && q >= 0) {
          A[p][q] -= g;
          A[q][p] -= g;
        }
      };

      // Helper to stamp current injection into p and out of q
      const stampCurrent = (pName: string, qName: string, iVal: number) => {
        const p = pName === gndNode ? -1 : nodeMap.get(pName) ?? -1;
        const q = qName === gndNode ? -1 : nodeMap.get(qName) ?? -1;
        if (p >= 0) Z[p] -= iVal; // Current leaving node p
        if (q >= 0) Z[q] += iVal; // Current entering node q
      };

      // 1. Stamp Resistors, Potentiometers, Switches
      components.forEach(c => {
        if (c.type.startsWith('resistor_') || c.type === 'photoresistor_ldr' || c.type === 'buzzer_piezo') {
          const r = (c.params.resistance as number) || 220;
          const g = 1 / Math.max(0.01, r);
          stampConductance(c.nodes[0], c.nodes[1], g);
        } else if (c.type === 'potentiometer_10k') {
          const totalR = (c.params.total_resistance as number) || 10000;
          const ratio = Math.max(0.01, Math.min(0.99, (c.params.wiper_ratio as number) || 0.5));
          const r1 = totalR * ratio;
          const r2 = totalR * (1 - ratio);
          stampConductance(c.nodes[0], c.nodes[1], 1 / Math.max(0.1, r1));
          stampConductance(c.nodes[1], c.nodes[2], 1 / Math.max(0.1, r2));
        } else if (c.type.startsWith('switch_')) {
          const isClosed = c.params.is_pressed === 1 || c.params.state === 1;
          const r = isClosed ? 0.05 : 1e8;
          stampConductance(c.nodes[0], c.nodes[1], 1 / r);
        } else if (c.type.startsWith('capacitor_')) {
          // In DC steady state, ideal capacitor has very high resistance (leakage)
          stampConductance(c.nodes[0], c.nodes[1], 1e-9);
        } else if (c.type === 'buzzer_piezo') {
          // Active Piezo buzzer equivalent load ~150 Ohms
          stampConductance(c.nodes[0], c.nodes[1], 1 / 150.0);
        } else if (c.type === 'transformer_stepdown') {
          // DC steady state: primary and secondary are small series DC resistance
          stampConductance(c.nodes[0], c.nodes[1], 1 / 1.5);
          stampConductance(c.nodes[2], c.nodes[3], 1 / 0.5);
        }
      });

      // 2. Stamp Diodes and LEDs using linearized companion model (gd and Ieq)
      components.forEach(c => {
        if (c.type.startsWith('diode_') || c.type.startsWith('led_')) {
          const pName = c.nodes[0]; // Anode
          const nName = c.nodes[1]; // Cathode

          const vp = pName === gndNode ? 0 : v_prev[nodeMap.get(pName) ?? -1] ?? 0;
          const vn = nName === gndNode ? 0 : v_prev[nodeMap.get(nName) ?? -1] ?? 0;
          const vd = vp - vn;

          const n_coeff = c.type.startsWith('led_') ? 2.0 : N_IDEAL;
          const clampedVd = Math.max(-10, Math.min(2.5, vd));

          // Shockley diode equation: Id = Is * (exp(Vd / (n*Vt)) - 1)
          const expTerm = Math.exp(clampedVd / (n_coeff * VT));
          const id = IS * (expTerm - 1);
          // Small signal conductance gd = d(Id)/d(Vd)
          const gd = Math.max(1e-9, Math.min(50.0, (IS / (n_coeff * VT)) * expTerm));
          // Companion current source: Ieq = Id - gd * Vd
          const ieq = id - gd * clampedVd;

          stampConductance(pName, nName, gd);
          stampCurrent(pName, nName, -ieq);
        }
      });

      // 3. Stamp BJT Transistors (2N2222 NPN)
      components.forEach(c => {
        if (c.type === 'transistor_npn_2n2222') {
          const eName = c.nodes[0]; // Emitter
          const bName = c.nodes[1]; // Base
          const cName = c.nodes[2]; // Collector

          const ve = eName === gndNode ? 0 : v_prev[nodeMap.get(eName) ?? -1] ?? 0;
          const vb = bName === gndNode ? 0 : v_prev[nodeMap.get(bName) ?? -1] ?? 0;
          const vc = cName === gndNode ? 0 : v_prev[nodeMap.get(cName) ?? -1] ?? 0;

          const vbe = vb - ve;
          const vce = vc - ve;

          // Base-emitter diode
          const clampedVbe = Math.max(-5, Math.min(1.0, vbe));
          const expBE = Math.exp(clampedVbe / (1.5 * VT));
          const ib = IS * (expBE - 1);
          const gbe = Math.max(1e-9, (IS / (1.5 * VT)) * expBE);
          const ieq_be = ib - gbe * clampedVbe;

          stampConductance(bName, eName, gbe);
          stampCurrent(bName, eName, -ieq_be);

          // Collector-emitter conduction when Vbe > 0.6V and Vce > 0
          if (vbe > 0.55 && vce > 0.05) {
            const beta = (c.params.hfe as number) || 150;
            const ic = Math.max(0, Math.min(0.8, beta * Math.max(0, ib)));
            const gce = Math.max(1e-6, ic / Math.max(0.1, vce));
            stampConductance(cName, eName, gce);
          } else {
            stampConductance(cName, eName, 1e-9); // Off
          }
        }
      });

      // 4. Stamp Independent Voltage Sources
      vSources.forEach((vs, idx) => {
        const jIdx = N + idx; // Index of branch current equation
        const p = vs.posNode === gndNode ? -1 : nodeMap.get(vs.posNode) ?? -1;
        const q = vs.negNode === gndNode ? -1 : nodeMap.get(vs.negNode) ?? -1;

        // V_pos - V_neg = V_source
        if (p >= 0) {
          A[p][jIdx] += 1;
          A[jIdx][p] += 1;
        }
        if (q >= 0) {
          A[q][jIdx] -= 1;
          A[jIdx][q] -= 1;
        }

        Z[jIdx] = vs.voltage;
      });

      // 5. Solve linear system A * X = Z using Gaussian elimination with partial pivoting
      const X = MnaSolver.gaussianElimination(A, Z);

      if (!X) {
        break; // Singular matrix
      }

      // Check convergence between v_prev and X
      let maxDiff = 0;
      for (let i = 0; i < N; i++) {
        const diff = Math.abs(X[i] - v_prev[i]);
        if (diff > maxDiff) maxDiff = diff;
      }

      v_prev = new Float64Array(X);

      if (maxDiff < 1e-4) {
        converged = true;
      }
    }

    // Build final node voltages map
    const nodeVoltages: Record<string, number> = {};
    nodeVoltages[gndNode] = 0.0;
    nodeSet.forEach(n => {
      if (n !== gndNode) {
        const idx = nodeMap.get(n);
        nodeVoltages[n] = idx !== undefined ? Math.round(v_prev[idx] * 1000) / 1000 : 0.0;
      }
    });

    // Calculate branch currents
    const branchCurrents: Record<string, number> = {};
    vSources.forEach((vs, idx) => {
      const current = v_prev[N + idx] ?? 0;
      branchCurrents[vs.comp.id] = Math.abs(Math.round(current * 10000) / 10000);
    });

    return {
      nodeVoltages,
      branchCurrents,
      converged,
      iterations
    };
  }

  /**
   * Standard Gaussian elimination with partial pivoting
   */
  private static gaussianElimination(A: number[][], B: number[]): number[] | null {
    const n = B.length;

    // Clone matrix and vector
    const M: number[][] = A.map(row => [...row]);
    const x: number[] = [...B];

    for (let k = 0; k < n; k++) {
      // Find pivot
      let maxRow = k;
      let maxVal = Math.abs(M[k][k]);
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(M[i][k]) > maxVal) {
          maxVal = Math.abs(M[i][k]);
          maxRow = i;
        }
      }

      if (maxVal < 1e-12) {
        // Add tiny conductance to diagonal to prevent singular matrix for floating nodes
        M[k][k] += 1e-8;
      }

      // Swap rows
      if (maxRow !== k) {
        const tempRow = M[k];
        M[k] = M[maxRow];
        M[maxRow] = tempRow;
        const tempB = x[k];
        x[k] = x[maxRow];
        x[maxRow] = tempB;
      }

      // Eliminate below
      for (let i = k + 1; i < n; i++) {
        const factor = M[i][k] / M[k][k];
        x[i] -= factor * x[k];
        for (let j = k; j < n; j++) {
          M[i][j] -= factor * M[k][j];
        }
      }
    }

    // Back substitution
    const sol = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = x[i];
      for (let j = i + 1; j < n; j++) {
        sum -= M[i][j] * sol[j];
      }
      sol[i] = sum / M[i][i];
    }

    return sol;
  }
}
