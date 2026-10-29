import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager } from '../scene/SceneManager';
import { CameraManager } from '../camera/CameraManager';
import { HandLandmarkerTracker } from '../tracking/HandLandmarkerTracker';
import { InteractionManager } from '../interaction/InteractionManager';
import { TaskPanel } from './TaskPanel';
import { WebcamOverlay } from './WebcamOverlay';
import { ToastNotification } from './ToastNotification';
import { SuccessModal } from './SuccessModal';
import { soundEffects } from '../audio/SoundEffects';
import {
  CameraStatus,
  CameraErrorDetails,
  GestureDetectionResult,
  SimulationTask,
  ToastMessage,
  CableId,
  TerminalId
} from '../types';
import {
  ArrowLeft,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  MousePointer,
  Video,
  Info
} from 'lucide-react';

interface SimulatorViewProps {
  onBackToLanding: () => void;
}

const INITIAL_TASKS: SimulationTask[] = [
  {
    id: 'task-1',
    cableId: 'cable-red',
    terminalId: 'term-vcc',
    titleUz: '1. Qizil kabel ➔ +5V VCC porti',
    descUz: 'Manba musbat kuchlanishini mikrokontrollerga ulang',
    isCompleted: false
  },
  {
    id: 'task-2',
    cableId: 'cable-black',
    terminalId: 'term-gnd',
    titleUz: '2. Qora kabel ➔ GND (Zamin) porti',
    descUz: 'Yopiq kontur hosil qilish uchun zaminni ulang',
    isCompleted: false
  },
  {
    id: 'task-3',
    cableId: 'cable-blue',
    terminalId: 'term-signal',
    titleUz: '3. Moviy kabel ➔ LED SIGNAL porti',
    descUz: 'LED chirog‘ini boshqarish signal simini ulang',
    isCompleted: false
  }
];

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onBackToLanding }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Engine references
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const cameraManagerRef = useRef<CameraManager | null>(null);
  const trackerRef = useRef<HandLandmarkerTracker | null>(null);
  const interactionRef = useRef<InteractionManager | null>(null);

  // UI States
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraError, setCameraError] = useState<CameraErrorDetails | undefined>(undefined);
  const [gestureResult, setGestureResult] = useState<GestureDetectionResult | null>(null);
  const [tasks, setTasks] = useState<SimulationTask[]>(INITIAL_TASKS);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isFullyConnected, setIsFullyConnected] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'camera' | 'mouse'>('camera');
  const [hoveredTerminalLabel, setHoveredTerminalLabel] = useState<string | null>(null);

  // Toast handler
  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const newToast: ToastMessage = {
      ...toast,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    setToasts(prev => [...prev.slice(-3), newToast]); // Keep max 4 toasts

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Reset circuit
  const handleReset = useCallback(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.resetCircuit();
    }
    setTasks(INITIAL_TASKS);
    setCompletedCount(0);
    setIsFullyConnected(false);
    setShowSuccessModal(false);
    soundEffects.playReset();
    addToast({
      textUz: 'Zanjir va kabellar qayta boshlang‘ich holatga qaytarildi.',
      type: 'info'
    });
  }, [addToast]);

  // Initialize Three.js scene and InteractionManager
  useEffect(() => {
    if (!containerRef.current) return;

    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;

    const interactionManager = new InteractionManager(sceneManager, {
      onToast: addToast,
      onConnectionChange: (count, isFull) => {
        setCompletedCount(count);
        setIsFullyConnected(isFull);

        // Update task list states
        setTasks(prev =>
          prev.map(task => {
            const cable = sceneManager.cables.get(task.cableId);
            const isDone = cable?.state === 'CONNECTED' && cable.connectedTerminalId === task.terminalId;
            return { ...task, isCompleted: !!isDone };
          })
        );

        if (isFull) {
          setShowSuccessModal(true);
        }
      },
      onHoverTerminalChange: term => {
        setHoveredTerminalLabel(term ? term.definition.label : null);
      }
    });
    interactionRef.current = interactionManager;

    // Start camera tracking
    const cameraManager = new CameraManager((status, err) => {
      setCameraStatus(status);
      setCameraError(err);
    });
    cameraManagerRef.current = cameraManager;

    const tracker = new HandLandmarkerTracker(result => {
      setGestureResult(result);
      if (interactionRef.current) {
        interactionRef.current.handleGestureFrame(result);
      }
    });
    trackerRef.current = tracker;

    // Load tracker and then start camera
    tracker.initialize().then(ok => {
      if (ok && videoRef.current) {
        cameraManager.startCamera(videoRef.current).then(started => {
          if (started && videoRef.current) {
            tracker.start(videoRef.current, canvasRef.current);
          }
        });
      }
    });

    // Cleanup when unmounting or returning to landing
    return () => {
      tracker.close();
      cameraManager.stopCamera();
      sceneManager.dispose();
      sceneManagerRef.current = null;
      cameraManagerRef.current = null;
      trackerRef.current = null;
      interactionRef.current = null;
    };
  }, [addToast]);

  // Camera toggle handler
  const handleToggleCamera = async () => {
    if (!cameraManagerRef.current || !trackerRef.current || !videoRef.current) return;

    if (cameraStatus === 'active') {
      trackerRef.current.stop();
      cameraManagerRef.current.stopCamera();
      setCameraStatus('stopped');
      addToast({ textUz: 'Kamera to‘xtatildi.', type: 'info' });
    } else {
      const ok = await cameraManagerRef.current.startCamera(videoRef.current);
      if (ok) {
        trackerRef.current.start(videoRef.current, canvasRef.current);
        setCameraStatus('active');
        addToast({ textUz: 'Kamera ishga tushirildi.', type: 'success' });
      }
    }
  };

  const handleRetryCamera = async () => {
    if (!cameraManagerRef.current || !trackerRef.current || !videoRef.current) return;
    const ok = await cameraManagerRef.current.startCamera(videoRef.current);
    if (ok) {
      trackerRef.current.start(videoRef.current, canvasRef.current);
    }
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
    addToast({
      textUz: nextMuted ? 'Ovoz o‘chirildi.' : 'Ovoz yoqildi.',
      type: 'info'
    });
  };

  // Mouse / Touch interaction on 3D canvas (fallback / convenience)
  const getCanvasCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0.5, y: 0.5 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inputMode === 'mouse' || cameraStatus !== 'active' || !gestureResult?.isHandDetected) {
      const { x, y } = getCanvasCoords(e);
      interactionRef.current?.handlePointerDown(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inputMode === 'mouse' || cameraStatus !== 'active' || !gestureResult?.isHandDetected) {
      const { x, y } = getCanvasCoords(e);
      interactionRef.current?.handlePointerMove(x, y);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inputMode === 'mouse' || cameraStatus !== 'active' || !gestureResult?.isHandDetected) {
      const { x, y } = getCanvasCoords(e);
      interactionRef.current?.handlePointerUp(x, y);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060b17] select-none">
      
      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#070d19]/90 to-transparent pointer-events-none">
        
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 backdrop-blur-md text-xs sm:text-sm font-semibold transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Bosh sahifa
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                ElectroHand <span className="text-cyan-400 text-xs font-mono font-normal">v1.0</span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                3D Elektr Simulyatori
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b1328]/85 border border-[#1e325c] backdrop-blur-md pointer-events-auto shadow-lg">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              cameraStatus === 'active'
                ? gestureResult?.isHandDetected
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-medium text-slate-200">
            {cameraStatus === 'active'
              ? gestureResult?.isHandDetected
                ? gestureResult.isPinching
                  ? 'Qo‘l ushlandi (Pinch faol)'
                  : 'Qo‘l aniqlandi (Harakat kutilmoqda)'
                : 'Qo‘l kutilmoqda...'
              : cameraStatus === 'starting'
              ? 'Kamera ochilmoqda...'
              : 'Kamera nofaol'}
          </span>
        </div>

        {/* Right: Controls (Input mode, Mute, Reset) */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Mode switch */}
          <button
            onClick={() => {
              const next = inputMode === 'camera' ? 'mouse' : 'camera';
              setInputMode(next);
              addToast({
                textUz: next === 'mouse' ? 'Sichqoncha rejimi yoqildi.' : 'Veb-kamera qo‘l harakati rejimi yoqildi.',
                type: 'info'
              });
            }}
            title={inputMode === 'camera' ? 'Sichqoncha rejimiga o‘tish' : 'Kamera rejimiga o‘tish'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all ${
              inputMode === 'camera'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-200'
            }`}
          >
            {inputMode === 'camera' ? <Video className="w-3.5 h-3.5" /> : <MousePointer className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {inputMode === 'camera' ? 'Kamera rejimi' : 'Sichqoncha rejimi'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            title="Qayta boshlash"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 backdrop-blur-md text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Qayta boshlash</span>
          </button>
        </div>
      </header>

      {/* Left: Task Panel */}
      <TaskPanel
        tasks={tasks}
        completedCount={completedCount}
        totalCount={tasks.length}
        isFullyConnected={isFullyConnected}
        onReset={handleReset}
        hoveredTerminalLabel={hoveredTerminalLabel}
      />

      {/* Bottom Right: Webcam Preview & Hand Tracking Skeleton */}
      <WebcamOverlay
        cameraStatus={cameraStatus}
        cameraError={cameraError}
        gestureResult={gestureResult}
        onToggleCamera={handleToggleCamera}
        onRetryCamera={handleRetryCamera}
        videoRef={videoRef}
        canvasRef={canvasRef}
      />

      {/* Floating Feedback Toasts */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Victory Celebration Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onReset={handleReset}
      />
    </div>
  );
};
