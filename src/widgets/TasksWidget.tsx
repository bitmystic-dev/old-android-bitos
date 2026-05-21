import { useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Check, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Task = { id: string; text: string; done: boolean };

const seed: Task[] = [
  { id: "1", text: "Boot up BitOS workspace", done: true },
  { id: "2", text: "Review Novel chapter 3 outline", done: false },
  { id: "3", text: "30m focused coding sprint", done: false },
  { id: "4", text: "Read inspiration feed", done: false },
];

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setTasks((t) => [...t, { id: crypto.randomUUID(), text: input, done: false }]);
    setInput("");
  };

  return (
    <RetroWindow title="today.todo" subtitle={`${tasks.filter(t => !t.done).length} open`}>
      <ul className="space-y-1.5">
        <AnimatePresence initial={false}>
          {tasks.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/60"
            >
              <button
                onClick={() => setTasks((all) => all.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                className={`h-4 w-4 grid place-items-center border border-border rounded ${t.done ? "bg-primary text-primary-foreground" : ""}`}
                aria-label="Toggle"
              >
                {t.done && <Check className="h-3 w-3" />}
              </button>
              <span className={`flex-1 text-sm ${t.done ? "line-through opacity-50" : ""}`}>{t.text}</span>
              <button
                onClick={() => setTasks((all) => all.filter(x => x.id !== t.id))}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
                aria-label="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="add a task…"
          className="flex-1 text-sm bg-input border border-border rounded-md px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={add} className="bitos-btn"><Plus className="h-4 w-4" /></button>
      </div>
    </RetroWindow>
  );
}
