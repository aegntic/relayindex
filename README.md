# Relay Index

Relay Index is a production-shaped prototype for an agent capability intelligence network. It discovers capabilities, verifies claims, normalizes evidence, tracks observed outcomes, ranks expected utility and emits agent-consumable records.

## What is real in this build

- Responsive product surface with capability graph, change radar, opportunity ledger, trust engine, watches and agent API examples
- Typed schemas for `Capability`, `Provider`, `Evidence`, `ChangeEvent`, `Observation`, `Opportunity` and `Watch`
- Replaceable discovery, verification, observation, ranking and signal adapter contracts
- Machine-readable `GET /api/v1/capabilities` and `GET /.well-known/agent.json`
- Shareable capability detail records with evidence-led explanations

All included market data is explicitly sample/demo data. No claim in the prototype should be treated as live market intelligence.

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
