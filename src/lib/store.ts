/**
 * BitOS shared data store — Firestore-backed, real-time per user.
 * users/{uid} holds shared widgets; habits and Kanban use realtime subcollections.
 */
import { create } from "zustand";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFbDb } from "./firebase";

export type Priority = "low" | "medium" | "high" | "na";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  category?: string;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
};

export type Habit = {
  id: string;
  title: string;
  completedDays: string[];
  streak: number;
  color?: string;
  createdAt: number;
  updatedAt: number;
};

export type PlannerEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  tag?: string;
};

export type KanbanCard = {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
};

export type KanbanColumn = {
  id: string;
  title: string;
  cardIds: string[];
};

export type KanbanBoard = {
  id: string;
  title: string;
  columns: KanbanColumn[];
  cards: Record<string, KanbanCard>;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  color?: string;
  createdAt: number;
  updatedAt?: number;
  boards: KanbanBoard[];
};

export type BitSettings = {
  theme?: string;
  custom?: any;
};

type Data = {
  tasks: Task[];
  habits: Habit[];
  events: PlannerEvent[];
  notes: string;
  projects: Project[];
  settings: BitSettings;
};

type State = Data & {
  userId: string | null;
  syncing: boolean;
  loaded: boolean;
  hydrate: (userId: string | null) => void;

  addTask: (t: Omit<Task, "id" | "createdAt" | "status"> & { status?: TaskStatus }) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  addHabit: (title: string, color?: string) => Promise<Habit>;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (id: string, isoDate: string) => Promise<void>;

  addEvent: (e: Omit<PlannerEvent, "id">) => PlannerEvent;
  deleteEvent: (id: string) => void;

  setNotes: (md: string) => void;

  saveSettings: (s: BitSettings) => void;

  // projects / kanban
  addProject: (p: Omit<Project, "id" | "createdAt" | "updatedAt" | "boards">) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addBoard: (projectId: string, title: string) => KanbanBoard | null;
  deleteBoard: (projectId: string, boardId: string) => void;
  addColumn: (projectId: string, boardId: string, title: string) => void;
  renameColumn: (projectId: string, boardId: string, columnId: string, title: string) => void;
  deleteColumn: (projectId: string, boardId: string, columnId: string) => void;
  addCard: (projectId: string, boardId: string, columnId: string, title: string) => void;
  updateCard: (projectId: string, boardId: string, cardId: string, patch: Partial<KanbanCard>) => void;
  deleteCard: (projectId: string, boardId: string, cardId: string) => void;
  moveCard: (projectId: string, boardId: string, cardId: string, toColumnId: string, toIndex: number) => void;
  moveColumn: (projectId: string, boardId: string, columnId: string, toIndex: number) => void;
};

const EMPTY: Data = { tasks: [], habits: [], events: [], notes: "", projects: [], settings: {} };
type RootData = Pick<Data, "tasks" | "events" | "notes" | "settings">;

let unsubs: Unsubscribe[] = [];
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextSnapshot = false;

function userDoc(uid: string) { return doc(getFbDb(), "users", uid); }
function habitDoc(uid: string, habitId: string) { return doc(getFbDb(), "users", uid, "habits", habitId); }
function habitsCol(uid: string) { return collection(getFbDb(), "users", uid, "habits"); }
function kanbanBoardDoc(uid: string, boardId: string) { return doc(getFbDb(), "users", uid, "kanbanBoards", boardId); }
function kanbanBoardsCol(uid: string) { return collection(getFbDb(), "users", uid, "kanbanBoards"); }

let pendingUid: string | null = null;
let pendingData: RootData | null = null;

async function flushNow() {
  if (!pendingUid || !pendingData) return;
  const uid = pendingUid, data = pendingData;
  pendingUid = null; pendingData = null;
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  skipNextSnapshot = true;
  try {
    await setDoc(userDoc(uid), { ...data, updatedAt: Date.now() }, { merge: true });
  } catch (e) { console.error("[bitos] firestore save failed", e); }
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => { void flushNow(); });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flushNow();
  });
}

function scheduleSave(uid: string, data: RootData) {
  if (typeof window === "undefined") return;
  pendingUid = uid;
  pendingData = data;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { void flushNow(); }, 120);
}

