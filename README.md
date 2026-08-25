# Relay Index

Relay Index is a production-shaped prototype for an agent capability intelligence network. It discovers capabilities, verifies claims, normalizes evidence, tracks observed outcomes, ranks expected utility and emits agent-consumable records.

## What is real in this build

- Responsive product surface with capability graph, change radar, opportunity ledger, trust engine, watches and agent API examples
- Typed schemas for `Capability`, `Provider`, `Evidence`, `ChangeEvent`, `Observation`, `Opportunity` and `Watch`
- Replaceable discovery, verification, observation, ranking and signal adapter contracts
- Machine-readable `GET /api/v1/capabilities` and `GET /.well-known/agent.json`
- Shareable capability detail records with evidence-led explanations
- Transparent pilot pricing and a commercial model that keeps trust rankings independent from revenue
- A recurring Codex growth engine covering daily research, twice-weekly distribution drafts and weekly monetization review

All included market data is explicitly sample/demo data. No claim in the prototype should be treated as live market intelligence. The commercial tiers are launch hypotheses and billing is not yet enabled.

## Launch domain

`relayindex.dev` is the owned primary domain and is attached to the Sites project. DNS validation may remain pending immediately after registration. See `docs/strategy/launch-and-monetization.md` for the domain decision and full revenue model.

## Local development

Requires Node.js 22. Copy `.env.example` to `.env.local`, then install dependencies and run the development script.

## Compounding loop

1. Discovery adapters detect providers, manifests, interface changes and market events.
2. Verification adapters convert claims into weighted evidence.
3. Privacy-preserving observations measure success, latency, cost and constraint fit.
4. Rankings update as evidence ages and outcomes accumulate.
5. Better resolution attracts more agent traffic, producing broader utility data and sharper alerts.

## Production wiring

Replace the sample adapters in `lib/pipeline.ts`, persist normalized records in the configured datastore, sign observations, add tenant-aware API keys and rate limits, and keep raw payloads outside the ranking path. The public schema and UI can remain stable while source and scoring modules evolve independently.
