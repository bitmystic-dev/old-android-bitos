import { useEffect, useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Clock } from "lucide-react";

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";
  const date = now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
  return (
    <RetroWindow title="clock.exe" icon={<Clock className="h-3.5 w-3.5" />}>
      <div className="text-center py-2">
        <div className="font-display text-5xl sm:text-6xl tabular-nums tracking-wider cursor-blink text-primary">
          {time}
        </div>
        <div className="mt-2 text-xs font-mono opacity-70">{date}</div>
      </div>
    </RetroWindow>
  );
}
