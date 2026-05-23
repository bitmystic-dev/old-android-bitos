import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { getVersion } from "@/lib/version";
import {
  fetchManifest,
  fetchWhatsNew,
  getLastSeenVersion,
  setLastSeenVersion,
  type WhatsNew,
} from "@/lib/updateService";

export function WhatsNewDialog() {
  const [data, setData] = useState<WhatsNew | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const current = await getVersion();
        const lastSeen = getLastSeenVersion();
        // Only show if we've actually upgraded (not on a fresh install with no record).
        if (!lastSeen) { setLastSeenVersion(current); return; }
        if (lastSeen === current) return;

        const manifest = await fetchManifest().catch(() => null);
        const url = manifest?.whatsNewUrl
          ?? "https://raw.githubusercontent.com/bitmystic-dev/bitos-updates/main/whatsnew.json";
        const wn = await fetchWhatsNew(url);
        if (!alive) return;
        // Match either the manifest's latest or the installed version.
        if (wn.version === current || wn.version === manifest?.latestVersion) {
          setData(wn);
          setOpen(true);
        } else {
          setLastSeenVersion(current);
        }
      } catch {/* silent */}
    })();
    return () => { alive = false; };
  }, []);

  if (!open || !data) return null;

  const dismiss = async () => {
    setLastSeenVersion(await getVersion());
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-3 bg-background/70 backdrop-blur-sm">
      <div className="bitos-window w-full max-w-md">
        <div className="bitos-titlebar">
          <span>release_notes.md</span>
          <button onClick={dismiss} className="opacity-70 hover:opacity-100" aria-label="close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="font-display text-lg">{data.title}</div>
          </div>
          <div className="text-xs font-mono opacity-70">v{data.version}</div>
          <ul className="space-y-1.5 text-sm">
            {data.changes.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary mt-0.5">›</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end pt-1">
            <button onClick={dismiss} className="bitos-btn !bg-primary !text-primary-foreground">got it</button>
          </div>
        </div>
      </div>
    </div>
  );
}
