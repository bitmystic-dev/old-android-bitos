import { useEffect, useState } from "react";
import { RetroWindow } from "@/components/RetroWindow";
import { Quote, RefreshCw } from "lucide-react";

const quotes = [
  { t: "Stay hungry. Stay foolish.", a: "Steve Jobs" },
  { t: "Make it work, make it right, make it fast.", a: "Kent Beck" },
  { t: "The future depends on what you do today.", a: "Gandhi" },
  { t: "Simplicity is the ultimate sophistication.", a: "da Vinci" },
  { t: "First, solve the problem. Then, write the code.", a: "John Johnson" },
  { t: "Creativity is intelligence having fun.", a: "Einstein" },
];

export function QuoteWidget() {
  const [i, setI] = useState(0);
  useEffect(() => { setI(Math.floor(Math.random() * quotes.length)); }, []);
  const q = quotes[i];
  return (
    <RetroWindow
      title="muse.txt"
      icon={<Quote className="h-3.5 w-3.5" />}
      actions={
        <button onClick={() => setI((p) => (p + 1) % quotes.length)} aria-label="Next">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      }
    >
      <blockquote className="font-display text-xl sm:text-2xl leading-snug">"{q.t}"</blockquote>
      <div className="mt-2 text-xs font-mono opacity-70">— {q.a}</div>
    </RetroWindow>
  );
}
