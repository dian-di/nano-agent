import type { ToolCatalogEntry } from "./tool-catalog-entry.js";
export type ToolMetadata = ToolCatalogEntry & { version?: string; tags?: string[]; };
