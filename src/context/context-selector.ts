import type { ContextBudget } from './context-budget.js'
import type { ContextItem } from './context-item.js'
export interface ContextSelectionInput {
  items: ContextItem[]
  budget: ContextBudget
}
export interface ContextSelector {
  select(input: ContextSelectionInput): ContextItem[]
}
