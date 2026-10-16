import React from 'react';
import { Heart, Users, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface SocialImpactSectionProps {
  onStartApp: () => void;
}

export const SocialImpactSection: React.FC<SocialImpactSectionProps> = ({ onStartApp }) => {
  return (
    <section className="py-20 md:py-28 bg-surdo-cream border-t border-surdo-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-surdo-forest to-surdo-darkest rounded-3xl p-8 sm:p-14 text-surdo-cream shadow-elevated relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-surdo-green/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge variant="sage" size="md">
              Ijtimoiy Missiya va Inklyuziya
            </Badge>

            <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Muloqot — har bir insonning ajralmas huquqidir.
            </h2>

            <p className="text-base sm:text-lg text-surdo-cream/80 leading-relaxed">
              O‘zbekistonda 25 000 dan ortiq eshitishida nuqsoni bo‘lgan fuqarolar yashaydi. Ularning aksariyati maktabda, tibbiyot muassasalarida yoki hatto o‘z oilasida to‘laqonli tushunilmaslik muammosiga duch kelmoqda.
            </p>

            <p className="text-sm sm:text-base text-surdo-cream/75 leading-relaxed">
              Bizning vazifamiz — texnologiyalar, sun’iy intellekt va milliy madaniyat orqali bu to‘siqni yengib o‘tish, har bir kar yoki zaif eshituvchi bolaning to‘laqonli bilim olishi va jamiyatda o‘z o‘rnini topishiga ko‘maklashishdir.
            </p>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-surdo-cream/80 mt-1 font-medium">
                  Bepul va ochiq ta’lim imkoniyati
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400">
                  25 000+
                </div>
                <div className="text-xs sm:text-sm text-surdo-cream/80 mt-1 font-medium">
                  O‘zbekistonda yashaydigan eshitishi zaif insonlar
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400">
                  0 ta
                </div>
                <div className="text-xs sm:text-sm text-surdo-cream/80 mt-1 font-medium">
                  Ro‘yxatdan o‘tish yoki to‘lov to‘siqlari
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onStartApp}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-surdo-forest hover:bg-surdo-cream font-bold text-base shadow-lg transition-all"
              >
                <span>SURDO AI platformasiga kirish</span>
                <ArrowRight className="w-5 h-5 text-surdo-green" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
