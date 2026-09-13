import type { KnowledgeSearchResult } from "./knowledge-search.js";
export interface RetrievalFusion { fuse(resultSets: KnowledgeSearchResult[][]): KnowledgeSearchResult[]; }
