---
title: "feat: Ground Relay Index offer in verified market gaps"
type: feat
status: active
date: 2026-08-26
---

# feat: Ground Relay Index offer in verified market gaps

## Summary

Replace the guessed buyer and generic pricing pitch with a cited market-gap and organization-signal map, a narrowly defined decision-assurance pilot, and an honest machine-readable offer. Extend the existing draft-only growth engine so gap and account evidence must exist before content or commercial experiments are proposed.

---

## Problem Frame

Relay Index currently presents unvalidated tier prices, quotas, and a broad buyer assumption even though the repository contains no buyer research, willingness-to-pay evidence, named public organization signals, or live usage. The market already has capable directories, registries, security scanners, gateways, and observability systems. Repackaging those categories would not create a defensible product or a no-brainer offer.

Primary-source research points to a narrower unresolved decision: identity, metadata conformance, security posture, and private traces exist in separate systems, but a caller still lacks independent, task-specific evidence for which external agent or tool to use now, at what price and latency, with what failure risk, and what changed since the last decision.

---

## Assumptions

*This plan was authored without synchronous user confirmation. The items below are agent inferences that fill gaps in the input - un-validated bets that should be reviewed before implementation proceeds.*

- The first proof sprint evaluates one consequential workflow across no more than three candidate providers or approaches. It pre-registers common inputs and constraints, candidate eligibility, evidence classes, measurement and retry rules, timestamps and environment, uncertainty handling, and an `insufficient comparable evidence` outcome. It produces a cited decision matrix, reproducible observations, a recommendation or justified no-change conclusion, fallback, and stop conditions. It does not execute production work.
- The pilot is a hypothesis, not an available paid service. Its price remains unset and checkout remains disabled until public lead conversations produce evidence.
- Named leads are organizations showing dated public adoption, procurement, registry, gateway, or evaluation signals. The repository stores no individual names, personal contact data, inferred intent, enrichment, or outreach copy.
- The initial customer hypothesis is an operator facing one consequential external-agent routing decision. Registries, marketplaces, gateways, and evaluation platforms are evidence, telemetry, integration, or distribution partners until buyer-specific evidence proves otherwise.
- The evidence-led method and aggregate gap conclusions are repository strategy artifacts. The organization research queue is a private, non-deployed output with explicit retention and access boundaries; neither surface is imported into the capability graph or used by trust scoring.
- The existing automation remains an externally scheduled Codex workflow. This plan versions its policy and templates but does not claim a Worker Cron Trigger or repository-local scheduler exists.

---

## Requirements

- R1. Create a dated market-gap map whose claims are linked to primary public evidence, checked dates, fact/inference classification, confidence, substitutes, disconfirmers, and expiry or revalidation guidance.
- R2. Create a prioritized private organization research queue with the public signal, affected decision, Relay Index fit, smallest allowed validation step, public business route, confidence, buyer-specific falsification signal, and disqualifying evidence for each candidate. Ecosystem presence alone is not buyer evidence.
- R3. Demonstrate why the chosen wedge is not another directory, security scanner, marketplace, gateway, or internal observability product.
- R4. Replace the generic tier pitch with one exact proof-sprint hypothesis: clear input, comparable-task method, evidence hierarchy, measurement and retry rules, deliverables, objective acceptance threshold, exclusions, pilot status, unset price, disabled checkout, and no commercial guarantee. Retaining the current route and returning `insufficient comparable evidence` are valid outcomes.
- R5. Expose the offer through a stable, read-only JSON endpoint that agents can inspect without implying A2A invocation, purchase, booking, or live telemetry.
- R6. Keep the legacy product manifest truthful: link to the offer catalog as an HTTP interface, but do not advertise the offer as an A2A skill or publish a formal current Agent Card before an A2A transport exists.
- R7. Update the draft-only growth engine so market-gap and public organization signals precede distribution, weak or conflicting evidence becomes a research gap, and no personal data, outreach, publishing, or trust-score influence is allowed.
- R8. Preserve all sample/demo labels, canonical-host protections, revenue/trust separation, responsive behavior, and existing capability-list contracts.
- R9. Verify the homepage, offer endpoint, legacy manifest, capability API, and mobile layout; commit, push, and deploy the exact reviewed source.

---

## Scope Boundaries

