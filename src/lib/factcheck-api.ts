export const API_BASE_URL = "http://localhost:8080/api/v1/verify"

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
}
export interface FactCheckInput {
  rawText: string,
  pdf: boolean,
  pdfFile: File | null
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
export const callEndpoint = async (input: FactCheckInput) : Promise<BackendAgentState> => {
  try {
    let pdfContent_base64;
    if (input.pdf && input.pdfFile) {
      pdfContent_base64 = await convertToBase64(input.pdfFile)
    }
    const obj = {
      text_input: input.rawText, 
      pdf: input.pdf ? true : false,
      pdfContent: pdfContent_base64 ?? null,
    }
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(obj)
    })
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Unknown backend error");
    }
    const agentState = await response.json()
    console.log(agentState)
    return agentState as BackendAgentState
  } catch (err) {
    console.log(err)
    throw err
  }
}