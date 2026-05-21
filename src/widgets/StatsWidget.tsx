import { RetroWindow } from "@/components/RetroWindow";
import { Cpu, HardDrive, Wifi, Zap } from "lucide-react";

const stats = [
  { icon: Cpu, label: "FOCUS", value: 72, suffix: "%" },
  { icon: Zap, label: "ENERGY", value: 58, suffix: "%" },
  { icon: HardDrive, label: "NOTES", value: 184, suffix: "" },
  { icon: Wifi, label: "STREAK", value: 21, suffix: "d" },
];

export function StatsWidget() {
  return (
    <RetroWindow title="system.stat" subtitle="vitals">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const I = s.icon;
          return (
            <div key={s.label} className="rounded-md border border-border p-3 bg-secondary/40">
              <div className="flex items-center justify-between text-[10px] font-mono opacity-70">
                <span>{s.label}</span>
                <I className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-display text-3xl text-primary">
                {s.value}<span className="text-base opacity-70">{s.suffix}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, s.value)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </RetroWindow>
  );
}