function cleanupListeners() {
  for (const unsub of unsubs) {
    try { unsub(); } catch {}
  }
  unsubs = [];
}

function calculateStreak(days: string[]): number {
  const completed = new Set(days);
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (completed.has(toISODate(d))) streak++;
    else break;
  }
  return streak;
}

function normalizeHabit(id: string, raw: any): Habit {
  const completedDays = Array.isArray(raw?.completedDays)
    ? raw.completedDays.filter((d: unknown): d is string => typeof d === "string")
    : raw?.history && typeof raw.history === "object"
      ? Object.entries(raw.history).filter(([, done]) => !!done).map(([day]) => day)
      : [];
  const now = Date.now();
  return {
    id: raw?.id || id,
    title: raw?.title || raw?.name || "untitled",
    completedDays,
    streak: typeof raw?.streak === "number" ? raw.streak : calculateStreak(completedDays),
    color: raw?.color,
    createdAt: typeof raw?.createdAt === "number" ? raw.createdAt : now,
    updatedAt: typeof raw?.updatedAt === "number" ? raw.updatedAt : now,
  };
}

function normalizeProject(id: string, raw: any): Project {
  const now = Date.now();
  return {
    id: raw?.id || id,
    title: raw?.title || "untitled",
    description: raw?.description,
    color: raw?.color,
    createdAt: typeof raw?.createdAt === "number" ? raw.createdAt : now,
    updatedAt: typeof raw?.updatedAt === "number" ? raw.updatedAt : now,
    boards: Array.isArray(raw?.boards) && raw.boards.length ? raw.boards : [defaultBoard()],
  };
}

