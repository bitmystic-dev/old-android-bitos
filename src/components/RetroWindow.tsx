import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
  delay?: number;
  noPadding?: boolean;
};

export function RetroWindow({
  title, subtitle, icon, actions, className, bodyClassName, children, delay = 0, noPadding,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("bitos-window relative flex flex-col", className)}
    >
      <header className="bitos-titlebar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bitos-titlebar-dots">
            <span className="bitos-dot" style={{ background: "#ff5f57" }} />
            <span className="bitos-dot" style={{ background: "#febc2e" }} />
            <span className="bitos-dot" style={{ background: "#28c840" }} />
          </span>
          {icon && <span className="ml-1 opacity-90">{icon}</span>}
          <h3 className="text-sm sm:text-base truncate">{title}</h3>
          {subtitle && (
            <span className="hidden sm:inline text-xs opacity-70 truncate">— {subtitle}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs opacity-90">{actions}</div>
      </header>
      <div className={cn("flex-1", !noPadding && "p-4 sm:p-5", bodyClassName)}>{children}</div>
    </motion.section>
  );
}
