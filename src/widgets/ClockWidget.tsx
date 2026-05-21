import { useEffect, useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Clock } from "lucide-react";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
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
