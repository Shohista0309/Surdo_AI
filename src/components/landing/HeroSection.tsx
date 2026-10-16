import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface HeroSectionProps {
  onStartApp: () => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartApp,
  onExploreFeatures
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Subtle organic background gradient circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-surdo-sage/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-surdo-beige/40 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-surdo-beige shadow-xs backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider">
              O‘zbekistonda birinchi milliy inklyuziv platforma
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-surdo-forest font-display tracking-tight leading-[1.12] animate-in fade-in slide-in-from-bottom-3 duration-700">
            Har bir inson uchun <br className="hidden sm:inline" />
            <span className="text-surdo-green italic font-normal">tushunarli dunyo.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-surdo-brown max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
            SURDO AI — eshitishida nuqsoni bo‘lgan vatandoshlarimiz, ularning oila a’zolari hamda ustozlar uchun mo‘ljallangan zamonaviy ta’lim, muloqot va imo-ishora intellektual ekotizimi.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <button
              onClick={onStartApp}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-base shadow-elevated hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all group"
            >
              <span>Boshlash</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/80 hover:bg-white text-surdo-forest font-bold text-base border border-surdo-beige shadow-soft hover:shadow-md transition-all"
            >
              <span>Imkoniyatlarni ko‘rish</span>
            </button>
          </div>

          {/* Trust Points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-surdo-cocoa font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-surdo-green" />
              O‘zbek daktil alifbosi va lug‘ati
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-surdo-green" />
              Milliy 3D va 2D avatarlar
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-surdo-green" />
              Ro‘yxatdan o‘tish talab etilmaydi
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
