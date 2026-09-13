export interface RuntimeConfig { model: string; systemPrompt?: string; tools?: unknown[]; }
export interface RuntimeMessage { role: "user" | "system"; content: string; }
export interface RuntimeResult { outputText: string; toolCalls: RuntimeToolCall[]; }
export interface RuntimeToolCall { toolName: string; arguments: Record<string, unknown>; }
export type RuntimeEvent =
  | { type: "message-started" }
  | { type: "message-delta"; text: string }
  | { type: "tool-call-started"; toolName: string }
  | { type: "tool-call-completed"; toolName: string }
  | { type: "message-completed" }
  | { type: "error"; error: unknown };

/** Runtime-neutral boundary for the Agent execution loop. */
export interface AgentRuntime {
  initialize(config: RuntimeConfig): Promise<void>;
  send(message: RuntimeMessage, options?: { signal?: AbortSignal }): Promise<RuntimeResult>;
  continue(options?: { signal?: AbortSignal }): Promise<RuntimeResult>;
  abort(reason?: string): Promise<void>;
  events(): AsyncIterable<RuntimeEvent>;
  dispose(): Promise<void>;
}
