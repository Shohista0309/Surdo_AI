import React from 'react';
import { BookOpen, Search, Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppModule } from '../../types';
import { Badge } from '../common/Badge';

interface FeatureShowcaseProps {
  onSelectModule: (module: AppModule) => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onSelectModule }) => {
  return (
    <section id="features-section" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="sage" size="md" className="mb-3">
            To‘liq Imkoniyatlar
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-surdo-forest font-display tracking-tight">
            Inklyuziv Ta’lim va Muloqot Tizimi
          </h2>
          <p className="mt-4 text-base text-surdo-brown leading-relaxed">
            SURDO AI oddiy tarjimon emas. Bu eshitishida nuqsoni bo‘lgan insonning butun hayotiy bosqichlarini — ta’limdan tortib oilaviy muloqotgacha qamrab oluvchi yaxlit ekotizimdir.
          </p>
        </div>

        {/* 4 Alternating Feature Highlights */}
        <div className="space-y-16">
          {/* Feature 1: DarsKo'prik */}
          <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-surdo-lightGreen text-surdo-forest flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <Badge variant="sage" size="sm">Vizual Ta’lim Moduli</Badge>
              <h3 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display">
                DarsKo‘prik: Har bir tushuncha ko‘z oldingizda
              </h3>
              <p className="text-sm sm:text-base text-surdo-cocoa leading-relaxed">
                Eshitmaydigan bolalar dunyoni 90% ko‘rish orqali idrok etadi. DarsKo‘prik daktil alifbosi, matematika, tabiat va ijtimoiy qoidalarni harakatli vizual kartalar va interaktiv sinov testlari orqali o‘rgatadi.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-surdo-darkest">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Bosqichma-bosqich imo-ishora ko‘rsatmalari
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Natijalarni darhol tekshiruvchi viktorinalar va tushuntirishlar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Yangi fanlar va mavzularni oson qo‘shish imkoniyati
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => onSelectModule('darskoprik')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all group"
                >
                  <span>DarsKo‘prikka o‘tish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surdo-sand/50 rounded-2xl p-6 border border-surdo-beige space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">Namunaviy dars:</span>
              <div className="bg-white p-4 rounded-xl border border-surdo-beige shadow-xs">
                <span className="text-xs text-surdo-green font-bold">Daktilologiya</span>
                <h4 className="font-bold text-surdo-forest text-sm mt-1">O‘zbek daktil alifbosi: Boshlang‘ich harflar</h4>
                <div className="mt-3 flex items-center justify-between text-xs text-surdo-brown">
                  <span>3 ta qism</span>
                  <span>Viktorina mavjud</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-surdo-beige shadow-xs">
                <span className="text-xs text-surdo-green font-bold">Matematika</span>
                <h4 className="font-bold text-surdo-forest text-sm mt-1">Sonlar va hisoblash (1 dan 10 gacha)</h4>
                <div className="mt-3 flex items-center justify-between text-xs text-surdo-brown">
                  <span>2 ta qism</span>
                  <span>Interaktiv test</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: ImoLab */}
          <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 bg-surdo-sand/50 rounded-2xl p-6 border border-surdo-beige space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">Lug‘at ko‘rinishi:</span>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-surdo-forest text-sm">Assalomu alaykum</span>
                    <p className="text-[11px] text-surdo-brown">Yurak ustidagi ochiq kaft</p>
                  </div>
                  <Badge variant="verified" size="sm">Tasdiqlangan</Badge>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-surdo-forest text-sm">Rahmat</span>
                    <p className="text-[11px] text-surdo-brown">Iyakdan mayin ochiluvchi kaft</p>
                  </div>
                  <Badge variant="verified" size="sm">Tasdiqlangan</Badge>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-surdo-forest text-sm">Do‘st (O‘rtoq)</span>
                    <p className="text-[11px] text-surdo-brown">Zanjirsimon barmoqlar</p>
                  </div>
                  <Badge variant="demo" size="sm">Namoyish</Badge>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <Badge variant="brown" size="sm">Imo-ishora Lug‘ati</Badge>
              <h3 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display">
                ImoLab: Tasdiqlangan O‘zbek Imo-ishora Lug‘ati
              </h3>
              <p className="text-sm sm:text-base text-surdo-cocoa leading-relaxed">
                Biz soxta va sun’iyimo-ishoralar tarqalishiga qarshimiz. ImoLab har bir belgi uchun qo‘l shakli, harakat vektori, yuz ifodasi va madaniy ma’nosini aniq ko‘rsatadi.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-surdo-darkest">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Tasdiqlangan va o‘quv namoyishidagi belgilarni aniq farqlash
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Toifalar (Salomlashish, Oila, Taomlar, Maktab va b.) bo‘yicha saralash
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Ekspertlar tomonidan doimiy yangilanib boruvchi ochiq arxitektura
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => onSelectModule('imolab')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all group"
                >
                  <span>ImoLab lug‘atiga o‘tish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Feature 3: OilaSign */}
          <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <Badge variant="outline" size="sm">Oila Uchun Ko‘mak</Badge>
              <h3 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display">
                OilaSign: Oilada tushunishish va mehr ko‘prigi
              </h3>
              <p className="text-sm sm:text-base text-surdo-cocoa leading-relaxed">
                Eshitishida nuqsoni bo‘lgan bolalarning 90% dan ortig‘i eshitadigan ota-onalar oilasida tug‘iladi. OilaSign ota-onalar va opa-singillarga kundalik hayotdagi oddiy iboralar va mehr ifodalarini amalda qo‘llashni o‘rgatadi.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-surdo-darkest">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Tonggi salomlashish, ovqatlanish, maktab va mehr izhorlari
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Qurilmangizda saqlanuvchi shaxsiy taraqqiyot hisoblagichi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Eshitmaydigan farzandi bor ota-onalar uchun amaliy tavsiyalar
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => onSelectModule('oilasign')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all group"
                >
                  <span>OilaSign bilan mashq qilish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surdo-sand/50 rounded-2xl p-6 border border-surdo-beige space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">Oila mashg‘uloti misoli:</span>
              <div className="bg-white p-4 rounded-xl border border-surdo-beige shadow-xs space-y-2">
                <h4 className="font-bold text-surdo-forest text-sm">"Xayrli tong, yaxshi uxlab turdingizmi?"</h4>
                <p className="text-xs text-surdo-cocoa">Tonggi uyg‘onishda mehrli salom va kayfiyatni so‘rash mashqi.</p>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 text-[11px]">
                  ✓ Bir tugma bilan "O‘zlashtirildi" deb belgilash
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: AI Sign Assistant */}
          <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 bg-surdo-forest text-surdo-cream rounded-2xl p-6 border border-surdo-darkest space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-sage">Avatar interfeysi:</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white/10 rounded-xl text-xs">
                  <span>Nutq / Matn kiritish</span>
                  <span className="text-emerald-400 font-bold">Mikrofon faol</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/10 rounded-xl text-xs">
                  <span>Avatar tanlovi</span>
                  <span>Malika & Jasur</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/10 rounded-xl text-xs">
                  <span>Ko‘rinish rejimi</span>
                  <span>2D Vizual + 3D GLB</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <Badge variant="verified" size="sm">Sun’iy Intellekt Yordamchisi</Badge>
              <h3 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display">
                AI Sign Assistant: Nutq va Matndan Imo-ishoraga
              </h3>
              <p className="text-sm sm:text-base text-surdo-cocoa leading-relaxed">
                Brauzeringiz mikrofonidan ovozli nutqni qabul qiladi yoki kiritilgan matnni tahlil qilib, o‘zbek imo-ishorasi ketma-ketligini milliy avatar orqali namoyish etadi.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-surdo-darkest">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Ovozli kiritish (Web Speech API) va tezkor matn tekshiruvi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Ijro tezligi (0.5x, 0.75x, 1x) va pauza / qaytarish boshqaruvi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-surdo-green shrink-0" />
                  Bazada bo‘lmagan so‘zlar haqida halol ogohlantirish va tavsiyalar
                </li>
              </ul>
              <div className="pt-4">
                <button
                  onClick={() => onSelectModule('signassistant')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all group"
                >
                  <span>AI Yordamchini ishga tushirish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
