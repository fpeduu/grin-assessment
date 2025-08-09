import { Smile } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Smile className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">Grin</span>
      </div>
    </header>
  );
}
