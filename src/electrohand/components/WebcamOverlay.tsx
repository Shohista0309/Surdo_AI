import React, { useRef, useEffect, useState } from 'react';
import { CameraStatus, CameraErrorDetails, GestureDetectionResult } from '../types';
import { Camera, CameraOff, Video, Sparkles, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface WebcamOverlayProps {
  cameraStatus: CameraStatus;
  cameraError?: CameraErrorDetails;
  gestureResult: GestureDetectionResult | null;
  onToggleCamera: () => void;
  onRetryCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const WebcamOverlay: React.FC<WebcamOverlayProps> = ({
  cameraStatus,
  cameraError,
  gestureResult,
  onToggleCamera,
  onRetryCamera,
  videoRef,
  canvasRef
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const isHand = gestureResult?.isHandDetected ?? false;
  const isPinching = gestureResult?.isPinching ?? false;
  const pinchStrength = gestureResult?.pinchStrength ?? 0;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Container Box */}
      <div className="bg-[#0b1328]/95 border border-[#1e325c] rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 w-72 sm:w-80">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0e1a38] border-b border-[#1e325c]">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
              Veb-kamera nazorati
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Camera Toggle Button */}
            <button
              onClick={onToggleCamera}
              title={cameraStatus === 'active' ? "Kamerani to'xtatish" : "Kamerani yoqish"}
              className={`p-1.5 rounded-lg transition-colors ${
                cameraStatus === 'active'
                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              {cameraStatus === 'active' ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            </button>

            {/* Minimize / Maximize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video & Canvas Area */}
        {!isMinimized && (
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {/* Live Video Feed (Mirrored) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                cameraStatus !== 'active' ? 'hidden' : 'block'
              }`}
            />

            {/* Hand Skeleton Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
                cameraStatus !== 'active' ? 'hidden' : 'block'
              }`}
            />

            {/* Camera Error or Off View */}
            {cameraStatus === 'error' && (
              <div className="p-4 text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <p className="text-xs font-semibold text-rose-200">{cameraError?.titleUz || 'Kamera xatosi'}</p>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {cameraError?.messageUz || "Kameraga ulanib bo'lmadi."}
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

            {cameraStatus === 'starting' && (
              <div className="flex flex-col items-center justify-center gap-2 p-6">
                <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-cyan-300 font-medium">Kamera ishga tushirilmoqda...</p>
              </div>
            )}

            {cameraStatus === 'stopped' && (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-slate-400">
                <CameraOff className="w-8 h-8 text-slate-500" />
                <p className="text-xs">Kamera to‘xtatilgan</p>
                <button
                  onClick={onToggleCamera}
                  className="mt-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Kamerani yoqish
                </button>
              </div>
            )}

            {/* Active Status Overlay Bar */}
            {cameraStatus === 'active' && (
              <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-slate-700/60">
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
          </div>
        )}

        {/* Footer / Pinch Strength Indicator */}
        <div className="px-3.5 py-2.5 bg-[#091124] border-t border-[#1e325c]">
          <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Chimchilish darajasi:
            </span>
            <span className={`font-mono font-bold ${isPinching ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {pinchStrength}% {isPinching && '(Ushlandi)'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                isPinching ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${pinchStrength}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