- No automated outreach, lead scraping, contact enrichment, email capture, cold messaging, or external distribution of market-gap, organization-research, or marketing artifacts. The reviewed website release remains in scope.
- No personal names, personal email addresses, social handles, or inferred purchasing intent in the lead map.
- No checkout, billing, metering, entitlement, booking, or promise that the pilot is operationally available.
- No production ingestion, D1 persistence, runtime observation collection, live rankings, or change-alert delivery.
- No formal `/.well-known/agent-card.json` until Relay Index implements a conforming A2A transport and task lifecycle.
- No import from marketing, lead, sponsorship, or revenue artifacts into capability scores or ranking weights.

### Deferred to Follow-Up Work

- Production evidence pipeline: provision D1/R2, implement source adapters, sign observations, add provenance/expiry validation, and run idempotent scheduled ingestion.
- Pilot conversion: add an approved business contact channel only after consent, retention, abuse, and operator-response policies are ready.
- Commercial pricing: test willingness to pay with qualified organization conversations before restoring fixed public prices.
- A2A transport: implement and test the current protocol before publishing a formal Agent Card or invocation skill.

---

## Context & Research

### Relevant Code and Patterns

- `app/relay-dashboard.tsx` contains the current hard-coded buyer, four tier hypotheses, pilot copy, and all homepage sections.
- `app/api/v1/capabilities/route.ts` establishes the native `Response.json`, snake-case serialization, permissive public CORS, bounded cache, and explicit `sample_demo` coverage pattern.
- `app/.well-known/agent.json/route.ts` already uses a strict canonical-host allowlist; preserve it and label this route as legacy product discovery metadata rather than a current A2A Agent Card.
- `tests/rendered-html.test.mjs` locks the existing guessed prices and must be rewritten around the evidence-sprint contract.
- `tests/public-contracts.test.mjs` exercises the built Worker and protects sample/live and hostile-host boundaries.
- `docs/marketing/README.md` and `docs/marketing/templates/` already enforce primary sources, dates, fact/inference separation, human approval, no publication, and no sample-data evidence.
- `lib/pipeline.ts` keeps discovery, verification, observations, ranking, and opportunity signals replaceable. Commercial research remains outside this scoring path.

### Institutional Learnings

- No `docs/solutions/`, `AGENTS.md`, or repository knowledge base exists. This feature must preserve its method and safeguards explicitly in the strategy and automation documentation.
- Previous review found that a template is not proof of a recurring job, that watches remain browser-only, and that live/source claims require persistence, signed observations, API keys, and rate limits.

### External References

- A2A Agent Cards describe identity, interfaces, skills, and authentication; the protocol does not prescribe a standard curated-registry API: https://a2a-protocol.org/latest/topics/agent-discovery/
- A2A v1.0 adds signed Agent Cards and production interoperability, strengthening identity without proving task outcomes: https://a2a-protocol.org/latest/announcing-1.0/
- The official MCP Registry invites downstream aggregators to add ratings and security scans, and provides no uptime or durability guarantee: https://modelcontextprotocol.io/registry/registry-aggregators
- Glama already performs build, sandbox, security, schema-drift, and quality analysis at MCP scale, so Relay Index should not compete as another MCP scanner: https://glama.ai/mcp/methodology
- PulseMCP already sells enriched, curated subregistry data and explicitly seeks partner integrations: https://www.pulsemcp.com/api
- Solo.io and Gravitee already provide A2A/MCP gateway security, policy, routing, telemetry, and discovery, creating integration prospects rather than empty competitive space: https://www.solo.io/products/agentgateway and https://www.gravitee.io/platform/ai-gateway
- Arize already owns first-party production trace and evaluation workflows, but its public positioning focuses on each customer's internal agent systems: https://arize.com/blog/agent-telemetry-standards/
- Google Cloud Marketplace now validates and sells A2A agents with free, subscription, usage, and combined pricing, creating a live procurement surface and later distribution lead: https://docs.cloud.google.com/marketplace/docs/partners/ai-agents
- The A2A repository contains active proposals for registry trust, runtime attestation, health, discovery, governance, and reputation, confirming that conformance alone does not settle selection: https://github.com/a2aproject/A2A/discussions/1631 and https://github.com/a2aproject/A2A/issues/1835
- vinext is beta; use portable Web `Request` and `Response` primitives and explicit cache/CORS headers for new route contracts: https://github.com/cloudflare/vinext

---

## Key Technical Decisions

