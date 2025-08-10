interface SatisfactionBarProps {
  green: number;
  yellow: number;
  red: number;
}

export function SatisfactionBar({ green, yellow, red }: SatisfactionBarProps) {
  return (
    <div className="flex h-4 w-full rounded-full overflow-hidden">
      <div style={{ width: `${red}%` }} className="bg-red-500"></div>
      <div style={{ width: `${yellow}%` }} className="bg-yellow-500"></div>
      <div style={{ width: `${green}%` }} className="bg-green-500"></div>
    </div>
  );
}
