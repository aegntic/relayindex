import { capabilities as seedCapabilities, changes as seedChanges } from "../data.ts";
import type { Capability, ChangeEvent } from "../schema.ts";

export interface DecisionRecord {
  id: string;
  decisionId: string;
  workflowName: string;
  verdict: "allow_route" | "hold_route" | "reject_route" | "insufficient_comparable_evidence";
  confidence: number;
  packetJson: string;
  signature: string;
  generatedAt: string;
  expiresAt: string;
}

export interface TelemetryRecord {
  id: string;
  timestamp: string;
  eventType: string;
  clientKind: "human_browser" | "ai_agent" | "unknown";
  path: string;
  status: number;
  latencyMs: number;
  country: string;
  userAgentFamily: string;
}

// In-Memory Database Store (supports edge fallbacks, dev mode, and unit testing)
class RelayDataStore {
  private capabilities: Map<string, Capability> = new Map();
  private changes: ChangeEvent[] = [];
  private decisions: Map<string, DecisionRecord> = new Map();
  private telemetry: TelemetryRecord[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    for (const cap of seedCapabilities) {
      this.capabilities.set(cap.id, cap);
    }
    this.changes = [...seedChanges];
  }

  // Capability Queries
  async listCapabilities(filter?: { category?: string; protocol?: string; minTrust?: number }): Promise<Capability[]> {
    let result = Array.from(this.capabilities.values());

    if (filter?.category) {
      const cat = filter.category.toLowerCase().trim();
      result = result.filter((c) => c.category.toLowerCase() === cat);
    }
    if (filter?.protocol) {
      const proto = filter.protocol.toUpperCase().trim();
      result = result.filter((c) => c.provider.protocols.some((p) => p.toUpperCase() === proto));
    }
    if (filter?.minTrust !== undefined) {
      result = result.filter((c) => c.trustScore >= filter.minTrust!);
    }

    return result;
  }

  async getCapabilityBySlug(slug: string): Promise<Capability | null> {
    for (const cap of this.capabilities.values()) {
      if (cap.slug === slug) return cap;
    }
    return null;
  }

  async getCapabilityById(id: string): Promise<Capability | null> {
    return this.capabilities.get(id) ?? null;
  }

  // Decision Packets
  async saveDecisionPacket(record: DecisionRecord): Promise<DecisionRecord> {
    this.decisions.set(record.decisionId, record);
    return record;
  }

  async getDecisionPacket(decisionId: string): Promise<DecisionRecord | null> {
    return this.decisions.get(decisionId) ?? null;
  }

  async listDecisionPackets(limit = 20): Promise<DecisionRecord[]> {
    return Array.from(this.decisions.values())
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
      .slice(0, limit);
  }

  // Telemetry Events
  async recordTelemetry(event: TelemetryRecord): Promise<void> {
    this.telemetry.push(event);
    // Keep bounded in-memory ring buffer (last 5,000 events)
    if (this.telemetry.length > 5000) {
      this.telemetry.shift();
    }
  }

  async getTelemetryStats() {
    const total = this.telemetry.length;
    const byType: Record<string, number> = {};
    const byClient: Record<string, number> = {};
    let totalLatency = 0;

    for (const t of this.telemetry) {
      byType[t.eventType] = (byType[t.eventType] || 0) + 1;
      byClient[t.clientKind] = (byClient[t.clientKind] || 0) + 1;
      totalLatency += t.latencyMs;
    }

    return {
      totalEvents: total,
      avgLatencyMs: total > 0 ? Math.round((totalLatency / total) * 100) / 100 : 0,
      byType,
      byClient,
    };
  }
}

// Global Singleton (persists within isolate / Node process)
export const db = new RelayDataStore();
