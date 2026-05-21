import { RetroWindow } from "@/components/RetroWindow";
import { CheckSquare, Flame, CalendarDays, StickyNote } from "lucide-react";
import { useBitStore, habitStreak, toISODate } from "@/lib/store";

export function StatsWidget() {
  const tasks = useBitStore((s) => s.tasks);
  const habits = useBitStore((s) => s.habits);
  const events = useBitStore((s) => s.events);
  const notes = useBitStore((s) => s.notes);

  const open = tasks.filter((t) => t.status !== "done").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length || 1;
  const completion = Math.round((done / total) * 100);

  const topStreak = habits.reduce((m, h) => Math.max(m, habitStreak(h)), 0);
  const today = toISODate();
  const todayEvents = events.filter((e) => e.date === today).length;
  const noteChars = notes.length;

  const stats = [
    { icon: CheckSquare, label: "DONE",   value: completion, suffix: "%", bar: completion },
    { icon: Flame,       label: "STREAK", value: topStreak,  suffix: "d", bar: Math.min(100, topStreak * 5) },
    { icon: CalendarDays,label: "TODAY",  value: todayEvents,suffix: "",  bar: Math.min(100, todayEvents * 20) },
    { icon: StickyNote,  label: "NOTES",  value: noteChars,  suffix: "",  bar: Math.min(100, noteChars / 5) },
  ];

  const empty = tasks.length === 0 && habits.length === 0 && events.length === 0 && notes.length === 0;

  return (
    <RetroWindow title="system.stat" subtitle={empty ? "awaiting input" : "vitals"}>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const I = s.icon;
          return (
            <div key={s.label} className="rounded-md border border-border p-3 bg-secondary/40">
              <div className="flex items-center justify-between text-[10px] font-mono opacity-70">
                <span>{s.label}</span>
                <I className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-display text-3xl text-primary">
                {s.value}
                <span className="text-base opacity-70">{s.suffix}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${s.bar}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[10px] font-mono opacity-60">
        {open} open · {done} done · {habits.length} habits
      </div>
    </RetroWindow>
  );
}
