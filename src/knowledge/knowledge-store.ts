import type { Knowledge } from "./model/knowledge.js";
export interface KnowledgeStore { get(id: string): Promise<Knowledge | undefined>; list(options?: { type?: string; sourceId?: string }): Promise<Knowledge[]>; upsert(items: Knowledge[]): Promise<void>; delete(ids: string[]): Promise<void>; }
