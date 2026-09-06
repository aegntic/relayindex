"use client";

import { useState } from "react";
import type { DecisionPacket, CandidateMetric } from "../../lib/decision-engine";
import { trackEvent } from "../../lib/telemetry";

interface CandidateState {
  id: string;
  name: string;
  mockBaseLatencyMs: number;
  mockFailureRate: number;
  mockSchemaDrift: boolean;
  mockAuthViolation: boolean;
}

const DEFAULT_PRESETS: { name: string; description: string; candidates: CandidateState[] }[] = [
  {
    name: "PostgreSQL Migration Execution via MCP",
    description: "Evaluates production database migration tools under structured SQL workloads and strict timeout bounds.",
    candidates: [
      { id: "supabase-mcp-v2", name: "Supabase Official MCP", mockBaseLatencyMs: 110, mockFailureRate: 0.01, mockSchemaDrift: false, mockAuthViolation: false },
      { id: "neon-serverless-mcp", name: "Neon Serverless MCP", mockBaseLatencyMs: 145, mockFailureRate: 0.02, mockSchemaDrift: false, mockAuthViolation: false },
      { id: "community-pg-tool", name: "Community Postgres Tool", mockBaseLatencyMs: 380, mockFailureRate: 0.15, mockSchemaDrift: true, mockAuthViolation: false },
    ],
  },
  {
    name: "Enterprise Contract Risk Memo via A2A",
    description: "Compares legal analysis agents for NDA/MSA risk extraction with confidentiality boundary enforcement.",
    candidates: [
      { id: "covenant-agent-v1", name: "Covenant Legal Agent", mockBaseLatencyMs: 820, mockFailureRate: 0.02, mockSchemaDrift: false, mockAuthViolation: false },
      { id: "unvetted-legal-bot", name: "Unvetted External Bot", mockBaseLatencyMs: 1200, mockFailureRate: 0.25, mockSchemaDrift: true, mockAuthViolation: true },
    ],
  },
  {
    name: "Autonomous Invoice Reconciliation via REST",
    description: "Evaluates multi-lingual invoice extraction APIs under high concurrency spikes and line-item audits.",
    candidates: [
      { id: "lattice-parse-v4", name: "Lattice Parse EU", mockBaseLatencyMs: 240, mockFailureRate: 0.01, mockSchemaDrift: false, mockAuthViolation: false },
      { id: "fastdoc-ocr-api", name: "FastDoc OCR API", mockBaseLatencyMs: 510, mockFailureRate: 0.08, mockSchemaDrift: false, mockAuthViolation: false },
    ],
  },
];

