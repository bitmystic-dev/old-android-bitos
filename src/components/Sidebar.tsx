```tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";
import { Power } from "lucide-react";
import { useEffect, useState } from "react";
import { getVersion } from "@/lib/version";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [version, setVersion] = useState("loading...");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  const isPreRelease =
    version.toLowerCase().includes("alpha") ||
    version.toLowerCase().includes("beta");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bitos-window m-3 mr-0 sticky top-3 h-[calc(100vh-1.5rem)] transition-[width] duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="bitos-titlebar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bitos-titlebar-dots">
            <span
              className="bitos-dot"
              style={{ background: "#ff5f57" }}
            />
            <span
              className="bitos-dot"
              style={{ background: "#febc2e" }}
            />
            <span
              className="bitos-dot"
              style={{ background: "#28c840" }}
            />
          </span>

          {!collapsed && (
            <span className="text-sm tracking-widest">
              BitOS://
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          className="text-xs opacity-80 hover:opacity-100"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="p-2 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground/85"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md bg-primary -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}

                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <span className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        {item.label}

                        {item.soon && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent text-accent-foreground leading-none">
                            SOON
                          </span>
                        )}
                      </span>

                      <span className="text-[10px] uppercase opacity-50 font-mono">
                        {item.hint}
                      </span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border text-xs font-mono opacity-70 flex items-center gap-2">
        <Power className="h-3.5 w-3.5" />

        {!collapsed && (
          <span>
            {version}
            {!isPreRelease && " — alive"}
          </span>
        )}
      </div>
    </aside>
  );
}
```
