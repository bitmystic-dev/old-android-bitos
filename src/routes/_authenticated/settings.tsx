import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, THEMES, WALLPAPERS, type ThemeName, type Wallpaper } from "@/contexts/ThemeContext";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — BitOS" }] }),
});

const ACCENTS = ["oklch(0.72 0.2 295)", "oklch(0.75 0.28 330)", "oklch(0.8 0.22 145)", "oklch(0.78 0.18 65)", "oklch(0.7 0.18 0)", "oklch(0.65 0.2 220)"];

function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, custom, setCustom, reset } = useTheme();

  return (
    <PageShell title="settings" subtitle="config.sys">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RetroWindow title="appearance.themes">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeName)}
                className={`text-left rounded-md border p-3 hover:border-primary transition ${theme === t.id ? "border-primary ring-2 ring-ring" : "border-border"}`}
              >
                <div className="flex gap-1 mb-2">
                  {t.swatch.map((c, i) => (
                    <span key={i} className="h-5 w-5 rounded-full border border-border" style={{ background: c }} />
                  ))}
                </div>
                <div className="text-sm">{t.label}</div>
              </button>
            ))}
          </div>
        </RetroWindow>

        <RetroWindow title="appearance.wallpaper">
          <div className="grid grid-cols-3 gap-2">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => setCustom({ wallpaper: w.id as Wallpaper })}
                className={`group relative aspect-video rounded-md overflow-hidden border ${custom.wallpaper === w.id ? "border-primary ring-2 ring-ring" : "border-border"}`}
              >
                <div className={`absolute inset-0 bitos-${w.id === "none" ? "none" : w.id}`} />
                <div className="absolute inset-x-0 bottom-0 bg-background/80 text-xs px-2 py-1 font-mono">{w.label}</div>
              </button>
            ))}
          </div>
        </RetroWindow>

        <RetroWindow title="appearance.accent">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCustom({ accent: null })}
              className={`h-9 w-9 rounded-full border-2 ${!custom.accent ? "border-foreground" : "border-border"}`}
              style={{ background: "conic-gradient(red,orange,yellow,green,cyan,blue,violet,red)" }}
              title="Theme default"
            />
            {ACCENTS.map((c) => (
              <button
                key={c}
                onClick={() => setCustom({ accent: c })}
                className={`h-9 w-9 rounded-full border-2 ${custom.accent === c ? "border-foreground" : "border-border"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </RetroWindow>

        <RetroWindow title="appearance.custom">
          <div className="space-y-4">
            <label className="block">
              <div className="flex justify-between text-sm mb-1"><span>Border radius</span><span className="font-mono text-xs opacity-70">{custom.radius}px</span></div>
              <input type="range" min={0} max={24} value={custom.radius} onChange={(e) => setCustom({ radius: Number(e.target.value) })} className="w-full" />
            </label>
            <label className="block">
              <div className="flex justify-between text-sm mb-1"><span>Background blur</span><span className="font-mono text-xs opacity-70">{custom.blur}px</span></div>
              <input type="range" min={0} max={40} value={custom.blur} onChange={(e) => setCustom({ blur: Number(e.target.value) })} className="w-full" />
            </label>
            <label className="block">
              <div className="flex justify-between text-sm mb-1"><span>Window opacity</span><span className="font-mono text-xs opacity-70">{custom.opacity}%</span></div>
              <input type="range" min={40} max={100} value={custom.opacity} onChange={(e) => setCustom({ opacity: Number(e.target.value) })} className="w-full" />
            </label>
            <div>
              <div className="text-sm mb-1">Density</div>
              <div className="flex gap-2">
                {(["compact", "comfy", "spacious"] as const).map((d) => (
                  <button key={d} onClick={() => setCustom({ density: d })} className={`bitos-btn ${custom.density === d ? "!bg-primary !text-primary-foreground" : ""}`}>{d}</button>
                ))}
              </div>
            </div>
            <button onClick={reset} className="bitos-btn">reset to defaults</button>
          </div>
        </RetroWindow>

        <RetroWindow title="account" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent border border-border" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl truncate">{user?.displayName || "operator"}</div>
              <div className="text-xs font-mono opacity-70 truncate">{user?.email}</div>
            </div>
            <button onClick={signOut} className="bitos-btn">sign out</button>
          </div>
        </RetroWindow>
      </div>
    </PageShell>
  );
}
