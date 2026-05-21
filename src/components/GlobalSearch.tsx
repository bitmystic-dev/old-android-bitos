import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useBitStore } from "@/lib/store";
import { NAV } from "@/data/nav";
import { useNavigate } from "@tanstack/react-router";

type Hit = { id: string; type: "task" | "event" | "habit" | "page"; title: string; sub?: string; to: string };

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const tasks = useBitStore((s) => s.tasks);
  const events = useBitStore((s) => s.events);
  const habits = useBitStore((s) => s.habits);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      return NAV.filter((n) => !n.soon).slice(0, 6).map((n) => ({
        id: n.to, type: "page", title: n.label, sub: n.hint, to: n.to,
      }));
    }
    const out: Hit[] = [];
    for (const t of tasks) if (t.title.toLowerCase().includes(term))
      out.push({ id: "t-" + t.id, type: "task", title: t.title, sub: t.status === "done" ? "done" : t.priority, to: "/planner" });
    for (const e of events) if (e.title.toLowerCase().includes(term))
      out.push({ id: "e-" + e.id, type: "event", title: e.title, sub: `${e.date}${e.time ? " " + e.time : ""}`, to: "/planner" });
    for (const h of habits) if (h.name.toLowerCase().includes(term))
      out.push({ id: "h-" + h.id, type: "habit", title: h.name, sub: "habit", to: "/habits" });
    for (const n of NAV) if (n.label.toLowerCase().includes(term))
      out.push({ id: "p-" + n.to, type: "page", title: n.label, sub: "page", to: n.to });
    return out.slice(0, 12);
  }, [q, tasks, events, habits]);

  const go = (to: string) => {
    setOpen(false); setQ("");
    navigate({ to });
  };

  return (
    <div className="flex-1 max-w-md relative" ref={ref}>
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-secondary/60">
        <Search className="h-4 w-4 opacity-60" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="search bitos…"
          className="bg-transparent outline-none text-sm flex-1 placeholder:opacity-60 min-w-0"
        />
        <kbd className="hidden sm:inline text-[10px] font-mono opacity-60 border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bitos-window p-1 z-[100] shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="bitos-titlebar -mx-1 -mt-1 mb-1 text-xs">search.sys{q ? ` — “${q}”` : ""}</div>
          {hits.length === 0 ? (
            <div className="px-3 py-4 text-xs font-mono opacity-60 text-center">no matches in your universe</div>
          ) : (
            <ul className="space-y-0.5">
              {hits.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => go(h.to)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary text-left"
                  >
                    <span className="text-[9px] font-mono uppercase opacity-60 w-12">{h.type}</span>
                    <span className="text-sm flex-1 truncate">{h.title}</span>
                    {h.sub && <span className="text-[10px] font-mono opacity-50">{h.sub}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
