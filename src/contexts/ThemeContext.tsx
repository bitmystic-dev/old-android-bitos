import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeName = "system" | "light" | "dark" | "retro" | "cyber" | "hacker" | "cozy" | "sakura" | "midnight";
export type Wallpaper = "none" | "aurora" | "grid" | "stars" | "scanlines" | "mesh";

export const THEMES: { id: ThemeName; label: string; swatch: string[] }[] = [
  { id: "system", label: "System", swatch: ["#e5e7eb", "#1f2937"] },
  { id: "light", label: "Light", swatch: ["#f7f5ee", "#6d4cf2", "#f4a261"] },
  { id: "dark", label: "Dark", swatch: ["#1a1530", "#b89aff", "#f4a261"] },
  { id: "retro", label: "Windows 95", swatch: ["#008080", "#c0c0c0", "#000080"] },
  { id: "cyber", label: "Cyberpunk", swatch: ["#1a0b2e", "#ff2a9d", "#00f0ff"] },
  { id: "hacker", label: "Hacker", swatch: ["#0a1a0a", "#39ff14", "#80ff80"] },
  { id: "cozy", label: "Cozy", swatch: ["#efe2cf", "#8b5a3c", "#d99a5b"] },
  { id: "sakura", label: "Sakura", swatch: ["#fde7ef", "#ff6b9d", "#ffc1d6"] },
  { id: "midnight", label: "Midnight", swatch: ["#15082b", "#a064ff", "#ff7ad9"] },
];

export const WALLPAPERS: { id: Wallpaper; label: string }[] = [
  { id: "none", label: "None" },
  { id: "aurora", label: "Aurora" },
  { id: "grid", label: "Grid" },
  { id: "stars", label: "Stars" },
  { id: "scanlines", label: "Scanlines" },
  { id: "mesh", label: "Mesh" },
];

type Customization = {
  radius: number;
  blur: number;
  density: "compact" | "comfy" | "spacious";
  fontDisplay: string;
  wallpaper: Wallpaper;
  /** 0-100, lower = more transparent windows */
  opacity: number;
  /** hex or CSS color, optional accent override */
  accent: string | null;
};

type Ctx = {
  theme: ThemeName;
  resolved: Exclude<ThemeName, "system">;
  setTheme: (t: ThemeName) => void;
  custom: Customization;
  setCustom: (c: Partial<Customization>) => void;
  reset: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

const THEME_CLASSES = ["dark", "theme-retro", "theme-cyber", "theme-hacker", "theme-cozy", "theme-sakura", "theme-midnight"];

const DEFAULT_CUSTOM: Customization = {
  radius: 12,
  blur: 8,
  density: "comfy",
  fontDisplay: "VT323",
  wallpaper: "aurora",
  opacity: 92,
  accent: null,
};

function applyTheme(resolved: Exclude<ThemeName, "system">) {
  const root = document.documentElement;
  THEME_CLASSES.forEach((c) => root.classList.remove(c));
  if (resolved === "dark") root.classList.add("dark");
  else if (resolved !== "light") root.classList.add(`theme-${resolved}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("system");
  const [custom, setCustomState] = useState<Customization>(DEFAULT_CUSTOM);

  useEffect(() => {
    const saved = localStorage.getItem("bitos-theme") as ThemeName | null;
    if (saved) setThemeState(saved);
    const c = localStorage.getItem("bitos-custom");
    if (c) {
      try { setCustomState((prev) => ({ ...prev, ...JSON.parse(c) })); } catch {}
    }
  }, []);

  const resolved = useMemo<Exclude<ThemeName, "system">>(() => {
    if (theme !== "system") return theme;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }, [theme]);

  useEffect(() => {
    applyTheme(resolved);
    const root = document.documentElement;
    root.style.setProperty("--radius", `${custom.radius / 16}rem`);
    root.style.setProperty("--bitos-blur", `${custom.blur}px`);
    root.style.setProperty("--bitos-window-opacity", String(custom.opacity / 100));
    if (custom.accent) {
      root.style.setProperty("--primary", custom.accent);
      root.style.setProperty("--ring", custom.accent);
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
    }
  }, [resolved, custom]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("bitos-theme", t);
  };
  const setCustom = (c: Partial<Customization>) => {
    setCustomState((prev) => {
      const next = { ...prev, ...c };
      localStorage.setItem("bitos-custom", JSON.stringify(next));
      return next;
    });
  };
  const reset = () => {
    setCustomState(DEFAULT_CUSTOM);
    localStorage.setItem("bitos-custom", JSON.stringify(DEFAULT_CUSTOM));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, custom, setCustom, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
