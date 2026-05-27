import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ExternalLink } from "lucide-react";
import type { AgentResponse, FactCheckResult, Verdict } from "@/lib/factcheck-api";
import { cn } from "@/lib/utils";

const verdictMeta: Record<Verdict, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  true: { label: "Verified True", icon: CheckCircle2, tone: "text-[color:var(--success)]" },
  false: { label: "False", icon: XCircle, tone: "text-[color:var(--destructive)]" },
  misleading: { label: "Misleading", icon: AlertTriangle, tone: "text-[color:var(--warning)]" },
  unverified: { label: "Unverified", icon: HelpCircle, tone: "text-muted-foreground" },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
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

function AgentCard({ data, index }: { data: AgentResponse; index: number }) {
  const stanceColor =
    data.stance === "support"
      ? "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/5"
      : data.stance === "refute"
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
        <h3 className="font-display font-semibold text-sm">{data.agent}</h3>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded-md border",
            stanceColor,
          )}
        >
          {data.stance}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{data.reasoning}</p>
      <div className="mb-4">
        <ScoreBar label="Confidence" value={data.confidence} />
      </div>
      {data.sources.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-border">
          {data.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{s.title}</span>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ResultsPanel({ result }: { result: FactCheckResult }) {
  const { moderator, agent1, agent2 } = result;
  const meta = verdictMeta[moderator.verdict];
  const Icon = meta.icon;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-border-strong bg-surface-elevated p-6 shadow-elevated"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="rounded-xl border border-border-strong bg-card p-3">
            <Icon className={cn("h-6 w-6", meta.tone)} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-1">
              Moderator Verdict
            </div>
            <h2 className={cn("text-2xl font-display font-semibold", meta.tone)}>{meta.label}</h2>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              confidence · {Math.round(moderator.confidence * 100)}%
            </div>
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed mb-5">{moderator.summary}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScoreBar label="Factuality" value={moderator.scores.factuality} />
          <ScoreBar label="Source Quality" value={moderator.scores.sourceQuality} />
          <ScoreBar label="Consensus" value={moderator.scores.consensus} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AgentCard data={agent1} index={0} />
        <AgentCard data={agent2} index={1} />
      </div>

      {moderator.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl border border-border-strong bg-card p-5 shadow-card"
        >
          <h3 className="font-display font-semibold text-sm mb-3">Aggregated Sources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {moderator.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-border-strong hover:bg-surface transition-colors text-sm"
              >
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{s.title}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
