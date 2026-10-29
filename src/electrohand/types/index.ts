export type ComponentCategory =
  | 'diodes'
  | 'transistors'
  | 'power'
  | 'transformers'
  | 'opamps'
  | 'resistors'
  | 'capacitors'
  | 'ics'
  | 'switches'
  | 'other';

export type ComponentType =
  // Diodes
  | 'diode_1n4007'
  | 'diode_zener'
  | 'diode_schottky'
  | 'led_red'
  | 'led_green'
  | 'led_blue'
  | 'led_yellow'
  // Transistors
  | 'transistor_npn_2n2222'
  | 'transistor_pnp_2n3906'
  | 'transistor_mosfet_n'
  | 'transistor_mosfet_p'
  // Power Sources
  | 'dc_battery_9v'
  | 'dc_supply_5v'
  | 'dc_supply_3v3'
  | 'dc_adjustable'
  | 'ac_source'
  // Transformers
  | 'transformer_stepdown'
  // Comparators & Op-Amps
  | 'ic_lm393'
  | 'ic_lm358'
  | 'ic_lm741'
  // Resistors
  | 'resistor_220'
  | 'resistor_330'
  | 'resistor_1k'
  | 'resistor_10k'
  | 'resistor_100k'
  | 'potentiometer_10k'
  | 'photoresistor_ldr'
  // Capacitors
  | 'capacitor_ceramic_100n'
  | 'capacitor_electrolytic_10u'
  | 'capacitor_electrolytic_100u'
  | 'capacitor_film_1u'
  // ICs
  | 'ic_ne555'
  | 'ic_74hc04'
  | 'ic_74hc08'
  // Switches & Others
  | 'switch_push_button'
  | 'switch_slide'
  | 'buzzer_piezo'
  | 'ground_terminal';

export interface PinDefinition {
  id: string;
  label: string;
  relativePosition: { x: number; y: number; z: number };
  pinType: 'input' | 'output' | 'power' | 'ground' | 'passive';
  descriptionUz: string;
}

export interface ComponentSpecification {
  type: ComponentType;
  category: ComponentCategory;
  nameUz: string;
  code: string;
  descriptionUz: string;
  datasheetSnippetUz: string;
  pins: PinDefinition[];
  defaultParameters: Record<string, number | string>;
  parameterUnits: Record<string, string>;
  modelDimensions: { width: number; depth: number; height: number };
}

export interface ComponentInstance {
  id: string;
  type: ComponentType;
  position: { x: number; y: number; z: number };
  rotation: number;
  parameters: Record<string, number | string>;
  pinConnections: Record<string, string | null>;
}

export interface JumperWire {
  id: string;
  color: string;
  startNode: string;
  startPos: { x: number; y: number; z: number };
  endNode: string;
  endPos: { x: number; y: number; z: number };
}

export interface BreadboardHole {
  id: string;
  column: number;
  row: string;
  position: { x: number; y: number; z: number };
  nodeId: string;
}

export type SimulationStatus = 'idle' | 'running' | 'success' | 'error' | 'cannot_determine';

export interface DiagnosticIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  titleUz: string;
  descriptionUz: string;
  componentIds: string[];
  nodeIds: string[];
}

export interface NodeVoltageResult {
  nodeId: string;
  voltage: number;
}

export interface BranchCurrentResult {
  componentId: string;
  current: number;
  power: number;
  state?: string;
}

export interface SimulationResult {
  status: SimulationStatus;
  statusTextUz: string;
  nodeVoltages: Record<string, number>;
  branchCurrents: Record<string, BranchCurrentResult>;
  issues: DiagnosticIssue[];
  timestamp: number;
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  components: ComponentInstance[];
  wires: JumperWire[];
  notes?: string;
  isSample?: boolean;
}

export interface HandTrackingState {
  isHandDetected: boolean;
  landmarks: Array<{ x: number; y: number; z: number }> | null;
  isPinching: boolean;
  pinchStrength: number;
  screenPoint: { x: number; y: number };
  worldPoint: { x: number; y: number; z: number } | null;
}

// Multimeter & Interaction Modes
export type LabInteractionMode = 'select' | 'wire' | 'multimeter' | 'delete_wire';

export type MultimeterMode = 'voltage_dc' | 'continuity' | 'current_dc';

export interface MultimeterReading {
  mode: MultimeterMode;
  redProbeNode: string | null;
  redProbePos?: { x: number; y: number; z: number };
  blackProbeNode: string | null;
  blackProbePos?: { x: number; y: number; z: number };
  value: number | null;
  displayStr: string;
  unit: string;
  isBeeping: boolean;
  testPointNameUz: string;
}

// Camera & Gesture Types
export type CameraStatus = 'idle' | 'starting' | 'active' | 'error' | 'stopped';

export interface CameraErrorDetails {
  titleUz: string;
  messageUz: string;
  canRetry: boolean;
}

export interface HandLandmarkPoint {
  x: number;
  y: number;
  z: number;
}

export interface GestureDetectionResult {
  isHandDetected: boolean;
  landmarks: HandLandmarkPoint[] | null;
  isPinching: boolean;
  pinchDistance: number;
  pinchStrength: number;
  screenPoint: { x: number; y: number };
  worldPoint: { x: number; y: number; z: number } | null;
  rawPinchDistance: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  textUz: string;
  type: ToastType;
  timestamp: number;
}

// Legacy simulator types for backwards compatibility
export type CableId = 'cable-red' | 'cable-black' | 'cable-blue';
export type TerminalId = 'term-vcc' | 'term-gnd' | 'term-signal';
export type CableState = 'RESTING' | 'DRAGGING' | 'CONNECTED' | 'RETURNING';

export interface CableDefinition {
  id: CableId;
  name: string;
  nameUz: string;
  colorHex: string;
  colorNumber: number;
  expectedTerminalId: TerminalId;
  sourcePos: { x: number; y: number; z: number };
  restPos: { x: number; y: number; z: number };
  descriptionUz: string;
}

export interface TerminalDefinition {
  id: TerminalId;
  name: string;
  nameUz: string;
  label: string;
  colorHex: string;
  position: { x: number; y: number; z: number };
  acceptedCableId: CableId;
  voltageText: string;
  descriptionUz: string;
}

export interface SimulationTask {
  id: string;
  cableId: CableId;
  terminalId: TerminalId;
  titleUz: string;
  descUz: string;
  isCompleted: boolean;
}
