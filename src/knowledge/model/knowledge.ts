import type { KnowledgeType } from "./knowledge-type.js";
import type { KnowledgeRelation } from "./knowledge-relation.js";
export interface Knowledge { id: string; type: KnowledgeType; statement: string; sourceId: string; chunkId?: string; relatedTools?: string[]; relations?: KnowledgeRelation[]; metadata?: Record<string, unknown>; }
