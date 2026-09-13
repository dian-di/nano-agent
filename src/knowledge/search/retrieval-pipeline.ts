import type { KnowledgeSearchOptions, KnowledgeSearchResult } from "./knowledge-search.js";
export interface RetrievalPipeline { retrieve(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeSearchResult[]>; }
