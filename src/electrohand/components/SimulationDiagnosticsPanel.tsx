import React from 'react';
import { SimulationResult, DiagnosticIssue } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Zap,
  Activity,
  Layers,
  ShieldAlert
} from 'lucide-react';

interface SimulationDiagnosticsPanelProps {
  result: SimulationResult | null;
  onSelectComponentById?: (compId: string) => void;
}

export const SimulationDiagnosticsPanel: React.FC<SimulationDiagnosticsPanelProps> = ({
  result,
  onSelectComponentById
}) => {
  if (!result || result.status === 'idle') {
    return (
      <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full select-none">
        <Activity className="w-10 h-10 mb-3 opacity-40 text-cyan-400" />
        <p className="text-xs font-medium text-slate-300">Simulyatsiya o‘tkazilmagan</p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] leading-relaxed">
          Zanjirning kuchlanishi, toklari va to‘g‘riligini tekshirish uchun yuqoridagi <strong>“Simulyatsiya / Tekshirish”</strong> tugmasini bosing.
        </p>
      </div>
    );
  }

  const isSuccess = result.status === 'success';
  const isError = result.status === 'error';

  return (
    <div className="p-4 space-y-4 text-slate-200 select-none overflow-y-auto max-h-[calc(100vh-8rem)]">
      
      {/* Overall Status Banner */}
      <div
        className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-lg ${
          isSuccess
            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 shadow-neon-green'
            : isError
            ? 'bg-rose-950/60 border-rose-600/80 text-rose-100 shadow-neon-red'
            : 'bg-blue-950/60 border-blue-500/80 text-blue-100'
        }`}
      >
        <div className="pt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          ) : (
            <HelpCircle className="w-5 h-5 text-blue-400" />
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide">
            {isSuccess
              ? 'Zanjir To‘g‘ri va Ishlamoqda'
              : isError
              ? 'Xatolik / Muammo Aniqlandi'
              : 'Holatni Aniqlab Bo‘lmadi'}
          </h3>
          <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
            {result.statusTextUz}
          </p>
        </div>
      </div>

      {/* Issues / Diagnostics List */}
      {result.issues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Aniqlangan Xatoliklar ({result.issues.length})
          </h4>

          {result.issues.map(issue => {
            const isCrit = issue.severity === 'critical';
            return (
              <div
                key={issue.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCrit
                    ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                    : 'bg-amber-950/40 border-amber-600/60 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{issue.titleUz}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isCrit ? 'bg-rose-600 text-white' : 'bg-amber-600 text-black'
                    }`}
                  >
                    {isCrit ? 'Kritik xato' : 'Ogohlantirish'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {issue.descriptionUz}
                </p>

                {issue.componentIds.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">Muammoli elementlar:</span>
                    {issue.componentIds.map(id => (
                      <button
                        key={id}
                        onClick={() => onSelectComponentById && onSelectComponentById(id)}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 underline"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Node Voltages Table */}
      {Object.keys(result.nodeVoltages).length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Tugun Kuchlanishlari (Node Voltages)
          </h4>

          <div className="rounded-xl border border-[#1e325c] bg-[#0b1328] overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1a38] text-[10px] text-slate-400 uppercase font-mono border-b border-[#1e325c]">
                <tr>
                  <th className="px-2.5 py-1.5">Elektr Tugun (Net)</th>
                  <th className="px-2.5 py-1.5 text-right">Kuchlanish (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {Object.entries(result.nodeVoltages).map(([node, volt]) => (
                  <tr key={node} className="hover:bg-slate-800/40">
                    <td className="px-2.5 py-1.5 text-slate-300 truncate max-w-[140px]">{node}</td>
                    <td className="px-2.5 py-1.5 text-right font-bold text-cyan-400">
                      {volt.toFixed(2)} V
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Branch Currents Table */}
      {Object.keys(result.branchCurrents).length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Tarmoq Toklari (Branch Currents)
          </h4>

          <div className="rounded-xl border border-[#1e325c] bg-[#0b1328] overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1a38] text-[10px] text-slate-400 uppercase font-mono border-b border-[#1e325c]">
                <tr>
                  <th className="px-2.5 py-1.5">Komponent</th>
                  <th className="px-2.5 py-1.5">Tok (I)</th>
                  <th className="px-2.5 py-1.5 text-right">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {Object.entries(result.branchCurrents).map(([compId, res]) => (
                  <tr key={compId} className="hover:bg-slate-800/40">
                    <td className="px-2.5 py-1.5 text-slate-300">{compId}</td>
                    <td className="px-2.5 py-1.5 font-bold text-emerald-400">
                      {(res.current * 1000).toFixed(1)} mA
                    </td>
                    <td className="px-2.5 py-1.5 text-right">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          res.state === 'ON'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : res.state === 'BURNT'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {res.state || 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Technical Disclaimer Note */}
      <div className="p-2.5 rounded-xl bg-[#091124] border border-[#1e325c]/60 text-[10px] text-slate-500 leading-relaxed">
        * Ushbu ma’lumotlar Modified Nodal Analysis (MNA) nazariy fizik matematik modeli orqali hisoblandi. Haqiqiy jismoniy o‘lchovlarda simlarning ichki qarshiligi va harorat ta’sirida kichik farqlar bo‘lishi mumkin.
      </div>

    </div>
  );
};