- Position Relay Index as independent capability decision assurance: it compares external candidates for a specific task and records why a route is justified. Registries remain sources, gateways remain enforcement points, and observability vendors remain telemetry sources or partners.
- Keep the proof sprint non-commercial until its evidence protocol and acceptance criteria have been demonstrated. Do not publish a fee guarantee; the public contract states that price is unset, checkout is disabled, and any future commercial terms require separate agreement.
- Keep canonical offer content and relative paths in one shared TypeScript view model. The homepage renders its relative paths directly; server-only trusted-origin projection creates absolute links for JSON and legacy metadata. Structural parity tests prevent marketing and machine contracts from drifting.
- Use a versioned, read-only HTTP offer endpoint with stable identifiers, explicit status, bounded caching, public credential-free CORS, unset pricing, and canonical absolute links.
- Keep the existing `/.well-known/agent.json` only as legacy Relay Index discovery metadata. Add a clearly named offer-catalog interface but keep the existing sample-list skill count unchanged.
- Treat public organization signals as research candidates, not sales-qualified leads. Each remains reversible when evidence expires, buyer-specific evidence is absent, or a substitute already solves the problem.
- Keep market research additive and private. Automation creates uniquely dated artifacts, never overwrites a human-approved file, and cannot infer approval.

---

## Open Questions

### Resolved During Planning

- Initial wedge: task-specific external decision assurance rather than directory, scanning, execution, or internal observability.
- Conversion terminal: machine-readable pilot contract only; no fake enrollment or data capture.
- Lead boundary: public organization-level evidence and public business routes only.
- Commercial terms: price unset until qualified conversations produce willingness-to-pay evidence.
- Manifest boundary: link the offer as HTTP metadata without claiming current A2A conformance.

### Deferred to Implementation

- Exact wording and visual hierarchy may adapt during browser verification as long as the proof contract, honesty labels, and source-of-truth fields stay unchanged.
- Cache revalidation may remain header-only unless the built vinext Worker proves conditional ETag behavior cleanly.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```mermaid
flowchart LR
  S["Primary public sources"] --> G["Verified market gaps"]
  G --> L["Organization signals"]
  G --> O["Shared proof-sprint offer"]
  L --> H["Private organization research queue"]
  O --> W["Homepage"]
  O --> J["Read-only offer JSON"]
  J --> M["Legacy discovery link"]
  G --> A["Draft-only growth automation"]
  A --> Q{"Human approval?"}
  Q -->|No| P["Private research only"]
  Q -->|Yes| D["Eligible distribution draft"]
  H -. never enters .-> T["Trust scoring"]
  A -. never enters .-> T
```

---

## Implementation Units

### U1. Evidence-backed market gap and lead map

**Goal:** Produce the internal source of truth for market opportunity, competitive whitespace, initial account targets, and disconfirming evidence.

**Requirements:** R1, R2, R3

**Dependencies:** None

**Files:**
- Create: `docs/strategy/market-gap-method.md`
- Create: `../../outputs/relay-index-research/YYYY-MM-DD-organization-research-queue.md` (private, non-deployed)
- Modify: `docs/strategy/launch-and-monetization.md`
- Test: `tests/strategy-integrity.test.mjs`

**Approach:**
- Rank gaps by repeated primary-source evidence and current substitute coverage, not market-size storytelling.
- Include exact public organization signals for registry, gateway, evaluation, marketplace, and agent-provider research candidates, while separating ecosystem evidence from buyer evidence.
- Give each candidate a smallest allowed human validation step, public business route, confidence, disqualifiers, source excerpt/fact, retrieval timestamp, content fingerprint where permitted, and next verification date. Do not create outreach copy or contact records.
- Replace guessed prices and 100k-call buyer thresholds with evidence gates and reversible commercial experiments.

**Execution note:** Write the integrity test first so the artifact cannot omit citations, checked dates, classification, disconfirmers, or privacy boundaries.

**Patterns to follow:**
- Evidence, confidence, classification, and verification-gap shape in `docs/marketing/templates/change-radar.md`.

**Test scenarios:**
- Happy path: every ranked gap includes a direct public source, checked date, classification, confidence, substitute, and disconfirming condition.
- Research integrity: every candidate is an organization with a public business route, dated ecosystem signal, and an explicit buyer-evidence state; ecosystem activity alone cannot qualify it.
- Privacy: the map contains no personal contact field, inferred purchase intent, outreach copy, or sample/demo evidence.
- Competitive boundary: the map explicitly rejects directory, MCP-scanner, gateway, marketplace, and private-observability duplication.
- Expiry: stale or contradicted signals carry revalidation state rather than remaining silently qualified.

