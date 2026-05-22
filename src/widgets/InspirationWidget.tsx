import { RetroWindow } from "@/components/RetroWindow";
import { Sparkles, Star } from "lucide-react";

const items = [
  { tag: "ART", title: "Y2K UI revival on Are.na" },
  { tag: "READ", title: "Tools for Thought — Howard Rheingold" },
  { tag: "WATCH", title: "Ghibli scene composition study" },
  { tag: "CODE", title: "react-grid-layout dashboards" },
];

export function InspirationWidget() {
  return (
    <RetroWindow title="muse.feed" icon={<Sparkles className="h-3.5 w-3.5" />}>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.title} className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary/60 cursor-pointer">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{it.tag}</span>
            <span className="text-sm truncate">{it.title}</span>
          </li>
        ))}
      </ul>
    </RetroWindow>
  );
}
