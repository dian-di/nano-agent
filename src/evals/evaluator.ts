import type { EvalScenario } from './scenario.js'
export interface EvalRunResult {
  scenarioId: string
  success: boolean
  outputText: string
  metrics: Record<string, number>
  trace?: unknown
}
export interface Evaluator {
  evaluate(scenario: EvalScenario, run: unknown): Promise<EvalRunResult>
}
