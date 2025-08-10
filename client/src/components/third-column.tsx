import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { PatientListItem } from "./patient-list-item";

import { useState } from 'react';

interface ThirdColumnProps {
  data: {
    patientsSatisfaction: any[];
  } | null;
}

export function ThirdColumn({ data }: ThirdColumnProps) {
  const [filter, setFilter] = useState<string[]>([]);

  const filteredPatients = (data?.patientsSatisfaction || []).filter(patient => {
    if (filter.length === 0) return true;
    return filter.includes(patient.satisfaction);
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Overall Patients Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ToggleGroup 
          type="multiple" 
          className="justify-start mb-4"
          onValueChange={setFilter}
        >
          <ToggleGroupItem value="negative">Can be better</ToggleGroupItem>
          <ToggleGroupItem value="neutral">Neutral</ToggleGroupItem>
          <ToggleGroupItem value="positive">Positive</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex-grow space-y-4 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <PatientListItem key={patient.id} patient={patient} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
