import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
