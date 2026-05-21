import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";

export const Route = createFileRoute("/_authenticated/code")({
  component: CodeWorkspace,
  head: () => ({ meta: [{ title: "Code — BitOS" }] }),
});

const tree = ["src/", "  bitos/", "    core.ts", "    widgets.ts", "  index.tsx", "README.md"];

const snippet = `// bitos/core.ts
export const boot = async () => {
  await mount('dashboard')
  await load('widgets')
  return { status: 'alive' }
}`;

function CodeWorkspace() {
  return (
    <PageShell title="code" subtitle="hack the universe">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <RetroWindow title="explorer">
          <ul className="font-mono text-xs space-y-0.5">
            {tree.map((t) => <li key={t} className="hover:bg-secondary/60 px-1 rounded cursor-pointer">{t}</li>)}
          </ul>
        </RetroWindow>
        <div className="lg:col-span-2">
          <RetroWindow title="core.ts" subtitle="edited 2m ago" bodyClassName="!p-0">
            <pre className="p-4 font-mono text-sm leading-relaxed overflow-x-auto"><code>{snippet}</code></pre>
          </RetroWindow>
        </div>
        <RetroWindow title="terminal" bodyClassName="!p-0">
          <div className="p-4 font-mono text-xs space-y-1 min-h-48">
            <div><span className="text-accent">$</span> bitos boot</div>
            <div className="opacity-70">› mounting dashboard…</div>
            <div className="opacity-70">› loading 9 widgets</div>
            <div className="text-primary">✓ status: alive</div>
            <div className="cursor-blink"><span className="text-accent">$</span> </div>
          </div>
        </RetroWindow>
      </div>
    </PageShell>
  );
}
