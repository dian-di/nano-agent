export type KnowledgeRoute = "none" | "knowledge" | "tool-discovery" | "knowledge-and-tools";
export interface KnowledgeRouterInput { userRequest: string; conversationSummary?: string; }
export interface KnowledgeRouter { route(input: KnowledgeRouterInput): Promise<KnowledgeRoute>; }
