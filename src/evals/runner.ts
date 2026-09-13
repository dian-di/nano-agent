import type { EvalScenario } from "./scenario.js";
import type { Evaluator, EvalRunResult } from "./evaluator.js";
export interface EvalRunner { run(scenarios: EvalScenario[], evaluator: Evaluator): Promise<EvalRunResult[]>; }
export async function main(): Promise<void> { throw new Error("Not implemented"); }
