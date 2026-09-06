import test from "node:test";
import assert from "node:assert/strict";
import { POST as evaluatePost, GET as evaluateGet } from "../app/api/v1/decisions/evaluate/route.ts";
import { GET as decisionDetailGet } from "../app/api/v1/decisions/[id]/route.ts";
import { POST as telemetryPost, GET as telemetryGet } from "../app/api/v1/telemetry/route.ts";

test("POST /api/v1/decisions/evaluate validates input and generates decision packet", async () => {
  // 1. Invalid input returns 400
  const invalidRes = await evaluatePost(
    new Request("http://localhost/api/v1/decisions/evaluate", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    })
  );
  assert.equal(invalidRes.status, 400);

  // 2. Valid input returns 201 with DecisionPacket
  const validRes = await evaluatePost(
    new Request("http://localhost/api/v1/decisions/evaluate", {
      method: "POST",
      body: JSON.stringify({
        workflowName: "Postgres Connection Evaluation",
        candidates: [
          {
            id: "supabase-mcp",
            name: "Supabase MCP",
            mockBaseLatencyMs: 110,
            mockFailureRate: 0.0,
          },
        ],
        testInputs: [{ action: "ping" }],
        constraints: {
          maxP95LatencyMs: 300,
        },
      }),
      headers: { "Content-Type": "application/json" },
    })
  );

  assert.equal(validRes.status, 201);
  const packet = await validRes.json();
  assert.equal(packet.verdict, "allow_route");
  assert.ok(packet.decisionId);
  assert.ok(packet.signature.startsWith("sha256:"));

  // 3. GET on evaluate route returns 405 Method Not Allowed
  const getRes = await evaluateGet();
  assert.equal(getRes.status, 405);

  // 4. Retrieve saved decision via GET /api/v1/decisions/[id]
  const fetchRes = await decisionDetailGet(
    new Request(`http://localhost/api/v1/decisions/${packet.decisionId}`),
    { params: Promise.resolve({ id: packet.decisionId }) }
  );

  assert.equal(fetchRes.status, 200);
  const fetchedPacket = await fetchRes.json();
  assert.equal(fetchedPacket.decisionId, packet.decisionId);
  assert.equal(fetchedPacket.verdict, "allow_route");
  assert.ok(fetchRes.headers.get("etag"));

  // 5. Unknown decision ID returns 404
  const notFoundRes = await decisionDetailGet(
    new Request("http://localhost/api/v1/decisions/dec_non_existent"),
    { params: Promise.resolve({ id: "dec_non_existent" }) }
  );
  assert.equal(notFoundRes.status, 404);
});

test("POST /api/v1/telemetry logs events with zero cookies and classifies clients", async () => {
  // Ingest agent telemetry
  const postRes = await telemetryPost(
    new Request("http://localhost/api/v1/telemetry", {
      method: "POST",
      body: JSON.stringify({
        eventType: "offer_read",
        path: "/api/v1/offers/capability-assurance",
        status: 200,
        latencyMs: 14.5,
      }),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Claude-Web/1.0",
        Accept: "application/json",
      },
    })
  );

  assert.equal(postRes.status, 202);
  const recordResult = await postRes.json();
  assert.equal(recordResult.recorded, true);

  // Read back aggregated telemetry stats
  const getRes = await telemetryGet();
  assert.equal(getRes.status, 200);
  const telemetryData = await getRes.json();
  assert.equal(telemetryData.status, "operational");
  assert.equal(telemetryData.privacy_policy, "zero_cookies_zero_ip_storage");
  assert.ok(telemetryData.stats.totalEvents > 0);
  assert.ok(telemetryData.stats.byClient.ai_agent >= 1);
});

test("relay-mcp server initializes and lists tools over stdio", async () => {
  const { spawn } = await import("node:child_process");
  const path = await import("node:path");

  const serverPath = path.resolve("bin/relay-mcp.mjs");
  const proc = spawn(process.execPath, [serverPath]);

  let responseData = "";
  proc.stdout.on("data", (chunk) => {
    responseData += chunk.toString();
  });

  const initRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" },
    },
  }) + "\n";

  proc.stdin.write(initRequest);

  await new Promise((resolve) => setTimeout(resolve, 150));

  assert.ok(responseData.includes('"name":"relay-index-mcp"'));
  assert.ok(responseData.includes('"protocolVersion":"2024-11-05"'));

  // Test tools/list
  const toolsRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  }) + "\n";

  proc.stdin.write(toolsRequest);
  await new Promise((resolve) => setTimeout(resolve, 150));

  assert.ok(responseData.includes("relay_lookup_capability"));
  assert.ok(responseData.includes("relay_evaluate_connection"));

  proc.kill();
});

