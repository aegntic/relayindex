# Relay Index — Machine Contracts & Protocol Specifications

**Document Version:** `1.0.0`  
**Last Updated:** `2026-09-05`  
**Classification:** Interface & Protocol Specification  
**Status:** Canonical / Approved  

---

## 1. Protocol Architecture & Invariants

The Agent Control Plane is engineered for deterministic ingestion by LLM tool callers, agent orchestrators, and enterprise API gateways (e.g., Solo.io, Gravitee).

### Core Protocol Invariants
1. **Zero Hallucination Serialization:** All field names use `snake_case` in JSON serialization. Ambiguous or unmeasured metrics are explicitly serialized as `null` or omitted rather than filled with synthetic defaults.
2. **Canonical Origin Isolation:** URLs within JSON payloads (self-links, documentation, endpoints) are projected dynamically only against validated, allowlisted canonical hosts using [`lib/public-origin.ts`](file:///home/ae/Documents/Codex/2026-08-25/referenced-chatgpt-conversation-this-is-an/work/site/lib/public-origin.ts).
3. **Idempotent HTTP Semantics:** Mutating methods (`POST`, `PUT`, `DELETE`, `PATCH`) on read-only discovery routes return `HTTP 405 Method Not Allowed`. `OPTIONS` returns permissive, credential-free CORS. `HEAD` returns identical headers to `GET` without a body.

---

## 2. Public API Specifications

### 2.1 Capability Catalog: `GET /api/v1/capabilities`
Returns normalized capability intelligence with explicit sample/live data demarcations. Grounded in [`app/api/v1/capabilities/route.ts`](file:///home/ae/Documents/Codex/2026-08-25/referenced-chatgpt-conversation-this-is-an/work/site/app/api/v1/capabilities/route.ts).

* **Query Parameters:**
  * `category` (optional, string): Case-insensitive category filter (e.g., `compute`, `database`, `search`).
  * `protocol` (optional, string): Comma-separated protocol list (e.g., `MCP,A2A`).
  * `min_trust` (optional, float): Minimum acceptable trust score $[0 - 100]$.
  * `limit` (optional, integer, default: `20`, max: `100`): Pagination limit.
  * `cursor` (optional, string): Opaque pagination cursor.

* **Response Headers:**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json; charset=utf-8
  Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=86400
  ETag: W/"cap-catalog-20260905-a1b2"
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  ```

* **Response Body Schema:**
  ```json
  {
    "schema_version": "1.0.0",
    "sample_demo": true,
    "environment": "sample_prototype",
    "count": 1,
    "capabilities": [
      {
        "id": "cap_01J7Z8M4X9PQ2W3E5R6T7Y8U9I",
        "slug": "mcp-postgres-inspector",
        "name": "PostgreSQL Schema Inspector",
        "category": "database",
        "description": "Read-only introspection of Postgres schemas and query plans via MCP.",
        "provider": {
          "id": "prv_supabase",
          "name": "Supabase Community",
          "verified": true,
          "protocols": ["MCP"],
          "region": "global"
        },
        "trust_score": 88.4,
        "confidence": 0.92,
        "price_usd": 0.0,
        "p50_latency_ms": 112.0,
        "p95_latency_ms": 165.5,
        "reliability_30d": 0.998,
        "interfaces": ["inspect_tables", "explain_query"],
        "status": "verified",
        "updated_at": "2026-09-05T12:00:00Z",
        "links": {
          "self": "https://relayindex.dev/capabilities/mcp-postgres-inspector",
          "evidence": "https://relayindex.dev/api/v1/capabilities/mcp-postgres-inspector/evidence"
        }
      }
    ]
  }
  ```

---

### 2.2 Machine Offer Contract: `GET /api/v1/offers/capability-assurance`
Exposes the exact, machine-readable proof sprint contract. Sourced directly from [`lib/offer.ts`](file:///home/ae/Documents/Codex/2026-08-25/referenced-chatgpt-conversation-this-is-an/work/site/lib/offer.ts).

* **Purpose:** Enables an autonomous orchestrator or purchasing agent to programmatically inspect the exact deliverables, constraints, evidence hierarchy, and pricing before initiating an engagement.
* **Fail-Closed Semantics:** If `NEXT_PUBLIC_RELAY_PILOT_CHECKOUT_URL` is not set to an authorized `https://buy.stripe.com` host, `billing.enabled` and `billing.checkout_enabled` return `false`, and `checkout_url` is `null`.

* **Response Body Schema:**
  ```json
  {
    "schema_version": "1.0.0",
    "offer_id": "capability-decision-assurance",
    "offer_version": "2026-08-30",
    "status": "founding_price_test",
    "name": "MCP connection decision sprint",
    "outcome": "Decide whether to allow, hold, or reject one MCP route before it touches a consequential workflow.",
    "scope": {
      "workflow_count": 1,
      "maximum_candidates": 3,
      "production_execution": false
    },
    "evidence_protocol": {
      "evidence_classes": ["provider_claim", "independent_public_fact", "reproducible_observation"],
      "common_workload": "Use the same valid inputs and constraints wherever interfaces permit.",
      "minimum_trials": 10,
      "retry_rule": "Record the initial attempt separately from at most two transient-failure retries.",
      "latency_rule": "Report median and p95 for successful comparable trials; never blend failed attempts away.",
      "cost_rule": "Record the dated published price basis and observed billable units; do not extrapolate unclear pricing.",
      "failure_rule": "Count timeout, non-success response, invalid output, or an unmet declared constraint as a failure.",
      "stop_rule": "Return insufficient comparable evidence when equivalent testing is not lawful, authorized, or technically possible."
    },
    "decision_outcomes": [
      "allow_route",
      "hold_route",
      "reject_route",
      "insufficient_comparable_evidence"
    ],
    "pricing": {
      "status": "founding_price_test",
      "amount": 1250,
      "currency": "AUD",
      "tax_treatment": "shown_at_checkout"
    },
    "delivery": {
      "target_business_days": 5,
      "starts_after": "Valid inputs and authorized test access are confirmed."
    },
    "capacity": {
      "founding_slots": 3
    },
    "billing": {
      "provider": "stripe_payment_link",
      "enabled": false,
      "checkout_enabled": false,
      "checkout_url": null
    }
  }
  ```

---

### 2.3 Legacy Discovery Endpoint: `GET /.well-known/agent.json`
Maintained for backward compatibility with prototype discovery conventions. Grounded in [`app/.well-known/agent.json/route.ts`](file:///home/ae/Documents/Codex/2026-08-25/referenced-chatgpt-conversation-this-is-an/work/site/app/.well-known/agent.json/route.ts).

* **Classification:** Legacy Relay Index product discovery metadata.
* **Strict Non-A2A Boundary:** This endpoint explicitly declares `a2a_conformance: false` and advertises zero push or task invocation capabilities, preventing upstream clients from attempting broken RPC handshakes.

---

## 3. Protocol Evolution: A2A v1.0 & Native MCP Server

### 3.1 A2A Protocol v1.0 Conformance Roadmap
As the A2A standard solidifies around formal cryptographic Agent Cards, Relay Index will mount `/.well-known/agent-card.json`:
* **Card Signing:** The card will be cryptographically signed by Relay Index’s Ed25519 authority key.
* **Supported Skills:**
  * `skill_query_capability`: Look up empirical reliability/latency for an external tool.
  * `skill_verify_evidence`: Retrieve signed cryptographic observation receipts for an evaluation.

### 3.2 Relay Index Native MCP Server (`relay-index-mcp`)
To embed decision assurance directly into developer tooling (Cursor, Claude Desktop, Windsurf), Relay Index will expose a standardized Model Context Protocol server exposing three core tools:

```json
{
  "tools": [
    {
      "name": "relay_lookup_capability",
      "description": "Query Relay Index for empirical trust, p95 latency, and drift risk for an MCP server.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "server_identifier": { "type": "string" }
        },
        "required": ["server_identifier"]
      }
    },
    {
      "name": "relay_evaluate_connection",
      "description": "Pre-register and evaluate whether an external MCP tool satisfies workflow latency and security budgets.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "workflow_description": { "type": "string" },
          "candidate_tools": { "type": "array", "items": { "type": "string" }, "maxItems": 3 },
          "max_p95_latency_ms": { "type": "number" }
        },
        "required": ["workflow_description", "candidate_tools"]
      }
    }
  ]
}
```

---

## 4. Edge HTTP Policy & Error Contracts

### Standardized Error Envelope
All error responses from `/api/*` routes return a uniform JSON error structure:

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Only GET, HEAD, and OPTIONS methods are permitted on this route.",
    "status": 405,
    "timestamp": "2026-09-05T13:30:00Z",
    "documentation_url": "https://relayindex.dev/pilot"
  }
}
```

| HTTP Status | Error Code | Trigger Condition |
| :--- | :--- | :--- |
| `400 Bad Request` | `INVALID_HOST_HEADER` | Request `Host` does not match canonical host allowlist. |
| `404 Not Found` | `CAPABILITY_NOT_FOUND` | Queried capability slug does not exist in D1. |
| `405 Method Not Allowed` | `METHOD_NOT_ALLOWED` | `POST`/`PUT`/`DELETE` attempted on read-only resource. |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Client exceeded 120 requests/minute budget. |
| `503 Service Unavailable` | `CHECKOUT_DISABLED` | Stripe checkout link is unconfigured or failed closed. |
