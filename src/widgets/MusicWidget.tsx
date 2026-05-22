import { useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Music, Play, Pause, SkipBack, SkipForward } from "lucide-react";

export function MusicWidget() {
  const [playing, setPlaying] = useState(false);
  return (
    <RetroWindow title="bitmusic.exe" icon={<Music className="h-3.5 w-3.5" />}>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-md bg-gradient-to-br from-primary via-accent to-glow border border-border shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">Lo-fi for late nights</div>
          <div className="text-xs opacity-60 truncate">chillsynth · bitos radio</div>
          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "42%" }} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button className="bitos-btn !px-2" aria-label="Prev"><SkipBack className="h-4 w-4" /></button>
        <button className="bitos-btn !px-3" onClick={() => setPlaying((p) => !p)} aria-label="Play">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button className="bitos-btn !px-2" aria-label="Next"><SkipForward className="h-4 w-4" /></button>
      </div>
    </RetroWindow>
  );
}
