export type Provider = { id: string; name: string; verified: boolean; protocols: ("A2A" | "MCP" | "REST")[]; region: string };
export type Evidence = { id: string; kind: "benchmark" | "observed_call" | "provider_claim" | "audit"; source: string; observedAt: string; sampleSize?: number; supports: string; weight: number };
export type Observation = { id: string; capabilityId: string; success: boolean; latencyMs: number; costUsd: number; observedAt: string };
export type Capability = { id: string; slug: string; name: string; category: string; description: string; provider: Provider; trustScore: number; confidence: number; priceUsd: number; p50LatencyMs: number; reliability30d: number; interfaces: string[]; evidence: Evidence[]; status: "verified" | "monitoring" | "degraded" };
export type ChangeEvent = { id: string; capabilityId: string; kind: "launch" | "price" | "interface" | "reliability"; title: string; detail: string; detectedAt: string; impact: "high" | "medium" | "low"; confidence: number };
export type Opportunity = { id: string; title: string; thesis: string; capabilityIds: string[]; expectedValueUsd: number; window: string; confidence: number; status: "open" | "watch" };
export type Watch = { id: string; targetType: "capability" | "category" | "provider"; targetId: string; conditions: string[]; channels: ("webhook" | "email" | "feed")[] };
