import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'Rejimlar',
    items: [
      { keys: ['S'], desc: 'Ushlash & Siljitish rejimi' },
      { keys: ['W'], desc: 'Sim Ulash rejimi' },
      { keys: ['D'], desc: 'Simni O\'chirish rejimi' },
      { keys: ['M'], desc: 'Multimetr Prob rejimi' },
      { keys: ['Esc'], desc: 'Ushlash rejimine qaytish' },
    ]
  },
  {
    category: 'Tanlangan Element',
    items: [
      { keys: ['R'], desc: 'Elementni 90° aylantirish' },
      { keys: ['Delete'], desc: 'Tanlangan elementni o\'chirish' },
      { keys: ['Backspace'], desc: 'Tanlangan elementni o\'chirish' },
    ]
  },
  {
    category: 'Tarix',
    items: [
      { keys: ['Ctrl', 'Z'], desc: 'Harakatni bekor qilish (Undo)' },
      { keys: ['Ctrl', 'Y'], desc: 'Harakatni qaytarish (Redo)' },
    ]
  },
  {
    category: '3D Sahna Navigatsiyasi',
    items: [
      { keys: ['Chap tugma + Drag'], desc: 'Sahni aylantirish (Orbit)' },
      { keys: ['O\'ng tugma + Drag'], desc: 'Sahni siljitish (Pan)' },
      { keys: ['Scroll'], desc: 'Yaqinlashtirish / Uzoqlashtirish' },
    ]
  },
  {
    category: 'Qo\'l Ishoralari (Veb-kamera)',
    items: [
      { keys: ['Qisish (Pinch)'], desc: 'Elementni olish / qo\'yish' },
      { keys: ['Qisish + Siljitish'], desc: 'Elementni 3D bo\'shliqdа harakatlantirish' },
      { keys: ['Sim rejimida: Qisish'], desc: 'Teshikda simni boshlash / tugatish' },
    ]
  },
];

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl mx-4 bg-[#070d19] border border-[#1e325c] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e325c] bg-[#0a1122]">
          <div className="flex items-center gap-2 text-cyan-300">
            <Keyboard className="w-5 h-5" />
            <span className="font-bold text-lg">Klaviatura va Ishoralar Yo'riqnomasi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {SHORTCUTS.map(section => (
            <div key={section.category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2">{section.category}</h3>
              <div className="space-y-1.5">
                {section.items.map(item => (
                  <div key={item.desc} className="flex items-center justify-between gap-4 py-1.5 px-3 rounded-lg hover:bg-slate-800/40">
                    <span className="text-sm text-slate-300">{item.desc}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, i) => (
                        <React.Fragment key={k}>
                          <kbd className="px-2 py-0.5 rounded-md bg-[#0b1328] border border-[#1e325c] text-cyan-300 text-xs font-mono shadow-inner">
                            {k}
                          </kbd>
                          {i < item.keys.length - 1 && (
                            <span className="text-slate-600 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1e325c] bg-[#0a1122] text-center text-xs text-slate-500">
          Ushbu oynani yopish uchun Esc tugmasini bosing yoki chetga bosing
        </div>
      </div>
    </div>
  );
};
