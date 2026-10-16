import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, RefreshCw, AlertCircle, Box, Image as ImageIcon, Camera, ArrowRight, Volume2 } from 'lucide-react';
import { AvatarGender, AvatarViewMode, SignSequenceToken } from '../../../types';
import { analyzeTextForSigns, quickPromptPresets } from '../../../data/verifiedSigns';
import { isSpeechRecognitionSupported, createSpeechRecognizer } from '../../../utils/speechRecognition';
import { SignSequencePlayer } from './SignSequencePlayer';
import { AvatarViewer3D } from './AvatarViewer3D';
import { AvatarAnimationController, AnimationState } from './AvatarAnimationController';
import { Badge } from '../../common/Badge';

interface SignAssistantViewProps {
  onNavigateToCamera?: () => void;
}

export const SignAssistantView: React.FC<SignAssistantViewProps> = ({ onNavigateToCamera }) => {
  const [inputText, setInputText] = useState<string>('Assalomu alaykum, rahmat');
  const [gender, setGender] = useState<AvatarGender>('female');
  const [viewMode, setViewMode] = useState<AvatarViewMode>('2d');
  const [tokens, setTokens] = useState<SignSequenceToken[]>([]);
  const [verifiedCount, setVerifiedCount] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  // Animation controller state
  const [animState, setAnimState] = useState<AnimationState>('idle');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const playTimerRef = useRef<any>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    handleAnalyze('Assalomu alaykum, rahmat');
  }, []);

  // Autoplay loop through tokens based on speed
  useEffect(() => {
    if (animState === 'signing' && tokens.length > 0) {
      const stepDuration = Math.round(3200 / speed);
      playTimerRef.current = setTimeout(() => {
        if (currentIndex < tokens.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          if (isLooping) {
            setCurrentIndex(0);
          } else {
            setAnimState('completed');
          }
        }
      }, stepDuration);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [animState, currentIndex, tokens.length, speed, isLooping]);

  const handleAnalyze = (textToAnalyze: string) => {
    const result = analyzeTextForSigns(textToAnalyze);
    setTokens(result.tokens);
    setVerifiedCount(result.verifiedCount);
    setTotalTokens(result.totalTokens);
    setCurrentIndex(0);
    if (result.tokens.length > 0) {
      setAnimState('idle');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze(inputText);
    setAnimState('signing');
  };

  const handleToggleSpeech = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      setAnimState('idle');
      return;
    }

    setSpeechError(null);
    setAnimState('listening');

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setInputText(transcript);
        handleAnalyze(transcript);
      },
      (err) => {
        setSpeechError(err);
        setIsListening(false);
        setAnimState('idle');
      },
      () => {
        setIsListening(false);
        setAnimState('idle');
      }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (e) {
        setSpeechError("Mikrofonni ishga tushirishda xatolik yuz berdi.");
        setIsListening(false);
        setAnimState('idle');
      }
    }
  };

  const handleSelectPreset = (phrase: string) => {
    setInputText(phrase);
    handleAnalyze(phrase);
    setAnimState('signing');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Two-Way Communication Banner */}
      {onNavigateToCamera && (
        <div className="bg-gradient-to-r from-surdo-forest to-surdo-green text-surdo-cream p-5 rounded-3xl shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-surdo-sage tracking-wider">
                Ikki tomonlama inklyuziv muloqot
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Kamera orqali imo-ishorani matn va ovozga aylantirish
              </h3>
            </div>
          </div>

          <button
            onClick={onNavigateToCamera}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-surdo-forest hover:bg-surdo-cream font-bold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto shrink-0"
          >
            <span>Kamera orqali aniqlashga o‘tish</span>
            <ArrowRight className="w-4 h-4 text-surdo-green" />
          </button>
        </div>
      )}

      {/* Module Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="max-w-3xl">
          <Badge variant="sage" size="md" className="mb-3">
            Yo‘nalish A: Nutq/Matn → Imo-ishora
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
            AI Sign Assistant — O‘zbekcha Nutq va Matnni Imo-ishoraga Aylantirish
          </h1>
          <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
            Istalgan o‘zbekcha matnni yozing yoki mikrofon orqali ayting. Bizning milliy avatarimiz (Malika yoki Jasur) tasdiqlangan o‘zbek imo-ishora lug‘ati asosida harakatlar ketma-ketligini namoyish etadi.
          </p>
        </div>

        {/* Avatar & View Selector Bar */}
        <div className="mt-6 pt-6 border-t border-surdo-beige/80 flex flex-wrap items-center justify-between gap-4">
          {/* Avatar Character Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider">
              Avatar:
            </span>
            <div className="flex bg-surdo-sand/80 p-1 rounded-2xl border border-surdo-beige">
              <button
                onClick={() => setGender('female')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                <img src="/women.jpg" alt="Malika" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                <span>Malika (Ayol)</span>
              </button>
              <button
                onClick={() => setGender('male')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                <img src="/men.jpg" alt="Jasur" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                <span>Jasur (Erkak)</span>
              </button>
            </div>
          </div>

          {/* 2D vs 3D View Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider">
              Ko‘rinish:
            </span>
            <div className="flex bg-surdo-sand/80 p-1 rounded-2xl border border-surdo-beige">
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === '2d'
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2D Vizual</span>
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === '3d'
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'text-surdo-darkest hover:text-surdo-forest'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Model (GLB)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Column & Avatar Presentation Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Sentence Parser (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-3xl border border-surdo-beige shadow-soft">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="sign-input" className="text-xs font-bold uppercase tracking-wider text-surdo-forest">
                    O‘zbekcha matn yoki nutq:
                  </label>
                  <span className="text-xs text-surdo-brown">
                    {inputText.length} belgi
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    id="sign-input"
                    rows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Masalan: Assalomu alaykum, rahmat..."
                    className="w-full p-4 pr-12 text-sm sm:text-base rounded-2xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/30 focus:border-surdo-forest transition-all resize-none text-surdo-darkest placeholder:text-stone-400"
                  />
                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-xl transition-all shadow-sm ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-surdo-forest text-surdo-cream hover:bg-surdo-green'
                    }`}
                    title={isListening ? "Ovoz yozishni to‘xtatish" : "Ovoz bilan aytish (Mikrofon)"}
                    aria-label={isListening ? "Ovoz yozishni to‘xtatish" : "Ovoz bilan aytish"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Listening Notice */}
              {isListening && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Ovoz tinglanmoqda... Istalgan iborani o‘zbekcha aniq ayting.</span>
                </div>
              )}

              {/* Speech Error / Fallback */}
              {speechError && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Imo-ishorada ijro etish</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setTokens([]);
                    setAnimState('idle');
                  }}
                  className="p-3 text-surdo-forest/60 hover:text-surdo-forest hover:bg-surdo-sand rounded-2xl border border-surdo-beige transition-colors"
                  title="Tozalash"
                  aria-label="Matnni tozalash"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Presets */}
            <div className="mt-5 pt-5 border-t border-surdo-beige/60">
              <span className="text-xs font-bold text-surdo-brown block mb-2">
                Tezkor namunaviy iboralar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPromptPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 text-xs rounded-xl bg-surdo-sand/70 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige transition-colors font-medium text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modular Sequence Breakdown / Verification Status */}
          <div className="bg-white p-6 rounded-3xl border border-surdo-beige shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-surdo-forest font-display uppercase tracking-wider">
                Matn tahlili va Bog‘lanish
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-surdo-forest">
                  {verifiedCount} / {totalTokens}
                </span>
                <span className="text-xs text-surdo-brown">tasdiqlangan</span>
              </div>
            </div>

            {tokens.length === 0 ? (
              <p className="text-xs text-surdo-brown italic">
                Hali hech qanday matn kiritilmadi.
              </p>
            ) : (
              <div className="space-y-2">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setAnimState('signing');
                    }}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                      currentIndex === index
                        ? 'ring-2 ring-surdo-forest/40 bg-white shadow-xs'
                        : token.isVerified
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm">
                          {token.originalWord}
                        </span>
                        {token.isVerified ? (
                          <Badge variant="verified" size="sm">Lug‘atda mavjud</Badge>
                        ) : (
                          <Badge variant="demo" size="sm">Kutilmoqda</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] opacity-80 leading-normal">
                        {token.actionNote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Avatar Presentation Viewport & Animation Controller (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Animation Viewport */}
          {viewMode === '2d' ? (
            <SignSequencePlayer
              tokens={tokens}
              gender={gender}
              animationState={animState}
              currentIndex={currentIndex}
              onSelectSuggestion={(word) => {
                setInputText(word);
                handleAnalyze(word);
              }}
            />
          ) : (
            <AvatarViewer3D
              gender={gender}
              animationState={animState}
              activeSignName={tokens[currentIndex]?.matchedSign?.word || tokens[currentIndex]?.originalWord}
              speed={speed}
            />
          )}

          {/* Reusable Animation Controller */}
          <AvatarAnimationController
            state={animState}
            currentIndex={currentIndex}
            totalSteps={tokens.length}
            speed={speed}
            isLooping={isLooping}
            onPlay={() => setAnimState('signing')}
            onPause={() => setAnimState('paused')}
            onReplay={() => {
              setCurrentIndex(0);
              setAnimState('signing');
            }}
            onNextStep={() => {
              if (currentIndex < tokens.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            onPrevStep={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            }}
            onSelectStep={(idx) => {
              setCurrentIndex(idx);
              setAnimState('signing');
            }}
            onSpeedChange={(s) => setSpeed(s)}
            onToggleLoop={() => setIsLooping(!isLooping)}
            stepLabels={tokens.map((t) => t.originalWord)}
          />
        </div>
      </div>
    </div>
  );
};
