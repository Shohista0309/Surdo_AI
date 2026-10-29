import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { WorkbenchScene } from '../scene/WorkbenchScene';
import { BreadboardModel } from '../breadboard/BreadboardModel';
import { CircuitValidator } from '../simulation/CircuitValidator';
import { CameraManager } from '../camera/CameraManager';
import { HandLandmarkerTracker } from '../tracking/HandLandmarkerTracker';
import { LabInteractionManager } from '../interaction/LabInteractionManager';
import { UndoRedoManager } from '../state/UndoRedoManager';
import { ProjectManager, SAMPLE_PROJECTS } from '../state/ProjectManager';
import { soundEffects } from '../audio/SoundEffects';
import {
  ComponentInstance,
  JumperWire,
  ProjectData,
  SimulationResult,
  ComponentType,
  CameraStatus,
  CameraErrorDetails,
  HandTrackingState,
  ToastMessage,
  LabInteractionMode,
  MultimeterMode,
  MultimeterReading,
  BreadboardHole
} from '../types';
import { COMPONENT_CATALOG } from '../data/componentCatalog';

import { TopNavigationBar } from './TopNavigationBar';
import { ComponentLibrarySidebar } from './ComponentLibrarySidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { SimulationDiagnosticsPanel } from './SimulationDiagnosticsPanel';
import { WebcamTrackingPanel } from './WebcamTrackingPanel';
import { ProjectModal } from './ProjectModal';
import { StatusBar } from './StatusBar';
import { ToastNotification } from './ToastNotification';
import { VirtualMultimeterHUD } from './VirtualMultimeterHUD';
import { SchematicModal } from './SchematicModal';
import {
  Sliders,
  Video,
  Activity
} from 'lucide-react';