**Verification:**
- A skeptical reviewer can trace why the wedge and first account queue exist, what would falsify them, and what the next allowed action is.

### U2. Shared pilot offer and agent-readable contract

**Goal:** Define one honest proof-sprint offer and expose it through a stable read-only endpoint.

**Requirements:** R4, R5, R8

**Dependencies:** U1

**Files:**
- Create: `lib/offer.ts`
- Create: `app/api/v1/offers/capability-assurance/route.ts`
- Modify: `tests/public-contracts.test.mjs`

**Approach:**
- Store stable offer identity, version, status, input limits, evidence protocol, deliverables, proof threshold, exclusions, pricing state, billing state, and relative public paths in one immutable view model. Project absolute links only at trusted server boundaries.
- Return only GET/HEAD/OPTIONS behavior; reject mutation methods and never imply booking, purchase, invocation, or guaranteed results.
- Reuse canonical-host resolution semantics and explicit public cache/CORS headers.

**Execution note:** Start with failing Worker contract tests for the JSON response, host allowlist, no-invocation language, and mutation rejection.

**Patterns to follow:**
- `app/api/v1/capabilities/route.ts` for native JSON and cache/CORS shape.
- `app/.well-known/agent.json/route.ts` for canonical host allowlisting.

**Test scenarios:**
- Happy path: GET returns JSON with stable schema/offer versions, `pilot_hypothesis`, unset price, disabled billing and checkout, exact workflow/candidate limits, evidence hierarchy, measurement rules, an `insufficient comparable evidence` outcome, and implemented links.
- Agent safety: response contains no payment, booking, invocation, live-telemetry, or production-results claim.
- Security: Sites and `relayindex.dev` produce correct links; hostile and unowned hosts never appear in output.
- Protocol: OPTIONS returns public credential-free CORS; HEAD has GET-equivalent headers with no body; mutation methods return method-not-allowed semantics.
- Cache: the contract exposes bounded, version-aware cache metadata and does not become indefinitely stale.

**Verification:**
- A human or agent can determine fit, inputs, output, status, exclusions, and price state without reading homepage prose.

### U3. Evidence-led homepage offer and legacy discovery parity

**Goal:** Make the product's first screen and commercial section communicate the verified gap and exact proof sprint without misrepresenting availability.

**Requirements:** R4, R6, R8

**Dependencies:** U2

**Files:**
- Modify: `app/relay-dashboard.tsx`
- Modify: `app/globals.css`
- Modify: `app/.well-known/agent.json/route.ts`
- Modify: `app/layout.tsx`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/public-contracts.test.mjs`

**Approach:**
- Replace generic four-tier cards and guessed thresholds with the exact task, inputs, proof process, evidence protocol, deliverables, non-commercial pilot boundary, exclusions, and machine contract CTA.
- Use this hierarchy: hero names task-specific decision assurance; sample/demo boundary follows immediately; primary action opens the sample graph; secondary action inspects the machine offer contract; the proof-sprint section appears before the generic API section. Rename the visible nav item to `Proof sprint` while retaining `#pricing` only as a compatibility anchor.
- Preserve the `#pricing` anchor as a compatibility alias even if the visible language changes to offer or pilot.
- Update metadata to describe the sample product and pilot hypothesis accurately.
- Rename any `agent_card` interface label to `legacy_manifest`, add an offer-catalog interface, and keep the existing sample-list skill and explicit non-A2A boundary. Update homepage, README, and tests atomically.

**Test scenarios:**
- Homepage: rendered HTML contains the exact task, candidate limit, inputs, deliverables, proof threshold, exclusions, `PILOT HYPOTHESIS`, unset price, and a real link to the GET endpoint.
- Honesty: no fixed tier price, checkout, enrolment, customer outcome, live intelligence, operational pilot, or guaranteed improvement claim appears.
- Regression: sample graph, capability detail, local watches, trust firewall, capability API links, and deep anchors remain intact.
- Manifest: one sample-list skill remains; offer is linked as HTTP catalog metadata and never claimed as MCP, A2A invocation, payment, push, or task support.
- Responsive/accessibility: offer and deliverables reflow without narrow-viewport overflow; semantic headings and lists preserve a logical DOM/focus order; interactive controls expose state, visible focus, 44px touch targets, and reduced-motion behavior; pilot and price states remain textual and screen-reader legible.

