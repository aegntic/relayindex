import { decisionEngine, type PreRegistrationInput } from "../../../../../lib/decision-engine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PreRegistrationInput;

    if (!body || !body.workflowName || !Array.isArray(body.candidates)) {
      return Response.json(
        {
          error: {
            code: "INVALID_PRE_REGISTRATION",
            message: "Missing required fields: workflowName and candidates array (1-3 candidates).",
          },
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const packet = await decisionEngine.evaluate(body);

    return Response.json(packet, {
      status: 201,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Internal evaluation error";
    const status = errMessage.includes("scope of 3") || errMessage.includes("requires at least") ? 400 : 500;

    return Response.json(
      {
        error: {
          code: "EVALUATION_FAILED",
          message: errMessage,
        },
      },
      { status, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "POST is required to evaluate a pre-registered workflow. Use GET /api/v1/offers/capability-assurance for offer terms.",
      },
    },
    { status: 405, headers: { ...corsHeaders, Allow: "POST, OPTIONS" } }
  );
}
