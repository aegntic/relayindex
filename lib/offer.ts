export const capabilityAssuranceOffer = {
  schemaVersion: "1.0.0",
  offerId: "capability-decision-assurance",
  offerVersion: "2026-08-30",
  status: "founding_price_test",
  name: "MCP connection decision sprint",
  outcome: "Decide whether to allow, hold, or reject one MCP route before it touches a consequential workflow.",
  audience: "Operators who have found an MCP server or tool and need approval-ready evidence before connection.",
  scope: {
    workflowCount: 1,
    maximumCandidates: 3,
    productionExecution: false,
  },
  inputs: [
    "One named MCP workflow and its success constraints",
    "Up to three candidate servers, tools, or current routes",
    "Test-safe representative inputs and failure boundaries",
    "Authorized access or public interfaces that may be tested",
  ],
  evidenceProtocol: {
    evidenceClasses: ["provider_claim", "independent_public_fact", "reproducible_observation"],
    commonWorkload: "Use the same valid inputs and constraints wherever interfaces permit.",
    minimumTrials: 10,
    retryRule: "Record the initial attempt separately from at most two transient-failure retries.",
    latencyRule: "Report median and p95 for successful comparable trials; never blend failed attempts away.",
    costRule: "Record the dated published price basis and observed billable units; do not extrapolate unclear pricing.",
    failureRule: "Count timeout, non-success response, invalid output, or an unmet declared constraint as a failure.",
    stopRule: "Return insufficient comparable evidence when equivalent testing is not lawful, authorized, or technically possible.",
  },
  proofThreshold: "Compare task success plus at least two of cost, latency, reliability, interface fit, or change risk using dated evidence.",
  deliverables: [
    "Approval-ready evidence matrix with fact, observation, and inference separated",
    "Provenance, lifecycle, interface, authentication, and side-effect findings",
    "Reproducible test notes with environment, timestamp, failures, and retries",
    "Decision: allow, hold, reject, or insufficient comparable evidence",
    "Confidence, disconfirmers, fallback, and explicit stop conditions",
  ],
  decisionOutcomes: ["allow_route", "hold_route", "reject_route", "insufficient_comparable_evidence"],
  exclusions: [
    "No production execution or autonomous delegation",
    "No claim of guaranteed savings, reliability, or business outcome",
    "No paid placement or commercial influence on trust rankings",
    "No conclusion when candidate evidence is not comparable",
  ],
  pricing: { status: "founding_price_test", amount: 1250, currency: "AUD", taxTreatment: "shown_at_checkout" },
  delivery: {
    targetBusinessDays: 5,
    startsAfter: "Valid inputs and authorized test access are confirmed.",
  },
  capacity: { foundingSlots: 3 },
  billing: { provider: "stripe_payment_link" },
  availability: { invocation: false, booking: false },
  paths: {
    self: "/api/v1/offers/capability-assurance",
    documentation: "/pilot",
    sampleGraph: "/#graph",
  },
} as const;

export function publicCapabilityAssuranceOffer(origin: string, checkoutUrl: string | null = null) {
  const offer = capabilityAssuranceOffer;
  return {
    schema_version: offer.schemaVersion,
    offer_id: offer.offerId,
    offer_version: offer.offerVersion,
    status: offer.status,
    name: offer.name,
    outcome: offer.outcome,
    audience: offer.audience,
    scope: {
      workflow_count: offer.scope.workflowCount,
      maximum_candidates: offer.scope.maximumCandidates,
      production_execution: offer.scope.productionExecution,
    },
    inputs: offer.inputs,
    evidence_protocol: {
      evidence_classes: offer.evidenceProtocol.evidenceClasses,
      common_workload: offer.evidenceProtocol.commonWorkload,
      minimum_trials: offer.evidenceProtocol.minimumTrials,
      retry_rule: offer.evidenceProtocol.retryRule,
      latency_rule: offer.evidenceProtocol.latencyRule,
      cost_rule: offer.evidenceProtocol.costRule,
      failure_rule: offer.evidenceProtocol.failureRule,
      stop_rule: offer.evidenceProtocol.stopRule,
    },
    proof_threshold: offer.proofThreshold,
    deliverables: offer.deliverables,
    decision_outcomes: offer.decisionOutcomes,
    exclusions: offer.exclusions,
    pricing: offer.pricing,
    delivery: {
      target_business_days: offer.delivery.targetBusinessDays,
      starts_after: offer.delivery.startsAfter,
    },
    capacity: { founding_slots: offer.capacity.foundingSlots },
    billing: {
      provider: offer.billing.provider,
      enabled: checkoutUrl !== null,
      checkout_enabled: checkoutUrl !== null,
    },
    availability: { ...offer.availability, enrollment: checkoutUrl !== null },
    links: {
      self: `${origin}${offer.paths.self}`,
      documentation: `${origin}${offer.paths.documentation}`,
      sample_graph: `${origin}${offer.paths.sampleGraph}`,
      ...(checkoutUrl ? { checkout: checkoutUrl } : {}),
    },
    notice: checkoutUrl
      ? "Paid founding offer. Checkout purchases a manual evidence sprint; this endpoint does not invoke an agent or guarantee an outcome."
      : "Founding price test. Checkout is not configured; this endpoint does not invoke, book, enrol, bill, or guarantee an outcome.",
  };
}
