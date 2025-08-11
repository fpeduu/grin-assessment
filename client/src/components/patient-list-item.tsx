import * as Tooltip from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PatientListItemProps {
  patient: {
    id: string;
    name: string;
    satisfaction: 'positive' | 'neutral' | 'negative';
    lastCommunicationDate: string;
    scansCount?: number;
  };
}

export function PatientListItem({ patient }: PatientListItemProps) {
  const scansCount = patient.scansCount || Math.floor(Math.random() * 10) + 1;

  const comment = "Patient wasn't feeling comfortable with the aligners, leading to some negative feeling around the treatment and experiencing some tooth aches. Expecting smoother feeling.";

  return (
    <div className="grid grid-cols-4 items-center gap-4 p-3 hover:bg-muted/50 border-b border-muted-text pb-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://github.com/avatar/${patient.id}.png`}
            alt={patient.name}
          />
          <AvatarFallback className="bg-[#E6E6FA] text-foreground text-xs">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{patient.name}</span>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="text-[#969BA5]">Scans:</span> {scansCount}
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="text-[#969BA5]">Last comm.:</span> {new Date(patient.lastCommunicationDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        })}
      </div>

      <div className="relative group">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p className="text-sm text-[#969BA5] italic line-clamp-2 cursor-help">
                {comment}
              </p>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-white text-black border-2 border-blue-500 text-sm px-3 py-2 rounded shadow-lg z-50 max-w-xs"
                side="top"
                sideOffset={5}
              >
                <p className="text-sm">{comment}</p>
                <Tooltip.Arrow className="fill-foreground" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
}
