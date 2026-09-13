import type { AgentRuntime } from "../runtime/agent-runtime.js";
import type { KnowledgeSearch } from "../knowledge/search/knowledge-search.js";
import type { ToolDiscovery } from "../tools/discovery/tool-discovery.js";
import type { ToolLoader } from "../tools/loader/tool-loader.js";
import type { ContextBuilder } from "../context/context-builder.js";
export interface AgentOrchestratorDependencies { runtime: AgentRuntime; knowledgeSearch: KnowledgeSearch; toolDiscovery: ToolDiscovery; toolLoader: ToolLoader; contextBuilder: ContextBuilder; }
export interface AgentOrchestrator { run(userRequest: string, options?: { signal?: AbortSignal }): Promise<{ outputText: string; traceId?: string }>; }
/** Coordinates subsystems; does not implement retrieval, tool execution, or the Pi loop. */
export class DefaultAgentOrchestrator implements AgentOrchestrator {
  constructor(private readonly dependencies: AgentOrchestratorDependencies) {}
  run(userRequest: string, options?: { signal?: AbortSignal }): Promise<{ outputText: string; traceId?: string }> { throw new Error("Not implemented"); }
}
