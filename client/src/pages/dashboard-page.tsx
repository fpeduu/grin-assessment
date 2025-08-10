import axios from "axios";
import { useEffect, useState } from "react";
import { FirstColumn } from "../components/first-column";
import { Header } from "../components/header";
import { SecondColumn } from "../components/second-column";
import { ThirdColumn } from "../components/third-column";
import { TimeframeSwitch } from "../components/timeframe-switch";

interface DashboardData {
  meetings: number;
  brushing: number;
  instructionsSent: number;
  tasks: number;
  timeSaved: number;
  patientsSatisfaction: any[];
  employeesSatisfaction: any[];
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/dashboard?timeframe=${timeframe}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [timeframe]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        <TimeframeSwitch timeframe={timeframe} setTimeframe={setTimeframe} />
        <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <FirstColumn data={data} />
          </div>
          <div className="lg:col-span-1">
            <SecondColumn data={data} />
          </div>
          <div className="lg:col-span-2">
            <ThirdColumn data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
