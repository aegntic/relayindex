<p align="center">
  <img src="assets/cover-16x9.jpg" alt="relayindex — Real-time MCP server status ledger, executability envelopes, and capability intelligence network (relayindex.dev)" width="100%" />
</p>

# Relay Index

Relay Index is a production-shaped prototype for an agent capability intelligence network. It discovers capabilities, verifies claims, normalizes evidence, tracks observed outcomes, ranks expected utility and emits agent-consumable records.

## What is real in this build

- Responsive product surface with capability graph, change radar, opportunity ledger, trust engine, watches and agent API examples
- Typed schemas for `Capability`, `Provider`, `Evidence`, `ChangeEvent`, `Observation`, `Opportunity` and `Watch`
- Replaceable discovery, verification, observation, ranking and signal adapter contracts
- Machine-readable `GET /api/v1/capabilities`, `GET /api/v1/offers/capability-assurance`, and legacy `GET /.well-known/agent.json`
- Shareable capability detail records with evidence-led explanations
- A paid MCP connection decision sprint with an explicit evidence protocol, founding A$1,250 price test, and fail-closed Stripe checkout configuration
- Versioned policy and templates for an externally scheduled Codex growth engine covering daily change/gap research, gated distribution drafts, and weekly monetization review

All included capability-market data is explicitly sample/demo data. No graph claim in the prototype should be treated as live market intelligence. Generic SaaS tiers and quota guesses remain withdrawn. The manual sprint is a separate paid founding offer; billing and enrolment open only when a valid Stripe Payment Link is configured. Agent invocation remains disabled.

The public sprint endpoint is a read-only offer description, not an A2A invocation surface. `/.well-known/agent.json` is retained as legacy Relay Index product-discovery metadata and is not a current A2A Agent Card.

## Launch domain

`relayindex.dev` is the owned primary domain. As checked on 2026-08-30, public DNS still resolves to Porkbun parking addresses and HTTPS does not complete, so the domain is not live on the Sites project. The fallback Sites URL also requires authentication. Make the project public, copy the exact custom-domain DNS target from Sites into the authoritative Porkbun DNS zone, and verify TLS before sending traffic. See `docs/strategy/launch-and-monetization.md` for the full revenue model.

## Evidence-led market development

`docs/strategy/market-gap-method.md` defines the initial wedge: independent, task-specific decision assurance for an operator choosing among external agent capabilities. The current paid surface narrows that wedge to the decision between MCP registry discovery and connection approval. The private organization research queue stays outside the deployed app and treats ecosystem activity as evidence, not buyer intent. Marketing, revenue, sponsorship, and organization priority never enter trust scoring.

The recurring automation itself lives in the Codex app rather than this repository. `docs/marketing/` is its versioned policy surface. Every output is private and draft-only; the automation cannot publish, contact anyone, or approve its own distribution.

## Local development

Requires Node.js 22. Copy `.env.example` to `.env.local`, then install dependencies and run the development script.

To open checkout, create a one-time Stripe Payment Link for the MCP connection decision sprint, then set `NEXT_PUBLIC_RELAY_PILOT_CHECKOUT_URL`. Only `https://buy.stripe.com` URLs are accepted. Without it, the public page and API show the price but fail closed, with no working purchase link.

## Compounding loop

1. Discovery adapters detect providers, manifests, interface changes and market events.
2. Verification adapters convert claims into weighted evidence.
3. Privacy-preserving observations measure success, latency, cost and constraint fit.
4. Rankings update as evidence ages and outcomes accumulate.
5. Better resolution attracts more agent traffic, producing broader utility data and sharper alerts.

## Production wiring

Replace the sample adapters in `lib/pipeline.ts`, persist normalized records in the configured datastore, sign observations, add tenant-aware API keys and rate limits, and keep raw payloads outside the ranking path. The public schema and UI can remain stable while source and scoring modules evolve independently.
