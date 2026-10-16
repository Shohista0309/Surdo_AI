import React from 'react';
import { BookOpen, Search, Heart, Sparkles, GraduationCap, ArrowRight, Award, Compass, Volume2, ShieldCheck } from 'lucide-react';
import { AppModule } from '../../types';
import { Badge } from '../common/Badge';

interface AppOverviewViewProps {
  onSelectModule: (module: AppModule) => void;
  onNavigateToAssistantWithWord: (word: string) => void;
}

export const AppOverviewView: React.FC<AppOverviewViewProps> = ({
  onSelectModule,
  onNavigateToAssistantWithWord
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-surdo-forest via-surdo-forest to-surdo-darkest rounded-3xl p-6 sm:p-10 text-surdo-cream shadow-elevated">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="sage" size="md" className="mb-4">
            SURDO AI Boshqaruv Markazi
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white leading-tight">
            Xush kelibsiz! Har bir inson uchun tushunarli dunyoga qadam qo‘ying.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-surdo-cream/80 leading-relaxed">
            SURDO AI orqali siz o‘zbek imo-ishora tilini o‘rganishingiz, vizual darslarda qatnashishingiz, oilaviy muloqotni rivojlantirishingiz va nutqni imo-ishoraga aylantiruvchi sun’iy intellekt yordamchisidan foydalanishingiz mumkin.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectModule('signassistant')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-surdo-forest font-bold text-sm hover:bg-surdo-cream shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-surdo-green" />
              <span>AI Yordamchi bilan gaplashish</span>
            </button>
            <button
              onClick={() => onSelectModule('darskoprik')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 text-surdo-cream hover:bg-white/20 font-bold text-sm border border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Darslarni ko‘rish</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-current text-white">
            <path d="M45,-60C58,-51,68,-38,72,-23C76,-8,74,9,67,24C60,39,48,52,34,60C20,68,4,71,-12,69C-28,67,-44,60,-55,48C-66,36,-72,18,-71,1C-70,-16,-62,-32,-50,-42C-38,-52,-23,-56,-7,-57C9,-58,28,-56,45,-60Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {/* 5 Core Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-surdo-forest font-display">
            Asosiy platforma yo‘nalishlari
          </h2>
          <span className="text-xs text-surdo-brown font-medium">Barcha vositalar faol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: DarsKo'prik */}
          <div
            onClick={() => onSelectModule('darskoprik')}
            className="bg-white p-6 rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-surdo-lightGreen text-surdo-forest flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <Badge variant="sage" size="sm" className="mb-2">Ta’lim moduli</Badge>
              <h3 className="text-xl font-bold text-surdo-forest font-display group-hover:text-surdo-green transition-colors">
                DarsKo‘prik
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                Maxsus vizual darsliklar va interaktiv testlar. Daktil alifbosi, matematika, odob-axloq va tabiat tushunchalari.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs font-bold text-surdo-forest">
              <span>Darslarni boshlash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: ImoLab */}
          <div
            onClick={() => onSelectModule('imolab')}
            className="bg-white p-6 rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <Badge variant="brown" size="sm" className="mb-2">Lug‘at bazasi</Badge>
              <h3 className="text-xl font-bold text-surdo-forest font-display group-hover:text-surdo-green transition-colors">
                ImoLab
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                O‘zbek imo-ishora tilining qidiriladigan kutubxonasi. Tasdiqlangan harakatlar, qo‘l daktil shakllari va mimika qoidalari.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs font-bold text-surdo-forest">
              <span>Lug‘atni ko‘rish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: OilaSign */}
          <div
            onClick={() => onSelectModule('oilasign')}
            className="bg-white p-6 rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <Badge variant="outline" size="sm" className="mb-2">Oila amaliyoti</Badge>
              <h3 className="text-xl font-bold text-surdo-forest font-display group-hover:text-surdo-green transition-colors">
                OilaSign
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                Oila a’zolari uchun kundalik amaliy muloqot iboralari. Ota-onalar uchun tavsiyalar va qurilmangizda saqlanuvchi taraqqiyot.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs font-bold text-surdo-forest">
              <span>Oilaviy mashqlar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: AI Sign Assistant */}
          <div
            onClick={() => onSelectModule('signassistant')}
            className="bg-white p-6 rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <Badge variant="verified" size="sm" className="mb-2">AI Tarjima</Badge>
              <h3 className="text-xl font-bold text-surdo-forest font-display group-hover:text-surdo-green transition-colors">
                AI Sign Assistant
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                Nutq va matnni milliy 2D/3D avatarlar (Malika va Jasur) orqali imo-ishoraga aylantiruvchi intellektual yordamchi.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs font-bold text-surdo-forest">
              <span>Yordamchini ochish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Teacher Dashboard */}
          <div
            onClick={() => onSelectModule('teacher')}
            className="bg-white p-6 rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <Badge variant="sage" size="sm" className="mb-2">O‘qituvchi Kabineti</Badge>
              <h3 className="text-xl font-bold text-surdo-forest font-display group-hover:text-surdo-green transition-colors">
                O‘qituvchi Portali
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
                Sinflar va darslarni boshqarish, o‘quvchilar viktorinalari tahlili va ta’lim sifatini monitoring qilish paneli (Demo).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs font-bold text-surdo-forest">
              <span>Boshqaruvga o‘tish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Daily Sign Challenge Box */}
          <div className="bg-gradient-to-br from-surdo-sand/60 to-surdo-beige/60 p-6 rounded-3xl border border-surdo-beige flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🤲</span>
                <span className="text-xs font-bold uppercase tracking-wider text-surdo-forest">
                  Kunlik tavsiya etilgan ibora
                </span>
              </div>
              <h3 className="text-xl font-bold text-surdo-forest font-display">
                "Assalomu alaykum"
              </h3>
              <p className="mt-2 text-xs text-surdo-cocoa leading-relaxed">
                O‘ng qo‘l kafti yurak ustiga qo‘yiladi va suhbatdoshga samimiy tabassum bilan ehtirom bildiriladi.
              </p>
            </div>

            <button
              onClick={() => onNavigateToAssistantWithWord('Assalomu alaykum')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-surdo-forest text-surdo-cream text-xs font-bold hover:bg-surdo-green transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Avatarda ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
