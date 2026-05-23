/**
 * Version helpers. On native (Capacitor) we read the real installed version
 * from @capacitor/app. On web we fall back to /version.txt shipped with the
 * static bundle so the same code works in browser preview.
 */
import { Capacitor } from "@capacitor/core";

let _cachedVersion: string | null = null;

export async function getVersion(): Promise<string> {
  if (_cachedVersion) return _cachedVersion;
  try {
    if (Capacitor.isNativePlatform()) {
      const { App } = await import("@capacitor/app");
      const info = await App.getInfo();
      _cachedVersion = info.version || "0.0.0";
      return _cachedVersion;
    }
  } catch {}
  try {
    const res = await fetch("/version.txt", { cache: "no-store" });
    _cachedVersion = (await res.text()).trim().replace(/^v/, "");
    return _cachedVersion;
  } catch {
    return "unknown";
  }
}

/** Compare two dotted versions. Returns -1 / 0 / 1. */
export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, "").split(/[.\-+]/).map((x) => parseInt(x, 10) || 0);
  const pb = b.replace(/^v/, "").split(/[.\-+]/).map((x) => parseInt(x, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}
