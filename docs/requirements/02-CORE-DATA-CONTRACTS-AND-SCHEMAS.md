# Relay Index — Core Data Contracts & Schemas

**Document Version:** `1.0.0`  
**Last Updated:** `2026-09-05`  
**Classification:** Data Contract Specification  
**Status:** Canonical / Approved  

---

## 1. Overview & Data Invariants

This specification formalizes the canonical entities, TypeScript contracts, SQLite/D1 relational schemas, and cryptographic integrity protocols for Relay Index.

### Core Invariants
1. **Deterministic Serialization:** All machine-readable objects and API responses serialize with deterministic key ordering to ensure idempotent hashing and stable client verification.
2. **Cryptographic Provenance:** Every evidence item, observation trace, and decision packet carries a SHA-256 fingerprint derived from canonical JSON serialization.
3. **Temporal Invalidation:** Evidence is never permanent. All claims carry explicit observation timestamps and expire via defined half-life functions or upon detection of upstream drift events.

---

## 2. Domain Entities & TypeScript Contracts

Extending the foundation established in [`lib/schema.ts`](file:///home/ae/Documents/Codex/2026-08-25/referenced-chatgpt-conversation-this-is-an/work/site/lib/schema.ts):

```typescript
export type ProtocolKind = "MCP" | "A2A" | "REST";

export type EvidenceKind = 
  | "benchmark"              // Controlled synthetic trial
  | "observed_call"          // Real runtime traffic observation
  | "provider_claim"         // Self-reported manifest claim
  | "audit";                 // Formal third-party security/conformance audit

export type CapabilityStatus = "verified" | "monitoring" | "degraded";

export type ChangeEventKind = "launch" | "price" | "interface" | "reliability";

export type DecisionOutcome = 
  | "allow_route"
  | "hold_route"
  | "reject_route"
  | "insufficient_comparable_evidence";

// 1. Provider Contract
export interface Provider {
  id: string;
  name: string;
  verified: boolean;
  protocols: ProtocolKind[];
  region: string;
  publicKey?: string;          // Ed25519 public key for signed observations
  homepageUrl?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Evidence Contract
export interface Evidence {
  id: string;
  capabilityId: string;
  kind: EvidenceKind;
  source: string;              // URL, git commit hash, or trace ID
  observedAt: string;          // ISO 8601 UTC
  expiresAt: string;           // Expiry timestamp
  sampleSize?: number;         // Count of evaluated trials
  supports: string;            // Property supported (e.g., "p95_latency < 250ms")
  weight: number;              // Scientific confidence weight [0.0 - 1.0]
  contentHash: string;         // SHA-256 of the raw underlying evidence artifact
}

// 3. Runtime Observation Contract
export interface Observation {
  id: string;
  capabilityId: string;
  trialId: string;             // Correlation ID of the synthetic test run
  success: boolean;
  latencyMs: number;
  costUsd: number;
  errorCode?: string;          // e.g., "TIMEOUT", "SCHEMA_MISMATCH", "HTTP_503"
  observedAt: string;
}

// 4. Capability Contract
export interface Capability {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  provider: Provider;
  trustScore: number;          // Aggregated composite [0 - 100]
  confidence: number;          // Statistical confidence [0.0 - 1.0]
  priceUsd: number;            // Normalized cost per 1k operations
  p50LatencyMs: number;
  p95LatencyMs: number;
  reliability30d: number;      // Availability ratio [0.0 - 1.0]
  interfaces: string[];        // Array of supported tool names or method signatures
  evidence: Evidence[];
  status: CapabilityStatus;
  updatedAt: string;
}

// 5. Change Event Contract
export interface ChangeEvent {
  id: string;
  capabilityId: string;
  kind: ChangeEventKind;
  title: string;
  detail: string;
  detectedAt: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  diffHash?: string;           // SHA-256 of schema diff
}

// 6. Decision Packet Contract
export interface DecisionPacket {
  schemaVersion: "1.0.0";
  decisionId: string;
  workflowName: string;
  constraints: Record<string, unknown>;
  candidateIds: string[];
  matrix: {
    candidateId: string;
    successRate: number;
    medianLatencyMs: number;
    p95LatencyMs: number;
    unitCostUsd: number;
    driftRisk: "low" | "medium" | "high";
    recommendation: "primary" | "fallback" | "disqualified";
  }[];
  verdict: DecisionOutcome;
  confidence: number;
  disconfirmingConditions: string[];
  stopConditionsTriggered: string[];
  evaluatorSignature: string;   // Cryptographic signature from Relay Index authority
  generatedAt: string;
  expiresAt: string;
}
```

---

## 3. Relational DDL (Cloudflare D1 / SQLite)

```sql
-- Providers Table
CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    protocols TEXT NOT NULL, -- JSON Array: ["MCP", "A2A"]
    region TEXT NOT NULL DEFAULT 'global',
    public_key TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Capabilities Table
CREATE TABLE IF NOT EXISTS capabilities (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    provider_id TEXT NOT NULL REFERENCES providers(id),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    trust_score REAL NOT NULL DEFAULT 50.0,
    confidence REAL NOT NULL DEFAULT 0.1,
    price_usd REAL NOT NULL DEFAULT 0.0,
    p50_latency_ms REAL NOT NULL DEFAULT 0.0,
    p95_latency_ms REAL NOT NULL DEFAULT 0.0,
    reliability_30d REAL NOT NULL DEFAULT 1.0,
    interfaces TEXT NOT NULL, -- JSON Array of tool signatures
    status TEXT NOT NULL DEFAULT 'monitoring', -- 'verified' | 'monitoring' | 'degraded'
    updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_capabilities_slug ON capabilities(slug);
CREATE INDEX IF NOT EXISTS idx_capabilities_category ON capabilities(category);
CREATE INDEX IF NOT EXISTS idx_capabilities_trust_score ON capabilities(trust_score);

-- Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
    kind TEXT NOT NULL, -- 'benchmark' | 'observed_call' | 'provider_claim' | 'audit'
    source TEXT NOT NULL,
    observed_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    sample_size INTEGER,
    supports TEXT NOT NULL,
    weight REAL NOT NULL DEFAULT 0.5,
    content_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evidence_capability ON evidence(capability_id);
CREATE INDEX IF NOT EXISTS idx_evidence_expires ON evidence(expires_at);

-- Observations Table (Rollup Buffer)
CREATE TABLE IF NOT EXISTS observations (
    id TEXT PRIMARY KEY,
    capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
    trial_id TEXT NOT NULL,
    success INTEGER NOT NULL,
    latency_ms REAL NOT NULL,
    cost_usd REAL NOT NULL,
    error_code TEXT,
    observed_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_observations_cap_date ON observations(capability_id, observed_at);

-- Change Events Table
CREATE TABLE IF NOT EXISTS change_events (
    id TEXT PRIMARY KEY,
    capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
    kind TEXT NOT NULL, -- 'launch' | 'price' | 'interface' | 'reliability'
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    detected_at TEXT NOT NULL,
    impact TEXT NOT NULL, -- 'high' | 'medium' | 'low'
    confidence REAL NOT NULL,
    diff_hash TEXT
);
CREATE INDEX IF NOT EXISTS idx_change_events_detected ON change_events(detected_at DESC);

-- Decision Packets Table
CREATE TABLE IF NOT EXISTS decision_packets (
    id TEXT PRIMARY KEY,
    decision_id TEXT UNIQUE NOT NULL,
    workflow_name TEXT NOT NULL,
    verdict TEXT NOT NULL,
    confidence REAL NOT NULL,
    packet_json TEXT NOT NULL, -- Full JSON payload matching DecisionPacket interface
    signature TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_decision_packets_lookup ON decision_packets(decision_id);
```

---

## 4. Cryptographic Provenance & Content Hashing

All persistent artifacts must be verifiable against tampering using deterministic content hashing:

### Deterministic JSON Serialization Algorithm
```typescript
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

export async function computeSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
```

---

## 5. Temporal Decay & Invalidation Rules

Evidence quality naturally degrades over time as upstream software shifts:

1. **Exponential Evidence Decay:**  
   $$\text{Weight}(t) = W_0 \cdot \exp\left(-\frac{\ln(2)}{T_{\text{half}}} \cdot (t - t_0)\right)$$
   * For synthetic benchmark trials: $T_{\text{half}} = 14 \text{ days}$.
   * For provider self-reported claims: $T_{\text{half}} = 30 \text{ days}$.
   * For formal security/conformance audits: $T_{\text{half}} = 90 \text{ days}$.

2. **Immediate Invalidation Triggers:**  
   An evidence item is immediately marked $\texttt{EXPIRED}$ if any of the following events occur:
   * Upstream Git commit detected on tool repository main branch.
   * Semantic version bump in MCP tool metadata.
   * Invalidation of provider's A2A Agent Card cryptographic signature.
   * Observed runtime error rate exceeds $25\%$ over any trailing 1-hour window.
