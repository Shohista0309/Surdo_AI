import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle2, Circle, Users, Sparkles, BookOpen, HardDrive, Info, Share2, HelpCircle } from 'lucide-react';
import { FamilyPracticeItem } from '../../../types';
import { familyPracticeItems, parentQuickTips } from '../../../data/familyPracticeData';
import { Badge } from '../../common/Badge';

export const OilaSignView: React.FC = () => {
  const [items] = useState<FamilyPracticeItem[]>(familyPracticeItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');

  // Mastered phrase IDs saved in localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('surdo_oilasign_mastered');
      return saved ? JSON.parse(saved) : ['fp-1'];
    } catch {
      return ['fp-1'];
    }
  });

  const handleToggleMastered = (id: string) => {
    let next: string[];
    if (masteredIds.includes(id)) {
      next = masteredIds.filter((item) => item !== id);
    } else {
      next = [...masteredIds, id];
    }
    setMasteredIds(next);
    try {
      localStorage.setItem('surdo_oilasign_mastered', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const categories = [
    'Barchasi',
    'Salomlashish',
    'Oila',
    'Maktab',
    'Oshxona',
    'Kundalik ehtiyojlar',
    'Hissiyotlar'
  ];

  const filteredItems = items.filter((item) => {
    return selectedCategory === 'Barchasi' || item.category === selectedCategory;
  });

  const progressPct = Math.round((masteredIds.length / items.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="brown" size="md" className="mb-3">
              Oila va Mehr
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
              OilaSign — Oila A’zolari Uchun Kundalik Mashg‘ulotlar
            </h1>
            <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
              Eshitishida nuqsoni bo‘lgan farzandingiz yoki yaqiningiz bilan birinchi kundanoq samimiy tushunishish. Ota-onalar, aka-uka va opa-singillar uchun sodda va hayotiy amaliy mashqlar to‘plami.
            </p>
          </div>

          {/* Local Session Progress Card */}
          <div className="p-5 bg-surdo-sand/40 rounded-3xl border border-surdo-beige min-w-[260px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surdo-brown uppercase tracking-wider">
                Oilaviy o‘zlashtirish
              </span>
              <span className="text-xs font-bold text-surdo-forest">
                {masteredIds.length} / {items.length}
              </span>
            </div>

            <div className="w-full bg-surdo-beige h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-surdo-forest h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-surdo-brown">
              <HardDrive className="w-3.5 h-3.5 text-surdo-green shrink-0" />
              <span>Natijalar sizning qurilmangizda saqlanmoqda</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 pt-6 border-t border-surdo-beige/80 flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                  : 'bg-surdo-sand/60 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrase & Practice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isMastered = masteredIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between shadow-soft ${
                isMastered ? 'border-emerald-300/80 bg-emerald-50/20' : 'border-surdo-beige hover:border-surdo-sage/70'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="sage" size="sm">
                    {item.category}
                  </Badge>

                  {/* Toggle Mastered Button */}
                  <button
                    onClick={() => handleToggleMastered(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-surdo-sand text-surdo-brown border border-surdo-beige hover:bg-surdo-beige'
                    }`}
                  >
                    {isMastered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>O‘zlashtirildi</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-stone-400" />
                        <span>Mashq qilish</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Phrase Title */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-surdo-forest font-display leading-snug">
                    "{item.titleUz}"
                  </h3>
                  <p className="mt-1 text-xs text-surdo-brown font-medium">
                    {item.signPrompt}
                  </p>
                </div>

                {/* Practical Exercise Box */}
                <div className="p-4 rounded-2xl bg-surdo-sand/40 border border-surdo-beige/80 text-xs sm:text-sm text-surdo-darkest space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-surdo-forest text-xs">
                    <Sparkles className="w-4 h-4 text-surdo-green" />
                    <span>Oilaviy amaliy mashg‘ulot:</span>
                  </div>
                  <p className="leading-relaxed text-surdo-cocoa">
                    {item.practiceExercise}
                  </p>
                </div>

                {/* Key Signs in this phrase */}
                <div>
                  <span className="text-xs font-bold text-surdo-forest block mb-1.5">
                    Asosiy imo-ishoralar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.keySigns.map((ks, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-surdo-beige text-xs text-surdo-darkest font-medium"
                      >
                        {ks}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Advice for parents */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950">
                  <span className="font-bold block mb-0.5">Ota-onaga tavsiya:</span>
                  <span>{item.tipsForParents}</span>
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="mt-5 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs text-surdo-brown">
                <span>Ahamiyati: {item.importanceWhy.slice(0, 48)}...</span>
                <span className="font-semibold text-surdo-forest">
                  {isMastered ? '✓ Bajarildi' : 'Rejada'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidance Section for Families */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="max-w-2xl mb-6">
          <Badge variant="sage" size="md" className="mb-2">
            Ekspert Yo‘riqnomasi
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-surdo-forest font-display">
            Eshitishida nuqsoni bo‘lgan farzandi bor ota-onalar uchun oltin qoidalar
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-surdo-brown">
            Muloqot to‘sig‘ini yengish va farzandingiz bilan samimiy do‘stlik o‘rnatish sirlari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parentQuickTips.map((tip, idx) => (
            <div key={idx} className="p-4 bg-surdo-sand/30 rounded-2xl border border-surdo-beige space-y-1">
              <div className="flex items-center gap-2 text-surdo-forest font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-surdo-lightGreen text-surdo-forest flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <span>{tip.title}</span>
              </div>
              <p className="text-xs text-surdo-cocoa leading-relaxed pl-7">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
