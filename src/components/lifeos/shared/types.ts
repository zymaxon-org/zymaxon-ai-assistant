export type Priority = 'critical' | 'important' | 'optional';
export type TimeBlock = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  deadline?: string;
  estimatedMinutes?: number;
  progressPercent: number;
  completed: boolean;
  timeBlock?: TimeBlock;
  category?: string;
}

export interface Course {
  id: string;
  name: string;
  weeklyProgress: boolean[]; // 12 weeks
  examDate?: string;
  revisionNotes: string;
  pastQuestions: string[];
  studyHours: number;
}

export interface SiwesItem {
  id: string;
  title: string;
  type: 'logbook' | 'report' | 'slides' | 'defence';
  progressPercent: number;
  notes: string;
}

export interface FYPSection {
  id: string;
  title: string;
  progressPercent: number;
  deadline?: string;
  notes: string;
}

export interface LearningTool {
  id: string;
  name: string;
  lessonsCompleted: number;
  totalLessons: number;
  notes: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  platform: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending';
  dateApplied: string;
  notes: string;
}

export interface SkillCourse {
  id: string;
  name: string;
  deadline?: string;
  lessons: { id: string; title: string; completed: boolean }[];
  notes: string;
}

export interface GrowthItem {
  id: string;
  type: 'bible' | 'sermon' | 'book' | 'writing';
  title: string;
  progressPercent: number;
  notes: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export interface WishlistItem {
  id: string;
  title: string;
  estimatedCost: number;
  purchased: boolean;
}

export interface ForexTrade {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  profitLoss?: number;
  date: string;
  notes: string;
}

export interface ForexClass {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'linkedin';
  content: string;
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface SocialMetric {
  platform: string;
  followers: number;
  engagement: number;
  date: string;
}

export interface SpecialProject {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  deadline?: string;
  tasks: Task[];
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings
}

export interface WeeklyReviewData {
  id: string;
  weekStart: string;
  wins: string;
  challenges: string;
  nextWeekGoals: string;
  rating: number;
}

export interface DailyScheduleItem {
  id: string;
  date: string;
  tasks: Task[];
}

export const TIME_BLOCKS: { key: TimeBlock; label: string; time: string }[] = [
  { key: 'morning', label: 'Morning', time: '6am – 9am' },
  { key: 'midday', label: 'Midday', time: '10am – 1pm' },
  { key: 'afternoon', label: 'Afternoon', time: '2pm – 5pm' },
  { key: 'evening', label: 'Evening', time: '6pm – 8pm' },
  { key: 'night', label: 'Night', time: '8pm – 10pm' },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: 'text-destructive',
  important: 'text-primary',
  optional: 'text-muted-foreground',
};

export const PRIORITY_BG: Record<Priority, string> = {
  critical: 'bg-destructive/10 border-destructive/30',
  important: 'bg-primary/10 border-primary/30',
  optional: 'bg-muted border-border',
};
