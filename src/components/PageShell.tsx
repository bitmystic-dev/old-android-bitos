import { type ReactNode } from "react";

export function PageShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="bitos-window px-4 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-display text-2xl sm:text-3xl text-primary">{title}</h1>
        <span className="font-mono text-xs opacity-70">// {subtitle}</span>
      </div>
      {children}
    </div>
  );
}
