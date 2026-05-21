import { createFileRoute } from "@tanstack/react-router";
import { DashboardGrid } from "@/components/DashboardGrid";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardGrid,
  head: () => ({ meta: [{ title: "Dashboard — BitOS" }] }),
});
