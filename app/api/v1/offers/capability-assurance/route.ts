import { capabilityAssuranceOffer, publicCapabilityAssuranceOffer } from "../../../../../lib/offer";
import { configuredCheckoutUrl } from "../../../../../lib/checkout";
import { canonicalOrigin } from "../../../../../lib/public-origin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type, If-None-Match",
  "Access-Control-Max-Age": "86400",
};

function responseHeaders(checkoutEnabled: boolean) {
  return {
    ...corsHeaders,
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    ETag: `"${capabilityAssuranceOffer.offerId}-${capabilityAssuranceOffer.offerVersion}-${checkoutEnabled ? "open" : "closed"}"`,
  };
}

function matchesEtag(ifNoneMatch: string | null, etag: string) {
  if (!ifNoneMatch) return false;
  return ifNoneMatch.split(",").some((candidate) => {
    const validator = candidate.trim();
    if (validator === "*") return true;
    return validator.replace(/^W\//i, "") === etag;
  });
}

export async function GET(request: Request) {
  const checkoutUrl = configuredCheckoutUrl();
  const headers = responseHeaders(checkoutUrl !== null);
  if (matchesEtag(request.headers.get("if-none-match"), headers.ETag)) return new Response(null, { status: 304, headers });
  return Response.json(publicCapabilityAssuranceOffer(canonicalOrigin(request), checkoutUrl), { headers });
}

export async function HEAD(request: Request) {
  const headers = responseHeaders(configuredCheckoutUrl() !== null);
  if (matchesEtag(request.headers.get("if-none-match"), headers.ETag)) return new Response(null, { status: 304, headers });
  return new Response(null, { status: 200, headers: { ...headers, "Content-Type": "application/json" } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function methodNotAllowed() {
  return Response.json(
    { error: "method_not_allowed", allowed_methods: ["GET", "HEAD", "OPTIONS"] },
    { status: 405, headers: { ...corsHeaders, Allow: "GET, HEAD, OPTIONS", "Cache-Control": "no-store" } },
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
