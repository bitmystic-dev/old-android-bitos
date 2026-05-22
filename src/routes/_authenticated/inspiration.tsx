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
      <ComingSoon
        moduleName="inspiration.muse"
        tagline="curated feed — coming soon"
        blurb="A hand-tuned stream of art, reads, music and code to fuel your next project."
        features={[
          { name: "Feed", desc: "Daily drops across art, code, and writing." },
          { name: "Save", desc: "Pin items to your personal vault." },
          { name: "Share", desc: "Send finds to friends inside BitOS." },
        ]}
      />
    </PageShell>
  );
}
