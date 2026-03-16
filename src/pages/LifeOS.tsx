import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { LifeOSSidebar } from '@/components/lifeos/LifeOSSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/components/lifeos/Dashboard'));
const AcademicManager = lazy(() => import('@/components/lifeos/AcademicManager'));
const SiwesTracker = lazy(() => import('@/components/lifeos/SiwesTracker'));
const FYPManager = lazy(() => import('@/components/lifeos/FYPManager'));
const CareerTransition = lazy(() => import('@/components/lifeos/CareerTransition'));
const SkillsCourses = lazy(() => import('@/components/lifeos/SkillsCourses'));
const PersonalGrowth = lazy(() => import('@/components/lifeos/PersonalGrowth'));
const Finance = lazy(() => import('@/components/lifeos/Finance'));
const ForexLearning = lazy(() => import('@/components/lifeos/ForexLearning'));
const SocialMediaManager = lazy(() => import('@/components/lifeos/SocialMediaManager'));
const SpecialProjects = lazy(() => import('@/components/lifeos/SpecialProjects'));
const PomodoroTimer = lazy(() => import('@/components/lifeos/PomodoroTimer'));
const HabitTracker = lazy(() => import('@/components/lifeos/HabitTracker'));
const DailySchedule = lazy(() => import('@/components/lifeos/DailySchedule'));
const WeeklyReview = lazy(() => import('@/components/lifeos/WeeklyReview'));

const Loading = () => <div className="flex items-center justify-center h-40 text-muted-foreground">Loading...</div>;

export default function LifeOS() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <LifeOSSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4 bg-background sticky top-0 z-10">
            <SidebarTrigger className="mr-3" />
            <span className="text-sm font-display font-semibold text-foreground">LifeOS</span>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="academics" element={<AcademicManager />} />
                <Route path="siwes" element={<SiwesTracker />} />
                <Route path="fyp" element={<FYPManager />} />
                <Route path="career" element={<CareerTransition />} />
                <Route path="skills" element={<SkillsCourses />} />
                <Route path="growth" element={<PersonalGrowth />} />
                <Route path="finance" element={<Finance />} />
                <Route path="forex" element={<ForexLearning />} />
                <Route path="social" element={<SocialMediaManager />} />
                <Route path="projects" element={<SpecialProjects />} />
                <Route path="pomodoro" element={<PomodoroTimer />} />
                <Route path="habits" element={<HabitTracker />} />
                <Route path="schedule" element={<DailySchedule />} />
                <Route path="review" element={<WeeklyReview />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
