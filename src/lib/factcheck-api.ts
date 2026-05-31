const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = configuredApiBaseUrl ?? ""
const VERIFY_ENDPOINT_PATH = "/api/v1/verify"

const getVerifyUrl = () => {
  if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL environment variable.")
  }

  const normalizedBaseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`
  return new URL(VERIFY_ENDPOINT_PATH.slice(1), normalizedBaseUrl).toString()
}

export interface EvidenceSource {
  title: string;
  url: string | null;
  origin: "General Web Search" | "Trusted db Scoped Search" | null;
  credibility_percentage: number;
  extracted_snippet: string;
}

export interface ModelPerspectiveMapped {
  verdict: "Supported" | "Refuted" | "Conflicting";
  confidence_score: number | null;
  rationale: string;
  cited_sources: EvidenceSource[];
}

export interface DebateMessage {
  speaker: string;
  content: string;
}

export interface BackendAgentState {
  raw_input_text: string;
  isolated_claim: string | null;
  category: "general" | "finance" | "tech" | "legal" | "medical";
  retrieved_evidence: EvidenceSource[];
  agent1_perspective: ModelPerspectiveMapped | null;
  agent2_perspective: ModelPerspectiveMapped | null;
  debate_transcript: DebateMessage[];
  final_verdict: "Supported" | "Refuted" | "Conflicting" | null;
  final_justification: string | null;
  system_confidence: number;
  final_top_sources: EvidenceSource[];
  metadata: Record<string, any>;
  [key: string]: unknown;
}

export interface FactCheckInput {
  rawText: string;
  pdf: boolean;
  pdfFile: File | null;
}

export interface VerificationRequestBody {
  text_input: string;
  pdf?: boolean;
  pdfContent?: string;
}

const convertToBase64 = (pdfFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(pdfFile);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Clean = result.split(",")[1];
      resolve(base64Clean);
    };
    reader.onerror = (error) => reject(error);
  });
}

const parseErrorMessage = async (response: Response) => {
  try {
    const errData = await response.json();
    return errData?.detail || errData?.message || `Request failed with status ${response.status}`;
  } catch {
    const fallbackText = await response.text().catch(() => "");
    return fallbackText || `Request failed with status ${response.status}`;
  }
}

export const callEndpoint = async (input: FactCheckInput): Promise<BackendAgentState> => {
  try {
    const requestBody: VerificationRequestBody = {
      text_input: input.rawText,
      pdf: input.pdf,
    }

    if (input.pdf && input.pdfFile) {
      requestBody.pdfContent = await convertToBase64(input.pdfFile)
    }
    const response = await fetch(getVerifyUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }
    return (await response.json()) as BackendAgentState
  } catch (err) {
    throw err
  }
}