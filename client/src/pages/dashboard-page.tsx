import { useEffect, useState } from 'react';
import { FirstColumn } from '../components/first-column';
import { Header } from '../components/header';
import { SecondColumn } from '../components/second-column';
import { ThirdColumn } from '../components/third-column';
import { TimeframeSwitch } from '../components/timeframe-switch';
import { getDashboardData } from '../services/api';
import { DashboardData } from '../types';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(timeframe);
        setData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [timeframe]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col">
        <TimeframeSwitch timeframe={timeframe} setTimeframe={setTimeframe} />
        <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:grid-rows-1 mt-4 max-h-screen">
          <div className="lg:col-span-1">
            <FirstColumn data={data} />
          </div>
          <div className="lg:col-span-1">
            <SecondColumn data={data} />
          </div>
          <div className="lg:col-span-2">
            <ThirdColumn />
          </div>
        </div>
      </main>
    </div>
  );
}
