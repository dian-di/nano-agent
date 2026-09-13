import type { KnowledgeRoute } from "./knowledge-router.js";
export interface DiscoveryPolicyInput { userRequest: string; route: KnowledgeRoute; }
export interface DiscoveryPolicy { shouldDiscover(input: DiscoveryPolicyInput): boolean; }
