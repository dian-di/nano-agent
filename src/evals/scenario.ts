export interface EvalScenario {
  id: string
  name: string
  userRequest: string
  expected?: {
    requiredKnowledgeIds?: string[]
    allowedToolIds?: string[]
    expectedOutcome?: string
  }
  metadata?: Record<string, unknown>
}
