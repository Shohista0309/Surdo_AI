import React, { useState } from 'react';
import { Users, BookOpen, Award, CheckCircle, Plus, Filter, AlertCircle, BarChart3, Clock, Sparkles } from 'lucide-react';
import { TeacherLessonDemo, StudentProgressDemo } from '../../../types';
import { demoTeacherStats, demoLessonsList, demoStudentsList, demoQuizAnalytics } from '../../../data/teacherData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const TeacherDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'students' | 'analytics'>('lessons');
  const [lessons, setLessons] = useState<TeacherLessonDemo[]>(demoLessonsList);
  const [students] = useState<StudentProgressDemo[]>(demoStudentsList);
  const [selectedGrade, setSelectedGrade] = useState<string>('Barchasi');

  // New Lesson Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('Ona tili va Daktilologiya');
  const [newGrade, setNewGrade] = useState<string>('1–2 sinf');

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newLesson: TeacherLessonDemo = {
      id: `tl-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      grade: newGrade,
      enrolledStudents: 1,
      avgScore: 0,
      status: 'Qoralama',
      lastUpdated: 'Bugun'
    };

    setLessons([newLesson, ...lessons]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setLessons(
      lessons.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'Nashr qilingan' ? 'Qoralama' : 'Nashr qilingan';
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  const grades = ['Barchasi', '3-"A" sinf', '2-"B" sinf', '4-"A" sinf'];

  const filteredStudents = students.filter((s) => {
    return selectedGrade === 'Barchasi' || s.grade === selectedGrade;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Explicit MVP Demo Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-bold">O‘qituvchi Kabineti — Namoyish (Demo) Rejimi:</strong>
          <span className="ml-1 text-amber-900">
            Ushbu bo‘limdagi barcha o‘quvchi profillari, baholar va statistika ta’lim platformasining imkoniyatlarini ko‘rsatish uchun tuzilgan namunaviy (namoyish) ma’lumotlardir. Real o‘quvchilar shaxsiy ma’lumotlari bu yerda saqlanmaydi.
          </span>
        </div>
      </div>

      {/* Module Header and Stats Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surdo-beige shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="sage" size="md" className="mb-3">
              O‘qituvchi va Murabbiy Portali
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-bold text-surdo-forest font-display tracking-tight">
              O‘qituvchi Kabineti — Darslar va Natijalar Tahlili
            </h1>
            <p className="mt-3 text-sm sm:text-base text-surdo-brown leading-relaxed">
              Maxsus maktab-internatlar va inklyuziv sinf ustozlari uchun o‘quv jarayonini boshqarish, viktorinalar natijalarini monitoring qilish va har bir o‘quvchining o‘zlashtirish sur’atini kuzatish maydoni.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi dars qo‘shish</span>
          </button>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-surdo-beige/80">
          <div className="p-4 bg-surdo-sand/40 rounded-2xl border border-surdo-beige">
            <span className="text-xs text-surdo-brown font-semibold block">Jami o‘quvchilar</span>
            <div className="text-2xl sm:text-3xl font-bold text-surdo-forest mt-1 font-display">
              {demoTeacherStats.totalStudents} nafar
            </div>
            <span className="text-[11px] text-surdo-green font-medium">3 ta sinfda</span>
          </div>

          <div className="p-4 bg-surdo-sand/40 rounded-2xl border border-surdo-beige">
            <span className="text-xs text-surdo-brown font-semibold block">Faol darslar</span>
            <div className="text-2xl sm:text-3xl font-bold text-surdo-forest mt-1 font-display">
              {lessons.filter((l) => l.status === 'Nashr qilingan').length} ta
            </div>
            <span className="text-[11px] text-surdo-brown font-medium">
              {lessons.filter((l) => l.status === 'Qoralama').length} ta qoralama
            </span>
          </div>

          <div className="p-4 bg-surdo-sand/40 rounded-2xl border border-surdo-beige">
            <span className="text-xs text-surdo-brown font-semibold block">O‘rtacha o‘zlashtirish</span>
            <div className="text-2xl sm:text-3xl font-bold text-surdo-forest mt-1 font-display">
              {demoTeacherStats.averageProgressPct}%
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">+4% o‘tgan haftaga nisbatan</span>
          </div>

          <div className="p-4 bg-surdo-sand/40 rounded-2xl border border-surdo-beige">
            <span className="text-xs text-surdo-brown font-semibold block">Topshirilgan testlar</span>
            <div className="text-2xl sm:text-3xl font-bold text-surdo-forest mt-1 font-display">
              {demoTeacherStats.totalQuizzesSubmitted} ta
            </div>
            <span className="text-[11px] text-surdo-brown font-medium">89% muvaffaqiyatli</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-8 pt-4 border-t border-surdo-beige/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'lessons'
                ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                : 'bg-surdo-sand/60 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Darslar ro‘yxati ({lessons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'students'
                ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                : 'bg-surdo-sand/60 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>O‘quvchilar faolligi ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                : 'bg-surdo-sand/60 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Test savollari tahlili</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Lessons Management */}
      {activeTab === 'lessons' && (
        <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft overflow-hidden">
          <div className="p-6 border-b border-surdo-beige/80 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-surdo-forest font-display">
              Barcha o‘quv darslari
            </h3>
            <span className="text-xs text-surdo-brown">Holatni o‘zgartirish uchun tugmani bosing</span>
          </div>

          <div className="divide-y divide-surdo-beige/60">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surdo-sand/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="sage" size="sm">
                      {lesson.subject}
                    </Badge>
                    <span className="text-xs text-surdo-brown font-medium">
                      {lesson.grade}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-surdo-forest font-display">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-surdo-brown">
                    <span>O‘quvchilar: <strong>{lesson.enrolledStudents}</strong></span>
                    <span>O‘rtacha natija: <strong>{lesson.avgScore}%</strong></span>
                    <span>Oxirgi o‘zgarish: <strong>{lesson.lastUpdated}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(lesson.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      lesson.status === 'Nashr qilingan'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-stone-100 text-stone-700 border border-stone-300'
                    }`}
                  >
                    {lesson.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Students Roster */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-surdo-forest font-display">
                O‘quvchilar natijalari va faolligi
              </h3>
              <p className="text-xs text-surdo-brown mt-0.5">
                Namoyish ma’lumotlari bo‘yicha har bir o‘quvchining o‘zlashtirish foizi
              </p>
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {grades.map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGrade === gr
                      ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                      : 'bg-surdo-sand/70 text-surdo-darkest hover:bg-surdo-beige border border-surdo-beige'
                  }`}
                >
                  {gr}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surdo-beige text-surdo-forest uppercase tracking-wider text-[11px] font-bold">
                  <th className="pb-3">O‘quvchi</th>
                  <th className="pb-3">Sinf</th>
                  <th className="pb-3">Darslar</th>
                  <th className="pb-3">O‘rtacha ball</th>
                  <th className="pb-3">Oxirgi faollik</th>
                  <th className="pb-3">Maqomi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surdo-beige/60">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-surdo-sand/20 transition-colors">
                    <td className="py-3.5 font-bold text-surdo-forest">
                      {student.fullName}
                    </td>
                    <td className="py-3.5 text-surdo-brown font-medium">
                      {student.grade}
                    </td>
                    <td className="py-3.5 text-surdo-darkest">
                      {student.completedLessons} / {student.totalLessons}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-surdo-forest">{student.averageScore}%</span>
                        <div className="w-16 bg-surdo-beige/80 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-surdo-green h-full rounded-full"
                            style={{ width: `${student.averageScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-surdo-cocoa">
                      {student.lastActive}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.statusBadge === 'Namunali'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : student.statusBadge === 'Faol'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {student.statusBadge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Quiz Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl border border-surdo-beige shadow-soft p-6 space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-surdo-forest font-display">
              Test savollari bo‘yicha to‘g‘ri javoblar ulushi
            </h3>
            <p className="text-xs text-surdo-brown mt-0.5">
              Qaysi tushunchalar o‘quvchilar uchun qiyinlik tug‘dirayotganini aniqlash tahlili
            </p>
          </div>

          <div className="space-y-4">
            {demoQuizAnalytics.map((item, idx) => (
              <div key={idx} className="p-4 bg-surdo-sand/30 rounded-2xl border border-surdo-beige space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="font-bold text-surdo-forest text-sm">
                    {item.questionSummary}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="sage" size="sm">{item.topic}</Badge>
                    <span className="font-bold text-surdo-darkest">{item.correctRate}% to‘g‘ri</span>
                  </div>
                </div>

                <div className="w-full bg-surdo-beige/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.correctRate >= 80 ? 'bg-emerald-600' : item.correctRate >= 70 ? 'bg-amber-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.correctRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Lesson */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi dars rejasini yaratish"
        subtitle="O‘qituvchi boshqaruv paneliga yangi o‘quv moduli qo‘shish"
      >
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-surdo-forest block mb-1">
              Dars mavzusi:
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Masalan: Uy hayvonlari va ularning imo-ishoralari"
              className="w-full p-3 text-sm rounded-xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/20 text-surdo-darkest"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surdo-forest block mb-1">
                Fan / Yo‘nalish:
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/20 text-surdo-darkest"
              >
                <option value="Ona tili va Daktilologiya">Ona tili va Daktilologiya</option>
                <option value="Matematika">Matematika</option>
                <option value="Tabiatshunoslik">Tabiatshunoslik</option>
                <option value="Ijtimoiy ko‘nikmalar">Ijtimoiy ko‘nikmalar</option>
                <option value="San’at va Mehnat">San’at va Mehnat</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surdo-forest block mb-1">
                Sinf darajasi:
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-surdo-beige bg-surdo-sand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-surdo-forest/20 text-surdo-darkest"
              >
                <option value="1–2 sinf">1–2 sinf</option>
                <option value="3–4 sinf">3–4 sinf</option>
                <option value="5–7 sinf">5–7 sinf</option>
                <option value="Barcha yoshdagilar">Barcha yoshdagilar</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-surdo-beige flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-surdo-beige text-xs font-bold text-surdo-forest hover:bg-surdo-sand"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream text-xs font-bold shadow-sm"
            >
              Qoralamaga saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
