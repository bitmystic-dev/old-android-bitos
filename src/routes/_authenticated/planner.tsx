import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ScheduleWidget } from "@/widgets/ScheduleWidget";
import { TasksWidget } from "@/widgets/TasksWidget";
import { RetroWindow } from "@/components/RetroWindow";

export const Route = createFileRoute("/_authenticated/planner")({
  component: Planner,
  head: () => ({ meta: [{ title: "Planner — BitOS" }] }),
});

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Planner() {
  return (
    <PageShell title="planner" subtitle="time is a canvas">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <RetroWindow title="week.view" subtitle="this week">
            <div className="grid grid-cols-7 gap-2">
              {week.map((d, i) => (
                <div key={d} className="rounded-md border border-border p-2 bg-secondary/40 min-h-32">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-base">{d}</span>
                    <span className="font-mono text-[10px] opacity-60">{18 + i}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {i % 2 === 0 && <div className="text-[11px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground truncate">Deep work</div>}
                    {i % 3 === 0 && <div className="text-[11px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground truncate">Workout</div>}
                    {i === 4 && <div className="text-[11px] px-1.5 py-0.5 rounded bg-muted truncate">Movie night</div>}
                  </div>
                </div>
              ))}
            </div>
          </RetroWindow>
        </div>
        <ScheduleWidget />
        <div className="lg:col-span-2"><TasksWidget /></div>
        <RetroWindow title="focus.timer">
          <div className="text-center py-3">
            <div className="font-display text-6xl text-primary tabular-nums">25:00</div>
            <p className="mt-2 text-xs font-mono opacity-70">pomodoro · session 1 of 4</p>
            <div className="mt-3 flex justify-center gap-2">
              <button className="bitos-btn">start</button>
              <button className="bitos-btn">reset</button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </PageShell>
  );
}
