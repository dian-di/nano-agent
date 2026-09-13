export type KnowledgeRelationType = "related" | "supports" | "contradicts" | "explains" | "requires" | "references";
export interface KnowledgeRelation { fromId: string; toId: string; type: KnowledgeRelationType; }
