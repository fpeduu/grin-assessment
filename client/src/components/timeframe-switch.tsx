import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function TimeframeSwitch() {
  return (
    <ToggleGroup type="single" defaultValue="30d" className="my-4">
      <ToggleGroupItem value="7d">7d</ToggleGroupItem>
      <ToggleGroupItem value="30d">30d</ToggleGroupItem>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
    </ToggleGroup>
  );
}
