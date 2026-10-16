import { StudentProgressDemo, TeacherLessonDemo } from '../types';

export const demoTeacherStats = {
  totalStudents: 48,
  activeLessonsCount: 6,
  averageProgressPct: 78,
  totalQuizzesSubmitted: 142,
  topPerformingTopic: 'O‘zbek daktil alifbosi',
  needsAttentionTopic: 'Matematik sonlar (6-10)'
};

export const demoLessonsList: TeacherLessonDemo[] = [
  {
    id: 'tl-1',
    title: 'O‘zbek daktil alifbosi: Boshlang‘ich harflar (A, B, D, M, N)',
    subject: 'Daktilologiya',
    grade: '1–2 sinf',
    enrolledStudents: 32,
    avgScore: 92,
    status: 'Nashr qilingan',
    lastUpdated: '2026-10-14'
  },
  {
    id: 'tl-2',
    title: 'Matematik tasavvurlar: Sonlar va hisoblash (1 dan 10 gacha)',
    subject: 'Matematika',
    grade: '1–4 sinf',
    enrolledStudents: 28,
    avgScore: 74,
    status: 'Nashr qilingan',
    lastUpdated: '2026-10-12'
  },
  {
    id: 'tl-3',
    title: 'Kundalik muloqot odobi va hurmat iboralari',
    subject: 'Ijtimoiy ko‘nikma',
    grade: 'Umumiy guruh',
    enrolledStudents: 41,
    avgScore: 88,
    status: 'Nashr qilingan',
    lastUpdated: '2026-10-10'
  },
  {
    id: 'tl-4',
    title: 'Tabiat hodisalari va Fasllar: O‘zbekiston tabiati',
    subject: 'Tabiatshunoslik',
    grade: '2–5 sinf',
    enrolledStudents: 22,
    avgScore: 81,
    status: 'Nashr qilingan',
    lastUpdated: '2026-10-08'
  },
  {
    id: 'tl-5',
    title: 'O‘zbek xalq ertaklari: Vizual qahramonlar tasviri',
    subject: 'Adabiyot va San’at',
    grade: '3–4 sinf',
    enrolledStudents: 15,
    avgScore: 0,
    status: 'Qoralama',
    lastUpdated: '2026-10-15'
  }
];

export const demoStudentsList: StudentProgressDemo[] = [
  {
    id: 'std-1',
    fullName: 'Azizbek Rahimov',
    grade: '3-"A" sinf',
    completedLessons: 4,
    totalLessons: 4,
    averageScore: 96,
    lastActive: 'Bugun, 14:20',
    statusBadge: 'Namunali'
  },
  {
    id: 'std-2',
    fullName: 'Madinabonu Karimova',
    grade: '3-"A" sinf',
    completedLessons: 4,
    totalLessons: 4,
    averageScore: 92,
    lastActive: 'Bugun, 11:05',
    statusBadge: 'Namunali'
  },
  {
    id: 'std-3',
    fullName: 'Sardorbek Yo‘ldoshev',
    grade: '3-"A" sinf',
    completedLessons: 3,
    totalLessons: 4,
    averageScore: 82,
    lastActive: 'Kecha, 16:45',
    statusBadge: 'Faol'
  },
  {
    id: 'std-4',
    fullName: 'Zilola Ergasheva',
    grade: '2-"B" sinf',
    completedLessons: 2,
    totalLessons: 4,
    averageScore: 68,
    lastActive: '2 kun oldin',
    statusBadge: 'E’tibor kerak'
  },
  {
    id: 'std-5',
    fullName: 'Jasurbek Nurmatov',
    grade: '2-"B" sinf',
    completedLessons: 3,
    totalLessons: 4,
    averageScore: 85,
    lastActive: 'Bugun, 09:30',
    statusBadge: 'Faol'
  },
  {
    id: 'std-6',
    fullName: 'Mohinur Tursunova',
    grade: '4-"A" sinf',
    completedLessons: 4,
    totalLessons: 4,
    averageScore: 98,
    lastActive: 'Bugun, 15:10',
    statusBadge: 'Namunali'
  }
];

export const demoQuizAnalytics = [
  {
    questionSummary: 'Daktil alifboda qo‘l sathining to‘g‘ri joylashuvi',
    correctRate: 94,
    topic: 'Alifbo asoslari',
    difficulty: 'Oson'
  },
  {
    questionSummary: 'M va N harflaridagi pastga yo‘nalgan barmoqlar farqi',
    correctRate: 72,
    topic: 'Alifbo asoslari',
    difficulty: 'O‘rta'
  },
  {
    questionSummary: 'Imo-ishorada 1 dan 5 gacha sonlarda kaftning yo‘nalishi',
    correctRate: 88,
    topic: 'Matematika',
    difficulty: 'Oson'
  },
  {
    questionSummary: '6 dan 10 gacha sonlarda lab artikulyatsiyasining roli',
    correctRate: 64,
    topic: 'Matematika',
    difficulty: 'Qiyin'
  },
  {
    questionSummary: 'Hurmat ifodasi sifatida qo‘lning yurak ustiga qo‘yilishi',
    correctRate: 98,
    topic: 'Odob va Madaniyat',
    difficulty: 'Oson'
  }
];
