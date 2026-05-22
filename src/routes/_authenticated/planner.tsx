import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ScheduleWidget } from "@/widgets/ScheduleWidget";
import { TasksWidget } from "@/widgets/TasksWidget";
import { RetroWindow } from "@/components/RetroWindow";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useBitStore, toISODate } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/planner")({
  component: Planner,
  head: () => ({ meta: [{ title: "Planner — BitOS" }] }),
});

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekStart(d = new Date()): Date {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
}

function Planner() {
  const events = useBitStore((s) => s.events);
  const addEvent = useBitStore((s) => s.addEvent);
  const deleteEvent = useBitStore((s) => s.deleteEvent);
  const [draft, setDraft] = useState<{ date: string } | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("");

  const weekStart = getWeekStart();
  const days = WEEK.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { label, date: toISODate(d), num: d.getDate() };
  });

  const submit = () => {
    if (!draft || !title.trim()) return;
    addEvent({ title: title.trim(), date: draft.date, time: time || undefined, tag: tag.trim().toUpperCase() || undefined });
    setTitle(""); setTime(""); setTag(""); setDraft(null);
  };

  return (
    <PageShell title="planner" subtitle="time is a canvas">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <RetroWindow title="week.view" subtitle="tap any day to add an event">
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
              <div className="grid grid-cols-7 gap-2 min-w-[560px]">
                {days.map((d) => {
                  const dayEvents = events.filter((e) => e.date === d.date);
                  const isToday = d.date === toISODate();
                  return (
                    <button
                      key={d.date}
                      onClick={() => setDraft({ date: d.date })}
                      className={`text-left rounded-md border p-2 min-h-32 hover:border-primary transition ${isToday ? "border-primary bg-primary/5" : "border-border bg-secondary/40"}`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-base">{d.label}</span>
                        <span className={`font-mono text-[10px] ${isToday ? "text-primary" : "opacity-60"}`}>{d.num}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {dayEvents.length === 0 && (
                          <div className="text-[10px] font-mono opacity-30">+ add</div>
                        )}
                        {dayEvents.map((e) => (
                          <div key={e.id} className="group flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                            {e.time && <span className="opacity-70 font-mono">{e.time}</span>}
                            <span className="truncate flex-1">{e.title}</span>
                            <span
                              role="button"
                              onClick={(ev) => { ev.stopPropagation(); deleteEvent(e.id); }}
                              className="opacity-60 sm:opacity-0 sm:group-hover:opacity-80"
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </RetroWindow>
        </div>

        <ScheduleWidget />
        <div className="lg:col-span-2"><TasksWidget /></div>
        <FocusTimer />
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm grid place-items-center p-4" onClick={() => setDraft(null)}>
          <div className="bitos-window w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="bitos-titlebar">
              <span className="text-sm">new.event — {draft.date}</span>
              <button onClick={() => setDraft(null)}><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="p-4 space-y-2">
              <input
                autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="event title…"
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <input
                  type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm outline-none font-mono"
                />
                <input
                  value={tag} onChange={(e) => setTag(e.target.value)}
                  placeholder="tag (work, body…)"
                  className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm outline-none uppercase font-mono"
                />
              </div>
              <button onClick={submit} className="w-full bitos-btn justify-center !bg-primary !text-primary-foreground !py-2">
                <Plus className="h-4 w-4" /> add event
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  // simple controlled timer
  useTick(running, () => setSeconds((s) => (s > 0 ? s - 1 : 0)));

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <RetroWindow title="focus.timer">
      <div className="text-center py-3">
        <div className="font-display text-6xl text-primary tabular-nums">{mm}:{ss}</div>
        <p className="mt-2 text-xs font-mono opacity-70">pomodoro · 25 min</p>
        <div className="mt-3 flex justify-center gap-2">
          <button onClick={() => setRunning((r) => !r)} className="bitos-btn">
            {running ? "pause" : "start"}
          </button>
          <button onClick={() => { setRunning(false); setSeconds(25 * 60); }} className="bitos-btn">
            reset
          </button>
        </div>
      </div>
    </RetroWindow>
  );
}

import { useEffect } from "react";
function useTick(active: boolean, cb: () => void) {
  useEffect(() => {
    if (!active) return;
    const id = setInterval(cb, 1000);
    return () => clearInterval(id);
  }, [active, cb]);
}
