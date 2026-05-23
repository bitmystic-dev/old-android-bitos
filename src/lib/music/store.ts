/**
 * BitOS music store — Monochrome-style:
 * single global <audio>, queue + history, shuffle/repeat,
 * MediaSession API integration for lockscreen / system controls.
 */
import { create } from "zustand";
import type { Track } from "./types";
import { hifiProvider } from "./providers/hifi";

type Repeat = "off" | "one" | "all";

type State = {
  queue: Track[];
  index: number;        // -1 if nothing loaded
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: Repeat;
  buffering: boolean;
  error: string | null;
};

type Actions = {
  playNow: (track: Track, queue?: Track[]) => Promise<void>;
  playQueue: (tracks: Track[], startIndex?: number) => Promise<void>;
  enqueue: (track: Track) => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  toggle: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  clearQueue: () => void;
  removeAt: (i: number) => void;
};

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "metadata";
  audio.crossOrigin = "anonymous";
  audio.addEventListener("timeupdate", () => {
    useMusic.setState({ currentTime: audio!.currentTime, duration: audio!.duration || 0 });
  });
  audio.addEventListener("play",    () => useMusic.setState({ isPlaying: true, buffering: false }));
  audio.addEventListener("pause",   () => useMusic.setState({ isPlaying: false }));
  audio.addEventListener("waiting", () => useMusic.setState({ buffering: true }));
  audio.addEventListener("playing", () => useMusic.setState({ buffering: false }));
  audio.addEventListener("error",   () => useMusic.setState({ error: "playback error", buffering: false, isPlaying: false }));
  audio.addEventListener("ended",   () => { void useMusic.getState().next(); });
  return audio;
}

function updateMediaSession(track: Track | null) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artwork ? [{ src: track.artwork, sizes: "640x640", type: "image/jpeg" }] : [],
  });
  const a = useMusic;
  navigator.mediaSession.setActionHandler("play",         () => a.getState().toggle());
  navigator.mediaSession.setActionHandler("pause",        () => a.getState().toggle());
  navigator.mediaSession.setActionHandler("nexttrack",    () => { void a.getState().next(); });
  navigator.mediaSession.setActionHandler("previoustrack",() => { void a.getState().prev(); });
  navigator.mediaSession.setActionHandler("seekto",       (d) => { if (d.seekTime != null) a.getState().seek(d.seekTime); });
}

async function loadAndPlay(track: Track) {
  const el = getAudio();
  useMusic.setState({ buffering: true, error: null });
  try {
    let url = track.streamUrl;
    if (!url) {
      url = track.provider === "hifi"
        ? await hifiProvider.resolveStream(track)
        : track.streamUrl;
    }
    if (!url) throw new Error("no stream url");
    el.src = url;
    el.volume = useMusic.getState().volume;
    await el.play();
    updateMediaSession(track);
  } catch (e: any) {
    useMusic.setState({ error: e?.message || "failed to play", buffering: false, isPlaying: false });
  }
}

export const useMusic = create<State & Actions>((set, get) => ({
  queue: [],
  index: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  shuffle: false,
  repeat: "off",
  buffering: false,
  error: null,

  async playNow(track, queue) {
    const q = queue ?? [track];
    const idx = q.findIndex((t) => t.id === track.id);
    set({ queue: q, index: idx >= 0 ? idx : 0 });
    await loadAndPlay(track);
  },

  async playQueue(tracks, startIndex = 0) {
    if (!tracks.length) return;
    const i = Math.max(0, Math.min(startIndex, tracks.length - 1));
    set({ queue: tracks, index: i });
    await loadAndPlay(tracks[i]);
  },

  enqueue(track) {
    set((s) => ({ queue: [...s.queue, track], index: s.index < 0 ? 0 : s.index }));
    if (get().index === get().queue.length - 1 && !get().isPlaying) void loadAndPlay(track);
  },

  async next() {
    const { queue, index, shuffle, repeat } = get();
    if (!queue.length) return;
    if (repeat === "one") { getAudio().currentTime = 0; await getAudio().play(); return; }
    let nextIdx = shuffle
      ? Math.floor(Math.random() * queue.length)
      : index + 1;
    if (nextIdx >= queue.length) {
      if (repeat === "all") nextIdx = 0;
      else { set({ isPlaying: false }); getAudio().pause(); return; }
    }
    set({ index: nextIdx });
    await loadAndPlay(queue[nextIdx]);
  },

  async prev() {
    const { queue, index } = get();
    if (!queue.length) return;
    if (getAudio().currentTime > 3) { getAudio().currentTime = 0; return; }
    const i = Math.max(0, index - 1);
    set({ index: i });
    await loadAndPlay(queue[i]);
  },

  toggle() {
    const el = getAudio();
    if (el.paused) { void el.play(); } else { el.pause(); }
  },

  seek(sec) {
    const el = getAudio();
    if (Number.isFinite(sec)) el.currentTime = sec;
  },

  setVolume(v) {
    const vol = Math.max(0, Math.min(1, v));
    set({ volume: vol });
    getAudio().volume = vol;
  },

  toggleShuffle() { set((s) => ({ shuffle: !s.shuffle })); },
  cycleRepeat()  { set((s) => ({ repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off" })); },
  clearQueue()   { getAudio().pause(); set({ queue: [], index: -1, isPlaying: false, currentTime: 0, duration: 0 }); },
  removeAt(i)    {
    set((s) => {
      const q = s.queue.slice(); q.splice(i, 1);
      const idx = i < s.index ? s.index - 1 : s.index >= q.length ? q.length - 1 : s.index;
      return { queue: q, index: idx };
    });
  },
}));

export const currentTrack = (s: State): Track | null =>
  s.index >= 0 && s.queue[s.index] ? s.queue[s.index] : null;

export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
