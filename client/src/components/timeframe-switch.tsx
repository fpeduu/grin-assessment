import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface TimeframeSwitchProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
}

export function TimeframeSwitch({ timeframe, setTimeframe }: TimeframeSwitchProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={timeframe} 
      onValueChange={(value) => {
        if (value) setTimeframe(value);
      }}
      className="my-4"
    >
      <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
    </ToggleGroup>
  );
}
