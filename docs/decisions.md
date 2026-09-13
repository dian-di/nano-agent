# Nano Agent Knowledge — Architectural Decisions

## ADR-001 — Pi is the Agent Runtime

### Decision

Use `@earendil-works/pi-agent-core` as the Agent runtime.

### Rationale

The purpose of this project is not to learn how to implement a generic Agent loop. Pi provides an appropriate runtime boundary so the project can focus on Knowledge, Tool Discovery, Context Engineering, and evaluation.

### Boundary

```text
Pi:
  Agent loop
  Tool execution
  Runtime events
  Model interaction

Project:
  Knowledge
  Retrieval
  Tool discovery
  Tool usage knowledge
  Context construction
  Routing
  Evaluation
```

---

## ADR-002 — Do Not Use a Full Agent Framework

### Decision

Do not introduce LangGraph/LangChain as a required core dependency.

### Rationale

A graph framework would add abstraction around the very behavior this project is trying to understand.

The desired learning surface is:

```text
Retrieval
Tool Discovery
Context
Planning
Execution
```

not:

```text
Graph Node
Graph Edge
Graph State
```

A framework may be evaluated later, but it should not define the core architecture.

---

## ADR-003 — Knowledge Is Broader Than RAG

### Decision

Use "Knowledge" as the architectural concept rather than "RAG".

### Rationale

The system handles:

```text
Concepts
Capabilities
Constraints
Procedures
Tool Usage
Examples
```

These are not all naturally described as document chunks.

The project therefore treats RAG as one retrieval mechanism inside a broader Agent Knowledge system.

---

## ADR-004 — Documentation Has Three Roles

### Decision

Documentation is modeled as:

1. fallback knowledge;
2. semantic interpretation;
3. tool/planning knowledge.

### Rationale

A document can answer a user's question directly, explain the meaning of live tool results, or teach the Agent how to map user intent to available product capabilities.

The third role is particularly important because documentation can change the Agent's action plan.

---

## ADR-005 — Separate Tool Knowledge From Tool Execution

### Decision

Maintain a lightweight Tool Catalog separately from executable runtime tools.

### Rationale

The Agent should be able to discover capabilities without loading every complete tool schema into context.

```text
Catalog
 ↓
Discovery
 ↓
JIT Loading
 ↓
Runtime
```

This also makes tool-count scaling experiments possible.

---

## ADR-006 — Tool Examples Are First-Class Knowledge

### Decision

Model tool-use examples explicitly.

### Rationale

A schema describes structural validity. Examples can demonstrate semantic correctness.

The project should be able to compare:

```text
schema
schema + examples
schema + docs
schema + docs + examples
```

---

## ADR-007 — Retrieval Is Candidate Generation

### Decision

Separate retrieval from reranking.

### Rationale

Retrievers optimize for recall; rerankers can optimize for final relevance.

The architecture is:

```text
Retrieve
 ↓
Candidates
 ↓
Rerank
 ↓
Final Knowledge
```

---

## ADR-008 — Retrieval and Context Selection Are Different

### Decision

Introduce a dedicated Context Builder.

### Rationale

A retrieved result is not automatically worthy of entering the model context.

The Context Builder handles:

- relevance;
- ordering;
- deduplication;
- token budget;
- inclusion/exclusion.

---

## ADR-009 — Context Budget Is First-Class

### Decision

Track context cost explicitly.

### Rationale

An Agent with unlimited retrieved context is not necessarily better.

Knowledge, tool definitions, tool results, conversation history, and model output all compete for context capacity.

---

## ADR-010 — JIT Context Is a Core Experiment

### Decision

Support just-in-time retrieval and tool loading.

### Rationale

The project should compare:

```text
everything upfront
```

with:

```text
retrieve/load only what the current task requires
```

This directly tests context efficiency.

---

## ADR-011 — Keep the First Retrieval Backend Simple

### Decision

Start with lexical retrieval.

### Rationale

BM25/FTS5 makes retrieval behavior easy to inspect and reason about.

Semantic/vector retrieval should be added later so its contribution can be measured.

---

## ADR-012 — Avoid Premature Infrastructure

### Decision

Do not require a production vector database, distributed storage, queues, or cloud services.

### Rationale

The goal is mechanism-level understanding.

Recommended progression:

```text
In-memory / files
 ↓
SQLite FTS5
 ↓
Semantic index
 ↓
Optional external vector DB
```

---

## ADR-013 — Evaluation Is First-Class

### Decision

Keep `evals/` at repository root.

### Rationale

The project needs to answer:

```text
Did documentation actually improve the Agent?
Did Tool Search improve tool selection?
Did examples improve arguments?
Did reranking improve task success?
Did JIT context reduce tokens without reducing success?
```

Without evaluation, these remain anecdotes.

---

## ADR-014 — Keep the Demo World Deterministic

### Decision

Use small local fixtures for initial experiments.

### Rationale

The Agent should operate against a controlled product world:

```text
documents
users
conversations
integrations
native tools
scenarios
```

This makes failures reproducible and allows precise evaluation.

---

## ADR-015 — Keep Knowledge Independent of Pi

### Decision

`knowledge/` must not import Pi runtime APIs.

### Rationale

Knowledge retrieval is a domain capability, not an Agent-runtime concern.

This preserves the ability to reuse the Knowledge system with another Agent runtime later.

---

## ADR-016 — Keep Tool Catalog Independent of Pi

### Decision

Tool metadata uses runtime-neutral TypeScript models.

### Rationale

The catalog describes capabilities. Executable tool implementations belong to the runtime boundary.

This prevents the entire Knowledge system from becoming coupled to one Agent SDK.

---

## ADR-017 — Prefer Explicit Traces

### Decision

Important decisions should expose trace information.

### Rationale

Agent systems are difficult to debug when retrieval and context decisions are invisible.

The desired trace is:

```text
request
 ↓
route
 ↓
queries
 ↓
retrieval candidates
 ↓
reranking
 ↓
selected knowledge
 ↓
tool discovery
 ↓
selected tools
 ↓
loaded tools
 ↓
context
 ↓
tool calls
 ↓
observations
```

---

## ADR-018 — Do Not Build a Knowledge Graph Initially

### Decision

No graph database or explicit knowledge graph in the first versions.

### Rationale

The primary problem can be studied with documents, metadata, retrieval, tool catalogs, and examples.

A graph can be introduced later if experiments show that explicit relationships such as:

```text
concept → capability → tool → example
```

provide measurable value.

---

## ADR-019 — The Agent Is Not the Knowledge Router

### Decision

Do not force the LLM to make every retrieval decision through a single giant prompt.

### Rationale

Some retrieval/discovery policy should remain deterministic and inspectable.

The system may evolve toward learned routing later, but early versions should make routing behavior explicit.

---

## ADR-020 — The Core Mental Model

The project's final abstraction is:

```text
Knowledge = what the Agent can know
Tools     = what the Agent can do
Retrieval = how the Agent finds knowledge
Discovery = how the Agent finds capabilities
Context   = what the Agent is allowed to see now
Runtime   = how the Agent acts
Evaluation= whether the additions actually helped
```

The system exists to study the interactions between these components.
