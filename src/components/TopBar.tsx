import { useEffect, useState } from "react";
import { Bell, Palette, Menu } from "lucide-react";

import {
  useTheme,
  THEMES,
  type ThemeName,
} from "@/contexts/ThemeContext";

import { useAuth } from "@/contexts/AuthContext";

import { PowerMenu } from "@/components/PowerMenu";
import { GlobalSearch } from "@/components/GlobalSearch";

export function TopBar({
  onMobileMenu,
}: {
  onMobileMenu: () => void;
}) {
  const { theme, setTheme } = useTheme();

  const { user } = useAuth();

  const [time, setTime] = useState<Date | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());

    const t = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  // CLOSE MENUS GLOBALLY
  useEffect(() => {
    const closeMenu = () => {
      setOpen(false);
    };

    window.addEventListener(
      "bitos-close-menus",
      closeMenu
    );

    return () => {
      window.removeEventListener(
        "bitos-close-menus",
        closeMenu
      );
    };
  }, []);

  const toggleThemeMenu = () => {
    window.dispatchEvent(
      new CustomEvent("bitos-close-menus")
    );

    setTimeout(() => {
      setOpen((v) => !v);
    }, 0);
  };

  return (
    <header className="bitos-window mx-3 mt-3 flex items-center gap-2 px-3 py-2 relative z-[9999] overflow-visible">
      <button
        onClick={onMobileMenu}
        className="md:hidden bitos-btn !px-2 !py-1.5"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2 overflow-visible">
        {/* CLOCK */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-xs opacity-80 min-w-[110px] justify-end">
          {time && (
            <>
              <span>
                {time.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <span className="text-foreground/90 font-display text-base leading-none">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>

        {/* THEME MENU */}
        <div className="relative overflow-visible z-[99999]">
          <button
            onClick={toggleThemeMenu}
            className="bitos-btn !px-2"
            aria-label="Themes"
          >
            <Palette className="h-4 w-4" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bitos-window p-2 z-[999999] shadow-2xl overflow-visible origin-top-right animate-in fade-in slide-in-from-top-2">
              <div className="bitos-titlebar -mx-2 -mt-2 mb-2 text-xs">
                themes.cfg
              </div>

              <ul className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                {THEMES.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => {
                        setTheme(t.id as ThemeName);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors duration-150 hover:bg-secondary ${
                        theme === t.id
                          ? "bg-secondary"
                          : ""
                      }`}
                    >
                      <span className="flex gap-1">
                        {t.swatch.map((c, i) => (
                          <span
                            key={i}
                            className="h-3 w-3 rounded-full border border-border"
                            style={{
                              background: c,
                            }}
                          />
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

        {/* NOTIFICATIONS */}
        <button
          className="bitos-btn !px-2 hidden sm:inline-flex relative z-[99999]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* POWER MENU */}
        <PowerMenu />

        {/* USER */}
        <div
          className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border border-border flex items-center justify-center text-xs font-display"
          title={user?.email}
        >
          {(user?.displayName ||
            user?.email ||
            "?")
            .slice(0, 1)
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}
