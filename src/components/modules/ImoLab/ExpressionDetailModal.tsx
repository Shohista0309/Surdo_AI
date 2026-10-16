import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen, ExternalLink, ArrowRight, Layers, Smile } from 'lucide-react';
import { SignExpression } from '../../../types';
import { Modal } from '../../common/Modal';
import { Badge } from '../../common/Badge';

interface ExpressionDetailModalProps {
  expression: SignExpression | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInAssistant: (word: string) => void;
}

export const ExpressionDetailModal: React.FC<ExpressionDetailModalProps> = ({
  expression,
  isOpen,
  onClose,
  onOpenInAssistant
}) => {
  if (!expression) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expression.word}
      subtitle={`ImoLab lug‘at kartochkasi • ${expression.category}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Verification Status & Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-surdo-beige">
          <div className="flex items-center gap-2">
            {expression.isVerified ? (
              <Badge variant="verified" size="md" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
                Rasmiy tasdiqlangan o‘zbek imo-ishorasi
              </Badge>
            ) : (
              <Badge variant="demo" size="md" icon={<AlertCircle className="w-3.5 h-3.5 text-amber-600" />}>
                O‘quv namoyishi / Ekspert tekshiruvida
              </Badge>
            )}
          </div>
          <span className="text-xs font-semibold text-surdo-brown">
            Murakkablik: <strong className="text-surdo-forest">{expression.difficulty}</strong>
          </span>
        </div>

        {/* Meaning and Example Sentence */}
        <div className="p-4 bg-surdo-sand/40 rounded-2xl border border-surdo-beige space-y-2">
          <div>
            <span className="text-xs font-bold text-surdo-brown uppercase tracking-wider block">
              Ma’nosi va ifodasi:
            </span>
            <p className="text-sm font-medium text-surdo-darkest mt-0.5">
              {expression.meaning}
            </p>
          </div>
          <div className="pt-2 border-t border-surdo-beige/60">
            <span className="text-xs font-bold text-surdo-forest">Namunaviy gap: </span>
            <span className="text-xs text-surdo-cocoa italic">"{expression.exampleSentence}"</span>
          </div>
        </div>

        {/* Gesture Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-surdo-beige shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-surdo-forest text-xs font-bold">
              <span className="text-base">🤲</span> Qo‘l shakli (Daktil forma):
            </div>
            <p className="text-xs text-surdo-cocoa leading-relaxed">
              {expression.handShape}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-surdo-beige shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-surdo-forest text-xs font-bold">
              <span className="text-base">↔️</span> Harakat yo‘nalishi:
            </div>
            <p className="text-xs text-surdo-cocoa leading-relaxed">
              {expression.movement}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-surdo-beige shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-surdo-forest text-xs font-bold">
              <Smile className="w-4 h-4 text-surdo-green" /> Yuz ifodasi va Mimika:
            </div>
            <p className="text-xs text-surdo-cocoa leading-relaxed">
              {expression.facialExpression}
            </p>
          </div>

          {expression.culturalContext && (
            <div className="p-4 bg-white rounded-2xl border border-surdo-beige shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-surdo-forest text-xs font-bold">
                <span className="text-base">🇺🇿</span> Madaniy kontekst:
              </div>
              <p className="text-xs text-surdo-cocoa leading-relaxed">
                {expression.culturalContext}
              </p>
            </div>
          )}
        </div>

        {/* Step-by-step Execution */}
        {expression.steps && expression.steps.length > 0 && (
          <div className="p-4 bg-white rounded-2xl border border-surdo-beige shadow-xs">
            <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider block mb-3">
              Ketma-ket ijro bosqichlari:
            </span>
            <div className="space-y-2">
              {expression.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-surdo-darkest">
                  <span className="w-5 h-5 rounded-full bg-surdo-lightGreen text-surdo-forest font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="mt-0.5">{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA: Open in Sign Assistant */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-surdo-beige">
          <p className="text-xs text-surdo-brown">
            Ushbu iborani 3D yoki 2D avatarda sinab ko‘ring
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenInAssistant(expression.word);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>AI Yordamchida ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
