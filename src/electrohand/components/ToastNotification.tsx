import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        let bgStyle = 'bg-slate-900/95 border-slate-700 text-slate-100';
        let IconComponent = Info;
        let iconColor = 'text-cyan-400';

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-950/95 border-emerald-600/80 text-emerald-100 shadow-neon-green';
          IconComponent = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-950/95 border-rose-600/80 text-rose-100 shadow-neon-red';
          IconComponent = XCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-950/95 border-amber-600/80 text-amber-100';
          IconComponent = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slideInRight cursor-pointer hover:opacity-90 ${bgStyle}`}
          >
            <IconComponent className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            <p className="text-sm font-medium tracking-wide">{toast.textUz}</p>
          </div>
        );
      })}
    </div>
  );
};
