import type { ToolCatalogEntry } from "../catalog/tool-catalog-entry.js";
export interface ToolSearch { search(query: string, options?: { topK?: number }): Promise<Array<{ tool: ToolCatalogEntry; score: number }>>; }
