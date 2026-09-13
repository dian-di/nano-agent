export interface ToolExecutionContext { signal?: AbortSignal; metadata?: Record<string, unknown>; }
export interface ToolDefinition { id: string; name: string; description: string; inputSchema: Record<string, unknown>; execute(args: Record<string, unknown>, context?: ToolExecutionContext): Promise<unknown>; }
