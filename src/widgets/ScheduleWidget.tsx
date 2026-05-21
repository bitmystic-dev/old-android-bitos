import { RetroWindow } from "@/components/RetroWindow";
import { CalendarDays, X } from "lucide-react";
import { useBitStore, toISODate } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function ScheduleWidget() {
  const events = useBitStore((s) => s.events);
  const deleteEvent = useBitStore((s) => s.deleteEvent);
  const today = toISODate();

  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date + (a.time ?? "") < b.date + (b.time ?? "") ? -1 : 1))
    .slice(0, 6);

  return (
    <RetroWindow
      title="today.cal"
      icon={<CalendarDays className="h-3.5 w-3.5" />}
      subtitle={upcoming.length ? `${upcoming.length} upcoming` : "no events"}
    >
      {upcoming.length === 0 ? (
        <div className="py-6 text-center">
          <div className="font-mono text-xs opacity-60 mb-2">// agenda empty</div>
          <p className="text-sm opacity-80">Schedule events from the planner.</p>
          <Link to="/planner" className="bitos-btn inline-flex mt-3">→ open planner</Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((e) => (
            <li
              key={e.id}
              className="group flex items-center gap-3 rounded-md border border-border p-2 bg-secondary/40"
            >
              <span className="font-display text-lg text-primary tabular-nums w-14 shrink-0">
                {e.time || "—"}
              </span>
              <span className="flex-1 text-sm truncate">
                <span className="opacity-60 mr-2 font-mono text-[10px]">
                  {e.date === today ? "today" : e.date.slice(5)}
                </span>
                {e.title}
              </span>
              {e.tag && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                  {e.tag}
                </span>
              )}
              <button
                onClick={() => deleteEvent(e.id)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </RetroWindow>
  );
}
