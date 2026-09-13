import type { Knowledge } from "../model/knowledge.js";
export interface KnowledgeSearchOptions { topK?: number; filters?: Record<string, unknown>; types?: import("../model/knowledge-type.js").KnowledgeType[]; }
export interface KnowledgeSearchResult { knowledge: Knowledge; score: number; retrievalMethod: "lexical" | "semantic" | "hybrid" | "reranked"; rank: number; }
export interface KnowledgeSearch { search(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeSearchResult[]>; }
