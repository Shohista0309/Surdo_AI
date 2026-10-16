import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen, Clock, ArrowRight, MoveUpRight, Heart, Smile } from 'lucide-react';
import { AvatarGender, SignSequenceToken } from '../../../types';
import { Badge } from '../../common/Badge';
import { AnimationState } from './AvatarAnimationController';

interface SignSequencePlayerProps {
  tokens: SignSequenceToken[];
  gender: AvatarGender;
  animationState: AnimationState;
  currentIndex: number;
  onSelectSuggestion?: (word: string) => void;
}

export const SignSequencePlayer: React.FC<SignSequencePlayerProps> = ({
  tokens,
  gender,
  animationState,
  currentIndex,
  onSelectSuggestion
}) => {
  const avatarImgSrc = gender === 'female' ? '/women.jpg' : '/men.jpg';
  const avatarName = gender === 'female' ? 'Malika (Imo-ishora ustozi)' : 'Jasur (Imo-ishora ustozi)';

  const activeToken = tokens[currentIndex];
  const isSigning = animationState === 'signing';

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Avatar & Signing Presentation Card */}
      <div className="relative rounded-3xl overflow-hidden bg-surdo-cream border border-surdo-beige shadow-soft">
        {/* Avatar Image Container with Hand Frame */}
        <div className="relative w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-stone-900 to-surdo-forest flex items-center justify-center overflow-hidden">
          <img
            src={avatarImgSrc}
            alt={avatarName}
            className={`w-full h-full object-cover object-center filter contrast-[1.02] brightness-95 transition-transform duration-700 ${
              isSigning ? 'scale-[1.02]' : 'scale-100'
            }`}
          />

          {/* Ambient Lighting & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-surdo-darkest/85 via-transparent to-black/25 pointer-events-none" />

          {/* Dynamic Gesture Motion Overlay (Hand Focus Articulation) */}
          {isSigning && activeToken?.matchedSign && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
              {/* Outer pulse wave */}
              <span className="absolute w-48 h-48 rounded-full border-2 border-emerald-400/50 animate-ping duration-1000" />
              {/* Inner ambient glow */}
              <span className="absolute w-36 h-36 rounded-full border border-surdo-sage/70 animate-pulse duration-700" />

              {/* Directional Motion Hint Arrow Badge */}
              <div className="relative bg-surdo-darkest/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
                <MoveUpRight className="w-3.5 h-3.5" />
                <span>Harakat yo‘nalishi</span>
              </div>
            </div>
          )}

          {/* Avatar Name Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-surdo-darkest/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-surdo-cream text-xs">
            <span className={`w-2 h-2 rounded-full ${isSigning ? 'bg-emerald-400 animate-pulse' : 'bg-surdo-sage'}`} />
            <span className="font-semibold">{avatarName}</span>
          </div>

          {/* Two-hand visibility guarantee badge */}
          <div className="absolute top-4 right-4 z-10 bg-surdo-darkest/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-surdo-cream text-[11px] hidden sm:flex items-center gap-1">
            <span>🤲 Ikkala qo‘l va barcha barmoqlar to‘liq ochiq</span>
          </div>

          {/* Active Word Caption Banner */}
          {activeToken ? (
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surdo-darkest/85 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-surdo-cream flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-elevated">
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

              {/* State Pill */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  isSigning ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-surdo-sage'
                }`}>
                  {isSigning ? 'Harakatda...' : 'To‘xtatilgan'}
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-surdo-darkest/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-surdo-cream text-center">
              <p className="text-sm text-surdo-cream/90">
                Imo-ishorani namoyish qilish uchun yuqoridagi maydonga so‘z yozing yoki mikrofon orqali ayting.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Sign Instruction Card */}
      {activeToken && activeToken.matchedSign ? (
        <div className="p-6 bg-white rounded-3xl border border-surdo-beige shadow-soft space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surdo-brown">
                Imo-ishora anatomiyasi va yo‘riqnomasi
              </span>
              <h4 className="text-xl font-bold text-surdo-forest font-display mt-0.5">
                {activeToken.matchedSign.word}
              </h4>
            </div>
            <Badge variant="sage" size="sm">
              {activeToken.matchedSign.category}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-surdo-cocoa">
            <div className="p-3.5 bg-surdo-lightSage/50 rounded-2xl border border-surdo-sage/30">
              <span className="font-bold text-surdo-forest block mb-1">🤲 Qo‘l shakli (Daktil):</span>
              <p>{activeToken.matchedSign.handShape}</p>
            </div>
            <div className="p-3.5 bg-surdo-lightSage/50 rounded-2xl border border-surdo-sage/30">
              <span className="font-bold text-surdo-forest block mb-1">↔️ Harakat trayektoriyasi:</span>
              <p>{activeToken.matchedSign.movement}</p>
            </div>
            <div className="p-3.5 bg-surdo-sand/50 rounded-2xl border border-surdo-beige">
              <span className="font-bold text-surdo-forest block mb-1 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-surdo-green" /> Yuz ifodasi (Mimika):
              </span>
              <p>{activeToken.matchedSign.facialExpression}</p>
            </div>
            {activeToken.matchedSign.culturalContext && (
              <div className="p-3.5 bg-surdo-sand/50 rounded-2xl border border-surdo-beige">
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
                    <span className="w-5 h-5 rounded-full bg-surdo-lightGreen text-surdo-forest font-bold flex items-center justify-center shrink-0 text-[10px]">
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
        <div className="p-6 bg-amber-50/80 rounded-3xl border border-amber-200 text-amber-900 shadow-soft">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                "{activeToken.originalWord}" so‘zi bo‘yicha tasdiqlangan imo-ishora hozircha bazada mavjud emas
              </h4>
              <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
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
