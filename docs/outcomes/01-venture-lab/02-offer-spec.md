# Offer Specification: RelayIndex.dev
**Single Consequential Outcome:** Verified MCP server routing, status deltas, and live executability envelopes for agents.

## 1. Core Offer Components
1. **Status-Aware Delta Ledger:** Replayable upsert and tombstone log of all MCP registry changes, maintaining continuity even during official registry outages.
2. **Executability & Evidence Envelope:** Dynamic readiness verification differentiating `catalogued`, `route_declared`, `route_resolved`, `handshake_verified`, and `capability_observed`.
3. **Namespace-Normalized Change Radar:** Real-time stream filtering batch publisher surges and detecting genuine capability releases across 500+ verified namespaces.
4. **Failure-Closed Agent SDK & Gateway:** Drop-in client router preventing agents from attempting invocations against deprecated, deleted, or unresponsive MCP remotes.

## 2. Scope Boundaries
- **INCLUDED:** Protocol-level health monitoring, JSON-RPC ping/initialize verification, cryptographic record hashing, schema drift tracking.
- **EXCLUDED:** Subjective server popularity votes, token marketplace speculation, proprietary server hosting (RelayIndex is an index and routing ledger, not a host).

## 3. Evidence-Backed Pricing & Reliability Guarantee
- **Open Tier:** Public edge-cached ledger and real-time status feed (zero fee, CC0 data).
- **Pro / Enterprise Gateway:** Dedicated sub-millisecond route resolution, custom audit feeds, and SLA-backed uptime guarantee ($49/seat/mo).
