import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card className="flex-grow flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex-grow flex items-end">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
