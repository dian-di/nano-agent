import type { ToolUsageExample } from "./tool-usage-example.js";
export interface ToolUsageKnowledge { getExamples(toolIds: string[], options?: { query?: string; topK?: number }): Promise<ToolUsageExample[]>; addExample(example: ToolUsageExample): Promise<void>; }
