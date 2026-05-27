// API client for the Shocheton fact-checker backend.
// Backend lives in a separate repo. Override base URL via VITE_FACTCHECK_API_URL.
// Endpoints expected: POST /agent1, POST /agent2, POST /moderator

export const API_BASE_URL = (import.meta.env.VITE_FACTCHECK_API_URL as string | undefined) ?? "";

export type Verdict = "true" | "false" | "misleading" | "unverified";

export interface AgentResponse {
  agent: string;
  stance: "support" | "refute" | "neutral";
  confidence: number; // 0-1
  reasoning: string;
  sources: { title: string; url: string; snippet?: string }[];
}

export interface ModeratorResponse {
  verdict: Verdict;
  confidence: number; // 0-1
  summary: string;
  scores: {
    factuality: number;
    sourceQuality: number;
    consensus: number;
  };
  sources: { title: string; url: string; snippet?: string }[];
}

export interface FactCheckResult {
  agent1: AgentResponse;
  agent2: AgentResponse;
  moderator: ModeratorResponse;
}

async function callEndpoint<T>(path: string, body: FormData | object): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface FactCheckInput {
  text?: string;
  file?: File;
}

function buildPayload({ text, file }: FactCheckInput): FormData | object {
  if (file) {
    const fd = new FormData();
    if (text) fd.append("text", text);
    fd.append("file", file);
    return fd;
  }
  return { text: text ?? "" };
}

export async function runFactCheck(input: FactCheckInput): Promise<FactCheckResult> {
  const payload = buildPayload(input);
  // Run both agents in parallel, then send their outputs to the moderator.
  const [agent1, agent2] = await Promise.all([
    callEndpoint<AgentResponse>("/agent1", payload),
    callEndpoint<AgentResponse>("/agent2", payload),
  ]);
  const moderator = await callEndpoint<ModeratorResponse>("/moderator", {
    input: (input.text && input.file) ? `${input.text} [file: ${input.file.name}]` : (input.text || (input.file ? `[file: ${input.file.name}]` : "")),
    agent1,
    agent2,
  });
  return { agent1, agent2, moderator };
}

// Demo data so the UI is usable before the backend is wired up.
export function buildMockResult(input: FactCheckInput): FactCheckResult {
  const claim = input.text || input.file?.name || "Submitted claim";
  return {
    agent1: {
      agent: "Agent A · Affirmative",
      stance: "support",
      confidence: 0.62,
      reasoning: `Reviewed available evidence regarding: "${claim.slice(0, 120)}". Multiple reputable outlets corroborate the core assertion, though peripheral details vary.`,
      sources: [
        { title: "Reuters · Background report", url: "https://example.com/a1" },
        { title: "Nature · Primary study", url: "https://example.com/a2" },
      ],
    },
    agent2: {
      agent: "Agent B · Skeptic",
      stance: "refute",
      confidence: 0.48,
      reasoning:
        "Found inconsistencies in dates and a missing primary source. The framing omits relevant context which changes the conclusion.",
      sources: [
        { title: "AP Fact Check", url: "https://example.com/b1" },
        { title: "Snopes analysis", url: "https://example.com/b2" },
      ],
    },
    moderator: {
      verdict: "misleading",
      confidence: 0.71,
      summary:
        "The claim contains a kernel of truth but omits crucial context, leading to a misleading overall impression. Treat with caution and consult primary sources.",
      scores: { factuality: 0.58, sourceQuality: 0.74, consensus: 0.42 },
      sources: [
        { title: "Reuters", url: "https://example.com/m1" },
        { title: "AP", url: "https://example.com/m2" },
        { title: "Nature", url: "https://example.com/m3" },
      ],
    },
  };
}
