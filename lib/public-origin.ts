const fallbackOrigin = "https://relay-index-intelligence.aegnt.chatgpt.site";
const trustedHosts = new Set([
  "localhost",
  "127.0.0.1",
  "relay-index-intelligence.aegnt.chatgpt.site",
  "relayindex.dev",
]);

export function canonicalOrigin(request: Request) {
  const url = new URL(request.url);
  return trustedHosts.has(url.hostname.toLowerCase()) ? url.origin : fallbackOrigin;
}

