import type { ToolCatalogEntry } from "./tool-catalog-entry.js";
export interface ToolCatalog { get(id: string): Promise<ToolCatalogEntry | undefined>; list(options?: { query?: string; tags?: string[] }): Promise<ToolCatalogEntry[]>; upsert(entries: ToolCatalogEntry[]): Promise<void>; remove(ids: string[]): Promise<void>; }
