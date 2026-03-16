

# LifeOS — Personal Productivity Dashboard

## Important Note
You selected **New separate project**. Since I can only edit *this* project, I have two options:
1. **Build it here** under a `/lifeos` route (self-contained, won't interfere with Zymaxon pages)
2. **You create a new Lovable project** and paste this same prompt there

I'll plan for building it here under `/lifeos` so we can proceed immediately. You can always remix it into its own project later.

## Architecture

- **Routing**: `/lifeos` as entry point with nested sidebar navigation
- **State**: All data in localStorage via a custom `useLocalStorage` hook, structured for future Supabase migration
- **Layout**: Sidebar (shadcn Sidebar component) + main content area, dark mode toggle
- **Currency**: All financial values in ₦ (Nigerian Naira)

## File Structure

```text
src/
  pages/LifeOS.tsx              ← Layout shell with sidebar + outlet
  components/lifeos/
    LifeOSSidebar.tsx           ← Navigation sidebar (11 sections + tools)
    Dashboard.tsx               ← Overview widgets
    AcademicManager.tsx         ← Courses, study planner, exams, progress
    SiwesTracker.tsx            ← Logbook, report, slides, defence
    FYPManager.tsx              ← Chapters, slides, report, defence
    CareerTransition.tsx        ← Excel/SQL/PowerBI/Python learning + jobs
    SkillsCourses.tsx           ← Linux, Kubernetes, lesson checklists
    PersonalGrowth.tsx          ← Bible study, sermons, books, writing
    Finance.tsx                 ← Expenses, wishlist, savings (₦)
    ForexLearning.tsx           ← Classes, demo journal, bot tracker, P&L
    SocialMediaManager.tsx      ← Content calendar, scheduling, growth
    SpecialProjects.tsx         ← 72hr challenge, security experiments
    PomodoroTimer.tsx           ← Pomodoro with session tracking
    HabitTracker.tsx            ← Daily habits with streaks
    WeeklyReview.tsx            ← Reflection + goal progress charts
    DailySchedule.tsx           ← Time blocks (morning→night)
    shared/
      useLocalStorage.ts        ← Generic localStorage hook
      TaskItem.tsx              ← Reusable task with priority/deadline/progress
      ProgressCard.tsx          ← Reusable progress bar card
      types.ts                  ← All TypeScript interfaces
```

## Sections Summary

| # | Section | Key Features |
|---|---------|-------------|
| 1 | Dashboard | Today's tasks, deadlines, study hours, finance snapshot, habits, job apps |
| 2 | Academic Manager | 6 courses × 12 weeks, study planner, exam countdown, revision & past questions |
| 3 | SIWES Tracker | Logbook, report, slides, defence checklist with progress |
| 4 | FYP Manager | Ch1-3, slides, report, defence — progress bars + deadlines |
| 5 | Career Transition | Learning tracker (4 tools), schedule, projects, resume, portfolio, job tracker |
| 6 | Skills & Courses | Course list with deadlines, lesson checklists, notes |
| 7 | Personal Growth | Bible study, sermons, spiritual books, book writing tracker |
| 8 | Finance | Expense tracker, wishlist, savings goals — all in ₦ |
| 9 | Forex Learning | Classes, demo journal, trade analysis, bot dev, P&L |
| 10 | Social Media | 4 platforms, content calendar, post scheduling, growth metrics |
| 11 | Special Projects | Custom experiment tracking with timers |

## Productivity Tools (accessible from sidebar)
- **Pomodoro Timer**: 25/5 cycle, session count, sound notification
- **Habit Tracker**: Daily check-off grid with streak counting
- **Weekly Review**: Reflection form + recharts goal progress
- **Daily Schedule**: 5 time blocks with drag-priority tasks (priority, deadline, est. time, progress %)

## Task Model (shared across all sections)
```typescript
interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'important' | 'optional';
  deadline?: string;
  estimatedMinutes?: number;
  progressPercent: number;
  completed: boolean;
  timeBlock?: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
}
```

## Dark Mode
- Toggle in sidebar header using `next-themes` (already in dependencies)
- CSS variables already support dark mode in `index.css`

## Data Layer
- `useLocalStorage<T>(key, defaultValue)` hook for all persistence
- Each section gets its own localStorage key (e.g., `lifeos-academic`, `lifeos-finance`)
- Data shape designed so Supabase tables can mirror it later

## Implementation Approach
Since you chose "all at once," I'll build all 11 sections + 4 tools in a single implementation pass. Each section will be functional with add/edit/delete capabilities and progress tracking. Charts use `recharts` (already installed).

## What Gets Built
- 1 new page with sidebar layout
- ~20 new component files
- 1 shared types file + hooks
- 1 new route in App.tsx
- Full dark mode support
- All localStorage-backed CRUD operations

