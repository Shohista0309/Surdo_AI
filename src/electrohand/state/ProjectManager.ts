import { ProjectData } from '../types';

export const SAMPLE_PROJECTS: ProjectData[] = [
  {
    id: 'sample_led_resistor',
    name: '1. Oddiy LED va Rezistor Zanjiri',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSample: true,
    notes: '5V DC manbai, 330Ω tok cheklovchi rezistor va Qizil LED to‘g‘ri ulangan namunaviy ishchi zanjir.',
    components: [
      {
        id: 'psu_5v_1',
        type: 'dc_supply_5v',
        position: { x: -3.2, y: 0.0, z: 0.1 },
        rotation: 0,
        parameters: { voltage: 5.0 },
        pinConnections: { pos: 'rail_top_plus_5', neg: 'rail_bottom_minus_5' }
      },
      {
        id: 'res_330_1',
        type: 'resistor_330',
        position: { x: -0.5, y: 0.75, z: 0.1 },
        rotation: 0,
        parameters: { resistance: 330 },
        pinConnections: { p1: 'col_12_a', p2: 'col_15_a' }
      },
      {
        id: 'led_red_1',
        type: 'led_red',
        position: { x: 0.5, y: -0.75, z: 0.1 },
        rotation: 0,
        parameters: { v_forward: 1.9 },
        pinConnections: { anode: 'col_15_f', cathode: 'col_18_f' }
      }
    ],
    wires: [
      // Wire from Top + Rail to Resistor pin 1 (col 12)
      {
        id: 'w_power_to_res',
        color: '#ef4444',
        startNode: 'rail_top_plus_12',
        startPos: { x: -0.875, y: 1.55, z: 0.35 },
        endNode: 'col_12_e',
        endPos: { x: -0.875, y: 0.0875, z: 0.35 }
      },
      // Wire from Resistor pin 2 (col 15 top) across trough to LED anode (col 15 bottom)
      {
        id: 'w_res_to_led',
        color: '#f59e0b',
        startNode: 'col_15_e',
        startPos: { x: -0.125, y: 0.0875, z: 0.35 },
        endNode: 'col_15_f',
        endPos: { x: -0.125, y: -0.0875, z: 0.35 }
      },
      // Wire from LED cathode (col 18 bottom) to Bottom - Rail
      {
        id: 'w_led_to_gnd',
        color: '#1e293b',
        startNode: 'col_18_j',
        startPos: { x: 0.625, y: -1.0, z: 0.35 },
        endNode: 'rail_bottom_minus_18',
        endPos: { x: 0.625, y: -1.3, z: 0.35 }
      }
    ]
  },
  {
    id: 'sample_led_burnt',
    name: '2. Xato Zanjir: Rezistorsiz LED (Kuyish xavfi)',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSample: true,
    notes: 'LED to‘g‘ridan-to‘g‘ri 9V ga rezistorsiz ulangan. Simulyator buni haddan tashqari tok xatosi deb topadi.',
    components: [
      {
        id: 'batt_9v',
        type: 'dc_battery_9v',
        position: { x: -3.0, y: 0.0, z: 0.1 },
        rotation: 0,
        parameters: { voltage: 9.0 },
        pinConnections: { pos: 'rail_top_plus_6', neg: 'rail_bottom_minus_6' }
      },
      {
        id: 'led_burnt',
        type: 'led_red',
        position: { x: 0.0, y: 0.0, z: 0.1 },
        rotation: 90,
        parameters: { v_forward: 1.9 },
        pinConnections: { anode: 'col_15_e', cathode: 'col_15_f' }
      }
    ],
    wires: [
      {
        id: 'w_direct_pos',
        color: '#ef4444',
        startNode: 'rail_top_plus_15',
        startPos: { x: -0.125, y: 1.55, z: 0.35 },
        endNode: 'col_15_a',
        endPos: { x: -0.125, y: 1.0, z: 0.35 }
      },
      {
        id: 'w_direct_neg',
        color: '#1e293b',
        startNode: 'col_15_j',
        startPos: { x: -0.125, y: -1.0, z: 0.35 },
        endNode: 'rail_bottom_minus_15',
        endPos: { x: -0.125, y: -1.3, z: 0.35 }
      }
    ]
  },
  {
    id: 'sample_transistor_switch',
    name: '3. NPN Tranzistorli Kalit Zanjiri',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSample: true,
    notes: '2N2222 tranzistor orqali LEDni yoqish va boshqarish zanjiri.',
    components: [
      {
        id: 'psu_5v_npn',
        type: 'dc_supply_5v',
        position: { x: -3.2, y: 0.0, z: 0.1 },
        rotation: 0,
        parameters: { voltage: 5.0 },
        pinConnections: { pos: 'rail_top_plus_4', neg: 'rail_bottom_minus_4' }
      },
      {
        id: 'npn_2n2222',
        type: 'transistor_npn_2n2222',
        position: { x: 0.0, y: -0.5, z: 0.1 },
        rotation: 0,
        parameters: { hfe: 150 },
        pinConnections: { emitter: 'col_14_f', base: 'col_15_f', collector: 'col_16_f' }
      },
      {
        id: 'res_base',
        type: 'resistor_1k',
        position: { x: -1.2, y: -0.5, z: 0.1 },
        rotation: 0,
        parameters: { resistance: 1000 },
        pinConnections: { p1: 'col_10_f', p2: 'col_15_f' }
      },
      {
        id: 'res_collector',
        type: 'resistor_220',
        position: { x: 0.25, y: 0.75, z: 0.1 },
        rotation: 90,
        parameters: { resistance: 220 },
        pinConnections: { p1: 'col_16_a', p2: 'col_16_e' }
      },
      {
        id: 'led_green_trans',
        type: 'led_green',
        position: { x: 0.25, y: 0.0, z: 0.1 },
        rotation: 90,
        parameters: { v_forward: 2.2 },
        pinConnections: { anode: 'col_16_e', cathode: 'col_16_f' }
      }
    ],
    wires: [
      {
        id: 'w_npn_vcc',
        color: '#ef4444',
        startNode: 'rail_top_plus_16',
        startPos: { x: 0.125, y: 1.55, z: 0.35 },
        endNode: 'col_16_a',
        endPos: { x: 0.125, y: 1.0, z: 0.35 }
      },
      {
        id: 'w_npn_gnd',
        color: '#1e293b',
        startNode: 'col_14_j',
        startPos: { x: -0.375, y: -1.0, z: 0.35 },
        endNode: 'rail_bottom_minus_14',
        endPos: { x: -0.375, y: -1.3, z: 0.35 }
      },
      {
        id: 'w_base_signal',
        color: '#0ea5e9',
        startNode: 'rail_top_plus_10',
        startPos: { x: -1.375, y: 1.55, z: 0.35 },
        endNode: 'col_10_f',
        endPos: { x: -1.375, y: -0.0875, z: 0.35 }
      }
    ]
  },
  {
    id: 'sample_pot_divider',
    name: '4. Potensiometrli Kuchlanish Bo‘luvchi',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSample: true,
    notes: '10kΩ reostat orqali chiqish kuchlanishini 0V dan 5V gacha sozlash.',
    components: [
      {
        id: 'psu_5v_pot',
        type: 'dc_supply_5v',
        position: { x: -3.2, y: 0.0, z: 0.1 },
        rotation: 0,
        parameters: { voltage: 5.0 },
        pinConnections: { pos: 'rail_top_plus_4', neg: 'rail_bottom_minus_4' }
      },
      {
        id: 'pot_10k_sample',
        type: 'potentiometer_10k',
        position: { x: 0.0, y: 0.0, z: 0.1 },
        rotation: 0,
        parameters: { total_resistance: 10000, wiper_ratio: 0.5 },
        pinConnections: { p1: 'col_14_e', wiper: 'col_15_f', p3: 'col_16_e' }
      }
    ],
    wires: [
      {
        id: 'w_pot_vcc',
        color: '#ef4444',
        startNode: 'rail_top_plus_14',
        startPos: { x: -0.375, y: 1.55, z: 0.35 },
        endNode: 'col_14_a',
        endPos: { x: -0.375, y: 1.0, z: 0.35 }
      },
      {
        id: 'w_pot_gnd',
        color: '#1e293b',
        startNode: 'col_16_a',
        startPos: { x: 0.125, y: 1.0, z: 0.35 },
        endNode: 'rail_bottom_minus_16',
        endPos: { x: 0.125, y: -1.3, z: 0.35 }
      }
    ]
  }
];

export class ProjectManager {
  private static STORAGE_KEY = 'electrohand_projects_v2';

  public static getSavedProjects(): ProjectData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to read projects from localStorage:', e);
    }
    return [];
  }

  public static saveProject(project: ProjectData): boolean {
    try {
      const list = this.getSavedProjects().filter(p => p.id !== project.id);
      project.updatedAt = Date.now();
      list.unshift(project);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to save project:', e);
      return false;
    }
  }

  public static deleteProject(id: string): boolean {
    try {
      const list = this.getSavedProjects().filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  public static exportToJson(project: ProjectData): string {
    return JSON.stringify(project, null, 2);
  }

  public static importFromJson(jsonStr: string): ProjectData | null {
    try {
      const parsed = JSON.parse(jsonStr) as ProjectData;
      if (parsed && parsed.name && Array.isArray(parsed.components)) {
        parsed.id = `proj_${Date.now()}`;
        parsed.updatedAt = Date.now();
        return parsed;
      }
    } catch (e) {
      console.warn('Invalid JSON for project:', e);
    }
    return null;
  }
}
