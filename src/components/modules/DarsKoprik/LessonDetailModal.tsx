import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lightbulb, PlayCircle, Clock, BarChart } from 'lucide-react';
import { Lesson } from '../../../types';
import { Modal } from '../../common/Modal';
import { Badge } from '../../common/Badge';

interface LessonDetailModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: () => void;
  savedScore?: number;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onStartQuiz,
  savedScore
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const step = lesson.steps[activeStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lesson.title}
      subtitle={`${lesson.subject} • ${lesson.gradeLevel}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="sage" size="sm">
            <Clock className="w-3 h-3" /> {lesson.durationMinutes} daqiqa
          </Badge>
          <Badge variant="outline" size="sm">
            <BarChart className="w-3 h-3" /> {lesson.difficulty}
          </Badge>
          {savedScore !== undefined && (
            <Badge variant="verified" size="sm">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Natija: {savedScore}%
            </Badge>
          )}
        </div>

        {/* Lesson Intro description */}
        <div className="p-4 bg-white rounded-2xl border border-surdo-beige text-xs sm:text-sm text-surdo-cocoa leading-relaxed">
          {lesson.fullDescription}
        </div>

        {/* Step Navigation Tabs */}
        <div>
          <span className="text-xs font-bold text-surdo-forest uppercase tracking-wider block mb-2">
            Dars bosqichlari:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {lesson.steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 min-w-[120px] p-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-2 ${
                  activeStep === idx
                    ? 'bg-surdo-forest text-surdo-cream border-surdo-forest shadow-sm'
                    : 'bg-white text-surdo-darkest border-surdo-beige hover:bg-surdo-sand'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                  activeStep === idx ? 'bg-white/20 text-white' : 'bg-surdo-lightGreen text-surdo-forest'
                }`}>
                  {st.stepNumber}
                </span>
                <span className="truncate">{st.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content Card */}
        {step && (
          <div className="bg-white p-5 rounded-2xl border border-surdo-beige shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-surdo-beige/60 pb-3">
              <h4 className="text-base font-bold text-surdo-forest font-display">
                {step.stepNumber}-qism: {step.title}
              </h4>
              <Badge variant="sage" size="sm">
                {step.visualType === 'gesture' ? 'Imo-ishora' : 'Qoida va Asos'}
              </Badge>
            </div>

            <p className="text-sm text-surdo-darkest leading-relaxed">
              {step.explanation}
            </p>

            {/* Practical Sign Tip */}
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Amaliy ko‘rsatma:</span>
                <span>{step.signTip}</span>
              </div>
            </div>

            {/* Key takeaway bullet points */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-surdo-brown block">Asosiy e’tibor beriladigan jihatlar:</span>
              {step.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-surdo-cocoa">
                  <span className="w-1.5 h-1.5 rounded-full bg-surdo-green shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Navigation & Quiz Launch Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surdo-beige/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-xl border border-surdo-beige text-xs font-semibold text-surdo-forest hover:bg-surdo-sand disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Oldingi qism
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, lesson.steps.length - 1))}
              disabled={activeStep === lesson.steps.length - 1}
              className="px-3 py-1.5 rounded-xl border border-surdo-beige text-xs font-semibold text-surdo-forest hover:bg-surdo-sand disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Keyingi qism
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartQuiz();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Interaktiv testni boshlash ({lesson.quiz.length} savol)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
