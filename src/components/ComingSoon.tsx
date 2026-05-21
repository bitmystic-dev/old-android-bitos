import { motion } from "framer-motion";
import { Sparkles, Bell } from "lucide-react";

export function ComingSoon({
  moduleName, tagline, blurb, features,
}: {
  moduleName: string;
  tagline: string;
  blurb: string;
  features: { name: string; desc: string }[];
}) {
  return (
    <div className="space-y-3">
      <div className="bitos-window px-4 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-display text-2xl sm:text-3xl text-primary">{moduleName}</h1>
        <span className="font-mono text-xs opacity-70">// {tagline}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-full bg-accent text-accent-foreground">
          <Sparkles className="h-3 w-3" /> COMING SOON
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bitos-window p-8 sm:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bitos-aurora opacity-40 -z-10" />
        <div className="absolute inset-0 bitos-scanlines opacity-20 pointer-events-none" />
        <div className="font-display text-6xl sm:text-7xl text-primary cursor-blink">SYSTEM INITIALIZING</div>
        <p className="mt-4 max-w-xl mx-auto text-sm opacity-80">{blurb}</p>
        <div className="mt-6 inline-flex items-center gap-2">
          <button className="bitos-btn !bg-primary !text-primary-foreground">
            <Bell className="h-3.5 w-3.5" /> notify me when ready
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="bitos-window p-4 hover:border-primary transition"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg text-primary">{f.name}</h3>
              <span className="text-[10px] font-mono opacity-50">v0.next</span>
            </div>
            <p className="mt-1.5 text-sm opacity-80">{f.desc}</p>
            <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${20 + i * 15}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                className="h-full bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
