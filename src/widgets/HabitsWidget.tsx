import { RetroWindow } from "@/components/RetroWindow";
import { Flame } from "lucide-react";

const habits = [
  { name: "Read", streak: 14, days: [1,1,1,0,1,1,1] },
  { name: "Workout", streak: 6, days: [1,0,1,1,1,1,0] },
  { name: "Write", streak: 21, days: [1,1,1,1,1,1,1] },
  { name: "Meditate", streak: 3, days: [0,0,1,1,1,0,0] },
];

export function HabitsWidget() {
  return (
    <RetroWindow title="habits.run" subtitle="weekly streak">
      <ul className="space-y-3">
        {habits.map((h) => (
          <li key={h.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{h.name}</span>
              <span className="font-mono text-xs flex items-center gap-1 text-accent">
                <Flame className="h-3 w-3" /> {h.streak}d
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {h.days.map((d, i) => (
                <div
                  key={i}
                  className="h-6 rounded-sm border border-border"
                  style={{ background: d ? "var(--color-primary)" : "var(--color-muted)" }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </RetroWindow>
  );
}
