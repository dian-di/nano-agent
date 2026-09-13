import type { Knowledge } from "../model/knowledge.js";
import type { KnowledgeIndex } from "./knowledge-index.js";
export interface SemanticIndex extends KnowledgeIndex { search(embedding: number[], topK: number): Promise<Array<{ item: Knowledge; score: number }>>; }
