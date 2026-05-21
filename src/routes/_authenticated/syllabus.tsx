import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RetroWindow } from "@/components/RetroWindow";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/syllabus")({
  component: Syllabus,
  head: () => ({ meta: [{ title: "Syllabus — BitOS" }] }),
});

const courses = [
  { code: "CS-401", name: "Distributed Systems", progress: 62, next: "Ch 5 — Consensus" },
  { code: "LIT-220", name: "Modern Fiction", progress: 38, next: "Murakami essay" },
  { code: "MTH-310", name: "Linear Algebra", progress: 81, next: "Eigenproblems" },
  { code: "ART-101", name: "Visual Composition", progress: 24, next: "Color theory" },
];

function Syllabus() {
  return (
    <PageShell title="syllabus" subtitle="study OS">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.map((c) => (
          <RetroWindow key={c.code} title={`${c.code.toLowerCase()}.course`} icon={<BookOpen className="h-3.5 w-3.5" />}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl">{c.name}</h3>
              <span className="font-mono text-xs opacity-70">{c.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${c.progress}%` }} />
            </div>
            <p className="mt-3 text-sm opacity-80">Next: <span className="text-foreground">{c.next}</span></p>
            <div className="mt-3 flex gap-2">
              <button className="bitos-btn">open</button>
              <button className="bitos-btn">add note</button>
            </div>
          </RetroWindow>
        ))}
      </div>
    </PageShell>
  );
}
