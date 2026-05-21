import { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore - types in @types/react-grid-layout v2 are stale
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useAuth } from "@/contexts/AuthContext";
import { RetroWindow } from "@/components/RetroWindow";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TasksWidget } from "@/widgets/TasksWidget";
import { HabitsWidget } from "@/widgets/HabitsWidget";
import { QuoteWidget } from "@/widgets/QuoteWidget";
import { StatsWidget } from "@/widgets/StatsWidget";
import { NotesWidget } from "@/widgets/NotesWidget";
import { MusicWidget } from "@/widgets/MusicWidget";
import { ScheduleWidget } from "@/widgets/ScheduleWidget";
import { InspirationWidget } from "@/widgets/InspirationWidget";
import { Plus, X, ChevronDown, ChevronUp, GripVertical, RotateCcw, Edit3 } from "lucide-react";

const ResponsiveGrid: any = WidthProvider(Responsive);

type WidgetId = "clock" | "stats" | "quote" | "tasks" | "schedule" | "habits" | "music" | "notes" | "inspiration";
type LayoutItem = { i: string; x: number; y: number; w: number; h: number; minW?: number; minH?: number };

const REGISTRY: Record<WidgetId, { title: string; component: React.ComponentType; default: { w: number; h: number } }> = {
  clock:       { title: "clock.exe",       component: ClockWidget,       default: { w: 4, h: 5 } },
  stats:       { title: "stats.exe",       component: StatsWidget,       default: { w: 4, h: 5 } },
  quote:       { title: "muse.txt",        component: QuoteWidget,       default: { w: 4, h: 5 } },
  tasks:       { title: "tasks.exe",       component: TasksWidget,       default: { w: 4, h: 7 } },
  schedule:    { title: "schedule.exe",    component: ScheduleWidget,    default: { w: 4, h: 7 } },
  habits:      { title: "habits.exe",      component: HabitsWidget,      default: { w: 4, h: 7 } },
  music:       { title: "music.exe",       component: MusicWidget,       default: { w: 4, h: 6 } },
  notes:       { title: "notes.md",        component: NotesWidget,       default: { w: 8, h: 6 } },
  inspiration: { title: "inspiration.hub", component: InspirationWidget, default: { w: 12, h: 6 } },
};

type WState = { i: WidgetId; collapsed?: boolean };
type Saved = { widgets: WState[]; layouts: Record<string, LayoutItem[]> };

const DEFAULT_WIDGETS: WState[] = [
  { i: "clock" }, { i: "stats" }, { i: "quote" },
  { i: "tasks" }, { i: "schedule" }, { i: "habits" },
  { i: "music" }, { i: "notes" }, { i: "inspiration" },
];

function buildDefaultLayouts(widgets: WState[]): Record<string, LayoutItem[]> {
  const lg: LayoutItem[] = [];
  const md: LayoutItem[] = [];
  const sm: LayoutItem[] = [];
  let lgX = 0, lgY = 0, mdX = 0, mdY = 0, smY = 0;
  for (const w of widgets) {
    const d = REGISTRY[w.i].default;
    if (lgX + d.w > 12) { lgX = 0; lgY += d.h; }
    lg.push({ i: w.i, x: lgX, y: lgY, w: d.w, h: d.h, minW: 3, minH: 3 });
    lgX += d.w;
    const mdW = Math.min(d.w, 6);
    if (mdX + mdW > 6) { mdX = 0; mdY += d.h; }
    md.push({ i: w.i, x: mdX, y: mdY, w: mdW, h: d.h, minW: 3, minH: 3 });
    mdX += mdW;
    sm.push({ i: w.i, x: 0, y: smY, w: 2, h: d.h, minW: 2, minH: 3 });
    smY += d.h;
  }
  return { lg, md, sm };
}

