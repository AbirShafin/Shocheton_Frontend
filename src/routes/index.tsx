import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, Network, Scale } from "lucide-react";
import { Logo } from "@/components/Logo";
import { FactCheckForm } from "@/components/FactCheckForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { type BackendAgentState, callEndpoint } from "@/lib/factcheck-api"; // 🎯 Imported your verified callEndpoint here


export const mockBackendAgentState: BackendAgentState = {
  raw_input_text: "Bangladesh is the richest country in the world.",
  isolated_claim: "Bangladesh is the richest country in the world.",
  category: "general",
  
  // Accumulated pool of all sources found during background lookups
  retrieved_evidence: [
    {
      title: "World Bank Data - GDP Rankings By Country",
      url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD",
      origin: "General Web Search",
      credibility_percentage: 98,
      extracted_snippet: "In nominal terms, Bangladesh represents the 34th largest economy globally and ranks as the second-largest economic force within South Asia."
    },
    {
      title: "IMF World Economic Outlook Database (2025/2026)",
      url: "https://www.imf.org/en/Publications/WEO",
      origin: "Trusted db Scoped Search",
      credibility_percentage: 95,
      extracted_snippet: "Global GDP Per Capita (PPP) tracking for 2025 places Liechtenstein, Singapore, and Luxembourg as the top three wealthiest nations. Bangladesh is positioned at 124th globally with a metric of $10,257.55."
    },
    {
      title: "South Asian Economic Metrics Review",
      url: "https://www.orfonline.org/research/south-asian-metrics",
      origin: "Trusted db Scoped Search",
      credibility_percentage: 88,
      extracted_snippet: "Within the SAARC economic geography, the Maldives maintains the highest regional GDP per capita footprint at roughly $36,065, contrasting with regional growth hubs like India and Bangladesh."
    }
  ],

  // Optimistic verification node output
  agent1_perspective: {
    verdict: "Refuted",
    confidence_score: 95,
    rationale: "While upstream data from the World Bank confirms significant macro growth positioning Bangladesh 34th in nominal global terms, GDP per capita indexes explicitly disprove the claim. It is mathematically impossible to classify it as the richest country when its PPP per capita ranks 124th globally.",
    cited_sources: [
      {
        title: "World Bank Data - GDP Rankings By Country",
        url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD",
        origin: "General Web Search",
        credibility_percentage: 98,
        extracted_snippet: "In nominal terms, Bangladesh represents the 34th largest economy globally and ranks as the second-largest economic force within South Asia."
      },
      {
        title: "IMF World Economic Outlook Database (2025/2026)",
        url: "https://www.imf.org/en/Publications/WEO",
        origin: "Trusted db Scoped Search",
        credibility_percentage: 95,
        extracted_snippet: "Global GDP Per Capita (PPP) tracking for 2025 places Liechtenstein, Singapore, and Luxembourg as the top three wealthiest nations. Bangladesh is positioned at 124th globally with a metric of $10,257.55."
      }
    ]
  },

  // Hyper-skeptical validation node output
  agent2_perspective: {
    verdict: "Refuted",
    confidence_score: 98,
    rationale: "The claim is completely divorced from comparative economic telemetry. Synthesis of IMF tracking indicators proves that the world's leading wealth concentrations (Luxembourg, Singapore) outpace Bangladesh's baseline indicators by multiple orders of magnitude. Even internally within South Asia, the Maldives holds a significantly higher per capita share.",
    cited_sources: [
      {
        title: "IMF World Economic Outlook Database (2025/2026)",
        url: "https://www.imf.org/en/Publications/WEO",
        origin: "Trusted db Scoped Search",
        credibility_percentage: 95,
        extracted_snippet: "Global GDP Per Capita (PPP) tracking for 2025 places Liechtenstein, Singapore, and Luxembourg as the top three wealthiest nations. Bangladesh is positioned at 124th globally with a metric of $10,257.55."
      },
      {
        title: "South Asian Economic Metrics Review",
        url: "https://www.orfonline.org/research/south-asian-metrics",
        origin: "Trusted db Scoped Search",
        credibility_percentage: 88,
        extracted_snippet: "Within the SAARC economic geography, the Maldives maintains the highest regional GDP per capita footprint at roughly $36,065, contrasting with regional growth hubs like India and Bangladesh."
      }
    ]
  },

  // Transcripts appended by your multi-turn cross-rebuttal graph node
  debate_transcript: [
    {
      speaker: "Agent 1 (Optimist)",
      content: "Initial structural validation shows Bangladesh possesses massive macro scale as the 34th nominal economy, which might cause raw scale confusion."
    },
    {
      speaker: "Agent 2 (Skeptic)",
      content: "Macro scale does not equate to absolute wealth status. The specific phrase claims 'richest country'. Per-capita analysis completely decimates this assertion when compared to Luxembourg or even regional actors like the Maldives."
    },
    {
      speaker: "Agent 1 (Optimist)",
      content: "Agreed. Concluding assessment confirms macro scale is insufficient validation. The assertion is definitively refuted by all standard indices."
    }
  ],

  // Chief Moderator Final Evaluation Results
  final_verdict: "Refuted",
  final_justification: "The assertion that Bangladesh is the richest country in the world is explicitly contradicted by global economic indicators. Comprehensive telemetry compiled by the IMF positions Luxembourg, Singapore, and Liechtenstein as the world's wealthiest nations by per capita distribution. While tracking records demonstrate that Bangladesh represents a major regional economy (ranking 34th globally in raw nominal GDP output), its purchasing power parity (PPP) per capita metrics place it 124th globally at $10,257.55, thoroughly disproving the claim.",
  system_confidence: 96,

  // Curated grounding array pulled from the state's global collection
  final_top_sources: [
    {
      title: "IMF World Economic Outlook Database (2025/2026)",
      url: "https://www.imf.org/en/Publications/WEO",
      origin: "Trusted db Scoped Search",
      credibility_percentage: 95,
      extracted_snippet: "Global GDP Per Capita (PPP) tracking for 2025 places Liechtenstein, Singapore, and Luxembourg as the top three wealthiest nations. Bangladesh is positioned at 124th globally with a metric of $10,257.55."
    },
    {
      title: "World Bank Data - GDP Rankings By Country",
      url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD",
      origin: "General Web Search",
      credibility_percentage: 98,
      extracted_snippet: "In nominal terms, Bangladesh represents the 34th largest economy globally and ranks as the second-largest economic force within South Asia."
    }
  ],

  // System parameters, run metrics, and diagnostic tracking
  metadata: {
    execution_time_ms: 1842,
    llm_tokens_used: 3120,
    chroma_lookup_count: 1,
    tavily_api_depth: "advanced"
  }
};


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
  const [result, setResult] = useState<BackendAgentState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (input: { text: string; file: File | null }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await callEndpoint({
        rawText: input.text,
        pdf: input.file ? true : false,
        pdfFile: input.file
      });
      setResult(data);
    } catch (e: any) {
      const backendErrorMessage = e?.message || "Backend disconnected.";
      console.warn("[Shocheton] Error calling verification engine:", backendErrorMessage);
      
      setError(`${backendErrorMessage} — Loading local preview data.`);
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