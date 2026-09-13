import type { KnowledgeSearchOptions, KnowledgeSearchResult } from "./knowledge-search.js";
export interface LexicalRetriever { retrieve(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeSearchResult[]>; }
