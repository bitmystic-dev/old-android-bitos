import { useEffect, useState } from "react";
import { enterFullscreen, isDesktop, isFullscreen } from "@/lib/fullscreen";
import { Maximize2, X } from "lucide-react";

const PROMPT_KEY = "bitos.fs.dismissed";

export function FullscreenManager() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isDesktop()) return;
    if (localStorage.getItem(PROMPT_KEY) === "1") return;
    if (isFullscreen()) return;
    setShow(true);

    // Try to enter fullscreen on the next user gesture (browsers require it).
    const onGesture = () => {
      enterFullscreen();
      setShow(false);
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
    };
    document.addEventListener("click", onGesture, { once: true });
    document.addEventListener("keydown", onGesture, { once: true });

    return () => {
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
    };
  }, []);

  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bitos-window px-3 py-2 flex items-center gap-3 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <Maximize2 className="h-4 w-4 text-primary" />
      <span className="font-mono text-xs">Tap anywhere to enter immersive mode</span>
      <button
        className="opacity-60 hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); localStorage.setItem(PROMPT_KEY, "1"); setShow(false); }}
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
