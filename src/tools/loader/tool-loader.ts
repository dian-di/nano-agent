import type { ToolDefinition } from "./tool-definition.js";
export interface ToolLoader { load(toolId: string): Promise<ToolDefinition>; }
