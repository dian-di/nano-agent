export interface ToolCallExample { toolId: string; arguments: Record<string, unknown>; purpose?: string; }
export interface ToolUsageExample { id: string; task: string; context?: string; toolCalls: ToolCallExample[]; explanation?: string; metadata?: Record<string, unknown>; }
