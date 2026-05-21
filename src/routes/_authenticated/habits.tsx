import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { HabitsWidget } from "@/widgets/HabitsWidget";
import { RetroWindow } from "@/components/RetroWindow";

export const Route = createFileRoute("/_authenticated/habits")({
  component: Habits,
  head: () => ({ meta: [{ title: "Habits — BitOS" }] }),
});

function Heatmap() {
  const cells = Array.from({ length: 7 * 18 });
  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1">
      {cells.map((_, i) => {
        const v = ((i * 37) % 100) / 100;
        const op = v < 0.2 ? 0.1 : v < 0.5 ? 0.35 : v < 0.8 ? 0.65 : 1;
        return <div key={i} className="h-3 w-3 rounded-sm" style={{ background: `color-mix(in oklab, var(--color-primary) ${op * 100}%, var(--color-muted))` }} />;
      })}
    </div>
  );
}

function Habits() {
  return (
    <PageShell title="habits" subtitle="small loops, big lives">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <HabitsWidget />
        <div className="lg:col-span-2">
          <RetroWindow title="streak.map" subtitle="last 18 weeks">
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
