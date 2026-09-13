import type { Knowledge } from "../model/knowledge.js";
import type { KnowledgeIndex } from "./knowledge-index.js";
export interface LexicalIndex extends KnowledgeIndex { search(query: string, topK: number): Promise<Array<{ item: Knowledge; score: number }>>; }
