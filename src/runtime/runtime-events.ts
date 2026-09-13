import type { RuntimeEvent } from "./agent-runtime.js";
export interface RuntimeEventSink { emit(event: RuntimeEvent): void; }
