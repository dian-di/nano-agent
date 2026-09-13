import type { BuiltContext } from './built-context.js'
import type { ContextItem } from './context-item.js'

export interface ContextBuildInput {
  system?: ContextItem[]
  user?: ContextItem[]
  history?: ContextItem[]
  knowledge?: ContextItem[]
  tools?: ContextItem[]
  toolExamples?: ContextItem[]
  observations?: ContextItem[]
}

export interface ContextBuilder {
  build(input: ContextBuildInput): Promise<BuiltContext>
}
