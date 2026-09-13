export interface Chunk { id: string; documentId: string; text: string; startOffset?: number; endOffset?: number; metadata?: Record<string, unknown>; }