export function DashboardGrid() {
  const { user } = useAuth();
  const key = `bitos.dashboard.${user?.id ?? "guest"}`;
  const [state, setState] = useState<Saved | null>(null);
  const [adding, setAdding] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
      else setState({ widgets: DEFAULT_WIDGETS, layouts: buildDefaultLayouts(DEFAULT_WIDGETS) });
    } catch {
      setState({ widgets: DEFAULT_WIDGETS, layouts: buildDefaultLayouts(DEFAULT_WIDGETS) });
    }
    loadedRef.current = true;
  }, [key]);

  useEffect(() => {
    if (!loadedRef.current || !state) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  const onLayoutChange = (_cur: LayoutItem[], all: Record<string, LayoutItem[]>) => {
    setState((s) => (s ? { ...s, layouts: all } : s));
  };

  const removeWidget = (i: WidgetId) =>
    setState((s) => s ? {
      widgets: s.widgets.filter((w) => w.i !== i),
      layouts: Object.fromEntries(Object.entries(s.layouts).map(([k, v]) => [k, v.filter((l) => l.i !== i)])),
    } : s);

  const toggleCollapse = (i: WidgetId) =>
    setState((s) => {
      if (!s) return s;
      const isCollapsed = !!s.widgets.find((w) => w.i === i)?.collapsed;
      return {
        ...s,
        widgets: s.widgets.map((w) => w.i === i ? { ...w, collapsed: !isCollapsed } : w),
        layouts: Object.fromEntries(Object.entries(s.layouts).map(([k, v]) => [
          k, v.map((l) => l.i === i ? { ...l, h: isCollapsed ? REGISTRY[i].default.h : 2 } : l)
        ])),
      };
    });

  const addWidget = (i: WidgetId) => {
    setState((s) => {
      if (!s) return s;
      if (s.widgets.find((w) => w.i === i)) return s;
      const d = REGISTRY[i].default;
      const widgets = [...s.widgets, { i }];
      const layouts = Object.fromEntries(Object.entries(s.layouts).map(([k, v]) => {
        const maxY = Math.max(0, ...v.map((l) => l.y + l.h));
        const cols = k === "sm" ? 2 : k === "md" ? 6 : 12;
        return [k, [...v, { i, x: 0, y: maxY, w: Math.min(d.w, cols), h: d.h, minW: 2, minH: 3 } as LayoutItem]];
      }));
      return { widgets, layouts };
    });
    setAdding(false);
  };

  const reset = () => {
    localStorage.removeItem(key);
    setState({ widgets: DEFAULT_WIDGETS, layouts: buildDefaultLayouts(DEFAULT_WIDGETS) });
  };

  const available = useMemo<WidgetId[]>(() => {
    if (!state) return [];
    const present = new Set(state.widgets.map((w) => w.i));
    return (Object.keys(REGISTRY) as WidgetId[]).filter((i) => !present.has(i));
  }, [state]);

  if (!state) return <div className="bitos-window p-8 text-center font-mono text-sm opacity-70">loading dashboard…</div>;

  return (
    <div className="space-y-3">
      <div className="bitos-window px-4 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="font-display text-2xl sm:text-3xl text-primary">welcome back, {user?.displayName || "operator"}</h1>
        <span className="font-mono text-xs opacity-70">// dashboard.v2 — {editMode ? "edit mode active" : "tap edit to drag & resize"}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setEditMode((v) => !v)} className={`bitos-btn ${editMode ? "!bg-primary !text-primary-foreground" : ""}`}>
            <Edit3 className="h-3.5 w-3.5" /> {editMode ? "done" : "edit"}
          </button>
          <button onClick={() => setAdding(true)} className="bitos-btn">
            <Plus className="h-3.5 w-3.5" /> widget
          </button>
          <button onClick={reset} className="bitos-btn" title="Reset layout">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ResponsiveGrid
        className="bitos-rgl"
        layouts={state.layouts}
        breakpoints={{ lg: 1200, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 6, sm: 2 }}
        rowHeight={42}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".bitos-drag-handle"
        onLayoutChange={onLayoutChange}
        compactType="vertical"
      >
        {state.widgets.map((w) => {
          const meta = REGISTRY[w.i];
          const Comp = meta.component;
          return (
            <div key={w.i} className="bitos-grid-item">
              <RetroWindow
                title={meta.title}
                actions={
                  <>
                    {editMode && (
                      <span className="bitos-drag-handle cursor-grab active:cursor-grabbing opacity-70 hover:opacity-100" title="Drag">
                        <GripVertical className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <button onClick={() => toggleCollapse(w.i)} className="opacity-70 hover:opacity-100" title="Collapse">
                      {w.collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => removeWidget(w.i)} className="opacity-70 hover:opacity-100 hover:text-destructive" title="Remove">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                }
                className="h-full"
                bodyClassName={`h-full overflow-auto ${w.collapsed ? "hidden" : ""}`}
              >
                <Comp />
              </RetroWindow>
            </div>
          );
        })}
      </ResponsiveGrid>

      {adding && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="bitos-window w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="bitos-titlebar">
              <span className="text-sm">add.widget</span>
              <button onClick={() => setAdding(false)} className="opacity-80"><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="p-4">
              {available.length === 0 ? (
                <p className="text-sm opacity-70 py-4 text-center">All widgets are already on your dashboard.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {available.map((id) => (
                    <button key={id} onClick={() => addWidget(id)} className="rounded-md border border-border p-3 text-left hover:border-primary hover:bg-secondary/60 transition">
                      <div className="font-mono text-xs opacity-70">{REGISTRY[id].title}</div>
                      <div className="text-sm mt-1">+ add</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