export const ElectroHandLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Engine refs
  const sceneRef = useRef<WorkbenchScene | null>(null);
  const breadboardModelRef = useRef<BreadboardModel>(new BreadboardModel());
  const validatorRef = useRef<CircuitValidator>(new CircuitValidator(breadboardModelRef.current));
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const trackerRef = useRef<HandLandmarkerTracker | null>(null);
  const interactionRef = useRef<LabInteractionManager | null>(null);
  const undoRedoRef = useRef<UndoRedoManager>(new UndoRedoManager());

  // App & Project State
  const [currentProject, setCurrentProject] = useState<ProjectData>(SAMPLE_PROJECTS[0]);
  const [components, setComponents] = useState<ComponentInstance[]>(SAMPLE_PROJECTS[0].components);
  const [wires, setWires] = useState<JumperWire[]>(SAMPLE_PROJECTS[0].wires);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

  // Tools & UI Modes
  const [activeMode, setActiveMode] = useState<LabInteractionMode>('select');
  const [wireColor, setWireColor] = useState<string>('#ef4444');
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'camera' | 'diagnostics'>('properties');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [isSchematicOpen, setIsSchematicOpen] = useState<boolean>(false);

  // Multimeter State
  const [activeProbeTarget, setActiveProbeTarget] = useState<'red' | 'black'>('red');
  const [multimeterReading, setMultimeterReading] = useState<MultimeterReading>({
    mode: 'voltage_dc',
    redProbeNode: null,
    blackProbeNode: null,
    value: 0.0,
    displayStr: '0.000',
    unit: 'V',
    isBeeping: false,
    testPointNameUz: ''
  });

  // Camera & Tracking State
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraError, setCameraError] = useState<CameraErrorDetails | undefined>(undefined);
  const [trackingState, setTrackingState] = useState<HandTrackingState | null>(null);

  // Simulation State
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Undo / Redo availability
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateUndoRedoFlags = useCallback(() => {
    setCanUndo(undoRedoRef.current.canUndo());
    setCanRedo(undoRedoRef.current.canRedo());
  }, []);

  const addToast = useCallback((textUz: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      textUz,
      type,
      timestamp: Date.now()
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync 3D components and wires when loading project or state
  const syncSceneObjects = useCallback((comps: ComponentInstance[], wrs: JumperWire[]) => {
    if (!sceneRef.current) return;
    sceneRef.current.clearAll();

    comps.forEach(c => {
      sceneRef.current?.addComponent(c);
    });
    wrs.forEach(w => {
      sceneRef.current?.addWire(w);
    });
  }, []);

  // Run MNA Simulation and Physical Validation
  const handleRunSimulation = useCallback(() => {
    const result = validatorRef.current.analyzeCircuit(components, wires);
    setSimulationResult(result);
    setRightPanelTab('diagnostics');

    // Update 3D scene visual states
    if (sceneRef.current) {
      sceneRef.current.componentObjects.forEach((compObj, compId) => {
        const branchRes = result.branchCurrents[compId];
        const hasIssue = result.issues.some(i => i.componentIds.includes(compId));
        compObj.setError(hasIssue);
        compObj.updateSimulationVisuals(branchRes?.state, branchRes?.current);
      });
    }

    // Play corresponding realistic sound effects
    const hasBurnt = Object.values(result.branchCurrents).some(b => b.state === 'BURNT');
    const hasActiveBuzzer = components.some(c => c.type === 'buzzer_piezo' && result.branchCurrents[c.id]?.state === 'ACTIVE');

    if (hasBurnt || result.issues.some(i => i.id === 'critical_short_circuit')) {
      soundEffects.playSparkBurnout();
    } else if (hasActiveBuzzer) {
      soundEffects.playBuzzer();
    }

    if (result.status === 'success') {
      soundEffects.playVictory();
      addToast('Zanjir to‘g‘ri yig‘ildi va muvaffaqiyatli ishga tushdi!', 'success');
    } else if (result.status === 'error') {
      if (!hasBurnt) soundEffects.playError();
      addToast(result.statusTextUz, 'error');
    } else {
      addToast(result.statusTextUz, 'info');
    }
  }, [components, wires, addToast]);

  // Multimeter Probe Touch Handler
  const handleProbeTouch = useCallback((hole: BreadboardHole, worldPos: THREE.Vector3) => {
    let friendlyName = `Kolonna ${hole.column}, Qator ${hole.row}`;
    if (hole.id.startsWith('rail_top_pos')) friendlyName = 'Yuqori Musbat Shina (+ VCC)';
    else if (hole.id.startsWith('rail_top_neg')) friendlyName = 'Yuqori Manfiy Shina (GND)';
    else if (hole.id.startsWith('rail_bot_pos')) friendlyName = 'Pastki Musbat Shina (+ VCC)';
    else if (hole.id.startsWith('rail_bot_neg')) friendlyName = 'Pastki Manfiy Shina (GND / 0V)';

    components.forEach(comp => {
      const spec = COMPONENT_CATALOG[comp.type];
      if (!spec) return;
      spec.pins.forEach(pin => {
        if (comp.pinConnections[pin.id] === hole.id) {
          friendlyName = `${spec.nameUz} (${pin.label})`;
        }
      });
    });

    const currentSim = validatorRef.current.analyzeCircuit(components, wires);
    setSimulationResult(currentSim);

    const isTargetRed = activeProbeTarget === 'red';

    if (isTargetRed) {
      sceneRef.current?.setRedProbePosition(worldPos, true);
    } else {
      sceneRef.current?.setBlackProbePosition(worldPos, true);
    }

    setMultimeterReading(prev => {
      const redNode = isTargetRed ? hole.nodeId : (prev.redProbeNode || hole.nodeId);
      const blackNode = !isTargetRed ? hole.nodeId : prev.blackProbeNode;

      const vRed = currentSim.nodeVoltages[redNode] ?? 0;
      const vBlack = blackNode ? (currentSim.nodeVoltages[blackNode] ?? 0) : 0;
      const vDiff = vRed - vBlack;

      let displayStr = '0.000';
      let unit = 'V';
      let isBeeping = false;

      if (prev.mode === 'voltage_dc') {
        displayStr = `${vDiff >= 0 ? '+' : ''}${vDiff.toFixed(3)}`;
        unit = 'V';
        soundEffects.playGrab();
      } else if (prev.mode === 'continuity') {
        const isConnected = redNode === blackNode || Math.abs(vDiff) < 0.05;
        if (isConnected) {
          displayStr = '0.00';
          unit = 'Ω';
          isBeeping = true;
          soundEffects.playContinuityBeep();
        } else {
          displayStr = 'O.L';
          unit = 'MΩ';
          isBeeping = false;
          soundEffects.playGrab();
        }
      } else if (prev.mode === 'current_dc') {
        const totalBranchCurrent = Object.values(currentSim.branchCurrents).reduce((acc, b) => acc + b.current, 0);
        const approxI = (totalBranchCurrent * 1000).toFixed(2);
        displayStr = approxI;
        unit = 'mA';
        soundEffects.playGrab();
      }

      return {
        ...prev,
        redProbeNode: isTargetRed ? hole.nodeId : prev.redProbeNode,
        blackProbeNode: !isTargetRed ? hole.nodeId : prev.blackProbeNode,
        value: vDiff,
        displayStr,
        unit,
        isBeeping,
        testPointNameUz: friendlyName
      };
    });

    addToast(`Prob ulandi: ${friendlyName}`, 'info');
  }, [activeProbeTarget, components, wires, addToast]);

  const probeTouchHandlerRef = useRef(handleProbeTouch);
  probeTouchHandlerRef.current = handleProbeTouch;

  const handleChangeMultimeterMode = (mode: MultimeterMode) => {
    setMultimeterReading(prev => {
      let displayStr = '0.000';
      let unit = 'V';
      if (mode === 'voltage_dc') {
        const val = prev.value ?? 0;
        displayStr = `${val >= 0 ? '+' : ''}${val.toFixed(3)}`;
        unit = 'V';
      } else if (mode === 'continuity') {
        displayStr = prev.isBeeping ? '0.00' : 'O.L';
        unit = prev.isBeeping ? 'Ω' : 'MΩ';
      } else if (mode === 'current_dc') {
        displayStr = '15.20';
        unit = 'mA';
      }
      return {
        ...prev,
        mode,
        displayStr,
        unit
      };
    });
  };

  const handleResetBlackToGnd = () => {
    sceneRef.current?.setBlackProbePosition(new THREE.Vector3(0, -3.81, 0.4), true);
    setMultimeterReading(prev => ({
      ...prev,
      blackProbeNode: null
    }));
    addToast('Qora prob manfiy zaminga (GND / 0V) ulandi.', 'info');
  };

  // Initialize 3D Workbench Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new WorkbenchScene(containerRef.current);
    sceneRef.current = scene;

    // Load initial sample circuit
    syncSceneObjects(currentProject.components, currentProject.wires);

    // Setup Interaction Manager
    const interaction = new LabInteractionManager(scene, breadboardModelRef.current, {
      onSelectComponent: comp => {
        setSelectedCompId(comp ? comp.id : null);
        if (comp) {
          setRightPanelTab('properties');
        }
      },
      onComponentMoved: movedComp => {
        setComponents(prev => {
          undoRedoRef.current.pushState(prev, wires);
          updateUndoRedoFlags();
          return prev.map(c => (c.id === movedComp.id ? movedComp : c));
        });
      },
      onWireCreated: newWire => {
        setWires(prev => {
          undoRedoRef.current.pushState(components, prev);
          updateUndoRedoFlags();
          return [...prev, newWire];
        });
      },
      onWireDeleted: (wireId: string) => {
        setWires(prev => {
          const next = prev.filter(w => w.id !== wireId);
          undoRedoRef.current.pushState(components, prev);
          updateUndoRedoFlags();
          return next;
        });
      },
      onProbeTouch: (hole, pos) => {
        probeTouchHandlerRef.current(hole, pos);
      },
      onToast: (msg, type) => addToast(msg, type)
    });
    interactionRef.current = interaction;

    // Setup Camera & Hand Tracker
    const cameraManager = new CameraManager((status, err) => {
      setCameraStatus(status);
      setCameraError(err);
    });
    cameraManagerRef.current = cameraManager;

    const tracker = new HandLandmarkerTracker(gestureRes => {
      const tracking: HandTrackingState = {
        isHandDetected: gestureRes.isHandDetected,
        landmarks: gestureRes.landmarks,
        isPinching: gestureRes.isPinching,
        pinchStrength: gestureRes.pinchStrength,
        screenPoint: gestureRes.screenPoint,
        worldPoint: gestureRes.worldPoint
      };
      setTrackingState(tracking);

      if (interactionRef.current) {
        interactionRef.current.handleGestureFrame(tracking);
      }
    });
    trackerRef.current = tracker;

    // Auto-init Hand Landmarker
    tracker.initialize().then(ok => {
      if (ok && videoRef.current) {
        cameraManager.startCamera(videoRef.current).then(started => {
          if (started && videoRef.current) {
            tracker.start(videoRef.current, canvasRef.current);
          }
        }).catch(err => {
          console.warn('[ElectroHand] Camera auto-start skipped:', err);
        });
      }
    }).catch(err => {
      console.warn('[ElectroHand] Tracker init error:', err);
    });

    return () => {
      tracker.close();
      cameraManager.stopCamera();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []); // Run once on mount

  // Sync mode changes to interaction manager
  useEffect(() => {
    if (interactionRef.current) {
      interactionRef.current.setMode(activeMode);
      interactionRef.current.setWireColor(wireColor);
    }
  }, [activeMode, wireColor]);

  // Add Component from Library
  const handleAddComponent = (type: ComponentType) => {
    const spec = COMPONENT_CATALOG[type];
    if (!spec) return;

    undoRedoRef.current.pushState(components, wires);
    updateUndoRedoFlags();

    const newComp: ComponentInstance = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      position: { x: 0.0, y: 0.0, z: 0.1 },
      rotation: 0,
      parameters: { ...spec.defaultParameters },
      pinConnections: {}
    };

    setComponents(prev => [...prev, newComp]);
    if (sceneRef.current) {
      const obj = sceneRef.current.addComponent(newComp);
      sceneRef.current.componentObjects.forEach(c => c.setSelected(false));
      obj.setSelected(true);
    }

    setSelectedCompId(newComp.id);
    setRightPanelTab('properties');
    soundEffects.playGrab();
    addToast(`${spec.nameUz} ishchi stolga qo‘shildi. Uni kerakli joyga suring.`, 'info');
  };

  // Rotate Selected Component
  const handleRotateComponent = (compId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return;

    undoRedoRef.current.pushState(components, wires);
    updateUndoRedoFlags();

    const nextRotation = (comp.rotation + 90) % 360;
    comp.rotation = nextRotation;

    if (sceneRef.current) {
      const obj = sceneRef.current.componentObjects.get(compId);
      if (obj) {
        obj.setRotation(nextRotation);
      }
    }

    setComponents(prev => prev.map(c => (c.id === compId ? { ...c, rotation: nextRotation } : c)));
    soundEffects.playGrab();
  };

  // Delete Selected Component
  const handleDeleteComponent = (compId: string) => {
    undoRedoRef.current.pushState(components, wires);
    updateUndoRedoFlags();

    setComponents(prev => prev.filter(c => c.id !== compId));
    if (sceneRef.current) {
      sceneRef.current.removeComponent(compId);
    }
    setSelectedCompId(null);
    soundEffects.playReset();
    addToast('Komponent o‘chirildi.', 'info');
  };

  // Update Component Parameters
  const handleUpdateParameters = (compId: string, params: Record<string, number | string>) => {
    setComponents(prev =>
      prev.map(c => (c.id === compId ? { ...c, parameters: params } : c))
    );
  };

  // Undo / Redo
  const handleUndo = () => {
    const prev = undoRedoRef.current.undo(components, wires);
    if (prev) {
      setComponents(prev.components);
      setWires(prev.wires);
      syncSceneObjects(prev.components, prev.wires);
      updateUndoRedoFlags();
      soundEffects.playReset();
      addToast('Harakat bekor qilindi (Undo).', 'info');
    }
  };

  const handleRedo = () => {
    const next = undoRedoRef.current.redo(components, wires);
    if (next) {
      setComponents(next.components);
      setWires(next.wires);
      syncSceneObjects(next.components, next.wires);
      updateUndoRedoFlags();
      soundEffects.playReset();
      addToast('Harakat qaytarildi (Redo).', 'info');
    }
  };

  // Load a project (or sample)
  const handleLoadProject = (project: ProjectData) => {
    setCurrentProject(project);
    setComponents(project.components);
    setWires(project.wires);
    syncSceneObjects(project.components, project.wires);
    setSelectedCompId(null);
    setSimulationResult(null);
    undoRedoRef.current.clear();
    updateUndoRedoFlags();
    soundEffects.playReset();
    addToast(`"${project.name}" zanjiri muvaffaqiyatli yuklandi!`, 'success');
  };

  // Save current project
  const handleSaveProject = () => {
    const updatedProj: ProjectData = {
      ...currentProject,
      components,
      wires,
      updatedAt: Date.now()
    };
    ProjectManager.saveProject(updatedProj);
    setCurrentProject(updatedProj);
    soundEffects.playConnect();
    addToast(`"${updatedProj.name}" loyihasi saqlandi!`, 'success');
  };

  // New blank project
  const handleNewProject = () => {
    if (confirm("Yangi bo‘sh loyiha yaratilsinmi? Saqlanmagan o‘zgarishlar yo‘qolishi mumkin.")) {
      const blankProj: ProjectData = {
        id: `proj_${Date.now()}`,
        name: 'Yangi Zanjir',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        components: [],
        wires: []
      };
      handleLoadProject(blankProj);
    }
  };

  // Camera toggle handler
  const handleToggleCamera = async () => {
    if (!cameraManagerRef.current || !trackerRef.current || !videoRef.current) return;

    if (cameraStatus === 'active') {
      trackerRef.current.stop();
      cameraManagerRef.current.stopCamera();
      setCameraStatus('stopped');
      addToast('Kamera to‘xtatildi.', 'info');
    } else {
      const isReady = await trackerRef.current.initialize();
      if (!isReady) {
        addToast('Qo‘lni aniqlash modeli yuklanmadi.', 'error');
        return;
      }
      const ok = await cameraManagerRef.current.startCamera(videoRef.current);
      if (ok) {
        trackerRef.current.start(videoRef.current, canvasRef.current);
        setCameraStatus('active');
        addToast('Veb-kamera ishga tushirildi.', 'success');
      }
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Rotate
      if ((e.key === 'r' || e.key === 'R') && selectedCompId) {
        handleRotateComponent(selectedCompId);
      }
      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedCompId) {
        // Prevent if typing in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        handleDeleteComponent(selectedCompId);
      }
      // Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCompId, components, wires]);

  // Mouse fallback handlers for 3D viewport
  const getCanvasCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0.5, y: 0.5 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = getCanvasCoords(e);
    interactionRef.current?.handlePointerDown(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = getCanvasCoords(e);
    interactionRef.current?.handlePointerMove(x, y);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const { x, y } = getCanvasCoords(e);
    interactionRef.current?.handlePointerUp(x, y);
  };

  const selectedComp = components.find(c => c.id === selectedCompId) || null;

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070d19] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 1. Top Navigation Bar */}
      <TopNavigationBar
        projectName={currentProject.name}
        onRenameProject={name => setCurrentProject(prev => ({ ...prev, name }))}
        onNewProject={handleNewProject}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenSchematic={() => setIsSchematicOpen(true)}
        onSaveProject={handleSaveProject}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        activeMode={activeMode}
        onChangeMode={setActiveMode}
        wireColor={wireColor}
        onChangeWireColor={setWireColor}
        simulationStatus={simulationResult?.status || 'idle'}
        onRunSimulation={handleRunSimulation}
        onResetView={() => sceneRef.current?.resetCameraView()}
        isMuted={isMuted}
        onToggleMute={() => {
          const m = soundEffects.toggleMute();
          setIsMuted(m);
        }}
        cameraStatus={cameraStatus}
        onToggleCamera={handleToggleCamera}
      />

      {/* 2. Middle Body: Sidebar + 3D Workbench + Right Inspector Tabs */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Left: Component Library Sidebar */}
        <ComponentLibrarySidebar
          onAddComponent={handleAddComponent}
          isCollapsed={isLibraryCollapsed}
          onToggleCollapse={() => setIsLibraryCollapsed(!isLibraryCollapsed)}
        />

        {/* Center: Interactive 3D Workbench Canvas */}
        <main className="flex-1 relative bg-[#060b17] overflow-hidden">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`w-full h-full ${
              activeMode === 'wire' ? 'cursor-crosshair' :
              activeMode === 'delete_wire' ? 'cursor-not-allowed' :
              'cursor-grab active:cursor-grabbing'
            }`}
          />

          {/* Quick Mode Indicator Badge in 3D Viewport */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b1328]/80 border border-[#1e325c] backdrop-blur-md text-xs shadow-lg">
            <span className={`w-2 h-2 rounded-full ${
              activeMode === 'wire' ? 'bg-cyan-400 animate-ping' :
              activeMode === 'delete_wire' ? 'bg-rose-500 animate-ping' :
              activeMode === 'multimeter' ? 'bg-amber-400 animate-pulse' :
              'bg-emerald-400'
            }`} />
            <span className="text-slate-300 font-medium">
              {activeMode === 'wire' ? 'Sim ulash rejimi (Teshikdan teshikka torting)' :
               activeMode === 'delete_wire' ? 'Sim o\'chirish rejimi (Simni bosing)' :
               activeMode === 'multimeter' ? 'Multimetr rejimi (Prob ulash)' :
               'Elementni ushlash va siljitish rejimi'}
            </span>
          </div>
        </main>

        {/* Right Inspector Panel (Tabs: Properties, Camera, Diagnostics) */}
        <aside className="w-80 sm:w-88 bg-[#070d19]/95 border-l border-[#1e325c] flex flex-col h-[calc(100vh-4rem-2.25rem)] z-20 shadow-2xl">
          {/* Tab Headers */}
          <div className="h-11 px-2 border-b border-[#1e325c] flex items-center justify-around text-xs font-semibold bg-[#0a1122]">
            <button
              onClick={() => setRightPanelTab('properties')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                rightPanelTab === 'properties'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Xususiyatlar</span>
            </button>

            <button
              onClick={() => setRightPanelTab('camera')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                rightPanelTab === 'camera'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Veb-kamera</span>
            </button>

            <button
              onClick={() => setRightPanelTab('diagnostics')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all ${
                rightPanelTab === 'diagnostics'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostika</span>
              {simulationResult && simulationResult.issues.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>

          {/* Tab Content (Preserve DOM nodes so video stream & canvas never unmount) */}
          <div className="flex-1 overflow-y-auto relative">
            <div className={rightPanelTab === 'properties' ? 'block' : 'hidden'}>
              <PropertiesPanel
                selectedComponent={selectedComp}
                onUpdateParameters={handleUpdateParameters}
                onRotateComponent={handleRotateComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            </div>

            <div className={rightPanelTab === 'camera' ? 'block' : 'hidden'}>
              <WebcamTrackingPanel
                cameraStatus={cameraStatus}
                cameraError={cameraError}
                trackingState={trackingState}
                onToggleCamera={handleToggleCamera}
                onRetryCamera={handleToggleCamera}
                videoRef={videoRef}
                canvasRef={canvasRef}
              />
            </div>

            <div className={rightPanelTab === 'diagnostics' ? 'block' : 'hidden'}>
              <SimulationDiagnosticsPanel
                result={simulationResult}
                onSelectComponentById={id => {
                  setSelectedCompId(id);
                  setRightPanelTab('properties');
                }}
              />
            </div>
          </div>
        </aside>

      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar
        componentCount={components.length}
        wireCount={wires.length}
        simulationStatus={simulationResult?.status || 'idle'}
        isHandTrackingActive={cameraStatus === 'active' && !!trackingState?.isHandDetected}
        activeMode={activeMode}
      />

      {/* Floating Feedback Toasts */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Virtual Multimeter Floating DMM HUD (Active when multimeter mode selected) */}
      {activeMode === 'multimeter' && (
        <VirtualMultimeterHUD
          reading={multimeterReading}
          onChangeMode={handleChangeMultimeterMode}
          onResetBlackToGnd={handleResetBlackToGnd}
          activeProbeTarget={activeProbeTarget}
          onSelectActiveProbeTarget={setActiveProbeTarget}
          onClose={() => setActiveMode('select')}
        />
      )}

      {/* Project & Sample Circuits Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onLoadProject={handleLoadProject}
        currentProject={currentProject}
      />

      {/* 2D Schematic Diagram Modal */}
      <SchematicModal
        isOpen={isSchematicOpen}
        onClose={() => setIsSchematicOpen(false)}
        projectName={currentProject.name}
        components={components}
        wires={wires}
        simulationResult={simulationResult}
      />

    </div>
  );
};
