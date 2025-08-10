import { DashboardCard } from "./dashboard-card";
import { CheckCircle, Clock, Heart, ListChecks, Smile } from 'lucide-react';

interface FirstColumnProps {
  data: {
    meetings: number;
    tasks: number;
    brushing: number;
    timeSaved: number;
  } | null;
}

export function FirstColumn({ data }: FirstColumnProps) {
  const timeSavedHours = data ? Math.floor(data.timeSaved / 60) : 0;
  const timeSavedDisplay = `${timeSavedHours}h`;

  return (
    <div className="flex flex-col gap-4">
      <DashboardCard title="Meetings Completed" value={data?.meetings.toString() ?? '...'} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Tasks Completed" value={data?.tasks.toString() ?? '...'} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Brushing Count" value={data?.brushing.toString() ?? '...'} icon={<Smile className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Time Saved" value={timeSavedDisplay} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
    </div>
  );
}
