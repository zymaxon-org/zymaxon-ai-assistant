import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useLocalStorage } from './shared/useLocalStorage';
import { WeeklyReviewData } from './shared/types';
import { Plus, ClipboardList, Star } from 'lucide-react';

export default function WeeklyReview() {
  const [reviews, setReviews] = useLocalStorage<WeeklyReviewData[]>('lifeos-reviews', []);
  const [current, setCurrent] = useState<Omit<WeeklyReviewData, 'id' | 'weekStart'>>({
    wins: '', challenges: '', nextWeekGoals: '', rating: 7,
  });

  const submit = () => {
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    setReviews(prev => [...prev, {
      id: crypto.randomUUID(),
      weekStart: monday.toISOString().split('T')[0],
      ...current,
    }]);
    setCurrent({ wins: '', challenges: '', nextWeekGoals: '', rating: 7 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Weekly Review</h1>
        <p className="text-muted-foreground mt-1">Reflect on your week and plan ahead</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" /> This Week's Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">🎉 Wins</label>
            <Textarea value={current.wins} onChange={e => setCurrent(p => ({ ...p, wins: e.target.value }))} placeholder="What went well?" className="min-h-[80px]" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">🧗 Challenges</label>
            <Textarea value={current.challenges} onChange={e => setCurrent(p => ({ ...p, challenges: e.target.value }))} placeholder="What was difficult?" className="min-h-[80px]" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">🎯 Next Week Goals</label>
            <Textarea value={current.nextWeekGoals} onChange={e => setCurrent(p => ({ ...p, nextWeekGoals: e.target.value }))} placeholder="What will you focus on?" className="min-h-[80px]" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">⭐ Week Rating: {current.rating}/10</label>
            <Slider value={[current.rating]} onValueChange={([v]) => setCurrent(p => ({ ...p, rating: v }))} min={1} max={10} step={1} />
          </div>
          <Button onClick={submit} className="w-full">Submit Review</Button>
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-display font-bold text-foreground">Past Reviews</h2>
          {[...reviews].reverse().map(r => (
            <Card key={r.id} className="bg-card border-border">
              <CardContent className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Week of {r.weekStart}</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary" /> {r.rating}/10
                  </span>
                </div>
                {r.wins && <p className="text-xs text-muted-foreground mb-1"><strong>Wins:</strong> {r.wins}</p>}
                {r.challenges && <p className="text-xs text-muted-foreground mb-1"><strong>Challenges:</strong> {r.challenges}</p>}
                {r.nextWeekGoals && <p className="text-xs text-muted-foreground"><strong>Goals:</strong> {r.nextWeekGoals}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
