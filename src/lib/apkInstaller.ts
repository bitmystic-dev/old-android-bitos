/**
 * APK downloader for Android (Capacitor) with progress + install handoff.
 * On web, falls back to opening the APK URL in a new tab.
 */
import { Capacitor } from "@capacitor/core";

export type Progress = { received: number; total: number; percent: number };

export async function downloadAndInstallApk(
  apkUrl: string,
  onProgress?: (p: Progress) => void,
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    window.open(apkUrl, "_blank", "noopener");
    return;
  }

  const { Filesystem, Directory } = await import("@capacitor/filesystem");
  const { FileOpener } = await import("@capacitor-community/file-opener");

  // Stream the APK and report progress.
  const res = await fetch(apkUrl);
  if (!res.ok || !res.body) throw new Error(`download failed (${res.status})`);

  const total = Number(res.headers.get("content-length")) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress?.({
      received,
      total,
      percent: total ? Math.min(100, (received / total) * 100) : 0,
    });
  }

  // Concatenate and base64-encode for Filesystem.writeFile.
  const blob = new Blob(chunks as BlobPart[]);
  const base64 = await blobToBase64(blob);
  const fileName = `bitos-update-${Date.now()}.apk`;

  const written = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
    recursive: true,
  });

  await FileOpener.open({
    filePath: written.uri,
    contentType: "application/vnd.android.package-archive",
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      const s = String(r.result);
      // strip data:...;base64, prefix
      resolve(s.slice(s.indexOf(",") + 1));
    };
    r.readAsDataURL(blob);
  });
}
