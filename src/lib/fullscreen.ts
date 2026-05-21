export function isFullscreen() {
  return typeof document !== "undefined" && !!document.fullscreenElement;
}

export async function enterFullscreen() {
  try {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" } as any);
    }
  } catch (e) {
    console.warn("[bitos] fullscreen request failed", e);
  }
}

export async function exitFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {}
}

export function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
}
