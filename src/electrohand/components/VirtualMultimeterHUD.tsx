import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  ArrowRightLeft,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { MultimeterMode, MultimeterReading } from '../types';

interface VirtualMultimeterHUDProps {
  reading: MultimeterReading;
  onChangeMode: (mode: MultimeterMode) => void;
  onResetBlackToGnd: () => void;
  activeProbeTarget: 'red' | 'black';
  onSelectActiveProbeTarget: (target: 'red' | 'black') => void;
  onClose: () => void;
}

export const VirtualMultimeterHUD: React.FC<VirtualMultimeterHUDProps> = ({
  reading,
  onChangeMode,
  onResetBlackToGnd,
  activeProbeTarget,
  onSelectActiveProbeTarget,
  onClose
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHold, setIsHold] = useState(false);

  return (
    <div
      className={`fixed bottom-12 right-6 z-40 select-none transition-all duration-300 font-sans ${
        isMinimized ? 'w-64' : 'w-84 sm:w-96'
      }`}
    >
      {/* Outer Chassis (Industrial Yellow/Dark Gray Rugged Casing) */}
      <div className="rounded-2xl bg-gradient-to-b from-[#222733] to-[#121620] border-2 border-amber-500/70 p-3.5 shadow-2xl backdrop-blur-md ring-1 ring-amber-500/30">
        
        {/* Chassis Top Bar: Model Name & Controls */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center text-black font-extrabold text-[10px]">
              DMM
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>ElectroHand DMM-88</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  TRUE RMS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Kattalashtirish' : 'Kichraytirish'}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              title="Multimetrni yopish"
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Digital LCD Screen (Backlit Neon Amber / Green) */}
        <div className="rounded-xl bg-[#08120d] border border-emerald-500/40 p-3 shadow-inner relative overflow-hidden">
          {/* Subtle LCD grid lines overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

          {/* LCD Status Header */}
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-400/80 mb-1">
            <div className="flex items-center gap-2">
              <span className="px-1 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/30">AUTO</span>
              {isHold && (
                <span className="px-1 py-0.5 rounded bg-amber-500 text-black font-bold animate-pulse">HOLD</span>
              )}
              {reading.isBeeping && (
                <span className="flex items-center gap-0.5 text-amber-400 font-bold animate-bounce">
                  <Volume2 className="w-3 h-3" /> UZLUKSIZLIK
                </span>
              )}
            </div>
            <div className="font-mono text-emerald-300 tracking-wider">
              {reading.mode === 'voltage_dc' ? 'DC KUCHLANISH' : reading.mode === 'current_dc' ? 'DC TOK' : 'QARSHILIK'}
            </div>
          </div>

          {/* Primary 7-Segment Value Readout */}
          <div className="flex items-baseline justify-between my-1">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]">
              {isHold ? reading.displayStr : reading.displayStr}
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 ml-2">
              {reading.unit}
            </div>
          </div>

          {/* Probe Points Target Sub-info */}
          <div className="mt-2 pt-2 border-t border-emerald-900/50 flex flex-col gap-1 text-[11px] font-mono text-emerald-300/90">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_6px_red]" />
                <span className="text-slate-300">Qizil (+):</span>
              </span>
              <span className="font-semibold text-white truncate max-w-[190px]">
                {reading.testPointNameUz || 'Ulangan emas (Bosib tekkizing)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-400 inline-block" />
                <span className="text-slate-300">Qora (-):</span>
              </span>
              <span className="font-semibold text-white truncate max-w-[190px]">
                {reading.blackProbeNode ? reading.blackProbeNode : 'Zamin / GND (0V)'}
              </span>
            </div>
          </div>
        </div>

        {/* Multimeter Rotary Functions & Buttons */}
        {!isMinimized && (
          <div className="mt-3 flex flex-col gap-2">
            {/* Function Mode Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#090d16] border border-slate-800">
              <button
                onClick={() => onChangeMode('voltage_dc')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                  reading.mode === 'voltage_dc'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>V ⎓</span>
                <span className="text-[9px]">Kuchlanish</span>
              </button>

              <button
                onClick={() => onChangeMode('current_dc')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                  reading.mode === 'current_dc'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>mA ⎓</span>
                <span className="text-[9px]">Tok Kuchi</span>
              </button>

              <button
                onClick={() => onChangeMode('continuity')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                  reading.mode === 'continuity'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Ω / •)))</span>
                <span className="text-[9px]">Qarshilik</span>
              </button>
            </div>

            {/* Probe Lead Switching & Hold */}
            <div className="flex items-center gap-2 text-xs">
              {/* Active Probe Selection Toggle */}
              <div className="flex-1 flex rounded-lg bg-slate-900 border border-slate-700/80 p-0.5">
                <button
                  onClick={() => onSelectActiveProbeTarget('red')}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeProbeTarget === 'red'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Qizil (+)
                </button>
                <button
                  onClick={() => onSelectActiveProbeTarget('black')}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeProbeTarget === 'black'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Qora (-)
                </button>
              </div>

              {/* Hold Button */}
              <button
                onClick={() => setIsHold(!isHold)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isHold
                    ? 'bg-amber-400 text-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                HOLD
              </button>

              {/* Reset Black to GND */}
              <button
                onClick={onResetBlackToGnd}
                title="Qora probni zaminga (GND / 0V) qaytarish"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all"
              >
                GND ga
              </button>
            </div>

            {/* Practical instructions hint */}
            <div className="text-[10px] text-slate-400 text-center bg-slate-900/50 py-1 px-2 rounded-lg border border-slate-800">
              💡 <span className="text-slate-300 font-medium">Ko‘rsatma:</span> Maket platasining istalgan teshigini bosib kuchlanish yoki qarshilikni o‘lchang.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
