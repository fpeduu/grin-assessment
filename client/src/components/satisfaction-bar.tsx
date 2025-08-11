import NegativeIcon from '../assets/negative.svg';
import NeutralIcon from '../assets/neutral.svg';
import PositiveIcon from '../assets/positive.svg';

interface SatisfactionBarProps {
  green: number;
  yellow: number;
  red: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  description: string;
}

export function SatisfactionBar({
  green,
  yellow,
  red,
  positiveCount,
  neutralCount,
  negativeCount,
  description,
}: SatisfactionBarProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Icons and Counts */}
      <div className="flex justify-around text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <img src={NegativeIcon} alt="Negative" className="h-4 w-4" />
          <span>{negativeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={NeutralIcon} alt="Neutral" className="h-4 w-4" />
          <span>{neutralCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={PositiveIcon} alt="Positive" className="h-4 w-4" />
          <span>{positiveCount}</span>
        </div>
      </div>

      {/* Bar */}
      <div className="flex h-2 w-full rounded-full overflow-hidden">
        <div style={{ width: `${red}%` }} className="bg-red-500"></div>
        <div style={{ width: `${yellow}%` }} className="bg-yellow-500"></div>
        <div style={{ width: `${green}%` }} className="bg-green-500"></div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-muted-foreground">Can be better</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          <span className="text-muted-foreground">Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-muted-foreground">Positive</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
