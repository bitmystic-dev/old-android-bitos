import { useEffect, useRef, useState } from "react";
import { Power, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { getVersion } from "@/lib/version";

export function PowerMenu() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    getVersion().then(setVersion).catch(() => {});
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Item = ({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) => (
    <button
      onClick={() => { onClick(); setOpen(false); }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors ${
        danger ? "hover:bg-destructive hover:text-destructive-foreground" : "hover:bg-secondary"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
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
        <div className="absolute right-0 mt-2 w-60 bitos-window p-2 z-[100] shadow-2xl origin-top-right">
          <div className="bitos-titlebar -mx-2 -mt-2 mb-2 text-xs">power.sys</div>
          <div className="space-y-0.5">
            <Item icon={RefreshCw} label="Reload BitOS" onClick={() => window.location.reload()} />
            <div className="my-1 h-px bg-border" />
            <Item icon={LogOut} label="Sign Out" danger onClick={async () => { await signOut(); navigate({ to: "/login" }); }} />
          </div>
          <div className="mt-2 px-2 py-1 text-[10px] font-mono opacity-60 border-t border-border pt-2">
            BitOS v{version || "—"}
          </div>
        </div>
      )}
    </div>
  );
}
