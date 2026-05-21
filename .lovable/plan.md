## BitOS v2 — Auth, Power Menu, Interactive Dashboard

A big update split into focused, shippable pieces. Preserves the current visual identity (layered windows, retro-futuristic vibe, theme system).

### 1. Authentication (Firebase) 🔐
- Add Firebase Auth (email/password + optional Google).
- New routes:
  - `/login` — immersive "boot terminal" style login
  - `/signup` — matching aesthetic
- Route guard via TanStack `_authenticated` layout — all current app routes move under it.
- `AuthContext` with `onAuthStateChanged` for session persistence (Firebase persists by default in `localStorage`).
- Logout wired into the new Power Menu + user avatar.

**Setup needed from you:** Firebase project credentials (apiKey, authDomain, projectId, appId). I'll request them as secrets after you confirm.

### 2. Power Menu + Fullscreen 🖥️
- Top-right power icon → dropdown styled like a retro shutdown menu.
- Options: Enter/Exit Fullscreen, Lock (sign out), Power Off.
- Power Off → triggers a "BitOS powered off" CRT-style screen with a "Boot again" button (tab close attempted first via `window.close()`).
- Desktop auto-fullscreen on first user interaction (browsers block on-load fullscreen; we listen for the first click/keypress and request it then — this is the standard workaround).
- Mobile: skipped (detected via `matchMedia('(pointer: coarse)')`).
- ESC interception: rebind via Fullscreen API's `keepalive` pattern — when user exits fullscreen via ESC, we show a re-enter prompt rather than forcing re-entry (browsers don't allow blocking ESC; honest UX disclaimer).

### 3. Interactive Dashboard 🧩
- Replace static grid with **react-grid-layout** — drag, resize, collapse, remove per widget.
- Each widget header gets: collapse toggle, settings, remove button.
- "Add Widget" button → modal with all available widgets.
- Layout saved to `localStorage` keyed by user id.
- Reset-layout option in Settings.

### 4. Novel + AI → Coming Soon 🚧
- Replace existing route content with polished placeholder pages: animated "system initializing" header, feature preview cards, ETA badge, "Notify me" button.
- Sidebar entries stay; add small "soon" badge.

### 5. Mobile Polish 📱
- Larger tap targets on widget controls.
- Bottom nav already exists — tighten spacing.
- Disable drag/resize on touch (read-only layout on mobile, keep collapsible).

### 6. Theme System Expansion 🎨
- Wallpaper picker (gradient presets + animated options: stars, grid, scanlines, aurora).
- Accent color picker (HSL slider → updates `--primary`).
- Transparency + blur sliders applied to `.bitos-window`.
- All persisted in `localStorage` (existing `ThemeContext` extended).

### Technical Notes
- New deps: `firebase`, `react-grid-layout`, `react-resizable`.
- New files: `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx`, `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/_authenticated.tsx`, `src/components/PowerMenu.tsx`, `src/components/FullscreenManager.tsx`, `src/components/DashboardGrid.tsx`, `src/components/AddWidgetModal.tsx`, `src/components/PoweredOff.tsx`, `src/components/WallpaperBackground.tsx`.
- Existing routes (`/`, `/planner`, `/habits`, etc.) move under `_authenticated/`.

### Browser limitations (heads-up)
- **Auto-fullscreen on load**: browsers require a user gesture. Best we can do is request fullscreen on first interaction. I'll add a one-time "Tap to enter BitOS" splash on desktop to satisfy the gesture requirement gracefully.
- **Blocking ESC from exiting fullscreen**: not possible per spec. We'll detect exit and prompt to re-enter.
- **`window.close()`**: only works on tabs opened via script. Fallback = "powered off" screen.

Ready to proceed? Confirm and I'll:
1. Request Firebase credentials as secrets
2. Install deps + scaffold auth + guard
3. Build power menu + fullscreen manager
4. Convert dashboard to draggable grid
5. Polish Novel/AI placeholders + wallpapers
