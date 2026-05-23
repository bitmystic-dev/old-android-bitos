import { useEffect, useState } from "react";
import { Download, X, AlertTriangle } from "lucide-react";
import { checkForUpdate, type UpdateInfo } from "@/lib/updateService";
import { downloadAndInstallApk, type Progress } from "@/lib/apkInstaller";

const DISMISS_KEY = "bitos.update.dismissedFor";

export function UpdatePrompt() {
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await checkForUpdate();
        if (!alive || !u.hasUpdate) return;
        const dismissed = localStorage.getItem(DISMISS_KEY);
        if (!u.manifest.mandatory && dismissed === u.latest) return;
        setInfo(u);
        setOpen(true);
      } catch {/* silent */}
    })();
    return () => { alive = false; };
  }, []);

  if (!open || !info) return null;

  const dismiss = () => {
    if (!info.manifest.mandatory) localStorage.setItem(DISMISS_KEY, info.latest);
    setOpen(false);
  };

  const install = async () => {
    setError(null);
    setBusy(true);
    try {
      await downloadAndInstallApk(info.manifest.apkUrl, setProgress);
    } catch (e: any) {
      setError(e?.message || "Download failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-3 bg-background/70 backdrop-blur-sm">
      <div className="bitos-window w-full max-w-md">
        <div className="bitos-titlebar">
          <span>updater.sys</span>
          {!info.manifest.mandatory && (
            <button onClick={dismiss} className="opacity-70 hover:opacity-100" aria-label="close">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/15 grid place-items-center shrink-0">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight">BitOS {info.latest}</div>
              <div className="text-xs font-mono opacity-70">installed: v{info.current}</div>
              {info.manifest.mandatory && (
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" /> mandatory update
                </div>
              )}
            </div>
          </div>

          {progress && (
            <div>
              <div className="flex justify-between text-[10px] font-mono opacity-70 mb-1">
                <span>downloading</span>
                <span>{progress.percent.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-destructive font-mono">{error}</p>}

          <div className="flex gap-2 justify-end">
            {!info.manifest.mandatory && (
              <button onClick={dismiss} className="bitos-btn" disabled={busy}>later</button>
            )}
            <button onClick={install} className="bitos-btn !bg-primary !text-primary-foreground" disabled={busy}>
              {busy ? "downloading…" : "install update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
