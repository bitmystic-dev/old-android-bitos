import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { getSession } from "@/lib/auth";
import { UpdatePrompt } from "@/components/UpdatePrompt";
import { WhatsNewDialog } from "@/components/WhatsNewDialog";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (!getSession()) {
      throw redirect({ to: "/login", search: { redirect: location.href } as any });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <AppLayout>
      <Outlet />
      <UpdatePrompt />
      <WhatsNewDialog />
    </AppLayout>
  );
}

