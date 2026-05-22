import { type ReactNode } from "react";

export function PageShell({
  title, subtitle, action, children,
}: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="bitos-window px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-primary truncate max-w-full">{title}</h1>
          <span className="font-mono text-[10px] sm:text-xs opacity-70 truncate">// {subtitle}</span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
