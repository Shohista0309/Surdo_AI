import { ComponentInstance, JumperWire } from '../types';

interface HistoryState {
  components: ComponentInstance[];
  wires: JumperWire[];
}

export class UndoRedoManager {
  private undoStack: HistoryState[] = [];
  private redoStack: HistoryState[] = [];
  private maxDepth: number = 25;

  public pushState(components: ComponentInstance[], wires: JumperWire[]) {
    // Deep clone
    const snapshot: HistoryState = {
      components: JSON.parse(JSON.stringify(components)),
      wires: JSON.parse(JSON.stringify(wires))
    };

    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    // Clear redo on new action
    this.redoStack = [];
  }

  public undo(currentComponents: ComponentInstance[], currentWires: JumperWire[]): HistoryState | null {
    if (this.undoStack.length === 0) return null;

    // Push current to redo
    this.redoStack.push({
      components: JSON.parse(JSON.stringify(currentComponents)),
      wires: JSON.parse(JSON.stringify(currentWires))
    });

    return this.undoStack.pop() || null;
  }

  public redo(currentComponents: ComponentInstance[], currentWires: JumperWire[]): HistoryState | null {
    if (this.redoStack.length === 0) return null;

    // Push current to undo
    this.undoStack.push({
      components: JSON.parse(JSON.stringify(currentComponents)),
      wires: JSON.parse(JSON.stringify(currentWires))
    });

    return this.redoStack.pop() || null;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
