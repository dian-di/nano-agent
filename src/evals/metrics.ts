export interface EvalMetrics {
  taskSuccess?: number
  toolSelectionAccuracy?: number
  argumentAccuracy?: number
  retrievalRecallAtK?: number
  retrievalPrecisionAtK?: number
  contextTokens?: number
  toolCalls?: number
  latencyMs?: number
}
