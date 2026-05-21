import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/_authenticated/ai")({
  component: () => (
    <ComingSoon
      moduleName="ai.workspace"
      tagline="copilot.sys · v0.2"
      blurb="Multi-agent workspace tailored to each module: writing muse, code copilot, planner strategist, research scout. Memory persists across sessions."
      features={[
        { name: "Agent Roster", desc: "Switch between Muse, Coder, Planner, Scout" },
        { name: "Module-aware Context", desc: "Agents read your tasks, notes, code" },
        { name: "Long-term Memory", desc: "Per-operator vector store" },
        { name: "Streaming UI", desc: "Inline tool calls and document edits" },
      ]}
    />
  ),
  head: () => ({ meta: [{ title: "AI — BitOS (soon)" }] }),
});
