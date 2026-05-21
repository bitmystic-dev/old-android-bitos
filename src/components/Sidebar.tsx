import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";

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

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bitos-window m-3 mr-0 sticky top-3 h-[calc(100vh-1.5rem)] transition-[width] duration-300 overflow-hidden",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* TITLEBAR */}
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
          className="text-xs opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* NAVIGATION */}
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
                    "group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors duration-150",
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

      {/* TERMINAL FOOTER */}
      <div className="p-3 border-t border-border min-h-[58px] flex items-center">
        {!collapsed && (
          <div className="font-mono text-[11px] leading-tight text-foreground/75 overflow-hidden whitespace-nowrap w-full">
            <div className="flex items-center overflow-hidden">
              <span className="animate-pulse mr-1 text-primary shrink-0">
                █
              </span>

              <span className="terminal-typing">
                root@bit-os:~# creator
              </span>
            </div>

            <div className="terminal-result opacity-80 pl-[10px]">
              Sai Pranav // BitMystic
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
