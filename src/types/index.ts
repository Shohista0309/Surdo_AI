export type NavPage = 'landing' | 'app';

export type AppModule = 
  | 'overview'
  | 'darskoprik'
  | 'imolab'
  | 'oilasign'
  | 'signassistant'
  | 'camera'
  | 'teacher';

export type AvatarGender = 'female' | 'male';
export type AvatarViewMode = '2d' | '3d';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  visualContext?: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  explanation: string;
  signTip: string;
  keyPoints: string[];
  visualType: 'gesture' | 'concept' | 'rule';
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  durationMinutes: number;
  difficulty: 'Boshlang‘ich' | 'O‘rta' | 'Murakkab';
  shortDescription: string;
  fullDescription: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
  badgeEarned?: string;
}

export interface SignExpression {
  id: string;
  word: string;
  category: 'Salomlashish' | 'Oila' | 'Taomlar' | 'Maktab' | 'Hissiyotlar' | 'Tibbiyot' | 'Kundalik harakatlar';
  meaning: string;
  difficulty: 'Boshlang‘ich' | 'O‘rta' | 'Yuqori';
  isVerified: boolean; // Tasdiqlangan vs o'quv namoyishi
  handShape: string;
  movement: string;
  facialExpression: string;
  culturalContext?: string;
  exampleSentence: string;
  steps: string[];
}

export interface FamilyPracticeItem {
  id: string;
  category: 'Salomlashish' | 'Oila' | 'Maktab' | 'Oshxona' | 'Kundalik ehtiyojlar' | 'Hissiyotlar';
  titleUz: string;
  signPrompt: string;
  importanceWhy: string;
  practiceExercise: string;
  keySigns: string[];
  tipsForParents: string;
}

export interface StudentProgressDemo {
  id: string;
  fullName: string;
  grade: string;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  lastActive: string;
  statusBadge: 'Faol' | 'E’tibor kerak' | 'Namunali';
}

export interface TeacherLessonDemo {
  id: string;
  title: string;
  subject: string;
  grade: string;
  enrolledStudents: number;
  avgScore: number;
  status: 'Nashr qilingan' | 'Qoralama';
  lastUpdated: string;
}

export interface SignSequenceToken {
  originalWord: string;
  matchedSign?: SignExpression;
  isVerified: boolean;
  actionNote?: string;
}
