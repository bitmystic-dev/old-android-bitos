import { createFileRoute, Link } from "@tanstack/react-router";
import { Power } from "lucide-react";

export const Route = createFileRoute("/powered-off")({
  component: PoweredOff,
  head: () => ({ meta: [{ title: "BitOS — powered off" }] }),
});

function PoweredOff() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono p-6 relative overflow-hidden">
      <div className="absolute inset-0 bitos-scanlines opacity-30 pointer-events-none" />
      <div className="text-center max-w-md relative">
        <Power className="mx-auto h-14 w-14 mb-6 opacity-50" />
        <div className="text-2xl mb-1">BitOS has powered off.</div>
        <div className="text-xs opacity-60 mb-8">It is now safe to close this tab.</div>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 border border-green-400/40 rounded hover:bg-green-400/10 transition">
          ⏻ boot again
        </Link>
      </div>
    </div>
  );
}
