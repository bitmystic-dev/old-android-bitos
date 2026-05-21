import { useEffect, useRef, useState } from "react";
import { Power, Maximize2, Minimize2, LogOut, RefreshCw, Moon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { enterFullscreen, exitFullscreen, isFullscreen } from "@/lib/fullscreen";

export function PowerMenu() {
  const [open, setOpen] = useState(false);
  const [fs, setFs] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onFs = () => setFs(isFullscreen());
    document.addEventListener("click", onClick);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  const Item = ({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) => (
    <button
      onClick={() => { onClick(); setOpen(false); }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-left transition-colors ${
        danger ? "hover:bg-destructive hover:text-destructive-foreground" : "hover:bg-secondary"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="bitos-btn !px-2"
        aria-label="Power menu"
        title="Power"
      >
        <Power className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 bitos-window p-2 z-[100] shadow-2xl origin-top-right animate-in fade-in slide-in-from-top-2">
          <div className="bitos-titlebar -mx-2 -mt-2 mb-2 text-xs">power.sys</div>
          <div className="space-y-0.5">
            {fs ? (
              <Item icon={Minimize2} label="Exit Fullscreen" onClick={exitFullscreen} />
            ) : (
              <Item icon={Maximize2} label="Enter Fullscreen" onClick={enterFullscreen} />
            )}
            <Item icon={RefreshCw} label="Reload BitOS" onClick={() => window.location.reload()} />
            <div className="my-1 h-px bg-border" />
            <Item icon={Moon} label="Lock (Sign Out)" onClick={() => { signOut(); navigate({ to: "/login" }); }} />
            <Item icon={LogOut} label="Power Off" danger onClick={() => {
              try { exitFullscreen(); } catch {}
              try { window.close(); } catch {}
              setTimeout(() => navigate({ to: "/powered-off" }), 80);
            }} />
          </div>
          <div className="mt-2 px-2 py-1 text-[10px] font-mono opacity-60 border-t border-border pt-2">
            BitOS v0.2.0 · operator session
          </div>
        </div>
      )}
    </div>
  );
}
