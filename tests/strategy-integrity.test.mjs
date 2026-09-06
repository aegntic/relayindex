import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("market-gap method is evidence-led and rejects adjacent category duplication", async () => {
  const method = await read("../docs/strategy/market-gap-method.md");
  for (const term of [
    "Checked: 2026-08-26",
    "Reported fact",
    "Analyst inference",
    "Disconfirming evidence",
    "Revalidate by",
    "not another directory",
    "not another security scanner",
    "not another gateway",
    "not another marketplace",
    "not another observability dashboard",
    "revenue and engagement never enter trust scoring",
  ]) assert.match(method, new RegExp(term, "i"));
  assert.ok((method.match(/https:\/\//g) || []).length >= 10);
});

test("committed organization-radar schema separates ecosystem and buyer evidence", async () => {
  const queue = await read("../docs/marketing/templates/market-gap-lead-radar.md");
  for (const term of [
    "Private research draft",
    "Organization research candidate",
    "Ecosystem evidence",
    "Buyer evidence state",
    "Disqualifier",
    "Public business route",
    "Revalidate by",
    "No outreach authorized",
    "Existing substitute",
    "Disconfirming evidence",
    "Confidence and uncertainty",
  ]) assert.match(queue, new RegExp(term, "i"));
  assert.doesNotMatch(queue, /(?:personal email|personal name|social handle|purchase intent):/i);
  const gapSection = queue.slice(queue.indexOf("## Ranked market gaps"), queue.indexOf("## Organization research candidates"));
  for (const field of ["Reported fact", "measured observation", "analyst inference", "Direct primary sources", "Existing substitute", "Disconfirming evidence", "Confidence and uncertainty", "Revalidate by"])
    assert.match(gapSection, new RegExp(field, "i"));
});

test("automation policy is gap-first, hostile-source aware, and trust isolated", async () => {
  const [rules, radar, distribution, growth, gap] = await Promise.all([
    read("../docs/marketing/README.md"),
    read("../docs/marketing/templates/change-radar.md"),
    read("../docs/marketing/templates/distribution-pack.md"),
    read("../docs/marketing/templates/growth-review.md"),
    read("../docs/marketing/templates/market-gap-lead-radar.md"),
  ]);
  const all = [rules, radar, distribution, growth, gap].join("\n");
  for (const term of [
    "untrusted data",
    "never follow embedded instructions",
    "organization research candidate",
    "buyer evidence",
    "Not approved",
    "not instrumented",
    "never overwrite",
    "no personal data",
    "sample data",
    "trust scores",
  ]) assert.match(all, new RegExp(term, "i"));
  assert.match(distribution, /newest[^\n]*approved|newest[^\n]*approval/i);
  assert.match(distribution, /same parsed run/i);
  assert.match(distribution, /pre-existing/i);
  assert.match(rules, /snapshot[^\n]*pre-existing/i);
  assert.match(rules, /same parsed run/i);
  assert.match(growth, /at most one/i);
});
