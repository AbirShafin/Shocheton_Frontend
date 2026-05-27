import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, Network, Scale } from "lucide-react";
import { Logo } from "@/components/Logo";
import { FactCheckForm } from "@/components/FactCheckForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { runFactCheck, buildMockResult, type FactCheckResult } from "@/lib/factcheck-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shocheton — AI Fact Checker" },
      {
        name: "description",
        content:
          "Submit a claim or a PDF. Our AI agents will process it through a multi‑agent pipeline; a moderator will return a verdict with a trust score & sources.",
      },
      { property: "og:title", content: "Shocheton — AI Fact Checker" },
      {
        property: "og:description",
        content:
          "Submit a claim or a PDF. Our AI agents will process it through a multi‑agent pipeline; a moderator will return a verdict with a trust score & sources.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: { text: string; file: File | null }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runFactCheck({ text: input.text, file: input.file ?? undefined });
      setResult(data);
    } catch (e) {
      // Backend not connected yet — show demo data so the UI is reviewable.
      console.warn("[Shocheton] backend unavailable, showing mock result:", e);
      setError("Backend not connected — showing demo result.");
      setResult(buildMockResult({ text: input.text, file: input.file ?? undefined }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <header className="relative border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <div>
              <div className="font-display font-semibold text-base leading-none">Shocheton</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mt-1">
                Fact Checker Engine
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
            <span>v0.1 · preview</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-5 pt-16 pb-24">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Multi-agent debate system
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold tracking-tight text-balance">
            Truth, adjudicated by debate.
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto text-balance">
            Submit a claim or a PDF. Our AI agents will process it through a multi‑agent pipeline; a
            moderator will return a verdict with a trust score & sources.
          </p>
        </motion.section>

        <FactCheckForm onSubmit={handleSubmit} loading={loading} />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl border border-border-strong bg-card p-8 shadow-card"
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span className="font-mono uppercase tracking-wider text-xs">
                  Agents deliberating…
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: "Agent A" },
                  { icon: Scale, label: "Agent B" },
                  { icon: Network, label: "Moderator" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
                  >
                    <s.icon className="h-4 w-4 text-accent" />
                    <span className="text-xs font-mono uppercase tracking-wider">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              {error && (
                <div className="mb-4 rounded-lg border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 px-4 py-2.5 text-xs font-mono text-[color:var(--warning)]">
                  {error}
                </div>
              )}
              <ResultsPanel result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>© Shocheton</span>
          <span className="uppercase tracking-wider">/agent1 · /agent2 · /moderator</span>
        </div>
      </footer>
    </div>
  );
}
