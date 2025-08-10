import { FileText } from 'lucide-react';
import { SatisfactionBar } from "./satisfaction-bar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DashboardData, Patient, Employee } from '../types';

interface SecondColumnProps {
  data: DashboardData | null;
}

const calculateSatisfaction = (satisfactionData: (Patient | Employee)[]) => {
  if (!satisfactionData || satisfactionData.length === 0) {
    return { green: 0, yellow: 0, red: 0 };
  }
  const total = satisfactionData.length;
  const positive = satisfactionData.filter(p => p.satisfaction === 'positive').length;
  const neutral = satisfactionData.filter(p => p.satisfaction === 'neutral').length;
  const negative = satisfactionData.filter(p => p.satisfaction === 'negative').length;

  return {
    green: (positive / total) * 100,
    yellow: (neutral / total) * 100,
    red: (negative / total) * 100,
  };
};

export function SecondColumn({ data }: SecondColumnProps) {
  const patientsSatisfaction = calculateSatisfaction(data?.patientsSatisfaction ?? []);
  const employeesSatisfaction = calculateSatisfaction(data?.employeesSatisfaction ?? []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="h-1/5">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructions Sent</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.instructionsSent ?? '...'}</div>
          </CardContent>
        </Card>
      </div>
      <div className="h-2/5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Employees Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <SatisfactionBar {...employeesSatisfaction} />
          </CardContent>
        </Card>
      </div>
      <div className="h-2/5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Patients Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <SatisfactionBar {...patientsSatisfaction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
