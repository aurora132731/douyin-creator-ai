import { Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../hooks/useTheme";

interface Props {
  theme: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  compact?: boolean;
}

export function ThemeToggle({ theme, onChange, compact }: Props) {
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-line bg-muted p-0.5"
      role="group"
      aria-label="外观模式"
    >
      <button
        type="button"
        onClick={() => onChange("light")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition ${
          !isDark
            ? "bg-card font-medium text-fg shadow-sm"
            : "text-fg-muted hover:text-fg"
        }`}
        title="浅色模式"
      >
        <Sun className="h-3.5 w-3.5" />
        {!compact && <span>浅色</span>}
      </button>
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition ${
          isDark
            ? "bg-inset font-medium text-fg shadow-sm"
            : "text-fg-muted hover:text-fg"
        }`}
        title="深色模式"
      >
        <Moon className="h-3.5 w-3.5" />
        {!compact && <span>深色</span>}
      </button>
    </div>
  );
}
