import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const providers = sqliteTable("providers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  protocols: text("protocols").notNull(), // JSON array: ["MCP", "A2A"]
  region: text("region").notNull().default("global"),
  publicKey: text("public_key"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const capabilities = sqliteTable("capabilities", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  providerId: text("provider_id").notNull().references(() => providers.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  trustScore: real("trust_score").notNull().default(50.0),
  confidence: real("confidence").notNull().default(0.1),
  priceUsd: real("price_usd").notNull().default(0.0),
  p50LatencyMs: real("p50_latency_ms").notNull().default(0.0),
  p95LatencyMs: real("p95_latency_ms").notNull().default(0.0),
  reliability30d: real("reliability_30d").notNull().default(1.0),
  interfaces: text("interfaces").notNull(), // JSON array
  status: text("status", { enum: ["verified", "monitoring", "degraded"] }).notNull().default("monitoring"),
  updatedAt: text("updated_at").notNull(),
});

export const evidence = sqliteTable("evidence", {
  id: text("id").primaryKey(),
  capabilityId: text("capability_id").notNull().references(() => capabilities.id),
  kind: text("kind", { enum: ["benchmark", "observed_call", "provider_claim", "audit"] }).notNull(),
  source: text("source").notNull(),
  observedAt: text("observed_at").notNull(),
  expiresAt: text("expires_at").notNull(),
  sampleSize: integer("sample_size"),
  supports: text("supports").notNull(),
  weight: real("weight").notNull().default(0.5),
  contentHash: text("content_hash").notNull(),
});

export const observations = sqliteTable("observations", {
  id: text("id").primaryKey(),
  capabilityId: text("capability_id").notNull().references(() => capabilities.id),
  trialId: text("trial_id").notNull(),
  success: integer("success", { mode: "boolean" }).notNull(),
  latencyMs: real("latency_ms").notNull(),
  costUsd: real("cost_usd").notNull(),
  errorCode: text("error_code"),
  observedAt: text("observed_at").notNull(),
});

export const changeEvents = sqliteTable("change_events", {
  id: text("id").primaryKey(),
  capabilityId: text("capability_id").notNull().references(() => capabilities.id),
  kind: text("kind", { enum: ["launch", "price", "interface", "reliability"] }).notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  detectedAt: text("detected_at").notNull(),
  impact: text("impact", { enum: ["high", "medium", "low"] }).notNull(),
  confidence: real("confidence").notNull(),
  diffHash: text("diff_hash"),
});

export const decisionPackets = sqliteTable("decision_packets", {
  id: text("id").primaryKey(),
  decisionId: text("decision_id").unique().notNull(),
  workflowName: text("workflow_name").notNull(),
  verdict: text("verdict", { enum: ["allow_route", "hold_route", "reject_route", "insufficient_comparable_evidence"] }).notNull(),
  confidence: real("confidence").notNull(),
  packetJson: text("packet_json").notNull(),
  signature: text("signature").notNull(),
  generatedAt: text("generated_at").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export const telemetryEvents = sqliteTable("telemetry_events", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp").notNull(),
  eventType: text("event_type").notNull(),
  clientKind: text("client_kind", { enum: ["human_browser", "ai_agent", "unknown"] }).notNull(),
  path: text("path").notNull(),
  status: integer("status").notNull(),
  latencyMs: real("latency_ms").notNull(),
  country: text("country").notNull().default("XX"),
  userAgentFamily: text("user_agent_family").notNull().default("unknown"),
});
