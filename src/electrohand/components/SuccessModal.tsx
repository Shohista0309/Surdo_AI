import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Zap, CheckCircle2, RotateCcw, X, Sparkles } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onReset }) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#10b981', '#38bdf8', '#fbbf24', '#ffffff']
        });

        const timer = setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00f0ff', '#10b981']
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00f0ff', '#10b981']
          });
        }, 300);

        return () => clearTimeout(timer);
      } catch {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0b1328] border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-neon-green text-center overflow-hidden">
        
        {/* Glow ambient circle in background */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-neon-green mb-5">
          <Zap className="w-9 h-9 animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Zanjir Ishga Tushdi!
        </h2>
        <p className="mt-2 text-sm sm:text-base text-emerald-300 font-medium">
          Barcha 3 ta kabel to‘g‘ri portlarga ulandi va yopiq kontur hosil qilindi.
        </p>

        {/* Specs Box */}
        <div className="mt-6 p-4 rounded-2xl bg-[#0e1a38] border border-[#1e325c] text-left flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400">🔴 +5V Quvvat liniyasi:</span>
            <span className="font-mono font-bold text-emerald-400">FAOL (5.00V)</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400">⚫ GND Zamin liniyasi:</span>
            <span className="font-mono font-bold text-emerald-400">ULANGAN (0.00V)</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400">🔵 LED Signal boshqaruvi:</span>
            <span className="font-mono font-bold text-emerald-400">SIGNAL UZATILMOQDA</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 hover:border-slate-600"
          >
            <RotateCcw className="w-4 h-4" /> Qayta boshlash
          </button>

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm shadow-neon-green transition-all"
          >
            <Sparkles className="w-4 h-4" /> 3D Natijani tomosha qilish
          </button>
        </div>

      </div>
    </div>
  );
};
