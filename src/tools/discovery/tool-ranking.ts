import type { ToolCatalogEntry } from "../catalog/tool-catalog-entry.js";
export interface ToolRanking { rank(task: string, candidates: ToolCatalogEntry[]): Promise<Array<{ tool: ToolCatalogEntry; score: number }>>; }
