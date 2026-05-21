/**
 * BitOS shared data store
 * ------------------------
 * Per-user persisted store using Zustand. Powers tasks, habits,
 * planner events, notes. Every module reads from here so the
 * dashboard reflects real user data instantly.
 */
import { create } from "zustand";

export type Priority = "low" | "medium" | "high" | "na";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date (YYYY-MM-DD)
  priority: Priority;
  category?: string;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
};

export type Habit = {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
  history: Record<string, boolean>; // { "2026-05-21": true }
};

export type PlannerEvent = {
  id: string;
  title: string;
  date: string; // ISO date YYYY-MM-DD
  time?: string; // HH:MM
  tag?: string;
};

type Data = {
  tasks: Task[];
  habits: Habit[];
  events: PlannerEvent[];
  notes: string;
};

type State = Data & {
  userId: string | null;
  hydrate: (userId: string | null) => void;

  addTask: (t: Omit<Task, "id" | "createdAt" | "status"> & { status?: TaskStatus }) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  addHabit: (name: string, color?: string) => Habit;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (id: string, isoDate: string) => void;

  addEvent: (e: Omit<PlannerEvent, "id">) => PlannerEvent;
  deleteEvent: (id: string) => void;

  setNotes: (md: string) => void;
};

const EMPTY: Data = { tasks: [], habits: [], events: [], notes: "" };
const KEY = (id: string) => `bitos.data.${id}`;

function load(userId: string | null): Data {
  if (!userId || typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY(userId));
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function save(userId: string | null, data: Data) {
  if (!userId || typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(data));
  } catch {}
}

export const useBitStore = create<State>((set, get) => {
  const persist = () => {
    const s = get();
    save(s.userId, { tasks: s.tasks, habits: s.habits, events: s.events, notes: s.notes });
  };

  return {
    userId: null,
    ...EMPTY,

    hydrate: (userId) => {
      const data = load(userId);
      set({ userId, ...data });
    },

    addTask: (t) => {
      const task: Task = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        status: t.status ?? "todo",
        ...t,
      };
      set((s) => ({ tasks: [task, ...s.tasks] }));
      persist();
      return task;
    },
    updateTask: (id, patch) => {
      set((s) => ({
        tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      }));
      persist();
    },
    deleteTask: (id) => {
      set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) }));
      persist();
    },
    toggleTask: (id) => {
      set((s) => ({
        tasks: s.tasks.map((x) => {
          if (x.id !== id) return x;
          const done = x.status !== "done";
          return { ...x, status: done ? "done" : "todo", completedAt: done ? Date.now() : undefined };
        }),
      }));
      persist();
    },

    addHabit: (name, color) => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: name.trim() || "untitled",
        color,
        createdAt: Date.now(),
        history: {},
      };
      set((s) => ({ habits: [...s.habits, habit] }));
      persist();
      return habit;
    },
    deleteHabit: (id) => {
      set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
      persist();
    },
    toggleHabitDay: (id, isoDate) => {
      set((s) => ({
        habits: s.habits.map((h) =>
          h.id === id
            ? { ...h, history: { ...h.history, [isoDate]: !h.history[isoDate] } }
            : h
        ),
      }));
      persist();
    },

    addEvent: (e) => {
      const ev: PlannerEvent = { id: crypto.randomUUID(), ...e };
      set((s) => ({ events: [...s.events, ev] }));
      persist();
      return ev;
    },
    deleteEvent: (id) => {
      set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
      persist();
    },

    setNotes: (md) => {
      set({ notes: md });
      persist();
    },
  };
});

// ---------- helpers ----------
export function toISODate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function habitStreak(h: Habit): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (h.history[toISODate(d)]) streak++;
    else break;
  }
  return streak;
}

export function habitWeek(h: Habit): boolean[] {
  const out: boolean[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(!!h.history[toISODate(d)]);
  }
  return out;
}

export const PRIORITY_META: Record<Priority, { label: string; tone: string; ring: string }> = {
  high:   { label: "HIGH",   tone: "bg-destructive text-destructive-foreground",      ring: "ring-destructive/40" },
  medium: { label: "MED",    tone: "bg-accent text-accent-foreground",                ring: "ring-accent/40" },
  low:    { label: "LOW",    tone: "bg-primary/80 text-primary-foreground",           ring: "ring-primary/40" },
  na:     { label: "N/A",    tone: "bg-muted text-foreground/70",                     ring: "ring-border" },
};
