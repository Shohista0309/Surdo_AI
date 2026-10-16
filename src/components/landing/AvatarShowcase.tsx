import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, User, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AvatarShowcaseProps {
  onOpenAssistant: () => void;
}

export const AvatarShowcase: React.FC<AvatarShowcaseProps> = ({ onOpenAssistant }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<'female' | 'male'>('female');

  return (
    <section className="py-16 md:py-24 bg-surdo-sand/40 border-y border-surdo-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="sage" size="md" className="mb-3">
            Milliy Vizual O‘zlik
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-surdo-forest font-display tracking-tight">
            O‘zbekistonlik Raqamli Avatarlar
          </h2>
          <p className="mt-4 text-sm sm:text-base text-surdo-brown leading-relaxed">
            SURDO AI xorijiy yoki begona personajlar emas, balki xalqimizning milliy liboslari, do‘ppisi, adras va beqasam matolari hamda samimiy imo-ishora madaniyatini o‘zida mujassam etgan haqiqiy o‘zbek avatarlarini yaratdi.
          </p>

          {/* Toggle buttons */}
          <div className="mt-6 inline-flex bg-white p-1.5 rounded-2xl border border-surdo-beige shadow-xs">
            <button
              onClick={() => setSelectedAvatar('female')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedAvatar === 'female'
                  ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                  : 'text-surdo-darkest hover:text-surdo-forest'
              }`}
            >
              <span>Malika (Ayol avatari)</span>
            </button>
            <button
              onClick={() => setSelectedAvatar('male')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedAvatar === 'male'
                  ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                  : 'text-surdo-darkest hover:text-surdo-forest'
              }`}
            >
              <span>Jasur (Erkak avatari)</span>
            </button>
          </div>
        </div>

        {/* Dual Showcase Display Card */}
        <div className="bg-white rounded-3xl border border-surdo-beige shadow-elevated overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Avatar Image Portrayal (7 cols) */}
          <div className="lg:col-span-7 relative h-[440px] sm:h-[540px] bg-gradient-to-b from-stone-900 to-surdo-forest overflow-hidden flex items-center justify-center">
            <img
              src={selectedAvatar === 'female' ? '/women.jpg' : '/men.jpg'}
              alt={selectedAvatar === 'female' ? 'Malika - O‘zbek ayol avatari' : 'Jasur - O‘zbek erkak avatari'}
              className="w-full h-full object-cover object-center filter contrast-[1.03]"
            />

            {/* Cultural Identity Badge */}
            <div className="absolute top-4 left-4 z-10 bg-surdo-darkest/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-surdo-cream text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">
                {selectedAvatar === 'female' ? 'Malika — O‘zbek ayol timsoli' : 'Jasur — O‘zbek erkak timsoli'}
              </span>
            </div>

            {/* Hand Room & Articulation Notice */}
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surdo-darkest/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-surdo-cream text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🤲</span>
                <span>Ikkala qo‘l va barmoqlar to‘liq ko‘rinadigan imo-ishora pozitsiyasi</span>
              </div>
              <Badge variant="verified" size="sm">Haqiqiy rasm</Badge>
            </div>
          </div>

          {/* Details & Cultural Rationale (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">
                Qahramon haqida
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-surdo-forest font-display mt-1">
                {selectedAvatar === 'female' ? 'Malika — Mehribon Ustoz' : 'Jasur — Ilhomlantiruvchi Murabbiy'}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                {selectedAvatar === 'female'
                  ? 'Ikat uslubidagi an’anaviy atlas ko‘ylak va nozik o‘zbek do‘ppisida tasvirlangan. Malika imo-ishoralarni mehrli va ravon ko‘rsatib, bolalar va oilalar uchun eng sevimli ta’lim hamrohiga aylanadi.'
                  : 'An’anaviy chopon, milliy naqshli do‘ppi va samimiy o‘zbek yigiti qiyofasida. Jasur daktil alifbosi, matematika va kundalik imo-ishoralarni qat’iy va aniq ifodalashda ustozlik qiladi.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-surdo-darkest">
                <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0 mt-0.5" />
                <span>Qo‘l harakatlari va barmoqlar uchun keng vizual maydon</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-surdo-darkest">
                <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0 mt-0.5" />
                <span>Yuz mimikasi va tabiiy lab artikulyatsiyasi uyg‘unligi</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-surdo-darkest">
                <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0 mt-0.5" />
                <span>3D GLB formatida 360° interaktiv ko‘rish imkoniyati</span>
              </div>
            </div>

            <div className="pt-4 border-t border-surdo-beige">
              <button
                onClick={onOpenAssistant}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all group"
              >
                <span>Avatarni AI Sign Assistant da sinash</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
