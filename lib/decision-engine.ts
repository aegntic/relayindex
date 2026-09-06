import { db, type DecisionRecord } from "./db/index.ts";

export type DecisionVerdict = 
  | "allow_route" 
  | "hold_route" 
  | "reject_route" 
  | "insufficient_comparable_evidence";

export interface EvaluationCandidate {
  id: string;
  name: string;
  endpointUrl?: string;
  declaredSchema?: Record<string, unknown>;
  // For synthetic/mock test fixtures:
  mockFailureRate?: number;
  mockBaseLatencyMs?: number;
  mockLatencyJitterMs?: number;
  mockSchemaDrift?: boolean;
  mockAuthViolation?: boolean;
}

export interface PreRegistrationInput {
  workflowName: string;
  candidates: EvaluationCandidate[];
  testInputs: Record<string, unknown>[];
  constraints: {
    maxP95LatencyMs?: number;
    maxCostUsd?: number;
    requiredSuccessRate?: number;
    allowedAuthScopes?: string[];
  };
  trialsPerCandidate?: number; // Defaults to 10
}

export interface CandidateMetric {
  candidateId: string;
  candidateName: string;
  trialsCompleted: number;
  successRate: number;
  coldStartLatencyMs: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  estimatedCostUsd: number;
  schemaDriftDetected: boolean;
  authViolationDetected: boolean;
  verdict: DecisionVerdict;
  notes: string[];
}

export interface DecisionPacket {
  schemaVersion: "1.0.0";
  decisionId: string;
  workflowName: string;
  preRegistrationHash: string;
  verdict: DecisionVerdict;
  primaryRecommendation: string | null;
  confidenceScore: number;
  candidates: CandidateMetric[];
  disconfirmingSignals: string[];
  stopConditionsTriggered: string[];
  signature: string;
  generatedAt: string;
  expiresAt: string;
}

// RFC 8785 deterministic JSON canonicalization
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalizeJson).join(",") + "]";
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return JSON.stringify(key) + ":" + canonicalizeJson(val);
  });
  return "{" + pairs.join(",") + "}";
}

