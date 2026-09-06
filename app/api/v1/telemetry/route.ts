import { db, type TelemetryRecord } from "../../../../lib/db/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  const stats = await db.getTelemetryStats();
  return Response.json(
    {
      status: "operational",
      privacy_policy: "zero_cookies_zero_ip_storage",
      stats,
    },
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get("user-agent") || "unknown";
    const isAgent =
      request.headers.get("accept")?.includes("application/json") ||
      /curl|python|claude|gptbot|postman|langchain|mcp/i.test(userAgent);

    const clientKind = isAgent ? "ai_agent" : "human_browser";
    const timestamp = new Date().toISOString();
    const eventId = `tel_${Math.random().toString(36).substring(2, 10)}`;

    const event: TelemetryRecord = {
      id: eventId,
      timestamp,
      eventType: String(body.eventType || "page_view"),
      clientKind,
      path: String(body.path || "/"),
      status: Number(body.status || 200),
      latencyMs: Number(body.latencyMs || 0),
      country: String(body.country || "XX"),
      userAgentFamily: userAgent.substring(0, 32),
    };

    await db.recordTelemetry(event);

    return Response.json(
      { recorded: true, eventId },
      {
        status: 202,
        headers: corsHeaders,
      }
    );
  } catch {
    return Response.json(
      { error: { code: "INVALID_TELEMETRY", message: "Failed to record telemetry event." } },
      { status: 400, headers: corsHeaders }
    );
  }
}
