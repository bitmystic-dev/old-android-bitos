import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/inspiration")({
  component: Inspiration,
  head: () => ({ meta: [{ title: "Inspiration — BitOS" }] }),
});

function Inspiration() {
  return (
    <PageShell title="inspiration" subtitle="muse.feed">
      <ComingSoon title="inspiration.muse" note="A curated feed of art, reads, music and code. Shipping soon." />
    </PageShell>
  );
}