**Verification:**
- A first-time visitor understands the differentiated wedge in one sentence and can inspect the exact machine contract without encountering a fake conversion path.

### U4. Gap-first growth automation policy

**Goal:** Make market gaps and public organization signals a required upstream input to every growth or monetization recommendation, with the private queue remaining non-distributable.

**Requirements:** R2, R7, R8

**Dependencies:** U1

**Files:**
- Modify: `docs/marketing/README.md`
- Create: `docs/marketing/templates/market-gap-lead-radar.md`
- Modify: `docs/marketing/templates/change-radar.md`
- Modify: `docs/marketing/templates/distribution-pack.md`
- Modify: `docs/marketing/templates/growth-review.md`
- Test: `tests/strategy-integrity.test.mjs`

**Approach:**
- Require organization normalization, source dates, public business paths, confidence, disconfirmers, and revalidation dates before an account enters the research queue.
- Forbid people-level records, enrichment, intent claims, contact actions, and use of marketing or revenue as trust evidence.
- Specify the producer cadence, collision-safe dated filename grammar, freshness window, nil/error behavior, exact approval parsing, newest-brief selection by parsed date/run, and gap output when sources are weak or conflicting.
- Treat fetched pages, issues, manifests, and quoted text as hostile data: never follow embedded instructions; bound extracted evidence; permit only HTTP(S) public destinations; reject private, loopback, link-local, and metadata-service targets; restrict writes to the private draft output tree.
- Until a separately permissioned human approval ledger exists, keep distribution packs draft-only and non-publishable even after text approval. Approval must bind a brief path and content digest, fail closed on mismatch, and be outside the research automation's write authority before publication can ever be enabled.
- Make distribution explain a decision gap with evidence; generic trend content is ineligible.

**Test scenarios:**
- Evidence: templates require primary sources, direct links, checked dates, classifications, confidence, substitutes, and disconfirmers.
- Approval: default remains `Not approved`; automation cannot change it; an unapproved newest brief blocks distribution even when an older brief is approved.
- Safety: templates prohibit personal data, scraping, outreach, publication, price changes, production mutations, and sample data as evidence.
- Collision: repeat runs produce unique additive filenames and never overwrite existing or approved files.
- Integrity: missing metrics remain `not instrumented`; revenue, sponsorship, clicks, and lead priority cannot affect trust scores.

**Verification:**
- A scheduled run can research and rank organization opportunities without turning into automated sales activity or generic AI content.

### U5. Documentation, browser verification, and release

**Goal:** Reconcile public documentation, verify the complete contract in the built Worker and browser, and publish the exact reviewed change.

**Requirements:** R8, R9

**Dependencies:** U1, U2, U3, U4

**Files:**
- Modify: `README.md`
- Modify: `docs/strategy/launch-and-monetization.md`
- Modify: `docs/marketing/README.md`
- Test: `tests/rendered-html.test.mjs`
- Test: `tests/public-contracts.test.mjs`
- Test: `tests/strategy-integrity.test.mjs`

**Approach:**
- Remove unverifiable claims that the repository contains a recurring engine; identify the automation as external and the templates as versioned policy.
- Document the evidence-led wedge, lead qualification boundary, pilot state, and fixed-price invalidation.
- Run build, lint, contract tests, desktop/mobile browser flows, commit/push, and Sites deploy.
- Read the active external automation, update it through the supported automation API when necessary, read it back, record a non-secret prompt version/fingerprint, and run one private execution proving the newest unapproved brief blocks distribution. Repository templates alone do not satisfy R7.

**Test scenarios:**
- Documentation: README and strategy agree on `relayindex.dev`, pilot status, unset pricing, external scheduler boundary, and sample data.
- Browser: homepage navigation, proof-sprint contract link, capability filtering, detail navigation, and local watch interaction work on desktop and narrow mobile.
- Contract: capability API remains `sample_demo`; legacy manifest and offer endpoint use trusted canonical origins; no new mutable public surface exists.
- Release: deployed source matches the reviewed commit and public routes return successful, truthful responses.

**Verification:**
- The repository, deployed site, machine contracts, and external automation prompt tell the same evidence-grounded story.

