import { BreadboardHole } from '../types';

export class BreadboardModel {
  public static readonly PITCH = 0.25; // 3D units per 0.1 inch (2.54 mm)
  public static readonly COLUMNS = 30; // 30 column breadboard
  public static readonly BOARD_WIDTH = 30 * BreadboardModel.PITCH + 1.2;
  public static readonly BOARD_HEIGHT = 16 * BreadboardModel.PITCH + 1.0;
  public static readonly BOARD_DEPTH = 0.35;

  private holes: Map<string, BreadboardHole> = new Map();
  private holesArray: BreadboardHole[] = [];

  constructor() {
    this.generateHoles();
  }

  private generateHoles() {
    const P = BreadboardModel.PITCH;
    const colOffset = -((BreadboardModel.COLUMNS - 1) * P) / 2;

    // Y offsets for breadboard rows:
    // Top Power Rails
    const y_top_plus = P * 6.2;
    const y_top_minus = P * 5.2;

    // Terminal Strips Top Half (Rows A, B, C, D, E)
    const y_rows_top: Record<string, number> = {
      'E': P * 3.2,
      'D': P * 2.2,
      'C': P * 1.2,
      'B': P * 0.2, // closest to center trough on top
      'A': P * -0.8 // center trough boundary
    };
    // Adjust top half nicely:
    const topRowLabels = ['A', 'B', 'C', 'D', 'E'];
    // A is near top rail, E is near center trough
    // Center trough is at y = 0
    const topRowY = [P * 4.0, P * 3.0, P * 2.0, P * 1.0, P * 0.35]; // A (outer) to E (inner)

    // Terminal Strips Bottom Half (Rows F, G, H, I, J)
    // F is near center trough, J is near bottom rail
    const bottomRowLabels = ['F', 'G', 'H', 'I', 'J'];
    const bottomRowY = [-P * 0.35, -P * 1.0, -P * 2.0, -P * 3.0, -P * 4.0];

    // Bottom Power Rails
    const y_bottom_minus = -P * 5.2;
    const y_bottom_plus = -P * 6.2;

    for (let c = 1; c <= BreadboardModel.COLUMNS; c++) {
      const x = colOffset + (c - 1) * P;

      // 1. Top Power Rail Plus (+)
      const id_top_plus = `rail_top_plus_${c}`;
      const hole_top_plus: BreadboardHole = {
        id: id_top_plus,
        column: c,
        row: 'power_top_plus',
        position: { x, y: y_top_plus, z: 0.18 },
        nodeId: 'NET_POWER_TOP_PLUS'
      };
      this.addHole(hole_top_plus);

      // 2. Top Power Rail Minus (-)
      const id_top_minus = `rail_top_minus_${c}`;
      const hole_top_minus: BreadboardHole = {
        id: id_top_minus,
        column: c,
        row: 'power_top_minus',
        position: { x, y: y_top_minus, z: 0.18 },
        nodeId: 'NET_POWER_TOP_MINUS'
      };
      this.addHole(hole_top_minus);

      // 3. Top Half Terminal Strip (Rows A, B, C, D, E) -> all tied to NET_COL_${c}_TOP
      for (let r = 0; r < 5; r++) {
        const rowLabel = topRowLabels[r];
        const id = `col_${c}_${rowLabel.toLowerCase()}`;
        const hole: BreadboardHole = {
          id,
          column: c,
          row: rowLabel,
          position: { x, y: topRowY[r], z: 0.18 },
          nodeId: `NET_COL_${c}_TOP`
        };
        this.addHole(hole);
      }

      // 4. Bottom Half Terminal Strip (Rows F, G, H, I, J) -> all tied to NET_COL_${c}_BOTTOM
      for (let r = 0; r < 5; r++) {
        const rowLabel = bottomRowLabels[r];
        const id = `col_${c}_${rowLabel.toLowerCase()}`;
        const hole: BreadboardHole = {
          id,
          column: c,
          row: rowLabel,
          position: { x, y: bottomRowY[r], z: 0.18 },
          nodeId: `NET_COL_${c}_BOTTOM`
        };
        this.addHole(hole);
      }

      // 5. Bottom Power Rail Minus (-)
      const id_bottom_minus = `rail_bottom_minus_${c}`;
      const hole_bottom_minus: BreadboardHole = {
        id: id_bottom_minus,
        column: c,
        row: 'power_bottom_minus',
        position: { x, y: y_bottom_minus, z: 0.18 },
        nodeId: 'NET_POWER_BOTTOM_MINUS'
      };
      this.addHole(hole_bottom_minus);

      // 6. Bottom Power Rail Plus (+)
      const id_bottom_plus = `rail_bottom_plus_${c}`;
      const hole_bottom_plus: BreadboardHole = {
        id: id_bottom_plus,
        column: c,
        row: 'power_bottom_plus',
        position: { x, y: y_bottom_plus, z: 0.18 },
        nodeId: 'NET_POWER_BOTTOM_PLUS'
      };
      this.addHole(hole_bottom_plus);
    }
  }

  private addHole(hole: BreadboardHole) {
    this.holes.set(hole.id, hole);
    this.holesArray.push(hole);
  }

  public getAllHoles(): BreadboardHole[] {
    return this.holesArray;
  }

  public getHoleById(id: string): BreadboardHole | undefined {
    return this.holes.get(id);
  }

  /**
   * Find nearest breadboard hole to given 3D coordinates on breadboard plane
   */
  public findNearestHole(worldX: number, worldY: number, maxRadius: number = 0.35): BreadboardHole | null {
    let bestHole: BreadboardHole | null = null;
    let minDistSq = maxRadius * maxRadius;

    for (let i = 0; i < this.holesArray.length; i++) {
      const h = this.holesArray[i];
      const dx = h.position.x - worldX;
      const dy = h.position.y - worldY;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        bestHole = h;
      }
    }

    return bestHole;
  }

  /**
   * Snap world position to closest grid hole
   */
  public snapPositionToHole(worldX: number, worldY: number): { x: number; y: number; hole: BreadboardHole | null } {
    const hole = this.findNearestHole(worldX, worldY, 0.4);
    if (hole) {
      return { x: hole.position.x, y: hole.position.y, hole };
    }
    return { x: worldX, y: worldY, hole: null };
  }
}
