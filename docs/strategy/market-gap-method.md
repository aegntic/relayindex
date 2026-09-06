# Relay Index market-gap method

Checked: 2026-08-26 08:00 AEST

Status: Internal strategy method. Public-source facts and analyst inference are separated. This document is not capability evidence and never enters ranking.

## Decision we are testing

Can an independent evidence layer help an operator choose among external agent capabilities for one consequential workflow, using comparable evidence for interface fit, price, latency, reliability, and change risk?

The initial customer hypothesis is the operator who owns that routing decision. Registries, marketplaces, gateways, and observability vendors are possible evidence, telemetry, integration, or distribution partners—not presumed buyers.

## Ranked gaps

### 1. Task-specific external capability selection

- Reported fact: A2A Agent Cards describe identity, endpoints, capabilities, skills, and authentication, but the current discovery specification does not prescribe a curated registry or prove runtime task outcomes. Sources: [A2A discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) and [A2A 1.0](https://a2a-protocol.org/latest/announcing-1.0/).
- Reported fact: the MCP Registry explicitly expects downstream aggregators to add value such as ratings and security scanning, while warning that the official registry has no uptime or data-durability guarantee. Source: [MCP Registry aggregators](https://modelcontextprotocol.io/registry/registry-aggregators).
- Analyst inference: identity, metadata, and discovery do not answer which candidate is best for one named workload under the operator's constraints.
- Existing substitutes: direct provider evaluation, internal benchmarks, procurement reviews, and gateway policy.
- Disconfirming evidence: a gateway or registry demonstrates independent, cross-provider, task-specific comparisons with comparable price, latency, reliability, and change evidence available at decision time.
- Confidence: high that the information gap exists; low that buyers will pay Relay Index to close it.
- Revalidate by: 2026-09-02.

### 2. Evidence portability across registries, gateways, and evaluators

- Reported fact: Glama already builds, sandboxes, scans, and evaluates MCP servers, including schema drift and tool-quality signals. Source: [Glama methodology](https://glama.ai/mcp/methodology).
- Reported fact: PulseMCP already offers enriched registry data and a partner surface. Source: [PulseMCP API](https://www.pulsemcp.com/api).
- Reported fact: Solo and Gravitee already provide discovery, routing, policy, and telemetry for agent traffic. Sources: [Solo agentgateway](https://www.solo.io/products/agentgateway) and [Gravitee AI Gateway](https://www.gravitee.io/platform/ai-gateway).
- Analyst inference: Relay Index should consume or exchange evidence with these systems, not recreate their control planes.
- Existing substitutes: vendor-specific registries, gateway telemetry, and internal observability.
- Disconfirming evidence: adjacent platforms expose normalized cross-provider decision records and confidence reasoning that operators can reuse outside the platform.
- Confidence: medium; partner appetite is unverified.
- Revalidate by: 2026-09-02.

### 3. Procurement-ready assurance for callable agents

- Reported fact: Google Cloud Marketplace documents validation and free, subscription, usage, and combined pricing for A2A agents. Source: [Google Cloud Marketplace AI agents](https://docs.cloud.google.com/marketplace/docs/partners/ai-agents).
- Reported fact: Google describes an A2A partner ecosystem including enterprise software providers and a publishing path into Gemini Enterprise and Cloud Marketplace. Sources: [A2A partner ecosystem](https://cloud.google.com/blog/topics/partners/best-agentic-ecosystem-helping-partners-build-ai-agents-next25), [Gemini Enterprise partners](https://cloud.google.com/blog/topics/partners/partners-powering-the-gemini-enterprise-agent-ecosystem/), and [agent publishing guide](https://cloud.google.com/blog/topics/developers-practitioners/publish-agents-in-gemini-enterprise-and-google-cloud-marketplace).
- Analyst inference: a marketplace listing creates a procurement surface, not an independent answer about workload fit or ongoing route quality.
- Existing substitutes: marketplace validation, enterprise procurement, gateway policy, and private evaluation.
- Disconfirming evidence: marketplaces publish continuously refreshed, comparable outcome evidence for the buyer's exact workflow.
- Confidence: medium on the gap; low on a near-term distribution partnership.
- Revalidate by: 2026-09-02.

## Competitive boundary

Relay Index is:

- not another directory;
- not another security scanner;
- not another gateway;
- not another marketplace;
- not another observability dashboard.

Its narrow claim is decision assurance: preserve the evidence and uncertainty behind an operator's choice for one workload. A conclusion that the current route remains best—or that comparable evidence is insufficient—is valid.

## Evidence protocol

Before recommending a route, pre-register:

1. one named workflow and constraints;
2. no more than three eligible candidates;
3. common inputs and success criteria;
4. evidence class: provider claim, independent public fact, or reproducible observation;
5. environment, timestamp, price basis, latency statistic, failure definition, retry count, and stop rule;
6. disconfirming evidence and uncertainty;
7. one of three outcomes: change route, retain route, or insufficient comparable evidence.

Material claims retain a checked timestamp, concise supporting fact, source type, and a content fingerprint or permitted archival reference when available. Revalidation is additive; prior observations are not silently replaced.

## Trust firewall

Market research, organization priority, sponsorship, revenue and engagement never enter trust scoring. Only verified capability evidence and privacy-preserving utility observations may influence rankings.

