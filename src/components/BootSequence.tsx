import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "[ OK ] mounting /universe",
  "[ OK ] loading bitos.kernel v0.2.0",
  "[ OK ] starting auth.shell",
  "[ OK ] linking firestore://users",
  "[ OK ] hydrating workspace",
  "[ OK ] ready.",
];

const KEY = "bitos.booted";

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY) === "1") return;
    sessionStorage.setItem(KEY, "1");
    setShow(true);
    const t1 = setInterval(() => setStep((s) => Math.min(s + 1, LINES.length)), 320);
    const t2 = setTimeout(() => setShow(false), 2600);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black text-green-400 font-mono flex items-center justify-center p-6"
          style={{ background: "radial-gradient(ellipse at center, #1a0b2e 0%, #050010 70%, #000 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-25" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.06) 3px, transparent 4px)"
          }} />
          <div className="relative w-full max-w-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-6"
            >
              <div className="text-5xl sm:text-6xl tracking-widest" style={{ fontFamily: "VT323, monospace", color: "#c4a8ff", textShadow: "0 0 24px #7c3aedaa" }}>
                BitOS://
              </div>
              <div className="text-[11px] opacity-60 mt-1 tracking-[0.4em]">PERSONAL OPERATING SYSTEM</div>
            </motion.div>
            <div className="text-xs sm:text-sm space-y-1 min-h-[8rem]">
              {LINES.slice(0, step).map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {l}
                </motion.div>
              ))}
              {step < LINES.length && (
                <div className="opacity-70">
                  &gt; <span className="inline-block w-2 h-3 bg-green-400 align-middle animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
