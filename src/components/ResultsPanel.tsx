import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  MessageSquare, 
  X 
} from "lucide-react";
import type { BackendAgentState } from "@/lib/factcheck-api";
import { cn } from "@/lib/utils";

const verdictMeta: Record<string, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  Supported: { label: "True", icon: CheckCircle2, tone: "text-[color:var(--success)]" },
  Refuted: { label: "False", icon: XCircle, tone: "text-[color:var(--destructive)]" },
  Conflicting: { label: "Mixed", icon: AlertTriangle, tone: "text-[color:var(--warning)]" },
};

function ScoreBar({ label, value, isIntegerScale = false }: { label: string; value: number; isIntegerScale?: boolean }) {
  const pct = isIntegerScale ? Math.round(value) : Math.round(value * 100);
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="font-mono text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}

function AgentCard({ 
  agentName, 
  perspective, 
  index 
}: { 
  agentName: string; 
  perspective: NonNullable<BackendAgentState["agent1_perspective"]>; 
  index: number;
}) {
  const verdict = perspective.verdict.toUpperCase();
  const stanceColor =
    verdict === "Supported"
      ? "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/5"
      : verdict === "Refuted"
        ? "text-[color:var(--destructive)] border-[color:var(--destructive)]/30 bg-[color:var(--destructive)]/5"
        : "text-muted-foreground border-border-strong bg-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border-strong bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm">{agentName}</h3>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded-md border",
            stanceColor,
          )}
        >
          {perspective.verdict}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{perspective.rationale}</p>
      <div className="mb-4">
        <ScoreBar label="Confidence" value={perspective.confidence_score ?? 0} isIntegerScale={true} />
      </div>
    </motion.div>
  );
}

export function ResultsPanel({ result }: { result: BackendAgentState }) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const currentVerdict = result.final_verdict || "UNCERTAIN";
  const meta = verdictMeta[currentVerdict] || verdictMeta.UNCERTAIN;
  const Icon = meta.icon;

  return (
    <div className="space-y-5 relative">
      
      {/* Primary Verification Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-border-strong bg-surface-elevated p-6 shadow-elevated"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="rounded-xl border border-border-strong bg-card p-2 md:p-3">
            <Icon className={cn("h-6 w-6", meta.tone)} strokeWidth={1.75} />
          </div>
          <div className="text-xs md:text-[20px] uppercase tracking-wider md:tracking-[0.18em] text-muted-foreground font-mono mb-1">
                Claim Category: {result.category}
            </div>
        </div>
        <div className="flex-col">
          <div className="flex  flex-row items-center justify-between">
            <h2 className={cn("text-2xl pr-5 font-display font-semibold", meta.tone)}>{meta.label}</h2>
            {result.debate_transcript && result.debate_transcript.length > 0 && (
                  <button
                    onClick={() => setIsTranscriptOpen(true)}
                    className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted hover:border-border-strong transition-all font-mono shadow-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-accent" />
                    View Debate Log ({result.debate_transcript.length})
                  </button>
              )}
          </div>
          <div className="text-xs font-mono tracking-wider text-muted-foreground pb-5 pt-3">
                <span className="text-white">Target Claim:</span> "{result.isolated_claim || result.raw_input_text}"
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed mb-5 whitespace-pre-line">
          {result.final_justification || "No evaluation justification returned from the system state."}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
          <ScoreBar label="Overall System Confidence" value={result.system_confidence} isIntegerScale={true} />
          <div className="flex flex-col justify-center text-right text-xs text-muted-foreground font-mono">
            <span>Tokens Consumed: {result.metadata?.llm_tokens_used || "N/A"}</span>
          </div>
        </div>
      </motion.div>

      {/* Individual Perspectival Node Cards Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.agent1_perspective && (
          <AgentCard agentName="Agent 1 Synthesis" perspective={result.agent1_perspective} index={0} />
        )}
        {result.agent2_perspective && (
          <AgentCard agentName="Agent 2 Synthesis " perspective={result.agent2_perspective} index={1} />
        )}
      </div>

      {/* Grounding Citations Base Layer */}
      {result.final_top_sources && result.final_top_sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl border border-border-strong bg-card p-5 shadow-card"
        >
          <h3 className="font-display font-semibold text-sm mb-3">Top Verified Evidence Sources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.final_top_sources.map((source, index) => (
              <a
                key={`${source.url}-${index}`}
                href={source.url ?? "https://google.com"}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-border hover:border-border-strong hover:bg-surface transition-colors text-sm"
              >
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate">{source.title}</span>
                </div>
                {source.extracted_snippet && (
                  <p className="text-xs text-muted-foreground line-clamp-2 italic pl-5">
                    "{source.extracted_snippet}"
                  </p>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pop-out Chat Interface Overlay */}
      <AnimatePresence>
        {isTranscriptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/60 backdrop-blur-sm">
            {/* Backdrop Closer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTranscriptOpen(false)}
              className="absolute inset-0"
            />

            {/* Chat Drawer Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg h-full border-l border-border-strong bg-card shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
                <div>
                  <h3 className="font-display font-semibold text-base">Adversarial Cross-Examination</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">Live Agent Transcript Trace</p>
                </div>
                <button
                  onClick={() => setIsTranscriptOpen(false)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Thread Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">
                {result.debate_transcript.map((message, idx) => {
                  // Determine layout styling based on which agent is speaking
                  const isSkeptic = message.speaker.toLowerCase().includes("skeptic") || message.speaker.includes("2");
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      className={cn(
                        "flex flex-col max-w-[85%] gap-1",
                        isSkeptic ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      {/* Speaker Badge */}
                      <span className="text-[10px] font-mono font-medium tracking-wider text-muted-foreground px-1">
                        {message.speaker}
                      </span>
                      
                      {/* Message Bubble Body */}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm border",
                          isSkeptic
                            ? "bg-foreground text-background rounded-tr-none border-foreground"
                            : "bg-card text-foreground rounded-tl-none border-border-strong"
                        )}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}