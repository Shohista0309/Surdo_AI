import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { Lesson, QuizQuestion } from '../../../types';
import { Modal } from '../../common/Modal';

interface QuizModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (score: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onCompleted
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const questions = lesson.quiz;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing after submitting
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finished quiz! Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          correct++;
        }
      });
      const pct = Math.round((correct / questions.length) * 100);
      setQuizFinished(true);
      if (pct >= 70) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      if (onCompleted) {
        onCompleted(pct);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Score calculation
  const totalCorrect = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctOptionIndex ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((totalCorrect / questions.length) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sinov testi: ${lesson.title}`}
      subtitle={`DarsKo‘prik interaktiv bilimlarni tekshirish`}
      maxWidth="xl"
    >
      {!quizFinished ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-surdo-brown">
            <span>Savol {currentQuestionIndex + 1} / {questions.length}</span>
            <span>To‘g‘ri javoblar: {totalCorrect} ta</span>
          </div>

          <div className="w-full bg-surdo-beige/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-surdo-forest h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white p-5 rounded-2xl border border-surdo-beige shadow-xs">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-surdo-lightGreen text-surdo-forest font-bold flex items-center justify-center shrink-0 text-xs">
                {currentQuestionIndex + 1}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-surdo-forest leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="mt-5 space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                const isCorrect = currentQ.correctOptionIndex === idx;

                let btnStyle = 'bg-surdo-sand/40 border-surdo-beige text-surdo-darkest hover:bg-surdo-sand';
                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-medium';
                  } else {
                    btnStyle = 'bg-white/40 border-stone-200 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/80 border border-surdo-beige/80 flex items-center justify-center text-xs font-bold text-surdo-forest shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {showExplanation && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {showExplanation && (
              <div className="mt-5 p-4 rounded-xl bg-surdo-lightSage/70 border border-surdo-sage/50 text-xs sm:text-sm text-surdo-darkest animate-in fade-in">
                <span className="font-bold text-surdo-forest block mb-1">
                  Izoh va tushuntirish:
                </span>
                <p className="leading-relaxed text-surdo-cocoa">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all"
              >
                <span>
                  {currentQuestionIndex < questions.length - 1 ? 'Keyingi savol' : 'Natijani ko‘rish'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Summary View */
        <div className="text-center py-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-surdo-lightGreen mx-auto flex items-center justify-center text-surdo-forest shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-surdo-forest font-display">
              Test yakunlandi!
            </h3>
            <p className="text-sm text-surdo-brown mt-1">
              Siz ushbu dars bo‘yicha bilimlaringizni muvaffaqiyatli sinovdan o‘tkazdingiz.
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-block p-6 bg-white rounded-2xl border border-surdo-beige shadow-soft">
            <span className="text-xs uppercase font-bold tracking-wider text-surdo-brown">
              Sizning natijangiz
            </span>
            <div className="text-4xl font-extrabold text-surdo-forest mt-1 font-display">
              {percentage}%
            </div>
            <p className="text-xs text-surdo-green mt-1 font-semibold">
              {totalCorrect} ta to‘g‘ri javob / {questions.length} tadan
            </p>
            {lesson.badgeEarned && percentage >= 70 && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                🏆 Noshir nishoni: {lesson.badgeEarned}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surdo-forest text-surdo-forest hover:bg-surdo-sand font-bold text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan topshirish</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-colors"
            >
              Darsga qaytish
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
