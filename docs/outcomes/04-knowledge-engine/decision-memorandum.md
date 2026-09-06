# Decision Memorandum: RelayIndex Ingestion & Routing Strategy

## Executive Decision
**RelayIndex will NOT emit autonomous routing or purchasing recommendations until servers are mapped through an immutable, status-aware delta ledger and verified via multi-tier executability envelopes.**

## Evidence Lineage
1. **Official Guidance & Durability Gaps:** The Model Context Protocol documentation explicitly advises aggregators to maintain local persistence due to the absence of durability SLAs (`modelcontextprotocol-io/registry-aggregators.mdx`).
2. **Observed Status Volatility:** Empirical measurement of 657 servers captured 8 deleted and 3 deprecated records; static scraping produces dead-end agent invocations.
3. **Execution Gap:** 24.8% of registered servers lack repository metadata and 3 declare neither packages nor remotes. Listing presence $\neq$ runtime executability.

## Downstream Correction Propagation
If upstream documentation or API schemas alter the `updated_since` parameter behavior, this memorandum is automatically invalidated and will trigger an alert across dependent routing nodes.
