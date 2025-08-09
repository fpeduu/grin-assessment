import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SatisfactionBar } from "./satisfaction-bar";
import { FileText } from 'lucide-react';

export function SecondColumn() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="h-1/5">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructions Sent</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,000</div>
          </CardContent>
        </Card>
      </div>
      <div className="h-2/5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Employees Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <SatisfactionBar green={70} yellow={20} red={10} />
          </CardContent>
        </Card>
      </div>
      <div className="h-2/5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Patients Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <SatisfactionBar green={85} yellow={10} red={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
