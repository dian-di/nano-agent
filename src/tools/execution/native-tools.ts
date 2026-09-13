import type { ToolDefinition } from "../loader/tool-definition.js";
export interface NativeToolProvider { getTools(): Promise<ToolDefinition[]>; }
