import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Clock, Repeat, CheckCircle2, Activity } from 'lucide-react';
import { Badge } from '../../common/Badge';

export type AnimationState = 'idle' | 'signing' | 'listening' | 'paused' | 'completed';

interface AvatarAnimationControllerProps {
  state: AnimationState;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  isLooping: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSelectStep: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleLoop: () => void;
  stepLabels?: string[];
}

export const AvatarAnimationController: React.FC<AvatarAnimationControllerProps> = ({
  state,
  currentIndex,
  totalSteps,
  speed,
  isLooping,
  onPlay,
  onPause,
  onReplay,
  onNextStep,
  onPrevStep,
  onSelectStep,
  onSpeedChange,
  onToggleLoop,
  stepLabels = []
}) => {
  const isPlaying = state === 'signing';
  const hasSteps = totalSteps > 0;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surdo-beige shadow-soft space-y-4">
      {/* Top Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-surdo-forest uppercase tracking-wider">
            Animatsiya Boshqaruvi:
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
              state === 'signing'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : state === 'listening'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                : state === 'paused'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>
              {state === 'signing'
                ? 'Harakatda (Signing)'
                : state === 'listening'
                ? 'Ovoz tinglanmoqda...'
                : state === 'paused'
                ? 'Pauzada'
                : state === 'completed'
                ? 'Yakunlandi'
                : 'Kutish holati (Idle)'}
            </span>
          </span>
        </div>

        {/* Hand Framing Notice */}
        <span className="text-[11px] text-surdo-brown font-medium flex items-center gap-1">
          <span>🤲 Ikkala qo‘l va barmoqlar to‘liq ko‘rinadi</span>
        </span>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Play/Pause/Navigation cluster */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onPrevStep}
            disabled={!hasSteps || currentIndex === 0}
            className="p-2 border border-surdo-beige text-surdo-forest hover:bg-surdo-sand rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Oldingi belgi"
            aria-label="Oldingi belgi"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause Toggle */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!hasSteps}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all ${
              !hasSteps
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-surdo-forest hover:bg-surdo-green text-surdo-cream'
            }`}
            aria-label={isPlaying ? "Pauza" : "Ijro etish"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pauza' : 'Ijro etish'}</span>
          </button>

          {/* Step Forward */}
          <button
            onClick={onNextStep}
            disabled={!hasSteps || currentIndex === totalSteps - 1}
            className="p-2 border border-surdo-beige text-surdo-forest hover:bg-surdo-sand rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Keyingi belgi"
            aria-label="Keyingi belgi"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Replay */}
          <button
            onClick={onReplay}
            disabled={!hasSteps}
            className="p-2 border border-surdo-beige text-surdo-forest hover:bg-surdo-sand rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Boshidan qaytarish"
            aria-label="Boshidan qaytarish"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Loop Toggle */}
          <button
            onClick={onToggleLoop}
            className={`p-2 rounded-xl border transition-colors ${
              isLooping
                ? 'bg-surdo-forest text-surdo-cream border-surdo-forest shadow-xs'
                : 'border-surdo-beige text-stone-500 hover:bg-surdo-sand'
            }`}
            title={isLooping ? "Takrorlash yoqilgan" : "Takrorlash o‘chiq"}
            aria-label="Takrorlashni yoqish yoki o‘chirish"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surdo-brown flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Tezlik:
          </span>
          {[0.5, 0.75, 1, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
                speed === s
                  ? 'bg-surdo-forest text-surdo-cream border-surdo-forest'
                  : 'bg-white text-surdo-forest border-surdo-beige hover:bg-surdo-sand'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Visual Sequence Scrubber */}
      {totalSteps > 1 && (
        <div className="pt-2 border-t border-surdo-beige/60">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const label = stepLabels[idx] || `${idx + 1}-belgi`;
              const isActive = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                    isActive
                      ? 'bg-surdo-forest text-surdo-cream border-surdo-forest shadow-xs'
                      : 'bg-surdo-sand/40 text-surdo-darkest border-surdo-beige hover:bg-surdo-sand'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
