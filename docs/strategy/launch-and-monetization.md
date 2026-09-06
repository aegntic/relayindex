# Relay Index launch and monetization strategy

Created: 2026-08-25

## Domain decision

Use `relayindex.dev` as the primary domain. It was registered by the operator and added to the Sites project on 2026-08-25.

The original `relayindex.ai` recommendation was rejected on cost. Potential future defensive options remain `relayindex.network` and `relayindex.io`, but they are not necessary for launch.

The domain currently uses Porkbun authoritative DNS. Do not assume a Cloudflare Registrar or Cloudflare DNS configuration from the application stack.

Current public verification on 2026-08-30 found `relayindex.dev` A records at `207.207.210.107` and `207.207.210.229`, consistent with a parking destination, and the HTTPS handshake failed. The Sites fallback returned HTTP 401. The code recognizes the custom domain as a canonical origin, but the public routing is not operational. Make the Sites project public, obtain its exact custom-domain DNS instructions, replace the parking records in Porkbun, and verify a valid certificate before launch. Never guess the target record.

## Revenue architecture

Relay Index should monetize the cost of a consequential routing decision. Generic subscriptions, quota assumptions, and the earlier 100k-call buyer threshold were guesses and remain withdrawn.

Public research on 2026-08-30 sharpened the first wedge: operators can discover MCP servers and tools faster than they can qualify them for connection. The current paid offer is an MCP connection decision sprint: one workflow, at most three candidate servers, tools, or routes, a pre-registered evidence protocol, and an approval-ready packet that returns allow, hold, reject, or insufficient comparable evidence.

The founding price is an explicit A$1,250 commercial experiment, not a claim of validated willingness to pay. Target delivery is five business days after valid inputs and authorized test access are confirmed. Three founding slots define the first operational cohort. A no-change or insufficient-evidence conclusion remains valid when the evidence justifies it.

Checkout uses a Stripe Payment Link because it adds no setup or monthly charge on standard Australian pricing. The public site and offer API fail closed until a valid `https://buy.stripe.com` URL is configured. Before opening checkout, the operator must set the legal business identity, privacy URL, terms, tax treatment, refund policy, support route, fulfilment response time, and post-payment intake in Stripe.

## Expansion revenue

- Outcome routing: a small fee on successfully delegated work after signed invocation receipts and dispute handling exist.
- Provider audits: a fixed verification engagement plus periodic re-certification. Payment buys testing effort, never ranking.
- Private coverage: customer-supplied sources, private provider graphs and policy-constrained routing.
- Evidence exports: signed compliance packets, change history and evaluation artifacts for procurement or model-risk review.

## Credibility firewall

Commercial relationships must not alter trust or evidence scores. Sponsored inventory, if ever introduced, must be visually isolated and excluded from resolution results. Marketing engagement is not a utility observation. Provider audit fees cannot suppress negative findings.

## Validation sequence

1. Confirm DNS and TLS for `relayindex.dev` and establish the legal/billing identity.
2. Configure the Stripe product, fulfilment terms, tax, refund, privacy, support, and post-payment intake.
3. Set `NEXT_PUBLIC_RELAY_PILOT_CHECKOUT_URL`, verify the public page and JSON contract, then deploy.
4. Sell at most three founding sprints at A$1,250 and record objections, accepted scope, fulfilment time, and decision-confidence change.
5. Revalidate the market gap weekly and produce each manual dossier under the published evidence protocol.
6. Keep subscriptions, API billing, and automated invocation disabled until durable live evidence and repeat demand exist.

## North-star metrics

- Comparable evidence coverage by decision dossier
- Percentage of dossiers that justify change, no-change, or insufficient evidence
- Decision-confidence improvement reported by the operator
- Evidence freshness and expiry coverage
- Reproducible observation rate
- Checkout starts, purchases, fulfilment time, refunds, and reported decision-confidence change

## Post-deploy monitoring & validation

- Check the production homepage, sample capability endpoint and agent manifest immediately after deployment and again after 24 hours.
- Healthy signals: successful page/API responses, `sample_demo` coverage, one implemented manifest skill, exact canonical URLs, and no checkout or live-market claims.
- Failure signals: 5xx responses, an untrusted manifest origin, missing sample labels, a checkout link on a non-Stripe host, a mismatch between page and JSON offer terms, broken pilot links, or a failed recurring research run.
- Roll back to the previous Sites version if a public contract or homepage route fails; pause the growth automation if it produces uncited output, overwrites a prior brief, or crosses the human distribution-approval gate.
- Validation owner: Relay Index operator for the first seven days, then weekly alongside the growth review.

## Sources

- RDAP lookup method: https://about.rdap.org/
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/
- Porkbun TLD pricing: https://porkbun.com/tld/features
- Stripe Australia pricing: https://stripe.com/au/pricing
- Stripe Payment Links: https://docs.stripe.com/payment-links
