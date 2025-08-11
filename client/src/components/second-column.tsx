import Instructions from '../assets/instructions.svg';
import { DashboardData, Employee, Patient } from '../types';
import { CenteredCard } from './centered-card';
import { DashboardCard } from './dashboard-card';
import { SatisfactionBar } from './satisfaction-bar';

interface SecondColumnProps {
  data: DashboardData | null;
}

const calculateSatisfaction = (satisfactionData: (Patient | Employee)[]) => {
  if (!satisfactionData || satisfactionData.length === 0) {
    return {
      green: 0,
      yellow: 0,
      red: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
    };
  }
  const total = satisfactionData.length;
  const positiveCount = satisfactionData.filter(
    (p) => p.satisfaction === 'positive',
  ).length;
  const neutralCount = satisfactionData.filter(
    (p) => p.satisfaction === 'neutral',
  ).length;
  const negativeCount = satisfactionData.filter(
    (p) => p.satisfaction === 'negative',
  ).length;

  return {
    green: (positiveCount / total) * 100,
    yellow: (neutralCount / total) * 100,
    red: (negativeCount / total) * 100,
    positiveCount,
    neutralCount,
    negativeCount,
  };
};

export function SecondColumn({ data }: SecondColumnProps) {
  const patientsSatisfaction = calculateSatisfaction(
    data?.patientsSatisfaction ?? [],
  );
  const employeesSatisfaction = calculateSatisfaction(
    data?.employeesSatisfaction ?? [],
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <DashboardCard
          title="Instructions Sent"
          value={data?.instructionsSent?.toString() ?? '...'}
          icon={<img src={Instructions} className="h-12 w-12" />}
        />
      </div>

      <div className="h-2/5">
        <CenteredCard
          title="Overall Employees Satisfaction"
          content={
            <SatisfactionBar
              {...employeesSatisfaction}
              description="Emotions are mixed among your employees.
You might want to reach out to some of them and find out what's on their mind."
            />
          }
        />
      </div>
      <div className="h-2/5">
        <CenteredCard
          title="Overall Patients Satisfaction"
          content={
            <SatisfactionBar
              {...patientsSatisfaction}
              description="Emotions are mixed among your patients.
You might want to reach out to some of them and find out what's on their mind."
            />
          }
        />
      </div>
    </div>
  );
}
