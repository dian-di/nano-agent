import type { ToolCatalogEntry } from "../catalog/tool-catalog-entry.js";
export interface ToolDiscoveryOptions { topK?: number; categories?: string[]; }
export interface ToolDiscoveryResult { tool: ToolCatalogEntry; score: number; rank: number; }
export interface ToolDiscovery { discover(task: string, options?: ToolDiscoveryOptions): Promise<ToolDiscoveryResult[]>; }
