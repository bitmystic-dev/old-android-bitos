import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";

export const Route = createFileRoute("/_authenticated/inspiration")({
  component: Inspiration,
  head: () => ({ meta: [{ title: "Inspiration — BitOS" }] }),
});

const cards = [
  { tag: "UI", title: "Y2K revival mood", hue: "from-pink-400 to-violet-500" },
  { tag: "Art", title: "Studio Ghibli skies", hue: "from-sky-300 to-emerald-300" },
  { tag: "Code", title: "Dataflow patterns", hue: "from-amber-300 to-rose-400" },
  { tag: "Music", title: "Late-night synthwave", hue: "from-fuchsia-500 to-indigo-600" },
  { tag: "Read", title: "Tools for thought", hue: "from-orange-300 to-pink-400" },
  { tag: "Photo", title: "Tokyo neon alleys", hue: "from-cyan-400 to-purple-500" },
];

function Inspiration() {
  return (
    <PageShell title="inspiration" subtitle="hub of muses">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <RetroWindow key={c.title} title={c.tag.toLowerCase()} bodyClassName="!p-0">
            <div className={`h-32 bg-gradient-to-br ${c.hue}`} />
            <div className="p-3">
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-[10px] font-mono opacity-60 mt-1">saved · 2d ago</div>
            </div>
          </RetroWindow>
        ))}
      </div>
    </PageShell>
  );
}