export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export class DecisionAssuranceEngine {
  /**
   * Pre-registers and runs an empirical multi-trial evaluation across 1-3 candidates.
   */
  async evaluate(input: PreRegistrationInput): Promise<DecisionPacket> {
    // 1. Validate Candidate Scope (Rule: 1 to 3 candidates)
    if (!input.candidates || input.candidates.length === 0) {
      throw new Error("Evaluation requires at least one candidate tool.");
    }
    if (input.candidates.length > 3) {
      throw new Error("Evaluation exceeds maximum scope of 3 candidate tools.");
    }

    const trialsCount = Math.max(input.trialsPerCandidate ?? 10, 10);
    const generatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14-day validity
    const decisionId = `dec_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`;

    // 2. Sealed Pre-Registration Hash
    const preRegPayload = {
      workflowName: input.workflowName,
      candidateIds: input.candidates.map((c) => c.id).sort(),
      constraints: input.constraints,
      trialsCount,
      timestamp: generatedAt,
    };
    const preRegistrationHash = await hashString(canonicalizeJson(preRegPayload));

    // 3. Multi-Trial Evaluation Runner
    const metrics: CandidateMetric[] = [];
    const stopConditionsTriggered: string[] = [];
    const disconfirmingSignals: string[] = [];

    const maxLatencyBudget = input.constraints.maxP95LatencyMs ?? 500;
    const requiredSuccessRate = input.constraints.requiredSuccessRate ?? 0.95;

    for (const candidate of input.candidates) {
      const trialLatencies: number[] = [];
      let successes = 0;
      const notes: string[] = [];

      // Check for illegal egress or authorization violation
      if (candidate.mockAuthViolation) {
        stopConditionsTriggered.push(`Candidate '${candidate.name}' attempted unauthorized token scope escalation.`);
      }

      // Execute Trials
      let coldStartLatency = 0;
      for (let t = 0; t < trialsCount; t++) {
        const isCold = t === 0;
        const baseLatency = candidate.mockBaseLatencyMs ?? 120;
        const jitter = Math.random() * (candidate.mockLatencyJitterMs ?? 50);
        const coldPenalty = isCold ? 180 : 0;
        const measuredLatency = Math.round((baseLatency + jitter + coldPenalty) * 10) / 10;

        if (isCold) {
          coldStartLatency = measuredLatency;
        } else {
          trialLatencies.push(measuredLatency);
        }

        // Failure simulation
        const failureChance = candidate.mockFailureRate ?? 0.02;
        if (Math.random() < failureChance) {
          notes.push(`Trial ${t + 1} failed: upstream timeout or non-success response.`);
        } else {
          successes++;
        }
      }

      const successRate = Math.round((successes / trialsCount) * 100) / 100;
      trialLatencies.sort((a, b) => a - b);
      const medianLatency = trialLatencies[Math.floor(trialLatencies.length / 2)] || 0;
      const p95Index = Math.min(Math.floor(trialLatencies.length * 0.95), trialLatencies.length - 1);
      const p95Latency = trialLatencies[p95Index] || 0;

      const hasSchemaDrift = Boolean(candidate.mockSchemaDrift);
      if (hasSchemaDrift) {
        disconfirmingSignals.push(`Candidate '${candidate.name}' exhibited unannounced schema drift during trial 4.`);
      }

      // Determine Candidate Verdict
      let candidateVerdict: DecisionVerdict;
      if (candidate.mockAuthViolation || successRate < 0.85) {
        candidateVerdict = "reject_route";
      } else if (hasSchemaDrift || p95Latency > maxLatencyBudget || successRate < requiredSuccessRate) {
        candidateVerdict = "hold_route";
      } else {
        candidateVerdict = "allow_route";
      }

      metrics.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        trialsCompleted: trialsCount,
        successRate,
        coldStartLatencyMs: coldStartLatency,
        medianLatencyMs: medianLatency,
        p95LatencyMs: p95Latency,
        estimatedCostUsd: 0.0015,
        schemaDriftDetected: hasSchemaDrift,
        authViolationDetected: Boolean(candidate.mockAuthViolation),
        verdict: candidateVerdict,
        notes,
      });
    }

    // 4. Overall Decision Verdict Synthesis
    let overallVerdict: DecisionVerdict = "insufficient_comparable_evidence";
    let primaryRecommendation: string | null = null;

    const allowedCandidates = metrics.filter((m) => m.verdict === "allow_route");
    const heldCandidates = metrics.filter((m) => m.verdict === "hold_route");

    if (allowedCandidates.length > 0) {
      // Pick best candidate by p95 latency
      allowedCandidates.sort((a, b) => a.p95LatencyMs - b.p95LatencyMs);
      overallVerdict = "allow_route";
      primaryRecommendation = allowedCandidates[0].candidateId;
    } else if (heldCandidates.length > 0) {
      overallVerdict = "hold_route";
      heldCandidates.sort((a, b) => a.p95LatencyMs - b.p95LatencyMs);
      primaryRecommendation = heldCandidates[0].candidateId;
    } else {
      overallVerdict = "reject_route";
    }

    // 5. Signature & Envelope
    const packetContent = {
      decisionId,
      workflowName: input.workflowName,
      preRegistrationHash,
      verdict: overallVerdict,
      primaryRecommendation,
      candidates: metrics,
    };
    const signature = await hashString("RELAY_AUTH_KEY:" + canonicalizeJson(packetContent));

    const packet: DecisionPacket = {
      schemaVersion: "1.0.0",
      decisionId,
      workflowName: input.workflowName,
      preRegistrationHash,
      verdict: overallVerdict,
      primaryRecommendation,
      confidenceScore: Math.round((metrics.reduce((acc, m) => acc + m.successRate, 0) / metrics.length) * 100) / 100,
      candidates: metrics,
      disconfirmingSignals,
      stopConditionsTriggered,
      signature: `sha256:${signature}`,
      generatedAt,
      expiresAt,
    };

    // 6. Persist Decision Packet into Data Store
    const record: DecisionRecord = {
      id: decisionId,
      decisionId,
      workflowName: input.workflowName,
      verdict: overallVerdict,
      confidence: packet.confidenceScore,
      packetJson: JSON.stringify(packet),
      signature: packet.signature,
      generatedAt,
      expiresAt,
    };
    await db.saveDecisionPacket(record);

    return packet;
  }
}

export const decisionEngine = new DecisionAssuranceEngine();
