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
      className="inline-flex items-center rounded-lg bg-white p-1 shadow-sm"
    >
      <ToggleGroupItem
        value="weekly"
        className="text-sm text-gray-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-600 data-[state=on]:font-semibold rounded-md data-[state=on]:shadow-sm"
      >
        7D
      </ToggleGroupItem>
      <ToggleGroupItem
        value="monthly"
        className="text-sm text-gray-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-600 data-[state=on]:font-semibold rounded-md data-[state=on]:shadow-sm"
      >
        30D
      </ToggleGroupItem>
      <ToggleGroupItem
        value="all"
        className="text-sm text-gray-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-600 data-[state=on]:font-semibold rounded-md data-[state=on]:shadow-sm"
      >
        All
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
