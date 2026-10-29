import React from 'react';
import { SimulationStatus, LabInteractionMode } from '../types';
import { Cpu, Link, Zap, Hand, MousePointer, ShieldCheck, AlertCircle, Activity } from 'lucide-react';

interface StatusBarProps {
  componentCount: number;
  wireCount: number;
  simulationStatus: SimulationStatus;
  isHandTrackingActive: boolean;
  activeMode: LabInteractionMode;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  componentCount,
  wireCount,
  simulationStatus,
  isHandTrackingActive,
  activeMode
}) => {
  return (
    <footer className="h-9 px-4 bg-[#070d19] border-t border-[#1e325c] flex items-center justify-between text-[11px] text-slate-400 select-none z-30 font-mono">
      
      {/* Left items: Counts */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Komponentlar:</span>
          <strong className="text-slate-200">{componentCount}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Link className="w-3.5 h-3.5 text-blue-400" />
          <span>Simlar:</span>
          <strong className="text-slate-200">{wireCount}</strong>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-500">
          <span>Plata: 30-ustunli (400 tie-point)</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <span>Rejim:</span>
          <strong className="text-cyan-300">
            {activeMode === 'select'
              ? 'Ushlash'
              : activeMode === 'wire'
              ? 'Sim Ulash'
              : activeMode === 'delete_wire'
              ? 'Sim O\'chirish'
              : 'Multimetr'}
          </strong>
        </div>
      </div>

      {/* Center: Simulation State */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            simulationStatus === 'success'
              ? 'bg-emerald-400 animate-pulse'
              : simulationStatus === 'error'
              ? 'bg-rose-500'
              : 'bg-cyan-500'
          }`}
        />
        <span className="font-semibold text-slate-300">
          {simulationStatus === 'success'
            ? 'Zanjir: TO‘G‘RI'
            : simulationStatus === 'error'
            ? 'Zanjir: XATOLIK ANIQLANDI'
            : 'Zanjir: TEKSHIRILMAGAN'}
        </span>
      </div>

      {/* Right items: Input mode & hotkey hint */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-[10px]">
          <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">R</kbd> Burish
          <span className="mx-1">•</span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Del</kbd> O‘chirish
        </div>

        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
          {isHandTrackingActive ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Hand className="w-3.5 h-3.5" /> Kamera (Qo‘l)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <MousePointer className="w-3.5 h-3.5" /> Sichqoncha
            </span>
          )}
        </div>
      </div>

    </footer>
  );
};
