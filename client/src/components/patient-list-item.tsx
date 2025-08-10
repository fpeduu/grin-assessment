import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PatientListItemProps {
  patient: {
    id: string;
    name: string;
    satisfaction: 'positive' | 'neutral' | 'negative';
    lastCommunicationDate: string;
  };
}

export function PatientListItem({ patient }: PatientListItemProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://github.com/avatar/${patient.id}.png`} alt={patient.name} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{patient.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${patient.satisfaction === 'positive' ? 'text-green-500' : patient.satisfaction === 'neutral' ? 'text-yellow-500' : 'text-red-500'}`}>
          {patient.satisfaction}
        </p>
        <p className="text-xs text-muted-foreground">Last comm: {new Date(patient.lastCommunicationDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
