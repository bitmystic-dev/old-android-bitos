/**
 * HiFi (TIDAL-via-public-instance) provider — same pattern as SpoFree /
 * Monochrome. We never bundle a single hardcoded instance: try the list
 * in order until one responds. Users can override via localStorage key
 * `bitos.hifiInstance`.
 */
import type { MusicProvider, SearchResult, Track } from "../types";

const DEFAULT_INSTANCES = [
  "https://hifi.401658.xyz",
  "https://tidal.qqdl.site",
];

function instances(): string[] {
  try {
    const override = localStorage.getItem("bitos.hifiInstance");
    if (override) return [override, ...DEFAULT_INSTANCES];
  } catch {}
  return DEFAULT_INSTANCES;
}

async function tryEach<T>(path: string, parse: (j: any) => T): Promise<T> {
  let lastErr: unknown;
  for (const base of instances()) {
    try {
      const res = await fetch(`${base}${path}`, { redirect: "follow" });
      if (!res.ok) { lastErr = new Error(`${res.status}`); continue; }
      const j = await res.json();
      return parse(j);
    } catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error("all hifi instances failed");
}

function pickArtwork(cover?: string): string | undefined {
  if (!cover) return undefined;
  return `https://resources.tidal.com/images/${cover.replace(/-/g, "/")}/640x640.jpg`;
}

export const hifiProvider: MusicProvider = {
  id: "hifi",
  label: "HiFi (TIDAL)",

  async search(query, opts) {
    const limit = opts?.limit ?? 20;
    const q = encodeURIComponent(query);
    return tryEach<SearchResult>(`/search/?s=${q}&limit=${limit}`, (j) => {
      // Response shape varies between forks; be defensive.
      const items: any[] = j?.items ?? j?.tracks?.items ?? j?.tracks ?? [];
      const tracks: Track[] = items.map((t: any) => ({
        id: `hifi:${t.id}`,
        providerId: String(t.id),
        provider: "hifi",
        title: t.title ?? "Unknown",
        artist: t.artist?.name ?? t.artists?.[0]?.name ?? "Unknown",
        album: t.album?.title,
        artwork: pickArtwork(t.album?.cover ?? t.cover),
        durationSec: typeof t.duration === "number" ? t.duration : undefined,
      }));
      return { tracks };
    });
  },

  async resolveStream(track) {
    const id = track.providerId;
    return tryEach<string>(`/track/?id=${id}&quality=LOSSLESS`, (j) => {
      // Some instances return { OriginalTrackUrl } or { url } or an array.
      const url = j?.OriginalTrackUrl
        ?? j?.url
        ?? (Array.isArray(j) ? j.find((x: any) => x?.OriginalTrackUrl || x?.url) : null)?.OriginalTrackUrl
        ?? (Array.isArray(j) ? j.find((x: any) => x?.OriginalTrackUrl || x?.url) : null)?.url;
      if (!url) throw new Error("no stream url in response");
      return url as string;
    });
  },
};
