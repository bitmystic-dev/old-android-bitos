import { Link, useRouterState } from "@tanstack/react-router";
import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] bg-background/70 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed left-0 bottom-0 z-[210] w-[80vw] max-w-[300px] bitos-window mx-2 mb-2 mt-4 md:hidden flex flex-col overflow-hidden bitos-safe-top bitos-safe-bottom"
            style={{ top: "calc(var(--safe-top) + 0.75rem)" }}
          >
            <div className="bitos-titlebar">
              <span className="text-sm tracking-widest truncate">BitOS://menu</span>
              <button onClick={onClose} aria-label="Close" className="shrink-0"><X className="h-4 w-4" /></button>
            </div>
            <nav className="p-2 flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm min-w-0",
                          active ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.soon && (
                            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent text-accent-foreground leading-none shrink-0">
                              SOON
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-mono opacity-50 shrink-0">{item.hint}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-border px-3 py-2 font-mono text-[10px] text-foreground/55">
              Made by Sai Pranav (BitMystic)
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
