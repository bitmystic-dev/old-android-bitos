import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/novel")({
  component: () => (
    <ComingSoon
      moduleName="novel.planner"
      tagline="writing room · v0.2"
      blurb="A focused longform writing environment with chapter graph, character codex, scene timeline, and distraction-free mode."
      features={[
        { name: "Chapter Graph", desc: "Visual story structure with drag-and-drop scenes" },
        { name: "Character Codex", desc: "Living dossiers, relationships, arcs" },
        { name: "Scene Timeline", desc: "Pacing analysis & beat tracking" },
        { name: "Focus Mode", desc: "Typewriter scrolling, sound design, word goals" },
      ]}
    />
  ),
  head: () => ({ meta: [{ title: "Novel — BitOS (soon)" }] }),
});
