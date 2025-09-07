import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-2xl font-bold text-primary">Anthara</h1>
      <ThemeToggle />
    </header>
  );
}
