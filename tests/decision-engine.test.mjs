import test from "node:test";
import assert from "node:assert/strict";
import { decisionEngine } from "../lib/decision-engine.ts";
import { db } from "../lib/db/index.ts";

test("decision engine enforces candidate scope between 1 and 3 candidates", async () => {
  await assert.rejects(
    async () => {
      await decisionEngine.evaluate({
        workflowName: "Empty Candidate Test",
        candidates: [],
        testInputs: [{}],
        constraints: {},
      });
    },
    { message: /requires at least one candidate tool/ }
  );

  await assert.rejects(
    async () => {
      await decisionEngine.evaluate({
        workflowName: "Over Boundary Test",
        candidates: [
          { id: "c1", name: "Candidate 1" },
          { id: "c2", name: "Candidate 2" },
          { id: "c3", name: "Candidate 3" },
          { id: "c4", name: "Candidate 4" },
        ],
        testInputs: [{}],
        constraints: {},
      });
    },
    { message: /exceeds maximum scope of 3 candidate tools/ }
  );
});

test("decision engine runs multi-trial evaluations and computes allow_route for clean candidate", async () => {
  const packet = await decisionEngine.evaluate({
    workflowName: "Postgres Schema Query via MCP",
    candidates: [
      {
        id: "supabase-mcp",
        name: "Supabase Community MCP",
        mockBaseLatencyMs: 120,
        mockFailureRate: 0.0,
      },
      {
        id: "neon-mcp",
        name: "Neon Serverless MCP",
        mockBaseLatencyMs: 180,
        mockFailureRate: 0.0,
      },
    ],
    testInputs: [{ query: "SELECT * FROM users LIMIT 1" }],
    constraints: {
      maxP95LatencyMs: 400,
      requiredSuccessRate: 0.95,
    },
    trialsPerCandidate: 10,
  });

  assert.equal(packet.schemaVersion, "1.0.0");
  assert.equal(packet.verdict, "allow_route");
  assert.equal(packet.primaryRecommendation, "supabase-mcp");
  assert.ok(packet.preRegistrationHash.length > 20);
  assert.ok(packet.signature.startsWith("sha256:"));
  assert.equal(packet.candidates.length, 2);

  // Cold start separated
  const primary = packet.candidates[0];
  assert.equal(primary.trialsCompleted, 10);
  assert.ok(primary.coldStartLatencyMs > primary.medianLatencyMs);
  assert.equal(primary.successRate, 1.0);
  assert.equal(primary.verdict, "allow_route");

  // Verified persistence in DB
  const stored = await db.getDecisionPacket(packet.decisionId);
  assert.ok(stored);
  assert.equal(stored.decisionId, packet.decisionId);
  assert.equal(stored.verdict, "allow_route");
});

test("decision engine triggers hold_route on schema drift or elevated p95 latency", async () => {
  const packet = await decisionEngine.evaluate({
    workflowName: "Drifting Schema Evaluation",
    candidates: [
      {
        id: "drifting-candidate",
        name: "Drifting Tool",
        mockBaseLatencyMs: 150,
        mockFailureRate: 0.0,
        mockSchemaDrift: true,
      },
    ],
    testInputs: [{ action: "parse" }],
    constraints: {
      maxP95LatencyMs: 500,
    },
  });

  assert.equal(packet.verdict, "hold_route");
  assert.equal(packet.candidates[0].verdict, "hold_route");
  assert.equal(packet.candidates[0].schemaDriftDetected, true);
  assert.ok(packet.disconfirmingSignals.some((s) => s.includes("schema drift")));
});

test("decision engine triggers reject_route on authorization scope violation", async () => {
  const packet = await decisionEngine.evaluate({
    workflowName: "Hostile Auth Test",
    candidates: [
      {
        id: "rogue-agent",
        name: "Rogue Agent MCP",
        mockAuthViolation: true,
      },
    ],
    testInputs: [{ action: "exec" }],
    constraints: {},
  });

  assert.equal(packet.verdict, "reject_route");
  assert.equal(packet.candidates[0].verdict, "reject_route");
  assert.ok(packet.stopConditionsTriggered.length > 0);
});
