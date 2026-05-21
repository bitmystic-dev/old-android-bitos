import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
  head: () => ({ meta: [{ title: "Projects — BitOS" }] }),
});

const columns: { title: string; items: { t: string; tag?: string }[] }[] = [
  { title: "Backlog", items: [{ t: "Theme marketplace" }, { t: "Mobile gesture nav" }, { t: "Voice notes widget" }] },
  { title: "In Progress", items: [{ t: "Dashboard v2", tag: "BitOS" }, { t: "Habit heatmap", tag: "BitOS" }] },
  { title: "Review", items: [{ t: "Settings panel" }] },
  { title: "Done", items: [{ t: "Design tokens" }, { t: "Sidebar nav" }, { t: "Theme switcher" }] },
];

function Projects() {
  return (
    <PageShell title="projects" subtitle="kanban.exe">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => (
          <RetroWindow key={col.title} title={col.title.toLowerCase()} subtitle={`${col.items.length}`}>
            <ul className="space-y-2">
              {col.items.map((it) => (
                <li key={it.t} className="rounded-md border border-border p-2.5 bg-secondary/40 hover:bg-secondary cursor-grab active:cursor-grabbing">
                  <div className="text-sm">{it.t}</div>
                  {it.tag && <div className="mt-1 inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{it.tag}</div>}
                </li>
              ))}
              <button className="w-full text-left text-xs font-mono opacity-60 hover:opacity-100 px-2 py-1">+ add card</button>
            </ul>
          </RetroWindow>
        ))}
      </div>
    </PageShell>
  );
}