export const useBitStore = create<State>((set, get) => {
  const persist = () => {
    const s = get();
    if (!s.userId) return;
    scheduleSave(s.userId, {
      tasks: s.tasks, events: s.events,
      notes: s.notes, settings: s.settings,
    });
  };

  const saveProject = async (project: Project) => {
    const uid = get().userId;
    if (!uid) return;
    try {
      await setDoc(kanbanBoardDoc(uid, project.id), { ...project, updatedAt: Date.now() }, { merge: true });
    } catch (e) { console.error("[bitos] kanban save failed", e); }
  };
  const mutateProject = (projectId: string, fn: (p: Project) => Project) => {
    let nextProject: Project | null = null;
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p;
        nextProject = { ...fn(p), updatedAt: Date.now() };
        return nextProject;
      }),
    }));
    if (nextProject) void saveProject(nextProject);
  };
  const mutateBoard = (projectId: string, boardId: string, fn: (b: KanbanBoard) => KanbanBoard) =>
    mutateProject(projectId, (p) => ({ ...p, boards: p.boards.map((b) => (b.id === boardId ? fn(b) : b)) }));

  return {
    userId: null,
    syncing: false,
    loaded: false,
    ...EMPTY,

    hydrate: (userId) => {
      cleanupListeners();
      // flush any pending write from the previous session before tearing down
      void flushNow();
      if (!userId || typeof window === "undefined") {
        set({ userId: null, syncing: false, loaded: false, ...EMPTY });
        return;
      }
      set({ userId, syncing: true, loaded: false, habits: [], projects: [] });
      const rootUnsub = onSnapshot(
        userDoc(userId),
        (snap) => {
          if (skipNextSnapshot) { skipNextSnapshot = false; set({ syncing: false, loaded: true }); return; }
          const d = snap.data() as Partial<RootData> | undefined;
          set({
            tasks: d?.tasks ?? [],
            events: d?.events ?? [],
            notes: d?.notes ?? "",
            settings: d?.settings ?? {},
            syncing: false,
            loaded: true,
          });
          window.dispatchEvent(new Event("bitos:settings-loaded"));
        },
        (err) => { console.error("[bitos] firestore subscribe failed", err); set({ syncing: false, loaded: true }); },
      );
      const habitsUnsub = onSnapshot(
        query(habitsCol(userId), orderBy("createdAt", "asc")),
        async (snap) => {
          const fromSubcollection = snap.docs.map((d) => normalizeHabit(d.id, d.data()));
          if (fromSubcollection.length) {
            set({ habits: fromSubcollection });
            return;
          }
          const legacy = (await getDoc(userDoc(userId))).data()?.habits as unknown[] | undefined;
          if (Array.isArray(legacy) && legacy.length) {
            const migrated = legacy.map((h: any) => normalizeHabit(h.id || crypto.randomUUID(), h));
            set({ habits: migrated });
            void Promise.all(migrated.map((h) => setDoc(habitDoc(userId, h.id), h, { merge: true })));
          } else {
            set({ habits: [] });
          }
        },
        (err) => console.error("[bitos] habits subscribe failed", err),
      );
      const boardsUnsub = onSnapshot(
        query(kanbanBoardsCol(userId), orderBy("createdAt", "desc")),
        async (snap) => {
          const fromSubcollection = snap.docs.map((d) => normalizeProject(d.id, d.data()));
          if (fromSubcollection.length) {
            set({ projects: fromSubcollection });
            return;
          }
          const legacy = (await getDoc(userDoc(userId))).data()?.projects as Project[] | undefined;
          if (Array.isArray(legacy) && legacy.length) {
            set({ projects: legacy.map((p) => normalizeProject(p.id, p)) });
            void Promise.all(legacy.map((p) => setDoc(kanbanBoardDoc(userId, p.id), normalizeProject(p.id, p), { merge: true })));
          } else {
            set({ projects: [] });
          }
        },
        (err) => console.error("[bitos] kanban subscribe failed", err),
      );
      unsubs = [rootUnsub, habitsUnsub, boardsUnsub];
    },

    addTask: (t) => {
      const task: Task = { id: crypto.randomUUID(), createdAt: Date.now(), status: t.status ?? "todo", ...t };
      set((s) => ({ tasks: [task, ...s.tasks] })); persist(); return task;
    },
    updateTask: (id, patch) => {
      set((s) => ({ tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)) })); persist();
    },
    deleteTask: (id) => { set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) })); persist(); },
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

    addHabit: async (title, color) => {
      const uid = get().userId;
      if (!uid) throw new Error("Sign in required");
      const now = Date.now();
      const habit: Habit = {
        id: crypto.randomUUID(),
        title: title.trim() || "untitled",
        completedDays: [],
        streak: 0,
        color,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(habitDoc(uid, habit.id), habit);
      return habit;
    },
    deleteHabit: (id) => {
      const uid = get().userId;
      if (!uid) return;
      void deleteDoc(habitDoc(uid, id));
    },
    toggleHabitDay: async (id, isoDate) => {
      const uid = get().userId;
      const habit = get().habits.find((h) => h.id === id);
      if (!uid || !habit) return;
      const completedDays = habit.completedDays.includes(isoDate)
        ? habit.completedDays.filter((d) => d !== isoDate)
        : [...habit.completedDays, isoDate];
      await setDoc(habitDoc(uid, id), {
        ...habit,
        completedDays,
        streak: calculateStreak(completedDays),
        updatedAt: Date.now(),
      }, { merge: true });
    },

    addEvent: (e) => {
      const ev: PlannerEvent = { id: crypto.randomUUID(), ...e };
      set((s) => ({ events: [...s.events, ev] })); persist(); return ev;
    },
    deleteEvent: (id) => { set((s) => ({ events: s.events.filter((e) => e.id !== id) })); persist(); },

    setNotes: (md) => { set({ notes: md }); persist(); },

    saveSettings: (s) => { set((st) => ({ settings: { ...st.settings, ...s } })); persist(); },

    addProject: async (p) => {
      const uid = get().userId;
      if (!uid) throw new Error("Sign in required");
      const now = Date.now();
      const project: Project = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, boards: [defaultBoard()], ...p };
      await setDoc(kanbanBoardDoc(uid, project.id), project);
      return project;
    },
    updateProject: (id, patch) => mutateProject(id, (p) => ({ ...p, ...patch })),
    deleteProject: (id) => {
      const uid = get().userId;
      if (!uid) return;
      void deleteDoc(kanbanBoardDoc(uid, id));
    },

    addBoard: (projectId, title) => {
      const board = { ...defaultBoard(), title: title.trim() || "board" };
      mutateProject(projectId, (p) => ({ ...p, boards: [...p.boards, board] }));
      return board;
    },
    deleteBoard: (projectId, boardId) =>
      mutateProject(projectId, (p) => ({ ...p, boards: p.boards.filter((b) => b.id !== boardId) })),

    addColumn: (projectId, boardId, title) =>
      mutateBoard(projectId, boardId, (b) => ({
        ...b,
        columns: [...b.columns, { id: crypto.randomUUID(), title: title.trim() || "column", cardIds: [] }],
      })),
    renameColumn: (projectId, boardId, columnId, title) =>
      mutateBoard(projectId, boardId, (b) => ({
        ...b,
        columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
      })),
    deleteColumn: (projectId, boardId, columnId) =>
      mutateBoard(projectId, boardId, (b) => {
        const col = b.columns.find((c) => c.id === columnId);
        const cards = { ...b.cards };
        col?.cardIds.forEach((id) => delete cards[id]);
        return { ...b, columns: b.columns.filter((c) => c.id !== columnId), cards };
      }),

    addCard: (projectId, boardId, columnId, title) =>
      mutateBoard(projectId, boardId, (b) => {
        const card: KanbanCard = { id: crypto.randomUUID(), title: title.trim() || "card" };
        return {
          ...b,
          cards: { ...b.cards, [card.id]: card },
          columns: b.columns.map((c) => (c.id === columnId ? { ...c, cardIds: [...c.cardIds, card.id] } : c)),
        };
      }),
    updateCard: (projectId, boardId, cardId, patch) =>
      mutateBoard(projectId, boardId, (b) => ({ ...b, cards: { ...b.cards, [cardId]: { ...b.cards[cardId], ...patch } } })),
    deleteCard: (projectId, boardId, cardId) =>
      mutateBoard(projectId, boardId, (b) => {
        const cards = { ...b.cards }; delete cards[cardId];
        return { ...b, cards, columns: b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((x) => x !== cardId) })) };
      }),

    moveCard: (projectId, boardId, cardId, toColumnId, toIndex) =>
      mutateBoard(projectId, boardId, (b) => {
        const columns = b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }));
        const target = columns.find((c) => c.id === toColumnId);
        if (target) {
          const next = [...target.cardIds];
          next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, cardId);
          target.cardIds = next;
        }
        return { ...b, columns };
      }),
    moveColumn: (projectId, boardId, columnId, toIndex) =>
      mutateBoard(projectId, boardId, (b) => {
        const cols = b.columns.filter((c) => c.id !== columnId);
        const col = b.columns.find((c) => c.id === columnId);
        if (!col) return b;
        cols.splice(Math.max(0, Math.min(toIndex, cols.length)), 0, col);
        return { ...b, columns: cols };
      }),
  };
});

