export type ContextItemKind =
  | 'system'
  | 'user'
  | 'history'
  | 'knowledge'
  | 'tool'
  | 'tool-example'
  | 'observation'
export interface ContextItem {
  id: string
  kind: ContextItemKind
  content: string
  tokenEstimate?: number
  priority?: number
  sourceId?: string
  metadata?: Record<string, unknown>
}
