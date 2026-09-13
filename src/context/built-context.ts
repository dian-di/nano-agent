import type { ContextItem } from './context-item.js'
export interface BuiltContext {
  items: ContextItem[]
  estimatedTokens: number
  excludedItems: Array<{ itemId: string; reason: 'budget' | 'priority' | 'duplicate' | 'policy' }>
}