function defaultBoard(): KanbanBoard {
  return {
    id: crypto.randomUUID(),
    title: "main",
    columns: [
      { id: crypto.randomUUID(), title: "Todo",        cardIds: [] },
      { id: crypto.randomUUID(), title: "In Progress", cardIds: [] },
      { id: crypto.randomUUID(), title: "Done",        cardIds: [] },
    ],
    cards: {},
  };
}

// ---------- helpers ----------
export function toISODate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfToday(): number {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime();
}

/** Tasks visible in widgets/planner — completed tasks linger until next day. */
export function visibleTasks(all: Task[]): Task[] {
  const cutoff = startOfToday();
  return all.filter((t) => t.status !== "done" || (t.completedAt ?? 0) >= cutoff);
}

export function habitStreak(h: Habit): number {
  return typeof h.streak === "number" ? h.streak : calculateStreak(h.completedDays);
}

export function habitWeek(h: Habit): boolean[] {
  const out: boolean[] = [];
  const completed = new Set(h.completedDays);
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(completed.has(toISODate(d)));
  }
  return out;
}

export const PRIORITY_META: Record<Priority, { label: string; tone: string; ring: string }> = {
  high:   { label: "HIGH",   tone: "bg-destructive text-destructive-foreground",      ring: "ring-destructive/40" },
  medium: { label: "MED",    tone: "bg-accent text-accent-foreground",                ring: "ring-accent/40" },
  low:    { label: "LOW",    tone: "bg-primary/80 text-primary-foreground",           ring: "ring-primary/40" },
  na:     { label: "N/A",    tone: "bg-muted text-foreground/70",                     ring: "ring-border" },
};
