import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { L as LoaderCircle, b as ShieldCheck, S as Scale, N as Network, F as FileText, U as Upload, X, A as ArrowRight, T as TriangleAlert, a as CircleX, C as CircleCheck, M as MessageSquare, E as ExternalLink } from "../_libs/lucide-react.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const logo = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='24px'%20viewBox='0%20-960%20960%20960'%20width='24px'%20fill='%23D9D9D9'%3e%3cpath%20d='M480-80%20120-280v-400l360-200%20360%20200v400L480-80ZM364-590q23-24%2053-37t63-13q33%200%2063%2013t53%2037l120-67-236-131-236%20131%20120%2067Zm76%20396v-131q-54-14-87-57t-33-98q0-11%201-20.5t4-19.5l-125-70v263l240%20133Zm96.5-229.5Q560-447%20560-480t-23.5-56.5Q513-560%20480-560t-56.5%2023.5Q400-513%20400-480t23.5%2056.5Q447-400%20480-400t56.5-23.5ZM520-194l240-133v-263l-125%2070q3%2010%204%2019.5t1%2020.5q0%2055-33%2098t-87%2057v131Z'/%3e%3c/svg%3e";
function Logo({ className = "h-7 w-7" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Shocheton", className });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function FactCheckForm({ onSubmit, loading }) {
  const [mode, setMode] = reactExports.useState("text");
  const [text, setText] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [dragging, setDragging] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const canSubmit = !loading && (mode === "text" ? text.trim().length > 4 : file && text.trim().length > 4);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ text, file: mode === "file" ? file : null });
  };
  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      return;
    }
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.form,
    {
      onSubmit: handleSubmit,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      className: "rounded-2xl border border-border-strong bg-surface-elevated shadow-elevated overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border", children: ["text", "file"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setMode(m),
            className: cn(
              "flex-1 px-5 py-3.5 text-sm font-medium font-mono uppercase tracking-wider transition-colors relative",
              mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                m === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
                m === "text" ? "Text Claim" : "PDF Document"
              ] }),
              mode === m && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "tab-underline",
                  className: "absolute bottom-0 left-0 right-0 h-px bg-accent"
                }
              )
            ]
          },
          m
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: mode === "text" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: text,
                onChange: (e) => setText(e.target.value),
                placeholder: "Paste a claim, news headline, or statement to verify…",
                rows: 6,
                className: "w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base leading-relaxed resize-none focus:outline-none"
              }
            )
          },
          "text"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "flex flex-col gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: inputRef,
                    type: "file",
                    accept: "application/pdf",
                    className: "hidden",
                    onChange: (e) => handleFile(e.target.files?.[0])
                  }
                ),
                !file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => inputRef.current?.click(),
                    onDragOver: (e) => {
                      e.preventDefault();
                      setDragging(true);
                    },
                    onDragLeave: () => setDragging(false),
                    onDrop: (e) => {
                      e.preventDefault();
                      setDragging(false);
                      handleFile(e.dataTransfer.files?.[0]);
                    },
                    className: cn(
                      "w-full rounded-xl border border-dashed py-12 flex flex-col items-center gap-2 transition-colors",
                      dragging ? "border-accent bg-accent/5" : "border-border-strong hover:border-accent hover:bg-surface"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: "Drop a PDF here or click to upload" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: "PDF · max 4MB" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border-strong bg-card p-4 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-surface p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-accent" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: file.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono", children: [
                      (file.size / 1024).toFixed(1),
                      " KB"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFile(null),
                      className: "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: text,
                  onChange: (e) => setText(e.target.value),
                  placeholder: "Claim to verify inside PDF (e.g., 'Check the claims in Section 2')...",
                  rows: 3,
                  className: "w-full bg-surface/50 text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed border border-border rounded-lg p-3 resize-none focus:outline-none focus:border-accent transition-colors"
                }
              )
            ]
          },
          "file"
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-surface/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-mono text-muted-foreground uppercase tracking-wider", children: "3-agent debate · moderator verdict" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !canSubmit,
              className: cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                canSubmit ? "bg-accent text-accent-foreground hover:brightness-110 shadow-glow" : "bg-muted text-muted-foreground cursor-not-allowed"
              ),
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Analyzing…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "Run fact check",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const verdictMeta = {
  Supported: { label: "True", icon: CircleCheck, tone: "text-[color:var(--success)]" },
  Refuted: { label: "False", icon: CircleX, tone: "text-[color:var(--destructive)]" },
  Conflicting: { label: "Mixed", icon: TriangleAlert, tone: "text-[color:var(--warning)]" }
};
function ScoreBar({ label, value, isIntegerScale = false }) {
  const pct = isIntegerScale ? Math.round(value) : Math.round(value * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${pct}%` },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        className: "h-full bg-accent"
      }
    ) })
  ] });
}
function AgentCard({
  agentName,
  perspective,
  index
}) {
  const verdict = perspective.verdict.toUpperCase();
  const stanceColor = verdict === "Supported" ? "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/5" : verdict === "Refuted" ? "text-[color:var(--destructive)] border-[color:var(--destructive)]/30 bg-[color:var(--destructive)]/5" : "text-muted-foreground border-border-strong bg-muted";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      className: "rounded-2xl border border-border-strong bg-card p-5 shadow-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm", children: agentName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded-md border",
                stanceColor
              ),
              children: perspective.verdict
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line", children: perspective.rationale }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Confidence", value: perspective.confidence_score ?? 0, isIntegerScale: true }) })
      ]
    }
  );
}
function ResultsPanel({ result }) {
  const [isTranscriptOpen, setIsTranscriptOpen] = reactExports.useState(false);
  const currentVerdict = result.final_verdict || "UNCERTAIN";
  const meta = verdictMeta[currentVerdict] || verdictMeta.UNCERTAIN;
  const Icon = meta.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        className: "rounded-2xl border border-border-strong bg-surface-elevated p-6 shadow-elevated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border-strong bg-card p-2 md:p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-6 w-6", meta.tone), strokeWidth: 1.75 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs md:text-[20px] uppercase tracking-wider md:tracking-[0.18em] text-muted-foreground font-mono mb-1", children: [
              "Claim Category: ",
              result.category
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex  flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: cn("text-2xl pr-5 font-display font-semibold", meta.tone), children: meta.label }),
              result.debate_transcript && result.debate_transcript.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setIsTranscriptOpen(true),
                  className: "inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted hover:border-border-strong transition-all font-mono shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5 text-accent" }),
                    "View Debate Log (",
                    result.debate_transcript.length,
                    ")"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono tracking-wider text-muted-foreground pb-5 pt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: "Target Claim:" }),
              ' "',
              result.isolated_claim || result.raw_input_text,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed mb-5 whitespace-pre-line", children: result.final_justification || "No evaluation justification returned from the system state." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Overall System Confidence", value: result.system_confidence, isIntegerScale: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-center text-right text-xs text-muted-foreground font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Tokens Consumed: ",
              result.metadata?.llm_tokens_used || "N/A"
            ] }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      result.agent1_perspective && /* @__PURE__ */ jsxRuntimeExports.jsx(AgentCard, { agentName: "Agent 1 Synthesis", perspective: result.agent1_perspective, index: 0 }),
      result.agent2_perspective && /* @__PURE__ */ jsxRuntimeExports.jsx(AgentCard, { agentName: "Agent 2 Synthesis ", perspective: result.agent2_perspective, index: 1 })
    ] }),
    result.final_top_sources && result.final_top_sources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3, duration: 0.5 },
        className: "rounded-2xl border border-border-strong bg-card p-5 shadow-card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm mb-3", children: "Top Verified Evidence Sources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: result.final_top_sources.map((source, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: source.url ?? "https://google.com",
              target: "_blank",
              rel: "noreferrer",
              className: "flex flex-col gap-1 px-3 py-2 rounded-lg border border-border hover:border-border-strong hover:bg-surface transition-colors text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: source.title })
                ] }),
                source.extracted_snippet && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-clamp-2 italic pl-5", children: [
                  '"',
                  source.extracted_snippet,
                  '"'
                ] })
              ]
            },
            `${source.url}-${index}`
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isTranscriptOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-end bg-background/60 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setIsTranscriptOpen(false),
          className: "absolute inset-0"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { type: "spring", damping: 25, stiffness: 220 },
          className: "relative w-full max-w-lg h-full border-l border-border-strong bg-card shadow-2xl flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between bg-surface", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base", children: "Adversarial Cross-Examination" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: "Live Agent Transcript Trace" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setIsTranscriptOpen(false),
                  className: "p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30", children: result.debate_transcript.map((message, idx) => {
              const isSkeptic = message.speaker.toLowerCase().includes("skeptic") || message.speaker.includes("2");
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx * 0.05 },
                  className: cn(
                    "flex flex-col max-w-[85%] gap-1",
                    isSkeptic ? "ml-auto items-end" : "mr-auto items-start"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-medium tracking-wider text-muted-foreground px-1", children: message.speaker }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm border",
                          isSkeptic ? "bg-foreground text-background rounded-tr-none border-foreground" : "bg-card text-foreground rounded-tl-none border-border-strong"
                        ),
                        children: message.content
                      }
                    )
                  ]
                },
                idx
              );
            }) })
          ]
        }
      )
    ] }) })
  ] });
}
const getVerifyUrl = () => {
  {
    throw new Error("Missing VITE_API_BASE_URL environment variable.");
  }
};
const convertToBase64 = (pdfFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(pdfFile);
    reader.onload = () => {
      const result = reader.result;
      const base64Clean = result.split(",")[1];
      resolve(base64Clean);
    };
    reader.onerror = (error) => reject(error);
  });
};
const parseErrorMessage = async (response) => {
  try {
    const errData = await response.json();
    return errData?.detail || errData?.message || `Request failed with status ${response.status}`;
  } catch {
    const fallbackText = await response.text().catch(() => "");
    return fallbackText || `Request failed with status ${response.status}`;
  }
};
const callEndpoint = async (input) => {
  try {
    const requestBody = {
      text_input: input.rawText,
      pdf: input.pdf
    };
    if (input.pdf && input.pdfFile) {
      requestBody.pdfContent = await convertToBase64(input.pdfFile);
    }
    const response = await fetch(getVerifyUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }
    return await response.json();
  } catch (err) {
    throw err;
  }
};
function Index() {
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const handleSubmit = async (input) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await callEndpoint({
        rawText: input.text,
        pdf: Boolean(input.file),
        pdfFile: input.file
      });
      setResult(data);
    } catch (e) {
      const backendErrorMessage = e?.message || "Backend disconnected.";
      console.warn("[Shocheton] Error calling verification engine:", backendErrorMessage);
      setError(backendErrorMessage);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "relative border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-7 w-7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-base leading-none", children: "Shocheton" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mt-1", children: "Fact Checker Engine" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[color:var(--success)] animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "v0.1 · preview" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative mx-auto max-w-3xl px-5 pt-16 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }, className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
          "Multi-agent debate system"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl sm:text-5xl font-display font-semibold tracking-tight text-balance", children: "Truth, adjudicated by debate." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground max-w-xl mx-auto text-balance", children: "Submit a claim or a PDF. Our AI agents will process it through a multi-agent pipeline; a moderator will return a verdict with a trust score & sources." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FactCheckForm, { onSubmit: handleSubmit, loading }),
      error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-lg border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 px-4 py-2.5 text-xs font-mono text-[color:var(--warning)]", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 8
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0
        }, className: "mt-8 rounded-2xl border border-border-strong bg-card p-8 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono uppercase tracking-wider text-xs", children: "Agents deliberating…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [{
            icon: ShieldCheck,
            label: "Agent A"
          }, {
            icon: Scale,
            label: "Agent B"
          }, {
            icon: Network,
            label: "Moderator"
          }].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0.4
          }, animate: {
            opacity: [0.4, 1, 0.4]
          }, transition: {
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.3
          }, className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono uppercase tracking-wider", children: s.label })
          ] }, s.label)) })
        ] }, "loading"),
        result && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0
        }, animate: {
          opacity: 1
        }, exit: {
          opacity: 0
        }, className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResultsPanel, { result }) }, "results")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5 py-5 flex items-center justify-between text-[11px] font-mono text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© Shocheton" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-wider", children: "/agent1 · /agent2 · /moderator" })
    ] }) })
  ] });
}
export {
  Index as component
};
