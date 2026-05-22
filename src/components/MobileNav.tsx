import { Link, useRouterState } from "@tanstack/react-router";
import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const primary = NAV.slice(0, 5);

  return (
    <>
      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bitos-window m-2 md:hidden flex flex-col"
            >
              <div className="bitos-titlebar">
                <span className="text-sm tracking-widest">BitOS://menu</span>
                <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
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
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                            active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <span className="ml-auto text-[10px] font-mono opacity-60">{item.hint}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-2 left-2 right-2 z-30 bitos-window px-2 py-1.5 flex justify-around">
        {primary.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px]",
                active ? "text-primary" : "text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
