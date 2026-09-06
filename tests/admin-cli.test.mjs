import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { listBriefs, inspectBrief, approveBrief, stageDistribution } from "../bin/relay-admin.mjs";

test("admin CLI lists briefs, inspects citations, approves with digest, and stages distribution", async () => {
  // Create temporary fixture directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "relay-admin-test-"));

  try {
    const briefFileName = "2026-09-05-change-radar.md";
    const sampleBriefPath = path.join(tempDir, briefFileName);
    const initialContent = `# Relay Index Change Radar — 2026-09-05

Distribution approval: Not approved

## Evidence
- Upstream MCP specification updated: https://modelcontextprotocol.io/spec
- A2A Agent Card draft published: https://a2a-protocol.org/cards
`;
    fs.writeFileSync(sampleBriefPath, initialContent, "utf8");

    // 1. Test listBriefs
    const briefs = listBriefs(tempDir);
    assert.equal(briefs.length, 1);
    assert.equal(briefs[0].file, briefFileName);
    assert.equal(briefs[0].approved, false);
    assert.equal(briefs[0].status, "PENDING_REVIEW");

    // 2. Test inspectBrief
    const inspection = inspectBrief(sampleBriefPath);
    assert.equal(inspection.file, briefFileName);
    assert.equal(inspection.approved, false);
    assert.ok(inspection.digest.length === 64);
    assert.equal(inspection.sourceCount, 2);

    // 3. Test fail-closed staging before approval
    assert.throws(
      () => stageDistribution(sampleBriefPath, tempDir),
      { message: /Fail-closed gate: Brief .* is NOT approved/ }
    );

    // 4. Test approveBrief
    const approval = approveBrief(sampleBriefPath, "lead@relayindex.dev");
    assert.equal(approval.approved, true);
    assert.equal(approval.signer, "lead@relayindex.dev");

    // Verify approval persisted in file
    const approvedInspection = inspectBrief(sampleBriefPath);
    assert.equal(approvedInspection.approved, true);

    // 5. Test stageDistribution after approval
    const staging = stageDistribution(sampleBriefPath, tempDir);
    assert.ok(fs.existsSync(staging.packPath));
    const stagedContent = fs.readFileSync(staging.packPath, "utf8");
    assert.ok(stagedContent.includes("Relay Index Distribution Pack"));
    assert.ok(stagedContent.includes("Technical Thread (X / Twitter)"));
    assert.ok(stagedContent.includes("Enterprise Memo (LinkedIn)"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
