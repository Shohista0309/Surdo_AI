import React from 'react';
import { SimulationTask, CableId } from '../types';
import { CheckCircle2, Circle, RotateCcw, Zap, Hand, Move, Link } from 'lucide-react';

interface TaskPanelProps {
  tasks: SimulationTask[];
  completedCount: number;
  totalCount: number;
  isFullyConnected: boolean;
  onReset: () => void;
  hoveredTerminalLabel?: string | null;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  completedCount,
  totalCount,
  isFullyConnected,
  onReset,
  hoveredTerminalLabel
}) => {
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed top-20 left-6 z-30 w-80 sm:w-88 flex flex-col gap-4 pointer-events-none">
      {/* Main Task Card */}
      <div className="bg-[#0b1328]/95 border border-[#1e325c] rounded-2xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1e325c]/70">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isFullyConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Elektr Zanjiri Vazifasi
              </h2>
              <p className="text-xs text-slate-400">
                {isFullyConnected ? 'Zanjir to‘liq ishga tushirildi!' : 'Kabellarni to‘g‘ri portlarga ulang'}
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            title="Barcha ulanishlarni qayta boshlash"
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-300">Ulanish jarayoni:</span>
            <span className={`font-mono font-bold ${isFullyConnected ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {completedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullyConnected
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-neon-green'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-neon-cyan'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="mt-4 flex flex-col gap-2.5">
          {tasks.map(task => {
            const isDone = task.isCompleted;

            let dotColor = 'bg-cyan-400';
            if (task.cableId === 'cable-red') dotColor = 'bg-red-500';
            if (task.cableId === 'cable-black') dotColor = 'bg-slate-400';
            if (task.cableId === 'cable-blue') dotColor = 'bg-cyan-400';

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-100'
                    : 'bg-[#0f1b38]/70 border-[#1e325c]/70 text-slate-300'
                }`}
              >
                <div className="pt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${isDone ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                      {task.titleUz}
                    </p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? 'Bajarildi' : 'Kutilmoqda'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{task.descUz}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover / Hint notification */}
        {hoveredTerminalLabel && (
          <div className="mt-3.5 px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Port: <strong>{hoveredTerminalLabel}</strong> (Ulash uchun qo‘yib yuboring)</span>
          </div>
        )}
      </div>

      {/* Mini Gesture Guide Card */}
      <div className="bg-[#0b1328]/90 border border-[#1e325c] rounded-2xl p-4 shadow-xl backdrop-blur-md pointer-events-auto">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Hand className="w-3.5 h-3.5 text-cyan-400" /> Boshqaruv qo‘llanmasi
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-[#0e1a38]/80 border border-[#1e325c]/50">
            <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">1</div>
            <p className="text-[11px] font-semibold text-slate-200">Chimchilang</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Kabel uchini ushlash</p>
          </div>

          <div className="p-2 rounded-xl bg-[#0e1a38]/80 border border-[#1e325c]/50">
            <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">2</div>
            <p className="text-[11px] font-semibold text-slate-200">Surish</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Port tomon yo‘naltirish</p>
          </div>

          <div className="p-2 rounded-xl bg-[#0e1a38]/80 border border-[#1e325c]/50">
            <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">3</div>
            <p className="text-[11px] font-semibold text-slate-200">Qo‘yib yuboring</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Portga avto-ulash</p>
          </div>
        </div>
      </div>
    </div>
  );
};
