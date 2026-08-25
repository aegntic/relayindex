# Relay Index launch and monetization strategy

Created: 2026-08-25

## Domain decision

Use `relayindex.ai` as the primary domain. Registry-level RDAP and WHOIS checks returned no registration record on 2026-08-25. Availability is not guaranteed until registrar checkout completes.

Defensive options, also unregistered in the same check: `relayindex.dev`, `relayindex.io`, `relayindex.network`, and `capabilityindex.ai`.

Recommended purchase route: Cloudflare Registrar for at-cost registration and DNS, or Porkbun as an alternative. Porkbun listed standard `.ai` registration and renewal at USD $72.40 when checked; `.ai` registries and registrars may require a multi-year term, and a specific name may carry premium pricing. Checkout is the authority.

After purchase, bind the domain to the existing private Sites project, make it the canonical origin for manifests and metadata, then register the defensive names only if the brand is being publicly launched.

## Revenue architecture

Relay Index should monetize the cost of uncertainty. The free graph earns attention and agent traffic; paid tiers sell freshness, evidence depth, routing controls and accountability.

| Tier | Launch price | Buyer | Value boundary |
|---|---:|---|---|
| Public | $0 | Evaluators and hobby builders | 24-hour delayed graph, public evidence summaries, 100 resolves/month |
| Operator | $79/month | Individual agent builders | Real-time graph, 25 watches, full evidence, 10k resolves/month |
| Team | $399/month | Production agent teams | Shared watches, webhooks, routing policy, history, 100k resolves/month |
| Enterprise | From $3k/month | Regulated or high-volume operators | Private sources, custom scoring, signed observations, SLA |

Usage above plan allowance should eventually be billed per 1,000 successful resolution calls. Do not meter raw page views or evidence access that improves safety.

## Expansion revenue

- Outcome routing: a small fee on successfully delegated work after signed invocation receipts and dispute handling exist.
- Provider audits: a fixed verification engagement plus periodic re-certification. Payment buys testing effort, never ranking.
- Private coverage: customer-supplied sources, private provider graphs and policy-constrained routing.
- Evidence exports: signed compliance packets, change history and evaluation artifacts for procurement or model-risk review.

## Credibility firewall

Commercial relationships must not alter trust or evidence scores. Sponsored inventory, if ever introduced, must be visually isolated and excluded from resolution results. Marketing engagement is not a utility observation. Provider audit fees cannot suppress negative findings.

## Launch sequence

1. Register `relayindex.ai` and establish the legal/billing entity.
2. Recruit five design partners with consequential multi-provider routing needs.
3. Measure time saved, avoided failure cost and API decision quality before changing pilot prices.
4. Add self-serve checkout only when entitlement, metering, tax and refund policies are operational.
5. Introduce outcome routing fees only after signed receipts make success auditable.

## North-star metrics

- Weekly verified capability resolutions
- Percentage of paid resolves that change a routing decision
- Avoided failure cost reported or observed
- Watch-to-action conversion
- Evidence freshness coverage
- Net revenue retention by agent-call cohort

## Post-deploy monitoring & validation

- Check the production homepage, sample capability endpoint and agent manifest immediately after deployment and again after 24 hours.
- Healthy signals: successful page/API responses, `sample_demo` coverage, one implemented manifest skill, exact canonical URLs, and no checkout or live-market claims.
- Failure signals: 5xx responses, an untrusted manifest origin, missing sample labels, broken pricing anchors, or a failed recurring research run.
- Roll back to the previous Sites version if a public contract or homepage route fails; pause the growth automation if it produces uncited output, overwrites a prior brief, or crosses the human distribution-approval gate.
- Validation owner: Relay Index operator for the first seven days, then weekly alongside the growth review.

## Sources

- RDAP lookup method: https://about.rdap.org/
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/
- Porkbun TLD pricing: https://porkbun.com/tld/features
