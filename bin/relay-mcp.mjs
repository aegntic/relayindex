#!/usr/bin/env node

/**
 * Relay Index Native MCP Server
 * Exposes Relay Index decision assurance and capability intelligence over stdio JSON-RPC 2.0.
 * Compatible with Claude Desktop, Cursor, Windsurf, and any standard MCP client.
 */

import readline from "node:readline";
import { decisionEngine } from "../lib/decision-engine.ts";
import { db } from "../lib/db/index.ts";
import { capabilityAssuranceOffer } from "../lib/offer.ts";

const SERVER_NAME = "relay-index-mcp";
const SERVER_VERSION = "1.0.0";

const TOOLS = [
  {
    name: "relay_lookup_capability",
    description: "Look up empirical trust scores, p95 latency, and reliability metrics for a tool or agent capability.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Slug of the capability (e.g. 'lattice-invoice-eu', 'relay-browser-checkout')",
        },
        category: {
          type: "string",
          description: "Optional category filter (e.g. 'Document', 'Commerce', 'Legal')",
        },
      },
    },
  },
  {
    name: "relay_evaluate_connection",
    description: "Run empirical decision assurance to determine whether to allow, hold, or reject connecting candidate MCP tools.",
    inputSchema: {
      type: "object",
      properties: {
        workflow_name: {
          type: "string",
          description: "Name of the workflow to be tested (e.g. 'SQL Query Generation')",
        },
        candidates: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              mockBaseLatencyMs: { type: "number" },
              mockFailureRate: { type: "number" },
              mockSchemaDrift: { type: "boolean" },
            },
            required: ["id", "name"],
          },
          minItems: 1,
          maxItems: 3,
          description: "1 to 3 candidate tools to evaluate.",
        },
        max_p95_latency_ms: {
          type: "number",
          description: "Maximum acceptable p95 latency budget in milliseconds.",
        },
      },
      required: ["workflow_name", "candidates"],
    },
  },
  {
    name: "relay_inspect_offer",
    description: "Inspect the current Relay Index capability assurance offer contract, price test, and proof protocol.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + "\n");
}

function sendError(id, code, message) {
  sendResponse({
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message },
  });
}

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let message;
  try {
    message = JSON.parse(trimmed);
  } catch {
    return sendError(null, -32700, "Parse error");
  }

  const { id, method, params } = message;

  try {
    switch (method) {
      case "initialize":
        return sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
            capabilities: { tools: {} },
          },
        });

      case "notifications/initialized":
        // Notification, no response needed
        return;

      case "tools/list":
        return sendResponse({
          jsonrpc: "2.0",
          id,
          result: { tools: TOOLS },
        });

      case "tools/call": {
        const { name, arguments: args } = params || {};

        if (name === "relay_lookup_capability") {
          if (args?.slug) {
            const cap = await db.getCapabilityBySlug(args.slug);
            if (!cap) {
              return sendResponse({
                jsonrpc: "2.0",
                id,
                result: {
                  content: [{ type: "text", text: `Capability '${args.slug}' not found.` }],
                  isError: true,
                },
              });
            }
            return sendResponse({
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        name: cap.name,
                        trust_score: cap.trustScore,
                        p50_latency_ms: cap.p50LatencyMs,
                        reliability_30d: cap.reliability30d,
                        status: cap.status,
                        interfaces: cap.interfaces,
                        evidence_count: cap.evidence.length,
                      },
                      null,
                      2
                    ),
                  },
                ],
              },
            });
          }

          const list = await db.listCapabilities({ category: args?.category });
          return sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    list.map((c) => ({
                      slug: c.slug,
                      name: c.name,
                      category: c.category,
                      trustScore: c.trustScore,
                      status: c.status,
                    })),
                    null,
                    2
                  ),
                },
              ],
            },
          });
        }

        if (name === "relay_evaluate_connection") {
          const packet = await decisionEngine.evaluate({
            workflowName: args.workflow_name,
            candidates: args.candidates,
            testInputs: [{}],
            constraints: {
              maxP95LatencyMs: args.max_p95_latency_ms ?? 500,
            },
          });

          return sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      decision_id: packet.decisionId,
                      verdict: packet.verdict,
                      primary_recommendation: packet.primaryRecommendation,
                      confidence: packet.confidenceScore,
                      candidates: packet.candidates.map((c) => ({
                        candidate: c.candidateName,
                        verdict: c.verdict,
                        p95_latency_ms: c.p95LatencyMs,
                        success_rate: c.successRate,
                      })),
                      signature: packet.signature,
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          });
        }

        if (name === "relay_inspect_offer") {
          return sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(capabilityAssuranceOffer, null, 2),
                },
              ],
            },
          });
        }

        return sendError(id, -32601, `Method/tool '${name}' not found.`);
      }

      default:
        return sendError(id, -32601, `Method '${method}' not found.`);
    }
  } catch (err) {
    return sendError(id, -32000, err.message);
  }
});
