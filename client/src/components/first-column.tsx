import { DashboardData } from '../types';
import { DashboardCard } from './dashboard-card';

import Brushing from '../assets/brushing.svg';
import Likes from '../assets/likes.svg';
import Meetings from '../assets/meetingsIcon.svg';
import Tasks from '../assets/tasks.svg';
import TimeSaved from '../assets/timesaved.svg';

interface FirstColumnProps {
  data: DashboardData | null;
}

export function FirstColumn({ data }: FirstColumnProps) {
  const timeSavedHours = data ? Math.floor(data.timeSaved / 60) : 0;
  const timeSavedDisplay = `${timeSavedHours}h`;

  return (
    <div className="flex flex-col gap-4 h-full">
      <DashboardCard
        title="Meetings Completed"
        value={data?.meetings.toString() ?? '...'}
        icon={<img src={Meetings} className="h-12 w-12" />}
      />
      <DashboardCard
        title="Tasks Completed"
        value={data?.tasks.toString() ?? '...'}
        icon={<img src={Tasks} className="h-12 w-12" />}
      />
      <DashboardCard
        title="Brushing Count"
        value={data?.brushing.toString() ?? '...'}
        icon={<img src={Brushing} className="h-12 w-12" />}
      />
      <DashboardCard
        title="Likes"
        value={data?.likes.toString() ?? '...'}
        icon={<img src={Likes} className="h-12 w-12" />}
      />
      <DashboardCard
        title="Time Saved"
        value={timeSavedDisplay}
        icon={<img src={TimeSaved} className="h-12 w-12" />}
      />
    </div>
  );
}
