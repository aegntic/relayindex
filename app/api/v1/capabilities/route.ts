import { capabilities } from "../../../../lib/data";
export async function GET(request:Request){
 const url=new URL(request.url); const category=url.searchParams.get("category"); const data=category?capabilities.filter(c=>c.category.toLowerCase()===category.toLowerCase()):capabilities;
 return Response.json({data:data.map(c=>({id:c.id,name:c.name,category:c.category,provider:c.provider,trust_score:c.trustScore,confidence:c.confidence,price_usd:c.priceUsd,p50_latency_ms:c.p50LatencyMs,reliability_30d:c.reliability30d/100,status:c.status,invoke:c.interfaces[0],evidence_count:c.evidence.length})),as_of:"2026-08-25T06:22:00Z",coverage:"sample_demo",next_cursor:null},{headers:{"Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=60"}})
}
