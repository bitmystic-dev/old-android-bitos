import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";
import { useBitStore, PRIORITY_META, type Task, type TaskStatus } from "@/lib/store";
import { ArrowRight, Plus, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/projects")({
  component: Projects,
  head: () => ({ meta: [{ title: "Projects — BitOS" }] }),
});

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo",        title: "backlog" },
  { id: "in_progress", title: "in progress" },
  { id: "review",      title: "review" },
  { id: "done",        title: "done" },
];

function Projects() {
  const tasks = useBitStore((s) => s.tasks);
  const addTask = useBitStore((s) => s.addTask);
  const updateTask = useBitStore((s) => s.updateTask);
  const deleteTask = useBitStore((s) => s.deleteTask);

  const [composing, setComposing] = useState<TaskStatus | null>(null);
  const [title, setTitle] = useState("");

  const move = (t: Task, dir: 1 | -1) => {
    const i = COLUMNS.findIndex((c) => c.id === t.status);
    const next = COLUMNS[Math.min(COLUMNS.length - 1, Math.max(0, i + dir))];
    if (next) updateTask(t.id, { status: next.id });
  };

  const submit = () => {
    if (!composing || !title.trim()) return;
    addTask({ title: title.trim(), priority: "medium", status: composing });
    setTitle(""); setComposing(null);
  };

  return (
    <PageShell title="projects" subtitle="kanban.exe — drag tasks across stages">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.id);
          return (
            <RetroWindow key={col.id} title={col.title} subtitle={`${items.length}`}>
              <ul className="space-y-2 min-h-12">
                {items.length === 0 && (
                  <li className="text-[11px] font-mono opacity-40 text-center py-2">// empty</li>
                )}
                {items.map((t) => {
                  const pri = PRIORITY_META[t.priority];
                  return (
                    <li key={t.id} className="group rounded-md border border-border p-2.5 bg-secondary/40 hover:bg-secondary">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 text-sm">{t.title}</div>
                        <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-60 hover:!opacity-100">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {t.priority !== "na" ? (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${pri.tone}`}>{pri.label}</span>
                        ) : <span />}
                        <div className="flex gap-1">
                          <button onClick={() => move(t, -1)} disabled={col.id === "todo"} className="bitos-btn !px-1.5 !py-0.5 disabled:opacity-30">‹</button>
                          <button onClick={() => move(t, 1)} disabled={col.id === "done"} className="bitos-btn !px-1.5 !py-0.5 disabled:opacity-30">›</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {composing === col.id ? (
                <div className="mt-2 flex gap-1">
                  <input
                    autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setComposing(null); }}
                    placeholder="card title…"
                    className="flex-1 text-sm bg-input border border-border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={submit} className="bitos-btn"><ArrowRight className="h-3 w-3" /></button>
                </div>
              ) : (
                <button onClick={() => setComposing(col.id)} className="mt-2 w-full text-[11px] font-mono opacity-60 hover:opacity-100 border border-dashed border-border rounded py-1.5">
                  <Plus className="inline h-3 w-3 mr-1" />add card
                </button>
              )}
            </RetroWindow>
          );
        })}
      </div>
    </PageShell>
  );
}
