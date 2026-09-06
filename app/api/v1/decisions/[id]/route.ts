import { db } from "../../../../../lib/db/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return Response.json(
      { error: { code: "INVALID_ID", message: "Decision ID is required." } },
      { status: 400, headers: corsHeaders }
    );
  }

  const record = await db.getDecisionPacket(id);

  if (!record) {
    return Response.json(
      { error: { code: "DECISION_NOT_FOUND", message: `No decision packet found with ID '${id}'.` } },
      { status: 404, headers: corsHeaders }
    );
  }

  const parsedPacket = JSON.parse(record.packetJson);

  return Response.json(parsedPacket, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      ETag: `W/"${record.signature}"`,
    },
  });
}
