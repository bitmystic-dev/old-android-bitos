import { useTheme } from "@/contexts/ThemeContext";

export function WallpaperBackground() {
  const { custom } = useTheme();
  const w = custom.wallpaper;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {w === "aurora" && (
        <div className="absolute inset-0 bitos-aurora" />
      )}
      {w === "grid" && (
        <div className="absolute inset-0 bitos-grid" />
      )}
      {w === "stars" && (
        <div className="absolute inset-0 bitos-stars" />
      )}
      {w === "scanlines" && (
        <div className="absolute inset-0 bitos-scanlines" />
      )}
      {w === "mesh" && (
        <div className="absolute inset-0 bitos-mesh" />
      )}
    </div>
  );
}
