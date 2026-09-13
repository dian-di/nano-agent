import type { AgentRuntime } from "./agent-runtime.js";
import type { RuntimeConfig, RuntimeMessage, RuntimeResult, RuntimeEvent } from "./agent-runtime.js";

/** Adapter that isolates @earendil-works/pi-agent-core from the project domain. */
export class PiAgentRuntime implements AgentRuntime {
  initialize(config: RuntimeConfig): Promise<void> { throw new Error("Not implemented"); }
  send(message: RuntimeMessage, options?: { signal?: AbortSignal }): Promise<RuntimeResult> { throw new Error("Not implemented"); }
  continue(options?: { signal?: AbortSignal }): Promise<RuntimeResult> { throw new Error("Not implemented"); }
  abort(reason?: string): Promise<void> { throw new Error("Not implemented"); }
  events(): AsyncIterable<RuntimeEvent> { throw new Error("Not implemented"); }
  dispose(): Promise<void> { throw new Error("Not implemented"); }
}
