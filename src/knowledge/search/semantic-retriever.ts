import type { KnowledgeSearchOptions, KnowledgeSearchResult } from "./knowledge-search.js";
export interface SemanticRetriever { retrieve(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeSearchResult[]>; }
