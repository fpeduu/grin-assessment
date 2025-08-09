import { DashboardCard } from "./dashboard-card";
import { CheckCircle, Clock, Heart, ListChecks, Smile } from 'lucide-react';

export function FirstColumn() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardCard title="Meetings Completed" value="120" icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Tasks Completed" value="85" icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Brushing Count" value="1,200" icon={<Smile className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Likes Count" value="500" icon={<Heart className="h-4 w-4 text-muted-foreground" />} />
      <DashboardCard title="Time Saved" value="25h" icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
    </div>
  );
}
