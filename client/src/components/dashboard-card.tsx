import { Card, CardContent, CardTitle } from './ui/card';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card className="flex-grow bg-white border-none shadow-sm">
      <CardContent className="p-4 flex items-center gap-2">
        <div>{icon}</div>
        <div className="flex flex-col items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
