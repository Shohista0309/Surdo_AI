import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertCircle, Sparkles, BookOpen, Clock } from 'lucide-react';
import { AvatarGender, SignSequenceToken } from '../../../types';
import { Badge } from '../../common/Badge';

interface SignSequencePlayerProps {
  tokens: SignSequenceToken[];
  gender: AvatarGender;
  onSelectSuggestion?: (word: string) => void;
}

export const SignSequencePlayer: React.FC<SignSequencePlayerProps> = ({
  tokens,
  gender,
  onSelectSuggestion
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 0.75, 1
  const timerRef = useRef<any>(null);

  const avatarImgSrc = gender === 'female' ? '/women.jpg' : '/men.jpg';
  const avatarName = gender === 'female' ? 'Malika (Imo-ishora ustozi)' : 'Jasur (Imo-ishora ustozi)';

  // Total tokens with valid sign
  const activeToken = tokens[currentIndex];
  const hasTokens = tokens.length > 0;

  // Autoplay loop through tokens
  useEffect(() => {
    if (isPlaying && hasTokens) {
      const stepDuration = Math.round(3000 / speed);
      timerRef.current = setTimeout(() => {
        if (currentIndex < tokens.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentIndex(0);
        }
      }, stepDuration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, tokens.length, speed, hasTokens]);

  const handleTogglePlay = () => {
    if (!hasTokens) return;
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Avatar & Signing Presentation Card */}
      <div className="relative rounded-2xl overflow-hidden bg-surdo-cream border border-surdo-beige shadow-soft">
        {/* Avatar Image Container with Hand Frame */}
        <div className="relative w-full h-[400px] sm:h-[460px] bg-gradient-to-b from-stone-900 to-surdo-forest flex items-center justify-center overflow-hidden">
          <img
            src={avatarImgSrc}
            alt={avatarName}
            className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-95"
          />

          {/* Subtle Ambient Vignette & Highlights */}
          <div className="absolute inset-0 bg-gradient-to-t from-surdo-darkest/80 via-transparent to-black/20 pointer-events-none" />

          {/* Active Gesture Visual Focus Ripple (simulating motion dynamics) */}
          {isPlaying && activeToken?.matchedSign && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
              <span className="absolute w-44 h-44 rounded-full border-2 border-emerald-400/50 animate-ping duration-1000" />
              <span className="absolute w-32 h-32 rounded-full border border-surdo-sage/60 animate-pulse duration-700" />
            </div>
          )}

          {/* Avatar Name Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-surdo-darkest/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-surdo-cream text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{avatarName}</span>
          </div>

          {/* Active Word Caption Banner */}
          {activeToken ? (
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surdo-darkest/85 backdrop-blur-md p-4 rounded-xl border border-white/15 text-surdo-cream flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-elevated">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-surdo-sage font-bold">
                    Faol belgi ({currentIndex + 1}/{tokens.length}):
                  </span>
                  {activeToken.isVerified ? (
                    <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
                      Tasdiqlangan
                    </Badge>
                  ) : (
                    <Badge variant="demo" size="sm" icon={<AlertCircle className="w-3 h-3 text-amber-600" />}>
                      Namoyish / To‘liq emas
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white">
                  "{activeToken.matchedSign ? activeToken.matchedSign.word : activeToken.originalWord}"
                </h3>
                {activeToken.matchedSign && (
                  <p className="text-xs text-surdo-cream/80 mt-0.5 line-clamp-1">
                    {activeToken.matchedSign.meaning}
                  </p>
                )}
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-surdo-sage font-medium">
                  {isPlaying ? 'Ijro etilmoqda...' : 'To‘xtatilgan'}
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surdo-darkest/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-surdo-cream text-center">
              <p className="text-sm text-surdo-cream/90">
                Imo-ishorani namoyish qilish uchun yuqoridagi maydonga so‘z yozing yoki ovoz bilan ayting.
              </p>
            </div>
          )}
        </div>

        {/* Playback Controls Toolbar */}
        <div className="p-4 bg-white/90 border-t border-surdo-beige flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              disabled={!hasTokens}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                !hasTokens
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-surdo-forest hover:bg-surdo-green text-surdo-cream'
              }`}
              aria-label={isPlaying ? "Pauza" : "Ijro etish"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pauza' : 'Ijro etish'}</span>
            </button>

            <button
              onClick={handleReplay}
              disabled={!hasTokens}
              className="p-2.5 border border-surdo-forest/20 text-surdo-forest hover:bg-surdo-sage/20 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Qaytadan ko‘rsatish"
              aria-label="Qaytadan ko‘rsatish"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-surdo-brown flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Tezlik:
            </span>
            {[0.5, 0.75, 1].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  speed === s
                    ? 'bg-surdo-forest text-surdo-cream border-surdo-forest'
                    : 'bg-white text-surdo-forest border-surdo-beige hover:bg-surdo-sand'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Timeline Indicator */}
        {tokens.length > 1 && (
          <div className="px-4 pb-4 pt-1 bg-white/90 flex gap-1.5 overflow-x-auto">
            {tokens.map((token, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center truncate ${
                  currentIndex === idx
                    ? 'bg-surdo-forest text-surdo-cream border-surdo-forest shadow-sm'
                    : 'bg-surdo-sand/60 text-surdo-darkest border-surdo-beige hover:bg-surdo-beige'
                }`}
              >
                {token.originalWord}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Sign Instruction Card */}
      {activeToken && activeToken.matchedSign ? (
        <div className="p-5 bg-white rounded-2xl border border-surdo-beige shadow-soft">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">
                Imo-ishora anatomiyasi va yo‘riqnomasi
              </span>
              <h4 className="text-lg font-bold text-surdo-forest font-display">
                {activeToken.matchedSign.word}
              </h4>
            </div>
            <Badge variant="sage" size="sm">
              {activeToken.matchedSign.category}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-surdo-cocoa">
            <div className="p-3 bg-surdo-lightSage/50 rounded-xl border border-surdo-sage/30">
              <span className="font-bold text-surdo-forest block mb-1">🤲 Qo‘l shakli:</span>
              <p>{activeToken.matchedSign.handShape}</p>
            </div>
            <div className="p-3 bg-surdo-lightSage/50 rounded-xl border border-surdo-sage/30">
              <span className="font-bold text-surdo-forest block mb-1">↔️ Harakat trayektoriyasi:</span>
              <p>{activeToken.matchedSign.movement}</p>
            </div>
            <div className="p-3 bg-surdo-sand/50 rounded-xl border border-surdo-beige">
              <span className="font-bold text-surdo-forest block mb-1">😊 Yuz ifodasi (Mimika):</span>
              <p>{activeToken.matchedSign.facialExpression}</p>
            </div>
            {activeToken.matchedSign.culturalContext && (
              <div className="p-3 bg-surdo-sand/50 rounded-xl border border-surdo-beige">
                <span className="font-bold text-surdo-forest block mb-1">🇺🇿 Madaniy xususiyat:</span>
                <p>{activeToken.matchedSign.culturalContext}</p>
              </div>
            )}
          </div>

          {/* Step-by-step points */}
          {activeToken.matchedSign.steps && (
            <div className="mt-4 pt-3 border-t border-surdo-beige/60">
              <span className="text-xs font-bold text-surdo-forest block mb-2">Bosqichma-bosqich bajarish:</span>
              <div className="space-y-1.5">
                {activeToken.matchedSign.steps.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-surdo-darkest">
                    <span className="w-4 h-4 rounded-full bg-surdo-lightGreen text-surdo-forest font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeToken && !activeToken.matchedSign ? (
        /* Honest notice when no matching animation exists */
        <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900 shadow-soft">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                "{activeToken.originalWord}" so‘zi bo‘yicha tasdiqlangan imo-ishora hozircha bazada mavjud emas
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                SURDO AI soxta yoki tekshirilmagan imo-ishoralarni ko‘rsatmaydi. O‘zbekiston Kar-soqovlar jamiyati va soha mutaxassislari tomonidan tasdiqlangan yangi belgilar navbatma-navbat qo‘shilmoqda.
              </p>

              {onSelectSuggestion && (
                <div className="mt-3.5">
                  <span className="text-xs font-bold text-amber-950 block mb-1.5">
                    Mavjud tasdiqlangan iboralarni sinab ko‘ring:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Assalomu alaykum', 'Rahmat', 'Suv', 'Non', 'Kitob', 'Yordam bermoq'].map((suggest) => (
                      <button
                        key={suggest}
                        onClick={() => onSelectSuggestion(suggest)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-medium text-amber-900 transition-colors shadow-xs"
                      >
                        + {suggest}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
