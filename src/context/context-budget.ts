import type { ContextItem } from './context-item.js'
export interface ContextBudget {
  maxTokens: number
  reservedTokens?: number
}
export interface ContextBudgetPolicy {
  estimateTokens(text: string): number
  fit(items: ContextItem[], budget: ContextBudget): ContextItem[]
}
