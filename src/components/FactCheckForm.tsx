import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, X, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (input: { text: string; file: File | null }) => void;
  loading: boolean;
}

export function FactCheckForm({ onSubmit, loading }: Props) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSubmit = !loading && (mode === "text" ? text.trim().length > 4 : !!file);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ text: mode === "text" ? text : "", file: mode === "file" ? file : null });
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
    setFile(f);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border-strong bg-surface-elevated shadow-elevated overflow-hidden"
    >
      <div className="flex border-b border-border">
        {(["text", "file"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 px-5 py-3.5 text-sm font-medium font-mono uppercase tracking-wider transition-colors relative",
              mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {m === "text" ? (
                <FileText className="h-3.5 w-3.5" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {m === "text" ? "Text Claim" : "PDF Document"}
            </span>
            {mode === m && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a claim, news headline, or statement to verify…"
                rows={6}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base leading-relaxed resize-none focus:outline-none"
              />
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {!file ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  className={cn(
                    "w-full rounded-xl border border-dashed py-12 flex flex-col items-center gap-2 transition-colors",
                    dragging
                      ? "border-accent bg-accent/5"
                      : "border-border-strong hover:border-accent hover:bg-surface",
                  )}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-sm text-foreground">Drop a PDF here or click to upload</div>
                  <div className="text-xs text-muted-foreground font-mono">PDF · max 20MB</div>
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-card p-4">
                  <div className="rounded-lg border border-border bg-surface p-2.5">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-surface/50">
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
          3-agent debate · moderator verdict
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            canSubmit
              ? "bg-accent text-accent-foreground hover:brightness-110 shadow-glow"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Run fact check
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
