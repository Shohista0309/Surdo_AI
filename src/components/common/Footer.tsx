import React from 'react';
import { AppModule } from '../../types';
import { SurdoLogoIcon } from './SurdoLogo';

interface FooterProps {
  onSelectModule?: (module: AppModule) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectModule }) => {
  return (
    <footer className="bg-surdo-darkest text-surdo-cream/80 border-t border-surdo-forest pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <SurdoLogoIcon size={32} />
              <span className="text-2xl font-black tracking-tight text-white font-display">
                SURDO AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-surdo-cream/70 leading-relaxed max-w-sm">
              O‘zbekistonda eshitishida nuqsoni bo‘lgan insonlar, ularning oilalari va o‘qituvchilar uchun qulay, inklyuziv ta’lim va imo-ishora muloqot platformasi.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-surdo-sage leading-relaxed max-w-sm">
              🇺🇿 <strong>Milliy qadriyatlar:</strong> Barcha imo-ishoralar va avatarlar O‘zbekiston madaniy kontekstiga mos ravishda ishlab chiqilmoqda.
            </div>
          </div>

          {/* Col 1: Ta'lim */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Ta’lim va Darslar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('darskoprik')}
                  className="hover:text-white transition-colors text-left"
                >
                  DarsKo‘prik
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('darskoprik')}
                  className="hover:text-white transition-colors text-left"
                >
                  Daktil alifbosi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('darskoprik')}
                  className="hover:text-white transition-colors text-left"
                >
                  Matematika va hisob
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('darskoprik')}
                  className="hover:text-white transition-colors text-left"
                >
                  Interaktiv testlar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Lug'at va Oila */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Muloqot vositalari
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('camera')}
                  className="hover:text-white transition-colors text-left font-semibold text-emerald-400"
                >
                  Kamera Tahlili (Sign-to-Speech)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('signassistant')}
                  className="hover:text-white transition-colors text-left"
                >
                  AI Sign Assistant (Nutqdan belgiga)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('imolab')}
                  className="hover:text-white transition-colors text-left"
                >
                  ImoLab Lug‘ati
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('oilasign')}
                  className="hover:text-white transition-colors text-left"
                >
                  OilaSign Mashqlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule && onSelectModule('teacher')}
                  className="hover:text-white transition-colors text-left"
                >
                  O‘qituvchi Kabineti
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Inklyuzivlik va Huquq */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Inklyuzivlik
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-surdo-cream/60">Maxsus ehtiyojlar uchun qulay</span>
              </li>
              <li>
                <span className="text-surdo-cream/60">Ekran o‘quvchilariga mos</span>
              </li>
              <li>
                <span className="text-surdo-cream/60">Yuqori kontrast va oson shrift</span>
              </li>
              <li>
                <span className="text-surdo-cream/60">Tijoriy bo‘lmagan ta’lim</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surdo-cream/60">
          <div>
            © {new Date().getFullYear()} SURDO AI. O‘zbekiston — Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-4">
            <span>Har bir inson uchun tushunarli dunyo.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
