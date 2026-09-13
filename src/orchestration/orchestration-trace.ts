export type OrchestrationTraceEvent = { type: "request" | "route" | "knowledge-search" | "tool-discovery" | "tool-load" | "context-built" | "runtime" | "observation" | "error"; data: unknown; };
export interface OrchestrationTrace { add(event: OrchestrationTraceEvent): void; getEvents(): OrchestrationTraceEvent[]; }
