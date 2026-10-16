import React, { useState, useEffect } from 'react';
import { BookOpen, Search, CheckCircle2, Clock, BarChart3, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { Lesson } from '../../../types';
import { sampleLessons } from '../../../data/lessonsData';
import { LessonDetailModal } from './LessonDetailModal';
import { QuizModal } from './QuizModal';
import { Badge } from '../../common/Badge';

export const DarsKoprikView: React.FC = () => {
  const [lessons] = useState<Lesson[]>(sampleLessons);
  const [selectedSubject, setSelectedSubject] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Local storage for completed lessons score
  const [scores, setScores] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('surdo_lesson_scores');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleSaveScore = (lessonId: string, score: number) => {
    const updated = { ...scores, [lessonId]: score };
    setScores(updated);
    try {
      localStorage.setItem('surdo_lesson_scores', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save score to localStorage', e);
    }
  };

  const subjects = ['Barchasi', ...Array.from(new Set(lessons.map((l) => l.subject)))];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject = selectedSubject === 'Barchasi' || lesson.subject === selectedSubject;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <Badge variant="sage" size="md" className="mb-3">
              Vizual Ta’lim
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
              DarsKo‘prik — Vizual Ta’lim va Interaktiv Darslar
            </h1>
            <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
              Karlar va eshitishida nuqsoni bo‘lgan o‘quvchilar uchun maxsus moslashtirilgan interaktiv darsliklar. Har bir dars vizual ko‘rgazmalar, imo-ishora yo‘riqnomalari va bilimlarni mustahkamlovchi viktorinalardan iborat.
            </p>
          </div>

          {/* Quick Progress Widget */}
          <div className="p-4 bg-surdo-sand/50 rounded-2xl border border-surdo-beige shrink-0 min-w-[200px] text-center">
            <span className="text-xs font-bold text-surdo-brown uppercase tracking-wider block">
              Sizning taraqqiyotingiz
            </span>
            <div className="text-3xl font-bold text-surdo-forest mt-1 font-display">
              {Object.keys(scores).length} / {lessons.length}
            </div>
            <p className="text-[11px] text-surdo-green mt-0.5">
              Tugatilgan darslar soni
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-6 border-t border-surdo-beige/80 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                    : 'bg-surdo-sand/60 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dars yoki mavzu qidirish..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/20 text-surdo-darkest placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => {
          const score = scores[lesson.id];
          const isCompleted = score !== undefined;

          return (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl border border-surdo-beige hover:border-surdo-sage/70 shadow-soft hover:shadow-elevated transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="sage" size="sm">
                    {lesson.subject}
                  </Badge>
                  {isCompleted ? (
                    <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
                      O‘zlashtirildi: {score}%
                    </Badge>
                  ) : (
                    <span className="text-xs text-surdo-brown font-medium">
                      {lesson.gradeLevel}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-surdo-forest group-hover:text-surdo-green transition-colors font-display">
                  {lesson.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-surdo-cocoa line-clamp-3 leading-relaxed">
                  {lesson.shortDescription}
                </p>

                {/* Lesson Info Stats */}
                <div className="flex items-center gap-4 mt-4 text-xs text-surdo-brown font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-surdo-forest" />
                    {lesson.durationMinutes} daqiqa
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-surdo-forest" />
                    {lesson.steps.length} qism
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-surdo-forest" />
                    {lesson.quiz.length} test savoli
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-surdo-beige/60 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLesson(lesson);
                    setIsDetailOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-surdo-forest hover:text-surdo-green transition-colors"
                >
                  <span>Darsni o‘rganish</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLesson(lesson);
                    setIsQuizOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream text-xs font-bold shadow-xs transition-colors"
                >
                  {isCompleted ? 'Testni qaytarish' : 'Test topshirish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-surdo-beige">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-surdo-forest">Mos keluvchi darslar topilmadi</h3>
          <p className="text-xs text-surdo-brown mt-1">Qidiruv so‘zini o‘zgartiring yoki boshqa fanni tanlang.</p>
        </div>
      )}

      {/* Lesson Detail Modal */}
      {activeLesson && (
        <LessonDetailModal
          lesson={activeLesson}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onStartQuiz={() => setIsQuizOpen(true)}
          savedScore={scores[activeLesson.id]}
        />
      )}

      {/* Quiz Modal */}
      {activeLesson && (
        <QuizModal
          lesson={activeLesson}
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onCompleted={(sc) => handleSaveScore(activeLesson.id, sc)}
        />
      )}
    </div>
  );
};
