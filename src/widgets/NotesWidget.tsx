import { useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { StickyNote } from "lucide-react";

export function NotesWidget() {
  const [text, setText] = useState("// scratchpad\n\nIdeas drop here. Markdown welcome.\n\n- BitOS is alive\n- ship the dashboard\n- write chapter 3");
  return (
    <RetroWindow
      title="scratch.md"
      icon={<StickyNote className="h-3.5 w-3.5" />}
      subtitle={`${text.length} chars`}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-44 resize-none bg-input border border-border rounded-md p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </RetroWindow>
  );
}
