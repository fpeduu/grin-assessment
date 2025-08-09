import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PatientListItemProps {
  patient: {
    name: string;
    avatarUrl: string;
    scans: number;
    lastComm: string;
    comment: string;
  };
}

export function PatientListItem({ patient }: PatientListItemProps) {
  return (
    <div className="flex items-center gap-4 py-2">
      <Avatar>
        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="grid grid-cols-4 gap-4 flex-grow items-center">
        <span className="font-medium col-span-1">{patient.name}</span>
        <span className="text-sm text-muted-foreground col-span-1">{patient.scans} scans</span>
        <span className="text-sm text-muted-foreground col-span-1">{patient.lastComm}</span>
        <p className="text-sm text-muted-foreground col-span-1 truncate">{patient.comment}</p>
      </div>
    </div>
  );
}
