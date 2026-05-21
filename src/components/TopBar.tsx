import { useEffect, useState } from "react";
import { Search, Bell, Palette, Menu } from "lucide-react";
import { useTheme, THEMES, type ThemeName } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { PowerMenu } from "@/components/PowerMenu";

export function TopBar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [time, setTime] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bitos-window mx-3 mt-3 flex items-center gap-2 px-3 py-2">
      <button onClick={onMobileMenu} className="md:hidden bitos-btn !px-2 !py-1.5" aria-label="Open menu">
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-secondary/60 flex-1 max-w-md">
        <Search className="h-4 w-4 opacity-60" />
        <input
          placeholder="search bitos…"
          className="bg-transparent outline-none text-sm flex-1 placeholder:opacity-60 min-w-0"
        />
        <kbd className="hidden sm:inline text-[10px] font-mono opacity-60 border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-3 font-mono text-xs opacity-80">
          <span>{time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
          <span className="text-foreground/90 font-display text-base leading-none">
            {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="relative">
          <button onClick={() => setOpen((v) => !v)} className="bitos-btn !px-2" aria-label="Themes">
            <Palette className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 bitos-window p-2 z-50">
              <div className="bitos-titlebar -mx-2 -mt-2 mb-2 text-xs">themes.cfg</div>
              <ul className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                {THEMES.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => { setTheme(t.id as ThemeName); setOpen(false); }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-secondary ${theme === t.id ? "bg-secondary" : ""}`}
                    >
                      <span className="flex gap-1">
                        {t.swatch.map((c, i) => (
                          <span key={i} className="h-3 w-3 rounded-full border border-border" style={{ background: c }} />
                        ))}
                      </span>
                      <span>{t.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="bitos-btn !px-2 hidden sm:inline-flex" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>

        <PowerMenu />

        <div
          className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border border-border flex items-center justify-center text-xs font-display"
          title={user?.email}
        >
          {(user?.displayName || user?.email || "?").slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
