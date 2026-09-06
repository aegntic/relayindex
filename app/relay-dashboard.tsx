"use client";

import { useMemo, useState, useEffect } from "react";
import { capabilities, changes, opportunities } from "../lib/data";
import { capabilityAssuranceOffer as offer } from "../lib/offer";
import { DecisionInspector } from "./components/decision-inspector";
import { trackEvent } from "../lib/telemetry";

const humanize = (value: string) => value.replaceAll("_", " ").replace(/^./, letter => letter.toUpperCase());

export default function RelayDashboard({ checkoutUrl }: { checkoutUrl: string | null }) {
  const [category, setCategory] = useState("All");
  const [protocolFilter, setProtocolFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize and load saved watches from session/local storage
  const [watched, setWatched] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("relay_watches");
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore storage error
      }
    }
    return [];
  });
  const [codeTab, setCodeTab] = useState<"curl" | "mcp" | "agent">("curl");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    trackEvent({ eventType: "page_view", path: "/" });
  }, []);

  const toggle = (id: string) => {
    trackEvent({ eventType: "watch_toggled", path: `/${id}` });
    setWatched((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("relay_watches", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    trackEvent({ eventType: "catalog_query", path: `/?category=${cat}` });
  };

  const visible = useMemo(() => {
    return capabilities.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const matchesProtocol = protocolFilter === "All" || c.provider.protocols.includes(protocolFilter);
      const matchesSearch =
        searchQuery.trim() === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesProtocol && matchesSearch;
    });
  }, [category, protocolFilter, searchQuery]);

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const curlExample = `curl -s "https://relayindex.dev/api/v1/capabilities?category=Document" \\
  -H "Accept: application/json"`;

  const mcpExample = `{
  "mcpServers": {
    "relay-index": {
      "command": "npx",
      "args": ["-y", "relay-mcp@latest"]
    }
  }
}`;

  const jsonSnippet = `GET /api/v1/capabilities?category=Document

{
  "data": [{
    "id": "cap_lattice_invoice_eu",
    "trust_score": 96.8,
    "confidence": 0.94,
    "price_usd": 0.014,
    "p50_latency_ms": 820,
    "reliability_30d": 0.9992,
    "invoke": "a2a://lattice.parse/invoice-eu"
  }],
  "as_of": "2026-08-25T06:22:00Z",
  "coverage": "sample_demo"
}`;

  return (
    <main>
      {/* Sample demo announcement banner */}
      <div className="demo-bar">
        SAMPLE INTELLIGENCE ENVIRONMENT <span>The public list endpoint works · All displayed records are simulated</span>
      </div>

      {/* Avant-Garde Navigation */}
      <nav className="nav shell" aria-label="Main Navigation">
        <a className="brand" href="#top">
          <span className="brand-mark">R/</span> RELAY INDEX
        </a>
        <div className="nav-links">
          <a href="#dilemma">The Dilemma</a>
          <a href="#harness">Assurance Harness</a>
          <a href="#graph">Capability Graph</a>
          <a href="#radar">Radar</a>
          <a href="#ledger">Ledger</a>
          <a href="#trust">Trust</a>
          <a href="/pilot">Paid sprint</a>
          <a href="#api">Agent API</a>
        </div>
        <div className="nav-right">
          <div className="beacon-pill" title="Decision Assurance Gates Active">
            <span className="beacon-dot" />
            <span>26/26 GATES GREEN</span>
          </div>
          <a className="watch-button" href="#watches" aria-label="View saved watchlist">
            Watches <b>{watched.length}</b>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero shell" id="top">
        <div className="eyebrow">
          <span className="live-dot" />
          PRODUCT DEMO <b>5 simulated capability records · N ≥ 10 Empirical Verification</b>
        </div>
        <h1>
          Know which agent to call.<br />
          <span>And why.</span>
        </h1>
        <p className="hero-copy">
          Independent decision assurance for external agent capabilities. Compare evidence, reliability, price, latency and change risk before you delegate.
        </p>
        <div className="hero-actions">
          <a className="primary" href="#harness">
            Run Decision Simulator <span>↓</span>
          </a>
          <a className="secondary" href="#graph">
            Explore the sample graph <span>→</span>
          </a>
          <a className="secondary" href="/pilot">
            See the paid MCP sprint
          </a>
        </div>
        <div className="proof" aria-label="System Proof Indicators">
          <span>SAMPLE RECORDS</span><b>5 capabilities</b>
          <i />
          <span>SAMPLE PROVIDERS</span><b>5 providers</b>
          <i />
          <span>MODELLED CONFIDENCE</span><b>89.0%</b>
          <i />
          <span>SAFETY FIREWALL</span><b>Fail-Closed Verification</b>
        </div>
      </section>

      {/* The Connection Dilemma Narrative Section */}
      <section className="dilemma-section" id="dilemma">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">THE CONNECTION DILEMMA / PROBLEM NARRATIVE</span>
              <h2>Discovery is not qualification.</h2>
            </div>
            <p>Why directory lists, static benchmarks, and blind tool delegation break down in production.</p>
          </div>

          <div className="dilemma-grid">
            <article className="dilemma-card">
              <small>FAILURE MODE 01</small>
              <h3>Interface & Schema Drift</h3>
              <p>Remote tools mutate parameter schemas without semantic version increments. Downstream agents hallucinate arguments or trigger unhandled validation exceptions.</p>
            </article>

            <article className="dilemma-card">
              <small>FAILURE MODE 02</small>
              <h3>Latency Tail Explosions</h3>
              <p>Unvetted endpoints degrade under load. A single 12-second p95 blowout exhausts orchestrator context timeouts and crashes entire multi-agent workflows.</p>
            </article>

            <article className="dilemma-card">
              <small>FAILURE MODE 03</small>
              <h3>Opaque Cost Escalation</h3>
              <p>Uncalibrated per-call and token-multiplier pricing models silently deplete agent credit wallets before billing circuit-breakers can engage.</p>
            </article>

            <article className="dilemma-card">
              <small>FAILURE MODE 04</small>
              <h3>Scope Creep & Exfiltration</h3>
              <p>External tools demand overly broad credential and file permissions beyond their declared capability boundary without empirical runtime isolation.</p>
            </article>
          </div>

          <div className="dilemma-verdict">
            <div>
              <span>THE RELAY INDEX ASSURANCE ARCHITECTURE</span>
              <p>Pre-registration hash locks + Isolated multi-trial empirical testing (N ≥ 10) + Cryptographically signed decision packets.</p>
            </div>
            <a href="#harness" className="primary" style={{ padding: "10px 18px", fontSize: "11px", whiteSpace: "nowrap" }}>
              Test Harness Below ↓
            </a>
          </div>
        </div>
      </section>

      {/* Live Decision Assurance Inspector Harness */}
      <div id="harness">
        <DecisionInspector />
      </div>

      {/* Capability Graph Panel */}
      <section className="intelligence shell" id="graph">
        <div className="section-heading">
          <div>
            <span className="kicker">CAPABILITY GRAPH / SAMPLE</span>
            <h2>The market, resolved.</h2>
          </div>
          <p>Illustrative rankings for expected utility, not attention.</p>
        </div>

        <div className="graph-panel">
          <div className="panel-toolbar">
            <div className="filters" aria-label="Category Filters">
              {["All", "Document", "Commerce", "Research", "Legal", "Logistics"].map((x) => (
                <button
                  key={x}
                  onClick={() => handleCategoryChange(x)}
                  className={category === x ? "active" : ""}
                  aria-pressed={category === x}
                >
                  {x}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="filters" aria-label="Protocol Filters">
                {["All", "MCP", "A2A", "REST"].map((proto) => (
                  <button
                    key={proto}
                    onClick={() => setProtocolFilter(proto)}
                    className={protocolFilter === proto ? "active" : ""}
                    aria-pressed={protocolFilter === proto}
                    style={{ fontSize: "10px", fontFamily: "var(--font-mono)" }}
                  >
                    {proto === "All" ? "All Protocols" : proto}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Filter capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-filter-input"
                aria-label="Filter capabilities by keyword"
              />
            </div>
          </div>

          <div className="table-head">
            <span>CAPABILITY / PROVIDER</span>
            <span>TRUST</span>
            <span>PRICE / CALL</span>
            <span>P50 LATENCY</span>
            <span style={{ textAlign: "right" }}>ACTION</span>
          </div>

          {visible.length === 0 ? (
            <div style={{ padding: "40px 22px", textAlign: "center", color: "#64706c", font: "12px var(--font-mono)" }}>
              No capabilities matched the selected filter criteria.
            </div>
          ) : (
            visible.map((c, i) => (
              <div className="cap-row" key={c.id}>
                <a className="cap-name" href={`/capabilities/${c.slug}`}>
                  <em>0{i + 1}</em>
                  <div>
                    <strong>{c.name}</strong>
                    <small>
                      {c.provider.name} · {c.provider.protocols.join(" + ")} · {c.provider.region}
                    </small>
                  </div>
                </a>

                <div className="trust">
                  <strong>{c.trustScore}</strong>
                  <small className={c.status === "verified" ? "up" : c.status === "monitoring" ? "monitoring" : "degraded"}>
                    {c.status}
                  </small>
                </div>

                <div>
                  <strong>${c.priceUsd}</strong>
                  <small>sample price</small>
                </div>

                <div>
                  <strong>{c.p50LatencyMs < 1000 ? `${c.p50LatencyMs}ms` : `${(c.p50LatencyMs / 1000).toFixed(1)}s`}</strong>
                  <small>{c.reliability30d}% modelled success</small>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    className={watched.includes(c.id) ? "watch active" : "watch"}
                    onClick={() => toggle(c.id)}
                    aria-label={`Watch ${c.name}`}
                    aria-pressed={watched.includes(c.id)}
                  >
                    {watched.includes(c.id) ? "Watching" : "Watch"}
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="panel-footer">
            <span style={{ color: "#68716f" }}>Static demonstration data · not telemetry</span>
            <a href="/api/v1/capabilities" style={{ color: "var(--aqua)", display: "flex", alignItems: "center", gap: "6px" }}>
              Machine-readable sample graph <span>JSON endpoint →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Change Radar Section */}
      <section className="two-col shell" id="radar">
        <div>
          <span className="kicker">CHANGE RADAR / SAMPLE</span>
          <h2>What moved, and why it matters.</h2>
          <p className="section-copy">
            Illustrative interface diffs, price shifts, launches and reliability breaks show the planned radar experience.
          </p>
        </div>
        <div className="radar-list">
          {changes.map((x, i) => (
            <article key={x.id}>
              <div className={`impact ${x.impact}`}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <small>{x.kind.toUpperCase()} · SAMPLE EVENT</small>
                <h3>{x.title}</h3>
                <p>{x.detail}</p>
              </div>
              <b>{Math.round(x.confidence * 100)}%</b>
            </article>
          ))}
        </div>
      </section>

      {/* Opportunity Ledger Section */}
      <section className="ledger-wrap" id="ledger">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">OPPORTUNITY LEDGER</span>
              <h2>Signals with an economic consequence.</h2>
            </div>
            <p>Expected value is modeled, never promised.</p>
          </div>
          <div className="opp-grid">
            {opportunities.map((o) => (
              <article key={o.id}>
                <div className="opp-top">
                  <span className={o.status}>{o.status}</span>
                  <b>{Math.round(o.confidence * 100)}% confidence</b>
                </div>
                <h3>{o.title}</h3>
                <p>{o.thesis}</p>
                <div className="opp-metric">
                  <span>MODELLED 30D VALUE</span>
                  <strong>${o.expectedValueUsd.toLocaleString()}</strong>
                </div>
                <small>{o.window} · Sample signal</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Evidence Engine Design */}
      <section className="trust-section shell" id="trust">
        <div className="trust-score">
          <span>96.8</span>
          <small>SAMPLE TRUST / 100</small>
          <div className="score-bars">
            {Array.from({ length: 12 }).map((_, i) => (
              <i key={i} className={i < 11 ? "filled" : ""} />
            ))}
          </div>
        </div>
        <div className="trust-copy">
          <span className="kicker">TRUST / EVIDENCE ENGINE DESIGN</span>
          <h2>Every score should have receipts.</h2>
          <p>
            Relay Index is designed to weigh independent benchmarks, observed outcomes, interface conformance and recency, then expose the reasoning behind every ranking.
          </p>
          <div className="evidence-grid">
            <div>
              <b>34%</b>
              <span>Observed reliability</span>
            </div>
            <div>
              <b>28%</b>
              <span>Independent evaluation</span>
            </div>
            <div>
              <b>22%</b>
              <span>Interface conformance</span>
            </div>
            <div>
              <b>16%</b>
              <span>Evidence freshness</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Paid MCP Sprint Offer (Preserves exact structure tested by tests/rendered-html.test.mjs) */}
      <section className="pricing-wrap" id="pricing" aria-labelledby="offer-heading">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">PAID MCP SPRINT / {humanize(offer.status).toUpperCase()}</span>
              <h2 id="offer-heading">
                {offer.name}.<br />
                Evidence you can defend.
              </h2>
            </div>
            <p>A${offer.pricing.amount.toLocaleString()} price test. Checkout {checkoutUrl ? "open" : "awaiting setup"}.</p>
          </div>
          <div className="offer-frame">
            <div className="offer-lead">
              <span>THE DECISION</span>
              <h3>{offer.outcome}</h3>
              <p>{offer.audience}</p>
              <div className="offer-scope">
                <b>{offer.scope.workflowCount} named workflow</b>
                <b>Up to {offer.scope.maximumCandidates} candidates</b>
                <b>{offer.scope.productionExecution ? "Production execution included" : "No production execution"}</b>
              </div>
            </div>
            <div className="offer-columns">
              <article>
                <span>YOU BRING</span>
                <ul>
                  {offer.inputs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <span>RELAY RETURNS</span>
                <ul>
                  {offer.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="evidence-protocol">
              <div>
                <span>EVIDENCE CLASSES</span>
                <div className="protocol-tags">
                  {offer.evidenceProtocol.evidenceClasses.map((item) => (
                    <b key={item}>{humanize(item)}</b>
                  ))}
                </div>
              </div>
              <p>{offer.proofThreshold}</p>
            </div>
            <div className="protocol-contract">
              <div>
                <span>MEASUREMENT CONTRACT</span>
                <b>Minimum {offer.evidenceProtocol.minimumTrials} trials</b>
                <p>{offer.evidenceProtocol.commonWorkload}</p>
              </div>
              <dl>
                <div>
                  <dt>Retry rule</dt>
                  <dd>{offer.evidenceProtocol.retryRule}</dd>
                </div>
                <div>
                  <dt>Latency rule</dt>
                  <dd>{offer.evidenceProtocol.latencyRule}</dd>
                </div>
                <div>
                  <dt>Cost rule</dt>
                  <dd>{offer.evidenceProtocol.costRule}</dd>
                </div>
                <div>
                  <dt>Failure rule</dt>
                  <dd>{offer.evidenceProtocol.failureRule}</dd>
                </div>
                <div>
                  <dt>Stop rule</dt>
                  <dd>{offer.evidenceProtocol.stopRule}</dd>
                </div>
              </dl>
            </div>
            <div className="decision-outcomes">
              <span>VALID OUTCOMES</span>
              {offer.decisionOutcomes.map((item) => (
                <b key={item}>{humanize(item)}</b>
              ))}
            </div>
            <div className="offer-exclusions">
              <span>SAFETY BOUNDARY / EXCLUSIONS</span>
              <ul>
                {offer.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="offer-bottom">
              <div>
                <span>FOUNDING PRICE TEST</span>
                <h3>A${offer.pricing.amount.toLocaleString()} for one decision packet.</h3>
                <p>
                  Target delivery is {offer.delivery.targetBusinessDays} business days after valid inputs and authorized test access are confirmed. The price is a commercial experiment, not a claim of market validation.
                </p>
              </div>
              {checkoutUrl ? (
                <a href={checkoutUrl} className="primary" rel="noreferrer">
                  Buy the sprint →
                </a>
              ) : (
                <a href="/pilot" className="primary">
                  Review launch offer →
                </a>
              )}
            </div>
          </div>
          <div className="trust-principle">
            <span>TRUST FIREWALL</span>
            <p>
              Customers buy testing effort and evidence. Provider payments, sponsorships, organization priority and campaign engagement can never alter capability trust or evidence scores.
            </p>
          </div>
        </div>
      </section>

      {/* Machine API Section */}
      <section className="api-section shell" id="api">
        <div className="api-copy">
          <span className="kicker">PUBLIC SAMPLE API / LEGACY DISCOVERY METADATA</span>
          <h2>Built to be consumed, not browsed.</h2>
          <p>
            The implemented public interface lists all sample capabilities, with an optional case-insensitive category filter. The legacy manifest is product metadata, not a current A2A Agent Card.
          </p>
          <ul>
            <li>
              <span>NOW</span> GET /api/v1/capabilities?category=Document
            </li>
            <li>
              <span>NOW</span> GET /api/v1/offers/capability-assurance
            </li>
            <li>
              <span>PLAN</span> MCP, saved watches and change subscriptions
            </li>
            <li>
              <span>PLAN</span> Evidence retrieval and constrained delegation
            </li>
          </ul>
          <div className="hero-actions">
            <a className="primary" href="/api/v1/capabilities">
              Open public API response <span>→</span>
            </a>
            <a className="secondary" href="/.well-known/agent.json">
              legacy agent.json
            </a>
          </div>
        </div>

        <div>
          <div className="code-tabs">
            <button
              onClick={() => setCodeTab("curl")}
              style={{
                background: "transparent",
                border: 0,
                color: codeTab === "curl" ? "var(--aqua)" : "#65706d",
                fontWeight: codeTab === "curl" ? 600 : 400,
                cursor: "pointer",
                padding: 0,
              }}
            >
              CURL (HTTP)
            </button>
            <button
              onClick={() => setCodeTab("mcp")}
              style={{
                background: "transparent",
                border: 0,
                color: codeTab === "mcp" ? "var(--aqua)" : "#65706d",
                fontWeight: codeTab === "mcp" ? 600 : 400,
                cursor: "pointer",
                padding: 0,
              }}
            >
              MCP (STDIO)
            </button>
            <button
              onClick={() => setCodeTab("agent")}
              style={{
                background: "transparent",
                border: 0,
                color: codeTab === "agent" ? "var(--aqua)" : "#65706d",
                fontWeight: codeTab === "agent" ? 600 : 400,
                cursor: "pointer",
                padding: 0,
              }}
            >
              JSON SCHEMA
            </button>

            <button
              type="button"
              onClick={() =>
                copyCodeToClipboard(
                  codeTab === "curl" ? curlExample : codeTab === "mcp" ? mcpExample : jsonSnippet
                )
              }
              style={{
                background: "transparent",
                border: 0,
                color: "#73978f",
                marginLeft: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
              aria-label="Copy snippet to clipboard"
            >
              {copiedCode ? "COPIED" : "200 OK · COPY"}
            </button>
          </div>
          <pre className="code-block">
            <code>
              {codeTab === "curl" ? curlExample : codeTab === "mcp" ? mcpExample : jsonSnippet}
            </code>
          </pre>
        </div>
      </section>

      {/* Flywheel Section */}
      <section className="flywheel shell">
        <span className="kicker">THE PLANNED COMPOUNDING LOOP</span>
        <h2>Each delegation can make the next one smarter.</h2>
        <div className="loop">
          <div>
            <b>01</b>
            <strong>Discover</strong>
            <small>New capabilities + changes</small>
          </div>
          <i>→</i>
          <div>
            <b>02</b>
            <strong>Verify</strong>
            <small>Claims become evidence</small>
          </div>
          <i>→</i>
          <div>
            <b>03</b>
            <strong>Observe</strong>
            <small>Calls produce outcomes</small>
          </div>
          <i>→</i>
          <div>
            <b>04</b>
            <strong>Re-rank</strong>
            <small>Utility sharpens routing</small>
          </div>
        </div>
      </section>

      {/* Watches Section */}
      <section className="watches shell" id="watches">
        <div>
          <span className="kicker">LOCAL DEMO WATCHES</span>
          <h2>
            {watched.length
              ? `${watched.length} selected ${watched.length === 1 ? "watch" : "watches"}`
              : "Preview a watchlist."}
          </h2>
          <p>
            {watched.length
              ? "This demo selection exists only in the current browser session; no alert is scheduled."
              : "Select a sample capability to preview the planned watchlist interaction. Persistence and alerts are not connected."}
          </p>
        </div>
        <a href="#graph" className="secondary">
          {watched.length ? "Manage selections" : "Choose a capability"} ↑
        </a>
      </section>

      {/* Footer */}
      <footer className="footer shell">
        <a className="brand" href="#top">
          <span className="brand-mark">R/</span> RELAY INDEX
        </a>
        <span>Capability intelligence for the agent economy.</span>
        <small>Sample environment · Built for transparent verification</small>
      </footer>
    </main>
  );
}
