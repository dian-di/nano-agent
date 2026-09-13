import type { KnowledgeSource } from "./knowledge-source.js";
export interface Document { id: string; source: KnowledgeSource; title: string; content: string; metadata?: Record<string, unknown>; }
