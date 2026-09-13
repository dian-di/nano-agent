import type { KnowledgeSearchOptions, KnowledgeSearchResult } from "./knowledge-search.js";
export interface HybridRetriever { retrieve(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeSearchResult[]>; }
