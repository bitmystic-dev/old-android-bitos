import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WallpaperBackground } from "@/components/WallpaperBackground";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="bitos-window max-w-md w-full">
        <div className="bitos-titlebar"><span>error.404</span></div>
        <div className="p-6 text-center">
          <div className="font-display text-6xl text-primary">404</div>
          <p className="mt-2 text-sm opacity-70">That sector of the universe does not exist.</p>
          <Link to="/" className="bitos-btn mt-4 inline-flex">return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="bitos-window max-w-md w-full">
        <div className="bitos-titlebar"><span>fatal.exception</span></div>
        <div className="p-6">
          <p className="font-mono text-sm opacity-80">{error.message}</p>
          <div className="mt-4 flex gap-2">
            <button className="bitos-btn" onClick={() => { router.invalidate(); reset(); }}>retry</button>
            <a className="bitos-btn" href="/">home</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "BitOS, a personal project brw" },
      { name: "description", content: "This is my personal app. Nothing much to see at all" },
      { name: "theme-color", content: "#1a0b2e" },
      { property: "og:title", content: "BitOS, a personal project brw" },
      { property: "og:description", content: "This is my personal app. Nothing much to see at all" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "BitOS, a personal project brw" },
      { name: "twitter:description", content: "This is my personal app. Nothing much to see at all" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b66f181b-eb78-4b83-8c07-bd566c2dcf31/id-preview-86ef6617--f9f5f57b-36d1-4bac-9c48-7e70b027bf5d.lovable.app-1779422508579.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b66f181b-eb78-4b83-8c07-bd566c2dcf31/id-preview-86ef6617--f9f5f57b-36d1-4bac-9c48-7e70b027bf5d.lovable.app-1779422508579.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=VT323&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WallpaperBackground />
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
