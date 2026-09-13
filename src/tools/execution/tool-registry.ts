import type { ToolDefinition } from "../loader/tool-definition.js";
export interface ToolRegistry { register(tool: ToolDefinition): void; unregister(toolId: string): void; get(toolId: string): ToolDefinition | undefined; list(): ToolDefinition[]; }
