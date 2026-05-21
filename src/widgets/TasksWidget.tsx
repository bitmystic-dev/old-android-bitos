import { useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Check, Plus, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBitStore, PRIORITY_META, type Priority } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function TasksWidget() {
  const tasks = useBitStore((s) => s.tasks);
  const addTask = useBitStore((s) => s.addTask);
  const toggleTask = useBitStore((s) => s.toggleTask);
  const deleteTask = useBitStore((s) => s.deleteTask);

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [showPri, setShowPri] = useState(false);

  const open = tasks.filter((t) => t.status !== "done");
  const visible = [...open, ...tasks.filter((t) => t.status === "done").slice(0, 3)];

  const add = () => {
    if (!input.trim()) return;
    addTask({ title: input.trim(), priority });
    setInput("");
  };

  return (
    <RetroWindow title="today.todo" subtitle={`${open.length} open · ${tasks.length} total`}>
      {tasks.length === 0 ? (
        <div className="py-6 text-center">
          <div className="font-mono text-xs opacity-60 mb-2">// no tasks yet</div>
          <p className="text-sm opacity-80">Type below to create your first task.</p>
        </div>
      ) : (
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {visible.map((t) => {
              const pri = PRIORITY_META[t.priority];
              const done = t.status === "done";
              return (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/60"
                >
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`h-4 w-4 shrink-0 grid place-items-center border border-border rounded ${done ? "bg-primary text-primary-foreground" : ""}`}
                    aria-label="Toggle"
                  >
                    {done && <Check className="h-3 w-3" />}
                  </button>
                  <span className={`flex-1 text-sm truncate ${done ? "line-through opacity-50" : ""}`}>
                    {t.title}
                  </span>
                  {t.priority !== "na" && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${pri.tone}`}>
                      {pri.label}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
                    aria-label="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-3 flex gap-2 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="add a task…"
          className="flex-1 text-sm bg-input border border-border rounded-md px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => setShowPri((v) => !v)}
          className={`bitos-btn !px-2 ${PRIORITY_META[priority].tone}`}
          title="Priority"
        >
          {PRIORITY_META[priority].label}
          <ChevronDown className="h-3 w-3" />
        </button>
        <button onClick={add} className="bitos-btn">
          <Plus className="h-4 w-4" />
        </button>

        {showPri && (
          <div className="absolute right-10 top-full mt-1 z-20 bitos-window p-1 flex flex-col text-xs">
            {(["high", "medium", "low", "na"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => { setPriority(p); setShowPri(false); }}
                className={`text-left px-3 py-1.5 rounded hover:bg-secondary ${PRIORITY_META[p].tone.split(" ")[0]} bg-transparent`}
              >
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <Link to="/planner" className="block mt-2 text-[10px] font-mono opacity-60 hover:opacity-100">
          → open planner
        </Link>
      )}
    </RetroWindow>
  );
}
