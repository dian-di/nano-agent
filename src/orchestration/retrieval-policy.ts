import type { KnowledgeRoute } from "./knowledge-router.js";
export interface RetrievalPolicyInput { userRequest: string; route: KnowledgeRoute; }
export interface RetrievalPolicy { shouldRetrieve(input: RetrievalPolicyInput): boolean; query(input: RetrievalPolicyInput): string; }
