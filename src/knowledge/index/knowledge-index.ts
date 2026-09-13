import type { Knowledge } from "../model/knowledge.js";
export interface KnowledgeIndex { upsert(items: Knowledge[]): Promise<void>; delete(ids: string[]): Promise<void>; clear(): Promise<void>; }
