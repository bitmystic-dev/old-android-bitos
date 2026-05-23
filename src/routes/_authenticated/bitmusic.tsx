import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";
import { hifiProvider } from "@/lib/music/providers/hifi";
import { useMusic, currentTrack, formatTime } from "@/lib/music/store";
import type { Track } from "@/lib/music/types";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Plus, Trash2, Search, Loader2, Volume2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bitmusic")({
  component: BitMusicPage,
  head: () => ({ meta: [{ title: "bitmusic.exe — BitOS" }] }),
});

function BitMusicPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const s = useMusic();
  const track = currentTrack(s);

  const search = async () => {
    if (!q.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await hifiProvider.search(q.trim(), { limit: 25 });
      setResults(r.tracks);
    } catch (e: any) { setErr(e?.message || "search failed"); }
    finally { setBusy(false); }
  };

  return (
    <PageShell title="bitmusic" subtitle="bitmusic.exe">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Now playing */}
        <RetroWindow title="now_playing" className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md border border-border overflow-hidden shrink-0 bg-gradient-to-br from-primary via-accent to-glow">
              {track?.artwork && <img src={track.artwork} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-medium truncate">{track?.title ?? "— nothing queued —"}</div>
              <div className="text-xs opacity-60 truncate">{track?.artist ?? "search a track to begin"}</div>
              <div className="mt-2">
                <input
                  type="range" min={0} max={s.duration || 0} step={1} value={s.currentTime}
                  onChange={(e) => s.seek(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono opacity-60">
                  <span>{formatTime(s.currentTime)}</span>
                  <span>{formatTime(s.duration)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button onClick={s.toggleShuffle} className={`bitos-btn !px-2 ${s.shuffle ? "!bg-primary !text-primary-foreground" : ""}`} aria-label="shuffle"><Shuffle className="h-4 w-4" /></button>
            <button onClick={s.prev} className="bitos-btn !px-2" aria-label="prev"><SkipBack className="h-4 w-4" /></button>
            <button onClick={s.toggle} className="bitos-btn !px-3" aria-label="play">
              {s.buffering ? <Loader2 className="h-4 w-4 animate-spin" /> : s.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={s.next} className="bitos-btn !px-2" aria-label="next"><SkipForward className="h-4 w-4" /></button>
            <button onClick={s.cycleRepeat} className={`bitos-btn !px-2 ${s.repeat !== "off" ? "!bg-primary !text-primary-foreground" : ""}`} aria-label="repeat">
              {s.repeat === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-1 ml-2">
              <Volume2 className="h-3.5 w-3.5 opacity-60" />
              <input type="range" min={0} max={1} step={0.01} value={s.volume}
                onChange={(e) => s.setVolume(Number(e.target.value))}
                className="w-20 accent-primary" />
            </div>
          </div>
          {s.error && <p className="mt-2 text-xs text-destructive font-mono">{s.error}</p>}
        </RetroWindow>

        {/* Queue */}
        <RetroWindow title="queue.list" subtitle={`${s.queue.length} track${s.queue.length === 1 ? "" : "s"}`}>
          {s.queue.length === 0 ? (
            <p className="text-xs opacity-60">// queue empty</p>
          ) : (
            <ul className="space-y-1 max-h-[260px] overflow-auto -mx-1 px-1">
              {s.queue.map((t, i) => (
                <li key={`${t.id}-${i}`} className={`flex items-center gap-2 rounded px-2 py-1 ${i === s.index ? "bg-primary/15" : "hover:bg-secondary"}`}>
                  <button className="text-xs font-mono opacity-60 w-5" onClick={() => useMusic.setState({ index: i })}>{i + 1}</button>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate">{t.title}</div>
                    <div className="text-[10px] opacity-60 truncate">{t.artist}</div>
                  </div>
                  <button onClick={() => s.removeAt(i)} className="opacity-50 hover:opacity-100" aria-label="remove"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
          {s.queue.length > 0 && (
            <button onClick={s.clearQueue} className="bitos-btn mt-2 w-full text-xs">clear queue</button>
          )}
        </RetroWindow>

        {/* Search */}
        <RetroWindow title="search.hifi" className="lg:col-span-3">
          <div className="flex gap-2">
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="search artist / track / album…"
              className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button onClick={search} className="bitos-btn !bg-primary !text-primary-foreground" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </div>
          {err && <p className="mt-2 text-xs text-destructive font-mono">{err}</p>}
          {results.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((t) => (
                <li key={t.id} className="flex items-center gap-2 rounded-md border border-border p-2 hover:border-primary transition">
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                    {t.artwork && <img src={t.artwork} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate">{t.title}</div>
                    <div className="text-[10px] opacity-60 truncate">{t.artist}</div>
                  </div>
                  <button onClick={() => s.enqueue(t)} className="bitos-btn !px-2" title="enqueue"><Plus className="h-3.5 w-3.5" /></button>
                  <button onClick={() => s.playNow(t, results)} className="bitos-btn !px-2 !bg-primary !text-primary-foreground" title="play"><Play className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
        </RetroWindow>
      </div>
    </PageShell>
  );
}