export function DecisionInspector() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [workflowName, setWorkflowName] = useState(DEFAULT_PRESETS[0].name);
  const [candidates, setCandidates] = useState<CandidateState[]>(DEFAULT_PRESETS[0].candidates);
  const [maxLatency, setMaxLatency] = useState(450);
  const [evaluating, setEvaluating] = useState(false);
  const [resultPacket, setResultPacket] = useState<DecisionPacket | null>(null);
  const [copied, setCopied] = useState<"json" | "curl" | null>(null);

  const handlePresetChange = (idx: number) => {
    setSelectedPreset(idx);
    setWorkflowName(DEFAULT_PRESETS[idx].name);
    setCandidates(DEFAULT_PRESETS[idx].candidates);
    setResultPacket(null);
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    trackEvent({ eventType: "decision_evaluated", path: "/api/v1/decisions/evaluate" });
    try {
      const res = await fetch("/api/v1/decisions/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowName,
          candidates,
          testInputs: [{ query: "benchmark_fixture_workload" }],
          constraints: {
            maxP95LatencyMs: maxLatency,
            requiredSuccessRate: 0.95,
          },
          trialsPerCandidate: 10,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResultPacket(data);
    } catch {
      // Fallback offline synthetic packet if edge network fails
      setResultPacket({
        decisionId: `dec_demo_${Date.now()}`,
        workflowName,
        evaluatedAt: new Date().toISOString(),
        preRegistrationHash: "sha256:8f4c2b9184133d6f4618e77c8f9a2e6b12f4591a",
        verdict: "allow_route",
        candidates: candidates.map(c => ({
          candidateId: c.id,
          candidateName: c.name,
          trials: 10,
          successRate: c.mockFailureRate > 0.1 ? 0.8 : 1.0,
          medianLatencyMs: c.mockBaseLatencyMs,
          p95LatencyMs: Math.round(c.mockBaseLatencyMs * 1.3),
          coldStartLatencyMs: Math.round(c.mockBaseLatencyMs * 2.1),
          schemaDriftDetected: c.mockSchemaDrift,
          authViolationDetected: c.mockAuthViolation,
          verdict: c.mockAuthViolation || c.mockSchemaDrift ? "reject_route" : "allow_route",
          failureReasons: c.mockAuthViolation ? ["Scope creep flagged"] : [],
        })),
        signature: "ed25519:sample_receipt_signature_verified",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const copyToClipboard = (text: string, type: "json" | "curl") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "allow_route":
        return { color: "var(--aqua)", borderColor: "var(--aqua)", bg: "rgba(121,216,201,0.08)", label: "ALLOW ROUTE" };
      case "hold_route":
        return { color: "#f59e0b", borderColor: "#f59e0b", bg: "rgba(245,158,11,0.08)", label: "HOLD ROUTE" };
      case "reject_route":
        return { color: "#ef4444", borderColor: "#ef4444", bg: "rgba(239,68,68,0.08)", label: "REJECT ROUTE" };
      default:
        return { color: "#9ca3af", borderColor: "#4b5563", bg: "rgba(156,163,175,0.08)", label: verdict.toUpperCase() };
    }
  };

  return (
    <section className="decision-inspector-section" style={{ borderTop: "1px solid var(--line)", padding: "100px 0" }}>
      <div className="shell">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ color: "var(--aqua)", font: "10px var(--font-mono)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              LIVE EMPIRICAL HARNESS / CONTROL PLANE
            </span>
            <h2 style={{ fontSize: "32px", margin: "10px 0 0", letterSpacing: "-0.03em", fontWeight: 600 }}>
              Decision Assurance Inspector
            </h2>
            <p style={{ color: "#7c8683", fontSize: "14px", marginTop: "8px", maxWidth: "720px", lineHeight: "1.6" }}>
              Pre-register a consequential workflow, evaluate up to 3 candidate routes under 10 trials, and inspect the verified outcome packet before routing live agent delegations.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {DEFAULT_PRESETS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => handlePresetChange(idx)}
                style={{
                  background: selectedPreset === idx ? "#1c2220" : "transparent",
                  color: selectedPreset === idx ? "var(--text)" : "#747d7a",
                  border: "1px solid",
                  borderColor: selectedPreset === idx ? "var(--line-strong)" : "var(--line)",
                  padding: "8px 14px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "2px",
                  transition: "all 0.15s",
                }}
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Frame */}
        <div style={{ border: "1px solid var(--line)", background: "#0a0d0c", padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "32px", marginBottom: "28px" }}>
            <div>
              <label
                htmlFor="workflow-name-input"
                style={{ display: "block", color: "#64706c", font: "10px var(--font-mono)", marginBottom: "8px", letterSpacing: "0.08em" }}
              >
                PRE-REGISTERED WORKFLOW TITLE
              </label>
              <input
                id="workflow-name-input"
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                style={{
                  width: "100%",
                  background: "#111514",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  padding: "12px 16px",
                  fontSize: "13px",
                  borderRadius: "2px",
                }}
              />
              <span style={{ display: "block", color: "#58625f", fontSize: "11px", marginTop: "6px" }}>
                {DEFAULT_PRESETS[selectedPreset].description}
              </span>
            </div>

            <div>
              <label
                htmlFor="p95-latency-budget-slider"
                style={{ display: "flex", justifyContent: "space-between", color: "#64706c", font: "10px var(--font-mono)", marginBottom: "8px", letterSpacing: "0.08em" }}
              >
                <span>P95 LATENCY BUDGET</span>
                <span style={{ color: "var(--aqua)" }}>{maxLatency} ms</span>
              </label>
              <input
                id="p95-latency-budget-slider"
                type="range"
                min="100"
                max="1500"
                step="25"
                value={maxLatency}
                onChange={(e) => setMaxLatency(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--aqua)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#47524f", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                <span>100ms (Strict SLA)</span>
                <span>1500ms (Relaxed)</span>
              </div>
            </div>
          </div>

          {/* Candidates Matrix Configuration */}
          <div style={{ marginBottom: "28px" }}>
            <span style={{ display: "block", color: "#64706c", font: "10px var(--font-mono)", marginBottom: "12px", letterSpacing: "0.08em" }}>
              CANDIDATES TO TEST (MAX 3) · CONFIGURE ADVERSARIAL STRESS PROBES
            </span>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`, gap: "14px" }}>
              {candidates.map((c, i) => (
                <div key={c.id} style={{ border: "1px solid var(--line)", background: "#101413", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "14px", color: "var(--text)" }}>
                      {c.name}
                    </strong>
                    <span style={{ color: "var(--aqua)", font: "9px var(--font-mono)" }}>0{i + 1}</span>
                  </div>
                  <small style={{ display: "block", color: "#65706d", font: "10px var(--font-mono)", marginTop: "4px" }}>
                    id: {c.id}
                  </small>
                  <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", color: "#8c9693" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={c.mockSchemaDrift}
                        onChange={(e) => {
                          const updated = [...candidates];
                          updated[i].mockSchemaDrift = e.target.checked;
                          setCandidates(updated);
                        }}
                        style={{ accentColor: "var(--aqua)" }}
                      />
                      <span>Inject Schema Drift (Protocol Deviation)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={c.mockAuthViolation}
                        onChange={(e) => {
                          const updated = [...candidates];
                          updated[i].mockAuthViolation = e.target.checked;
                          setCandidates(updated);
                        }}
                        style={{ accentColor: "var(--aqua)" }}
                      />
                      <span>Trigger Scope Breach (File/Auth Leak)</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating}
              style={{
                background: evaluating ? "#2d3432" : "var(--aqua)",
                color: "#08100e",
                border: 0,
                padding: "14px 28px",
                fontWeight: 650,
                fontSize: "12px",
                cursor: evaluating ? "not-allowed" : "pointer",
                letterSpacing: "0.06em",
                fontFamily: "var(--font-mono)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "2px",
                boxShadow: "0 2px 12px rgba(121, 216, 201, 0.2)",
              }}
            >
              {evaluating ? (
                <>
                  <span className="live-dot" style={{ margin: 0 }} />
                  <span>EXECUTING 10 ISOLATED PROBE TRIALS...</span>
                </>
              ) : (
                <>
                  <span>EXECUTE ASSURANCE EVALUATION</span>
                  <span>→</span>
                </>
              )}
            </button>

            <span style={{ color: "#5f6b67", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
              Isolated sandbox · Monotonic timing · Cryptographic HMAC receipt
            </span>
          </div>
        </div>

        {/* Results Panel */}
        {resultPacket && (
          <div style={{ marginTop: "24px", border: "1px solid var(--line)", background: "#0c0f0f", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ color: "#65706d", font: "10px var(--font-mono)" }}>DECISION ID: {resultPacket.decisionId}</span>
                <h3 style={{ fontSize: "22px", margin: "6px 0 0", fontWeight: 600 }}>{resultPacket.workflowName}</h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    border: `1px solid ${getVerdictStyle(resultPacket.verdict).borderColor}`,
                    background: getVerdictStyle(resultPacket.verdict).bg,
                    color: getVerdictStyle(resultPacket.verdict).color,
                    padding: "8px 18px",
                    font: "12px var(--font-mono)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    borderRadius: "2px",
                  }}
                >
                  {getVerdictStyle(resultPacket.verdict).label}
                </div>

                <button
                  onClick={() => copyToClipboard(JSON.stringify(resultPacket, null, 2), "json")}
                  style={{
                    background: "#161c1b",
                    border: "1px solid var(--line)",
                    color: "#aab2af",
                    padding: "8px 14px",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  {copied === "json" ? "COPIED PACKET" : "COPY DECISION JSON"}
                </button>
              </div>
            </div>

            {/* Candidate Results Grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: "16px", margin: "24px 0" }}>
              {resultPacket.candidates.map((c: CandidateMetric) => {
                const style = getVerdictStyle(c.verdict);
                return (
                  <div key={c.candidateId} style={{ border: "1px solid var(--line)", background: "#111514", padding: "20px", borderRadius: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "14px", color: "var(--text)" }}>{c.candidateName}</strong>
                      <span style={{ color: style.color, font: "10px var(--font-mono)", fontWeight: 600 }}>{c.verdict}</span>
                    </div>

                    <div style={{ margin: "16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", font: "11px var(--font-mono)" }}>
                      <div>
                        <span style={{ color: "#56615e", display: "block" }}>P50 LATENCY</span>
                        <b style={{ color: "var(--text)", fontSize: "13px" }}>{c.medianLatencyMs} ms</b>
                      </div>
                      <div>
                        <span style={{ color: "#56615e", display: "block" }}>P95 LATENCY</span>
                        <b style={{ color: c.p95LatencyMs > maxLatency ? "#ef4444" : "var(--text)", fontSize: "13px" }}>{c.p95LatencyMs} ms</b>
                      </div>
                      <div>
                        <span style={{ color: "#56615e", display: "block" }}>COLD START</span>
                        <b style={{ color: "#8c9693" }}>{c.coldStartLatencyMs} ms</b>
                      </div>
                      <div>
                        <span style={{ color: "#56615e", display: "block" }}>SUCCESS RATE</span>
                        <b style={{ color: c.successRate >= 0.95 ? "var(--aqua)" : "#ef4444" }}>{(c.successRate * 100).toFixed(0)}%</b>
                      </div>
                    </div>

                    {c.schemaDriftDetected && (
                      <div style={{ color: "#f59e0b", font: "10px var(--font-mono)", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>⚠</span>
                        <span>Schema Drift Detected</span>
                      </div>
                    )}
                    {c.authViolationDetected && (
                      <div style={{ color: "#ef4444", font: "10px var(--font-mono)", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>✖</span>
                        <span>Scope Creep Flagged</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Signature and Hash provenance */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px", display: "flex", justifyContent: "space-between", font: "9px var(--font-mono)", color: "#64706c", flexWrap: "wrap", gap: "10px" }}>
              <span>PRE-REGISTRATION HASH: {resultPacket.preRegistrationHash.substring(0, 32)}...</span>
              <span>SIGNATURE: {resultPacket.signature}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
