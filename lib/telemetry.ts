export type TelemetryEventType =
  | "page_view"
  | "offer_read"
  | "catalog_query"
  | "watch_toggled"
  | "checkout_initiated"
  | "decision_evaluated";

export interface TelemetryPayload {
  eventType: TelemetryEventType;
  path?: string;
  status?: number;
  latencyMs?: number;
  country?: string;
}

/**
 * Dispatches a zero-cookie, privacy-preserving telemetry event asynchronously.
 * Never throws or blocks main-thread rendering.
 */
export function trackEvent(payload: TelemetryPayload): void {
  try {
    const isBrowser = typeof window !== "undefined";
    const targetPath = payload.path || (isBrowser ? window.location.pathname : "/");

    const body = JSON.stringify({
      eventType: payload.eventType,
      path: targetPath,
      status: payload.status || 200,
      latencyMs: payload.latencyMs || 0,
      country: payload.country || "XX",
    });

    if (isBrowser) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/v1/telemetry", body);
      } else {
        fetch("/api/v1/telemetry", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        }).catch(() => {});
      }
    }
  } catch {
    // Fail silently: telemetry must never interrupt user or agent workflows
  }
}
