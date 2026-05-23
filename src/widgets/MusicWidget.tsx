import { Link } from "@tanstack/react-router";
import { RetroWindow } from "@/components/RetroWindow";
import { Music, Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { useMusic, currentTrack } from "@/lib/music/store";

export function MusicWidget() {
  const s = useMusic();
  const track = currentTrack(s);

  return (
    <RetroWindow title="bitmusic.exe" icon={<Music className="h-3.5 w-3.5" />}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-md bg-gradient-to-br from-primary via-accent to-glow border border-border shrink-0 overflow-hidden">
          {track?.artwork && <img src={track.artwork} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{track?.title ?? "no track loaded"}</div>
          <div className="text-xs opacity-60 truncate">{track?.artist ?? "open bitmusic.exe"}</div>
          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all"
              style={{ width: `${s.duration ? (s.currentTime / s.duration) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button className="bitos-btn !px-2" aria-label="Prev" onClick={s.prev} disabled={!track}><SkipBack className="h-4 w-4" /></button>
        <button className="bitos-btn !px-3" onClick={s.toggle} aria-label="Play" disabled={!track}>
          {s.buffering ? <Loader2 className="h-4 w-4 animate-spin" /> : s.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button className="bitos-btn !px-2" aria-label="Next" onClick={s.next} disabled={!track}><SkipForward className="h-4 w-4" /></button>
        <Link to="/bitmusic" className="bitos-btn !px-2 text-xs ml-1">open</Link>
      </div>
    </RetroWindow>
  );
}
