import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSession } from "@/lib/auth";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export const Route = createFileRoute("/sudo")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getSession()) throw redirect({ to: "/" });
  },
  component: SudoPage,
  head: () => ({ meta: [{ title: "sudo — BitOS" }] }),
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await signUp(email, password, name);
      navigate({ to: "/" });
    } catch (e: any) {
      setErr(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bitos-aurora -z-10" />
      <div className="absolute inset-0 bitos-scanlines opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bitos-window w-full max-w-md relative"
      >
        <div className="bitos-titlebar">
          <div className="flex items-center gap-2">
            <span className="bitos-titlebar-dots">
              <span className="bitos-dot" style={{ background: "#ff5f57" }} />
              <span className="bitos-dot" style={{ background: "#febc2e" }} />
              <span className="bitos-dot" style={{ background: "#28c840" }} />
            </span>
            <Terminal className="h-3.5 w-3.5" />
            <span className="text-sm">auth.shell — register</span>
          </div>
          <span className="text-[10px] opacity-70">tty0</span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="font-display text-4xl text-primary leading-none">BitOS://</div>
            <div className="font-mono text-xs opacity-70 mt-1 cursor-blink">register new operator</div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <div className="font-mono text-[11px] opacity-70 mb-1">$ display name</div>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                placeholder="operator"
              />
            </label>
            <label className="block">
              <div className="font-mono text-[11px] opacity-70 mb-1">$ email</div>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                placeholder="you@bitos.dev"
              />
            </label>
            <label className="block">
              <div className="font-mono text-[11px] opacity-70 mb-1">$ password (min 6)</div>
              <input
                type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
              />
            </label>

            {err && (
              <div className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
                ! {err}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bitos-btn justify-center !py-2.5 !bg-primary !text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "creating…" : "▸ create account"}
            </button>
          </form>

          <div className="mt-6 text-xs">
            <span className="opacity-60">already booted? </span>
            <Link to="/login" className="text-primary hover:underline font-mono">sign in →</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
