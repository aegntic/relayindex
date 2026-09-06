import { canonicalOrigin } from "../../../lib/public-origin";

export async function GET(request: Request) {
  const origin = canonicalOrigin(request);
  return Response.json({
    name: "Relay Index",
    description: "Browse the Relay Index sample capability dataset and inspect its paid MCP connection decision sprint.",
    version: "0.4.0-demo",
    manifest_kind: "legacy_product_discovery",
    url: origin,
    documentation_url: `${origin}/#api`,
    capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [
      {
        id: "list_sample_capabilities",
        name: "List sample capabilities",
        description: "Return the complete sample capability list, or filter it by an optional case-insensitive category query parameter.",
        tags: ["capability", "sample-data", "listing"],
        examples: [`${origin}/api/v1/capabilities`, `${origin}/api/v1/capabilities?category=Document`],
      },
      {
        id: "describe_mcp_connection_decision_sprint",
        name: "Describe MCP connection decision sprint",
        description: "Return the price, scope, evidence protocol, delivery target, availability, and current checkout state for the manual paid sprint.",
        tags: ["mcp", "decision-assurance", "paid-offer", "read-only"],
        examples: [`${origin}/api/v1/offers/capability-assurance`, `${origin}/pilot`],
      },
    ],
    interfaces: {
      capability_catalog: `${origin}/api/v1/capabilities`,
      http: `${origin}/api/v1/capabilities`,
      offer_catalog: `${origin}/api/v1/offers/capability-assurance`,
      legacy_manifest: `${origin}/.well-known/agent.json`,
    },
    notice: "Legacy Relay Index product-discovery metadata, not a current A2A Agent Card. interfaces.http is a deprecated compatibility alias of interfaces.capability_catalog. The capability catalog contains demonstration records. The paid offer catalog is read-only and exposes checkout only when a Stripe Payment Link is configured. MCP invocation, watches, evidence retrieval, delegation, A2A task transport, and production sources are not connected.",
  });
}
