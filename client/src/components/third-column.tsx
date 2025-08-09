import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { PatientListItem } from "./patient-list-item";

const patients = [
  {
    name: "John Doe",
    avatarUrl: "https://github.com/shadcn.png",
    scans: 5,
    lastComm: "2023-08-01",
    comment: "Patient is responding well to treatment.",
  },
  {
    name: "Jane Smith",
    avatarUrl: "https://github.com/shadcn.png",
    scans: 3,
    lastComm: "2023-08-02",
    comment: "Needs encouragement to complete daily tasks.",
  },
  {
    name: "Sam Wilson",
    avatarUrl: "https://github.com/shadcn.png",
    scans: 8,
    lastComm: "2023-07-28",
    comment: "Excellent progress, very motivated.",
  },
];

export function ThirdColumn() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Overall Patients Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ToggleGroup type="multiple" className="justify-start mb-4">
          <ToggleGroupItem value="better">Can be better</ToggleGroupItem>
          <ToggleGroupItem value="neutral">Neutral</ToggleGroupItem>
          <ToggleGroupItem value="positive">Positive</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex-grow space-y-4">
          {patients.map((patient) => (
            <PatientListItem key={patient.name} patient={patient} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
