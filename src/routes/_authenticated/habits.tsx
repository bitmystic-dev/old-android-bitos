import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { HabitsWidget } from "@/widgets/HabitsWidget";
import { RetroWindow } from "@/components/RetroWindow";
import { useBitStore, habitStreak, toISODate } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/habits")({
  component: Habits,
  head: () => ({ meta: [{ title: "Habits — BitOS" }] }),
});

const WEEKS = 18;

function Heatmap() {
  const habits = useBitStore((s) => s.habits);
  const today = new Date();

  // Per-day completion ratio across all habits (0..1)
  const cells: { date: string; ratio: number }[] = [];
  const totalDays = WEEKS * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = toISODate(d);
    const done = habits.filter((h) => h.history[date]).length;
    cells.push({ date, ratio: habits.length === 0 ? 0 : done / habits.length });
  }

  if (habits.length === 0) {
    return (
      <div className="py-8 text-center font-mono text-xs opacity-60">
        // create your first habit to start the heatmap
      </div>
    );
  }

  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1">
      {cells.map((c, i) => {
        const op = c.ratio === 0 ? 0.1 : 0.2 + c.ratio * 0.8;
        return (
          <div
            key={i}
            title={`${c.date} — ${Math.round(c.ratio * 100)}%`}
            className="h-3 w-3 rounded-sm"
            style={{ background: `color-mix(in oklab, var(--color-primary) ${op * 100}%, var(--color-muted))` }}
          />
        );
      })}
    </div>
  );
}

function Habits() {
  const habits = useBitStore((s) => s.habits);
  const topStreak = habits.reduce((m, h) => Math.max(m, habitStreak(h)), 0);

  return (
    <PageShell title="habits" subtitle={`small loops, big lives · top streak ${topStreak}d`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <HabitsWidget />
        <div className="lg:col-span-2">
          <RetroWindow title="streak.map" subtitle={`last ${WEEKS} weeks`}>
            <Heatmap />
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono opacity-70">
              <span>less</span>
              {[0.1, 0.35, 0.65, 1].map((o) => (
                <span key={o} className="h-2.5 w-2.5 rounded-sm" style={{ background: `color-mix(in oklab, var(--color-primary) ${o * 100}%, var(--color-muted))` }} />
              ))}
              <span>more</span>
            </div>
          </RetroWindow>
        </div>
      </div>
    </PageShell>
  );
}
