import { FirstColumn } from "../components/first-column";
import { Header } from "../components/header";
import { SecondColumn } from "../components/second-column";
import { ThirdColumn } from "../components/third-column";
import { TimeframeSwitch } from "../components/timeframe-switch";

export function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        <TimeframeSwitch />
        <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <FirstColumn />
          </div>
          <div className="lg:col-span-1">
            <SecondColumn />
          </div>
          <div className="lg:col-span-2">
            <ThirdColumn />
          </div>
        </div>
      </main>
    </div>
  );
}
