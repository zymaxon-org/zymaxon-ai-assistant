import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  progress: number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function ProgressCard({ title, progress, subtitle, icon }: ProgressCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-1">
          <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
