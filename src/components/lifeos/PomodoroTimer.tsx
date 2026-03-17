import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';

export default function PomodoroTimer() {
  // Pomodoro sessions kept in local state (ephemeral per-session counter)
  const [sessions, setSessions] = useState(0);
  const [isWork, setIsWork] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWork) {
        setSessions(prev => prev + 1);
        setIsWork(false);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsWork(true);
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, isWork]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = isWork ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100 : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  const reset = () => { setIsRunning(false); setIsWork(true); setTimeLeft(WORK_TIME); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-1">Focus sessions with 25/5 technique</p>
      </div>

      <div className="flex justify-center">
        <Card className="bg-card border-border w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center space-y-6">
            <div className="flex items-center gap-2">
              {isWork ? <Timer className="h-5 w-5 text-primary" /> : <Coffee className="h-5 w-5 text-accent-foreground" />}
              <span className="text-sm font-medium text-muted-foreground">{isWork ? 'Work Session' : 'Break Time'}</span>
            </div>

            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-muted" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} ${283 - progress * 2.83}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-foreground">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setIsRunning(!isRunning)} size="lg">
                {isRunning ? <Pause className="h-5 w-5 mr-1" /> : <Play className="h-5 w-5 mr-1" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="h-5 w-5 mr-1" /> Reset
              </Button>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{sessions}</span>
              <p className="text-sm text-muted-foreground">sessions completed today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
