import assert from "node:assert/strict";
import test from "node:test";

async function worker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

test("server-renders the complete evidence-led offer contract", async () => {
  const app = await worker();
  const origin = "https://relay-index-intelligence.aegnt.chatgpt.site";
  const [response, offerResponse] = await Promise.all([
    app.fetch(new Request(`${origin}/`, { headers: { accept: "text/html" } }), env, ctx),
    app.fetch(new Request(`${origin}/api/v1/offers/capability-assurance`), env, ctx),
  ]);
  assert.equal(response.status, 200);
  assert.equal(offerResponse.status, 200);

  const [html, offer] = await Promise.all([response.text(), offerResponse.json()]);
  const offerHtml = html.slice(
    html.indexOf('<section class="pricing-wrap"'),
    html.indexOf('<section class="api-section"'),
  );
  const offerText = offerHtml.replaceAll("<!-- -->", "");
  const humanize = (value) => value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());

  assert.match(html, /<title>Relay Index — Agent Capability Intelligence<\/title>/);
  assert.match(html, /independent decision assurance for external agent capabilities/i);
  assert.doesNotMatch(html, /live intelligence layer/i);
  assert.match(html, /Know which agent to call/);

  const renderedFields = [
    offer.name,
    offer.outcome,
    offer.audience,
    ...offer.inputs,
    ...offer.deliverables,
    ...offer.exclusions,
    offer.proof_threshold,
    offer.evidence_protocol.common_workload,
    offer.evidence_protocol.retry_rule,
    offer.evidence_protocol.latency_rule,
    offer.evidence_protocol.cost_rule,
    offer.evidence_protocol.failure_rule,
    offer.evidence_protocol.stop_rule,
    ...offer.evidence_protocol.evidence_classes.map(humanize),
    ...offer.decision_outcomes.map(humanize),
  ];
  for (const term of renderedFields) {
    assert.ok(offerText.includes(term), `offer field should render: ${term}`);
  }

  for (const term of [
    "PAID MCP SPRINT",
    `${offer.scope.workflow_count} named workflow`,
    `Up to ${offer.scope.maximum_candidates} candidates`,
    `Minimum ${offer.evidence_protocol.minimum_trials} trials`,
    "Retry rule",
    "Latency rule",
    "Cost rule",
    "Failure rule",
    "Stop rule",
    "SAFETY BOUNDARY / EXCLUSIONS",
    "A\\$1,250 price test",
    "Checkout awaiting setup",
    "No production execution",
    "Trust firewall",
  ]) {
    assert.match(offerText, new RegExp(term, "i"));
  }

  assert.ok(offerHtml.includes('href="/pilot"'));
  assert.ok(html.includes('href="/api/v1/capabilities"'));
  assert.ok(offerText.includes("can never alter capability trust or evidence scores"));
  for (const forbidden of ["$79", "$399", "$3k", "100k+"]) {
    assert.ok(!offerText.toLowerCase().includes(forbidden.toLowerCase()));
  }
  assert.match(offerText, /No claim of guaranteed savings, reliability, or business outcome/);
  assert.doesNotMatch(offerHtml, /href="https:\/\/buy\.stripe\.com/i);
});

test("homepage labels demo data and planned agent surfaces honestly", async () => {
  const app = await worker();
  const response = await app.fetch(
    new Request("https://relay-index-intelligence.aegnt.chatgpt.site/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  const html = await response.text();
  const mainHtml = html.slice(html.indexOf("<main>"), html.indexOf("</main>") + 7).replaceAll("<!-- -->", "");
  assert.match(mainHtml, /PRODUCT DEMO/);
  assert.match(mainHtml, /Static demonstration data · not telemetry/);
  assert.match(mainHtml, /GET \/api\/v1\/capabilities\?category=Document/);
  assert.match(mainHtml, /MCP, saved watches and change subscriptions/);
  assert.match(mainHtml, /Evidence retrieval and constrained delegation/);
  assert.match(mainHtml, /LEGACY DISCOVERY METADATA/);
  assert.match(mainHtml, /LOCAL DEMO WATCHES/);
  assert.match(mainHtml, /no alert is scheduled|Persistence and alerts are not connected/);
  assert.match(mainHtml, /A\$1,250 price test/);
  assert.doesNotMatch(mainHtml, /NETWORK ONLINE|live intelligence layer|Explore the live graph|CAPABILITY GRAPH \/ LIVE|Last observation|12,408 capabilities observed|VERIFIED TODAY|Billing and quotas are not yet enabled/i);
});

test("paid pilot landing page states the evidence-backed offer and fails closed without Stripe", async () => {
  const app = await worker();
  const response = await app.fetch(
    new Request("https://relayindex.dev/pilot", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = (await response.text()).replaceAll("<!-- -->", "");
  const mainHtml = html.slice(html.indexOf("<main"), html.indexOf("</main>") + 7);
  for (const term of [
    "Approve the route before the agent connects.",
    "Discovery is not approval.",
    "One workflow. One defensible call.",
    "A decision packet in five business days.",
    "$1,250",
    "Checkout not connected",
    "Official registry design discussion",
    "GitHub Agent Finder launch",
    "Machine-readable offer",
  ]) assert.ok(html.includes(term), `pilot page should render: ${term}`);
  assert.match(html, /relay-switching-cabinet\.webp/);
  assert.match(html, /relay-evidence-dossier\.webp/);
  assert.doesNotMatch(html, /https:\/\/buy\.stripe\.com/);
  assert.doesNotMatch(mainHtml, /[—–]/);
});

test("server-renders record-specific capability detail metadata", async () => {
  const app = await worker();
  const response = await app.fetch(
    new Request("https://relay-index-intelligence.aegnt.chatgpt.site/capabilities/lattice-invoice-eu", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Invoice extraction · EU by Lattice Parse — Relay Index<\/title>/);
  assert.match(html, /Sample simulated record: trust 96.8, 99.92% modelled reliability/);
  assert.match(html, /SAMPLE CAPABILITY RECORD/);
  assert.doesNotMatch(html, /property="og:image"/);
});
