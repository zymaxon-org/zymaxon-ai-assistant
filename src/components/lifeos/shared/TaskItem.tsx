import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Clock } from 'lucide-react';
import { Task, PRIORITY_COLORS, PRIORITY_BG } from './types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onProgressChange?: (id: string, progress: number) => void;
}

export function TaskItem({ task, onToggle, onDelete, onProgressChange }: TaskItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${PRIORITY_BG[task.priority]} ${task.completed ? 'opacity-60' : ''}`}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </span>
          <Badge variant="outline" className={`text-[10px] capitalize ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {task.deadline && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
          {task.estimatedMinutes && (
            <span className="text-xs text-muted-foreground">{task.estimatedMinutes}min</span>
          )}
        </div>
        {onProgressChange && (
          <div className="mt-2 flex items-center gap-2">
            <Progress value={task.progressPercent} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground w-8">{task.progressPercent}%</span>
          </div>
        )}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(task.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
