import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, AlertCircle, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { SignExpression } from '../../../types';
import { sampleExpressions } from '../../../data/expressionsData';
import { ExpressionDetailModal } from './ExpressionDetailModal';
import { Badge } from '../../common/Badge';

interface ImoLabViewProps {
  onNavigateToAssistant: (word?: string) => void;
}

export const ImoLabView: React.FC<ImoLabViewProps> = ({ onNavigateToAssistant }) => {
  const [expressions] = useState<SignExpression[]>(sampleExpressions);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'demo'>('all');
  const [activeExpression, setActiveExpression] = useState<SignExpression | null>(null);

  const categories = [
    'Barchasi',
    'Salomlashish',
    'Oila',
    'Taomlar',
    'Maktab',
    'Hissiyotlar',
    'Tibbiyot',
    'Kundalik harakatlar'
  ];

  const filteredExpressions = expressions.filter((exp) => {
    const matchesCategory = selectedCategory === 'Barchasi' || exp.category === selectedCategory;
    const matchesVerification =
      verificationFilter === 'all'
        ? true
        : verificationFilter === 'verified'
        ? exp.isVerified
        : !exp.isVerified;
    const matchesSearch =
      exp.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.handShape.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVerification && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="max-w-3xl">
          <Badge variant="sage" size="md" className="mb-3">
            O‘zbek Imo-ishora Lug‘ati
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
            ImoLab — Imo-ishora Lug‘ati va Qoidalar Boshqarmasi
          </h1>
          <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
            O‘zbek imo-ishora tilining tasdiqlangan va o‘quv namoyishidagi ifodalar bazasi. Har bir ibora qo‘l shakli, harakat yo‘nalishi, yuz mimikasi hamda madaniy ildizlari bilan to‘liq tavsiflangan.
          </p>
        </div>

        {/* Verification Ethics Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-surdo-lightSage/60 border border-surdo-sage/40 flex items-start gap-3 text-xs sm:text-sm text-surdo-forest">
          <Sparkles className="w-5 h-5 text-surdo-green shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Ekspert me’yori:</strong> Biz sun’iy to‘qib chiqarilgan imo-ishoralarni qat’iyan rad etamiz. Tizimdagi har bir belgi "Rasmiy tasdiqlangan" yoki "O‘quv namoyishi" maqomi bilan ochiq belgilanadi.
          </p>
        </div>

        {/* Controls: Search and Filters */}
        <div className="mt-6 pt-6 border-t border-surdo-beige/80 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ibora, ma’no yoki qo‘l shakli bo‘yicha qidirish..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/20 text-surdo-darkest placeholder:text-stone-400"
              />
            </div>

            {/* Verification Status Filter */}
            <div className="flex bg-surdo-sand/70 p-1 rounded-2xl border border-surdo-beige self-start md:self-auto">
              <button
                onClick={() => setVerificationFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  verificationFilter === 'all'
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                Barchasi ({expressions.length})
              </button>
              <button
                onClick={() => setVerificationFilter('verified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  verificationFilter === 'verified'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                Tasdiqlangan ({expressions.filter((e) => e.isVerified).length})
              </button>
              <button
                onClick={() => setVerificationFilter('demo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  verificationFilter === 'demo'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                Namoyish ({expressions.filter((e) => !e.isVerified).length})
              </button>
            </div>
          </div>

          {/* Categories Horizontal Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
      </div>

      {/* Expressions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpressions.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setActiveExpression(exp)}
            className="bg-white rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all p-5 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Card Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="sage" size="sm">
                  {exp.category}
                </Badge>
                {exp.isVerified ? (
                  <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
                    Tasdiqlangan
                  </Badge>
                ) : (
                  <Badge variant="demo" size="sm" icon={<AlertCircle className="w-3 h-3 text-amber-600" />}>
                    Namoyish
                  </Badge>
                )}
              </div>

              {/* Expression Title */}
              <h3 className="text-xl font-bold text-surdo-forest group-hover:text-surdo-green transition-colors font-display">
                {exp.word}
              </h3>

              <p className="mt-1.5 text-xs text-surdo-brown font-medium line-clamp-2">
                {exp.meaning}
              </p>

              {/* Gesture Snippet */}
              <div className="mt-4 p-3 bg-surdo-sand/30 rounded-xl border border-surdo-beige/60 text-xs text-surdo-cocoa space-y-1">
                <div>
                  <span className="font-bold text-surdo-forest">Qo‘l: </span>
                  <span className="line-clamp-1">{exp.handShape}</span>
                </div>
                <div>
                  <span className="font-bold text-surdo-forest">Harakat: </span>
                  <span className="line-clamp-1">{exp.movement}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-4 border-t border-surdo-beige/60 flex items-center justify-between text-xs">
              <span className="text-surdo-brown font-semibold">
                Batafsil ma’lumot
              </span>
              <span className="text-surdo-forest group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExpressions.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-surdo-beige">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-surdo-forest">Mos keluvchi imo-ishora topilmadi</h3>
          <p className="text-xs text-surdo-brown mt-1">Boshqa kalit so‘z bilan qidiring yoki barcha toifalarni oching.</p>
        </div>
      )}

      {/* Detail Modal */}
      <ExpressionDetailModal
        expression={activeExpression}
        isOpen={Boolean(activeExpression)}
        onClose={() => setActiveExpression(null)}
        onOpenInAssistant={(word) => onNavigateToAssistant(word)}
      />
    </div>
  );
};
