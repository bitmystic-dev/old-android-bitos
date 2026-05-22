import { RetroWindow } from "@/components/RetroWindow";
import { Flame, Plus, X } from "lucide-react";
import { useState } from "react";
import { useBitStore, habitStreak, habitWeek, toISODate } from "@/lib/store";

export function HabitsWidget() {
  const habits = useBitStore((s) => s.habits);
  const addHabit = useBitStore((s) => s.addHabit);
  const deleteHabit = useBitStore((s) => s.deleteHabit);
  const toggleHabitDay = useBitStore((s) => s.toggleHabitDay);
  const [name, setName] = useState("");
  const today = toISODate();

  const add = async () => {
    if (!name.trim()) return;
    await addHabit(name.trim());
    setName("");
  };

  return (
    <RetroWindow title="habits.run" subtitle={habits.length ? "weekly streak" : "no habits yet"}>
      {habits.length === 0 ? (
        <div className="py-4 text-center">
          <div className="font-mono text-xs opacity-60 mb-2">// build a loop</div>
          <p className="text-sm opacity-80 mb-3">Add a habit you want to repeat daily.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {habits.map((h) => {
            const week = habitWeek(h);
            const streak = habitStreak(h);
            return (
              <li key={h.id} className="group">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="truncate">{h.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs flex items-center gap-1 text-accent">
                      <Flame className="h-3 w-3" /> {streak}d
                    </span>
                    <button
                      onClick={() => deleteHabit(h.id)}
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
                      title="Remove habit"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {week.map((done, i) => {
                    const isToday = i === 6;
                    return (
                      <button
                        key={i}
                        onClick={() => { if (isToday) void toggleHabitDay(h.id, today); }}
                        disabled={!isToday}
                        className={`h-6 rounded-sm border border-border transition ${isToday ? "cursor-pointer hover:ring-1 hover:ring-primary" : "cursor-default"}`}
                        style={{ background: done ? "var(--color-primary)" : "var(--color-muted)" }}
                        title={isToday ? (done ? "Unmark today" : "Mark today done") : ""}
                      />
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void add(); }}
          placeholder="new habit…"
          className="flex-1 text-sm bg-input border border-border rounded-md px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={() => void add()} className="bitos-btn"><Plus className="h-4 w-4" /></button>
      </div>
    </RetroWindow>
  );
}
