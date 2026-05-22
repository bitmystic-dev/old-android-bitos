import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { PowerMenu } from "@/components/PowerMenu";
import { GlobalSearch } from "@/components/GlobalSearch";

export function TopBar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bitos-window mx-2 sm:mx-3 mt-2 sm:mt-3 flex items-center gap-2 px-2 sm:px-3 py-2 relative z-[40] overflow-visible min-w-0">
      <button
        onClick={onMobileMenu}
        className="md:hidden bitos-btn !px-2 !py-1.5 shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-3 font-mono text-xs opacity-80 min-w-[110px] justify-end">
          {time && (
            <>
              <span>{time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              <span className="text-foreground/90 font-display text-base leading-none">
                {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </>
          )}
        </div>
        <PowerMenu />
      </div>
    </header>
  );
}
