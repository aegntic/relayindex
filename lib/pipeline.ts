import type { Capability, ChangeEvent, Evidence, Observation, Opportunity } from "./schema";
export interface DiscoveryAdapter { discover(since:Date):Promise<unknown[]> }
export interface VerificationAdapter { verify(candidate:unknown):Promise<Evidence[]> }
export interface ObservationAdapter { observe(capability:Capability):Promise<Observation[]> }
export interface RankingAdapter { rank(capability:Capability,observations:Observation[],evidence:Evidence[]):Promise<number> }
export interface SignalAdapter { detect(capabilities:Capability[],changes:ChangeEvent[]):Promise<Opportunity[]> }
export class SampleDiscoveryAdapter implements DiscoveryAdapter { async discover(){return []} }
export class SampleVerificationAdapter implements VerificationAdapter { async verify(){return []} }
export const scoringWeights={observedReliability:.34,independentEvaluation:.28,interfaceConformance:.22,evidenceFreshness:.16} as const;
