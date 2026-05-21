import { RetroWindow } from "@/components/RetroWindow";
import { StickyNote } from "lucide-react";
import { useBitStore } from "@/lib/store";

export function NotesWidget() {
  const notes = useBitStore((s) => s.notes);
  const setNotes = useBitStore((s) => s.setNotes);

  return (
    <RetroWindow
      title="scratch.md"
      icon={<StickyNote className="h-3.5 w-3.5" />}
      subtitle={`${notes.length} chars`}
    >
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="// scratchpad — markdown welcome"
        className="w-full h-44 resize-none bg-input border border-border rounded-md p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </RetroWindow>
  );
}
