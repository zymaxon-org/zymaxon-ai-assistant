

# Add Supabase Backend to LifeOS

## Overview
Enable Lovable Cloud, add email authentication, create 18 database tables with RLS policies, and migrate all 15 components from localStorage to Supabase queries.

## Step 1: Enable Lovable Cloud + Auth
- Enable Lovable Cloud (Supabase backend)
- Set up basic email authentication (signup, login, password reset)
- Create an auth page at `/lifeos/auth` with login/signup form
- Protect all `/lifeos/*` routes behind auth — redirect to auth page if not logged in

## Step 2: Database Schema (single migration)
Create 18 tables, all with `user_id uuid references auth.users(id) on delete cascade not null` and RLS enabled:

| Table | Key Columns |
|-------|-------------|
| tasks | title, priority, deadline, estimated_minutes, progress_percent, completed, time_block, category |
| courses | name, weekly_progress (jsonb), exam_date, revision_notes, past_questions (jsonb), study_hours |
| siwes_items | title, type, progress_percent, notes |
| fyp_sections | title, progress_percent, deadline, notes |
| learning_tools | name, lessons_completed, total_lessons, notes |
| job_applications | company, role, platform, status, date_applied, notes |
| skill_courses | name, deadline, lessons (jsonb), notes |
| growth_items | type, title, progress_percent, notes |
| expenses | description, amount, category, date |
| savings_goals | title, target_amount, current_amount |
| wishlist_items | title, estimated_cost, purchased |
| forex_trades | pair, type, entry_price, exit_price, profit_loss, date, notes |
| forex_classes | title, completed, notes |
| social_posts | platform, content, scheduled_date, status |
| social_metrics | platform, followers, engagement, date |
| special_projects | title, description, progress_percent, deadline, tasks (jsonb) |
| habits | name, completed_dates (jsonb) |
| weekly_reviews | week_start, wins, challenges, next_week_goals, rating |

Each table gets one RLS policy: `user_id = auth.uid()` for ALL operations (select, insert, update, delete).

## Step 3: Data Layer Refactor
Replace `useLocalStorage` with Supabase client queries across all 15 components:

- Create a shared `useSupabaseData<T>(tableName)` hook that wraps common CRUD operations (fetch, insert, update, delete) with the Supabase client
- Each component switches from `useLocalStorage('lifeos-xxx', default)` to the new hook
- Use `@tanstack/react-query` (already installed) for caching, loading states, and optimistic updates

**Components to update** (all 15 in `src/components/lifeos/`):
Dashboard, AcademicManager, SiwesTracker, FYPManager, CareerTransition, SkillsCourses, PersonalGrowth, Finance, ForexLearning, SocialMediaManager, SpecialProjects, HabitTracker, DailySchedule, WeeklyReview, PomodoroTimer

## Step 4: Auth Guard + Layout Update
- Create `AuthProvider` context providing current user
- Wrap `/lifeos/*` routes in auth guard
- Add logout button to sidebar
- Show user email in sidebar header

## Files to Create
- `src/components/lifeos/Auth.tsx` — Login/signup page
- `src/components/lifeos/shared/useSupabaseData.ts` — Generic CRUD hook
- `src/components/lifeos/shared/AuthProvider.tsx` — Auth context + guard

## Files to Modify
- `src/pages/LifeOS.tsx` — Add auth guard wrapper
- `src/components/lifeos/LifeOSSidebar.tsx` — Add logout button
- All 15 lifeos components — Switch from useLocalStorage to useSupabaseData
- `src/App.tsx` — Add auth route

## Migration: 1 SQL migration with all 18 tables + RLS policies

