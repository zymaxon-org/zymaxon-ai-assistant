import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from './shared/useLocalStorage';
import { Habit } from './shared/types';
import { Plus, Trash2, Target, Flame, Check } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('lifeos-habits', []);
  const [newHabit, setNewHabit] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(prev => [...prev, { id: crypto.randomUUID(), name: newHabit, completedDates: [] }]);
    setNewHabit('');
  };

  const toggleDay = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const has = h.completedDates.includes(date);
      return { ...h, completedDates: has ? h.completedDates.filter(d => d !== date) : [...h.completedDates, date] };
    }));
  };

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (habit.completedDates.includes(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const dayLabels = last7Days.map(d => new Date(d).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Habit Tracker</h1>
        <p className="text-muted-foreground mt-1">Build consistent daily habits</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input placeholder="New habit..." value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} />
            <Button size="sm" onClick={addHabit}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {habits.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="py-8 text-center text-muted-foreground">Add habits to start tracking.</CardContent></Card>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-foreground pb-3 pr-4">Habit</th>
                    {dayLabels.map((d, i) => (
                      <th key={i} className="text-center text-xs text-muted-foreground pb-3 w-10">{d}</th>
                    ))}
                    <th className="text-center text-xs text-muted-foreground pb-3 w-16">Streak</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {habits.map(habit => {
                    const streak = getStreak(habit);
                    return (
                      <tr key={habit.id} className="border-t border-border">
                        <td className="py-2 pr-4">
                          <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-primary" /> {habit.name}
                          </span>
                        </td>
                        {last7Days.map(date => {
                          const done = habit.completedDates.includes(date);
                          return (
                            <td key={date} className="text-center py-2">
                              <button
                                onClick={() => toggleDay(habit.id, date)}
                                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                  done ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                }`}
                              >
                                {done && <Check className="h-4 w-4" />}
                              </button>
                            </td>
                          );
                        })}
                        <td className="text-center py-2">
                          <span className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                            {streak > 0 && <Flame className="h-3.5 w-3.5 text-destructive" />}
                            {streak}
                          </span>
                        </td>
                        <td className="py-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setHabits(prev => prev.filter(h => h.id !== habit.id))}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
