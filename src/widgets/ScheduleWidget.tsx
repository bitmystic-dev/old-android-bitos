import { RetroWindow } from "@/components/RetroWindow";
import { CalendarDays } from "lucide-react";

const events = [
  { time: "09:00", title: "Deep work — Novel", tag: "WRITE" },
  { time: "11:30", title: "Stand-up + code review", tag: "WORK" },
  { time: "14:00", title: "Syllabus: chapter 5", tag: "STUDY" },
  { time: "18:30", title: "Run + stretch", tag: "BODY" },
];

export function ScheduleWidget() {
  return (
    <RetroWindow title="today.cal" icon={<CalendarDays className="h-3.5 w-3.5" />} subtitle="agenda">
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.time} className="flex items-center gap-3 rounded-md border border-border p-2 bg-secondary/40">
            <span className="font-display text-lg text-primary tabular-nums w-14">{e.time}</span>
            <span className="flex-1 text-sm">{e.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{e.tag}</span>
          </li>
        ))}
      </ul>
    </RetroWindow>
  );
}