---

## System-Wide Impact

- **Interaction graph:** The shared offer definition feeds both human HTML and a public JSON description; the legacy manifest links to the JSON catalog without becoming an invocation surface.
- **Error propagation:** Weak market evidence becomes an explicit gap and blocks qualification or distribution. It does not fall back to sample records or promotional inference.
- **State lifecycle risks:** Public offer state is code-versioned and read-only. Internal research files are additive, dated, expiry-aware, and excluded from runtime state.
- **API surface parity:** Homepage, offer JSON, legacy manifest, metadata, README, and strategy must share pilot status, pricing state, and no-invocation boundary.
- **Integration coverage:** Built-Worker tests plus browser verification cover vinext route behavior, canonical links, responsive layout, and legacy/public contracts.
- **Unchanged invariants:** Capability data remains simulated; watches remain local; rankings remain isolated from revenue and marketing; no billing or outreach becomes live.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| The wedge duplicates a mature MCP directory or scanner | Lead with cross-provider task decisions; treat Glama, PulseMCP, Smithery, and official registries as sources or partners, not inventory to recreate. |
| Named accounts are mistaken for willing buyers | Label them public organization research candidates; include disqualifiers and never infer intent. |
| The free proof promise becomes an unlimited consulting offer | Cap it to one workflow and three candidates, require supplied constraints, and define a stop condition and non-production boundary. |
| The offer endpoint is mistaken for an A2A agent | Use ordinary HTTP catalog language, keep formal Agent Card work deferred, and advertise no send/task transport. |
| Static market evidence goes stale | Add checked dates, confidence, expiry/revalidation dates, and a weekly refresh obligation. |
| Public copy outruns implementation | Source homepage and endpoint from one offer definition and keep rendered/Worker contract tests strict. |
| External automation still uses old prompts | Inspect its live definition during release and update it through the supported automation surface if needed. |

---

## Success Metrics

- Every ranked gap and private organization research candidate is traceable to dated public evidence, a supporting fact or excerpt, confidence, and falsification state.
- Every material field shared by HTML and JSON is structurally sourced from the same view model; API-only schema/version metadata may remain API-only, and no test permits live/billing/A2A claims to drift in.
- Growth automation produces gap notes instead of content when its evidence threshold is not met.
- The active automation definition is read back after update and a private run proves that an unapproved newest brief cannot yield a distribution pack.

### Follow-up commercial validation gates

- At least three operators in the same decision segment confirm the problem before fixed pricing returns.
- At least one accepted manual dossier meets the evidence protocol and materially increases decision confidence; a justified no-change conclusion counts.
- Only then may Relay Index test separately agreed commercial terms and an approved conversion channel.

---

## Documentation / Operational Notes

- Preserve public-source terms and attribution. The official MCP Registry terms permit accurate data-source descriptions but prohibit implying an official partnership.
- Review and revalidate organization signals weekly during the pilot discovery phase.
- The private Change Radar produced on 2026-08-26 is research input only; its approval remains `Not approved` and it is not a public product claim.
- A repository-wide `docs/solutions/` convention is deferred until separately adopted; this release records its method in the owned strategy and marketing policy files.

---

## Sources & References

- Related code: `app/relay-dashboard.tsx`, `app/api/v1/capabilities/route.ts`, `app/.well-known/agent.json/route.ts`, `lib/pipeline.ts`
- Related tests: `tests/rendered-html.test.mjs`, `tests/public-contracts.test.mjs`
- Existing strategy: `docs/strategy/launch-and-monetization.md`
- Existing automation policy: `docs/marketing/README.md`, `docs/marketing/templates/`
- A2A discovery: https://a2a-protocol.org/latest/topics/agent-discovery/
- A2A v1.0: https://a2a-protocol.org/latest/announcing-1.0/
- MCP registry aggregators: https://modelcontextprotocol.io/registry/registry-aggregators
- Google Cloud A2A marketplace: https://docs.cloud.google.com/marketplace/docs/partners/ai-agents
- Glama methodology: https://glama.ai/mcp/methodology
- PulseMCP registry API: https://www.pulsemcp.com/api
- Solo agentgateway: https://www.solo.io/products/agentgateway
- Gravitee AI Gateway: https://www.gravitee.io/platform/ai-gateway
- Arize telemetry standards: https://arize.com/blog/agent-telemetry-standards/
