import type { KnowledgeSearchResult } from "./knowledge-search.js";
export interface Reranker { rerank(query: string, candidates: KnowledgeSearchResult[], options?: { topK?: number }): Promise<KnowledgeSearchResult[]>; }
