/**
 * BitOS update service.
 * Reads the manifest hosted in the bitmystic-dev/bitos-updates repo and
 * compares against the installed app version.
 *
 * Remote schema (version.json):
 *   {
 *     "latestVersion": "26.05.2",
 *     "versionCode":   260502,
 *     "apkUrl":        "https://github.com/<user>/bitos-updates/releases/download/v26.05.2/bitos.apk",
 *     "whatsNewUrl":   "https://raw.githubusercontent.com/<user>/bitos-updates/main/whatsnew.json",
 *     "mandatory":     false
 *   }
 *
 * whatsnew.json:
 *   { "version": "26.05.2", "title": "BitOS 26.05.2", "changes": ["..."] }
 */
import { compareVersions, getVersion } from "./version";

export const VERSION_MANIFEST_URL =
  "https://raw.githubusercontent.com/bitmystic-dev/bitos-updates/main/version.json";

export type VersionManifest = {
  latestVersion: string;
  versionCode?: number;
  apkUrl: string;
  whatsNewUrl?: string;
  mandatory?: boolean;
};

export type WhatsNew = {
  version: string;
  title: string;
  changes: string[];
};

export type UpdateInfo = {
  current: string;
  latest: string;
  hasUpdate: boolean;
  manifest: VersionManifest;
};

export async function fetchManifest(): Promise<VersionManifest> {
  const res = await fetch(`${VERSION_MANIFEST_URL}?_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`manifest fetch failed (${res.status})`);
  return (await res.json()) as VersionManifest;
}

export async function checkForUpdate(): Promise<UpdateInfo> {
  const [current, manifest] = await Promise.all([getVersion(), fetchManifest()]);
  const hasUpdate = compareVersions(manifest.latestVersion, current) > 0;
  return { current, latest: manifest.latestVersion, hasUpdate, manifest };
}

export async function fetchWhatsNew(url: string): Promise<WhatsNew> {
  const res = await fetch(`${url}?_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`whatsnew fetch failed (${res.status})`);
  return (await res.json()) as WhatsNew;
}

/* ---------- last-seen-version persistence for What's New ---------- */
const LAST_SEEN_KEY = "bitos.lastSeenVersion";
export function getLastSeenVersion(): string | null {
  try { return localStorage.getItem(LAST_SEEN_KEY); } catch { return null; }
}
export function setLastSeenVersion(v: string) {
  try { localStorage.setItem(LAST_SEEN_KEY, v); } catch {}
}
