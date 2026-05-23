export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  durationSec?: number;
  /** Resolved stream URL (lazy — populated by provider). */
  streamUrl?: string;
  /** Provider identifier so we know how to resolve streamUrl later. */
  provider: ProviderId;
  /** Provider-specific raw id (e.g. TIDAL track id). */
  providerId: string;
};

export type ProviderId = "hifi" | "local";

export type SearchResult = {
  tracks: Track[];
};

export interface MusicProvider {
  id: ProviderId;
  label: string;
  search(query: string, opts?: { limit?: number }): Promise<SearchResult>;
  resolveStream(track: Track): Promise<string>;
}
