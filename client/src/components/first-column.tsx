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
  const formatTimeSaved = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const timeSavedDisplay = data ? formatTimeSaved(data.timeSaved) : '...';

  return (
    <div className="flex flex-col gap-4 h-full">
      <DashboardCard
        title="Meetings Completed"
        value={data?.meetings.toString() ?? '...'}
        icon={<img src={Meetings} alt="Meetings" className="h-12 w-12" />}
      />
      <DashboardCard
        title="Tasks Completed"
        value={data?.tasks.toString() ?? '...'}
        icon={<img src={Tasks} alt="Tasks" className="h-12 w-12" />}
      />
      <DashboardCard
        title="Brushing Count"
        value={data?.brushing.toString() ?? '...'}
        icon={<img src={Brushing} alt="Brushing" className="h-12 w-12" />}
      />
      <DashboardCard
        title="Likes"
        value={data?.likes.toString() ?? '...'}
        icon={<img src={Likes} alt="Likes" className="h-12 w-12" />}
      />
      <DashboardCard
        title="Time Saved"
        value={timeSavedDisplay}
        icon={<img src={TimeSaved} alt="Time Saved" className="h-12 w-12" />}
      />
    </div>
  );
}
