import React from 'react';
import { CameraStatus, CameraErrorDetails, HandTrackingState } from '../types';
import {
  Camera,
  CameraOff,
  Video,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Hand
} from 'lucide-react';

interface WebcamTrackingPanelProps {
  cameraStatus: CameraStatus;
  cameraError?: CameraErrorDetails;
  trackingState: HandTrackingState | null;
  onToggleCamera: () => void;
  onRetryCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const WebcamTrackingPanel: React.FC<WebcamTrackingPanelProps> = ({
  cameraStatus,
  cameraError,
  trackingState,
  onToggleCamera,
  onRetryCamera,
  videoRef,
  canvasRef
}) => {
  const isHand = trackingState?.isHandDetected ?? false;
  const isPinching = trackingState?.isPinching ?? false;
  const pinchStrength = trackingState?.pinchStrength ?? 0;

  return (
    <div className="p-4 space-y-4 text-slate-200 select-none overflow-y-auto max-h-[calc(100vh-8rem)]">
      
      {/* Video & Skeleton Overlay Box */}
      <div className="relative aspect-video rounded-2xl bg-black border border-[#1e325c] overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Live Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${
            cameraStatus !== 'active' ? 'hidden' : 'block'
          }`}
        />

        {/* Hand Landmark Skeleton Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
            cameraStatus !== 'active' ? 'hidden' : 'block'
          }`}
        />

        {/* Status overlay badge */}
        {cameraStatus === 'active' && (
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-slate-700/60 shadow-lg">
            <span
              className={`w-2 h-2 rounded-full ${
                isHand
                  ? isPinching
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-emerald-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-200">
              {isHand ? (isPinching ? 'Ushlandi (Pinch)' : 'Qo‘l aniqlandi') : 'Qo‘l topilmadi'}
            </span>
          </div>
        )}

        {/* Camera Starting State */}
        {cameraStatus === 'starting' && (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-cyan-300 font-medium">Veb-kamera yuklanmoqda...</p>
          </div>
        )}

        {/* Camera Stopped State */}
        {cameraStatus === 'stopped' && (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-400">
            <CameraOff className="w-8 h-8 text-slate-500" />
            <p className="text-xs">Kamera to‘xtatilgan</p>
            <button
              onClick={onToggleCamera}
              className="mt-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg text-xs shadow-neon-cyan transition-colors"
            >
              Kamerani yoqish
            </button>
          </div>
        )}

        {/* Camera Error State */}
        {cameraStatus === 'error' && (
          <div className="p-4 text-center flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <p className="text-xs font-semibold text-rose-200">{cameraError?.titleUz || 'Kamera xatosi'}</p>
            <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
              {cameraError?.messageUz || "Veb-kameraga ulanishda xatolik yuz berdi."}
            </p>
            {cameraError?.canRetry && (
              <button
                onClick={onRetryCamera}
                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Qayta urinish
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pinch Strength Bar */}
      <div className="p-3 rounded-xl bg-[#0b1328] border border-[#1e325c]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Chimchilash (Pinch) kuchi:
          </span>
          <span className={`font-mono font-bold ${isPinching ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {pinchStrength}% {isPinching && '(Ushlandi)'}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              isPinching ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-neon-green' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${pinchStrength}%` }}
          />
        </div>
      </div>

      {/* Camera Toggle Button */}
      <button
        onClick={onToggleCamera}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
          cameraStatus === 'active'
            ? 'bg-rose-950/40 border-rose-600/50 text-rose-300 hover:bg-rose-900/50'
            : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60'
        }`}
      >
        {cameraStatus === 'active' ? (
          <>
            <CameraOff className="w-4 h-4" /> Kamerani to‘xtatish
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" /> Kamerani yoqish
          </>
        )}
      </button>

      {/* Gesture Controls Guide */}
      <div className="p-3.5 rounded-xl bg-[#0b1328] border border-[#1e325c] space-y-2 text-xs">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Hand className="w-3.5 h-3.5 text-cyan-400" />
          Qo‘l bilan boshqarish qoidalari
        </h4>

        <div className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
            <p><strong className="text-slate-200">Chimchilang:</strong> Bosh va ko‘rsatkich barmoqni birlashtirib elementni ushlang yoki simni boshlang.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
            <p><strong className="text-slate-200">Surish:</strong> Qo‘lingizni havoda siljitib komponentni kerakli joyga yo‘naltiring.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
            <p><strong className="text-slate-200">Qo‘yib yuboring:</strong> Barmoqlarni oching, u avtomatik breadboard teshiklariga joylashadi.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
