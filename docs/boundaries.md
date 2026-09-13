# Nano Agent Knowledge — Boundaries and Contracts

This document defines the contracts between the project's major modules.

## 1. High-Level Boundary

```text
+------------------+      +------------------+
|    Knowledge     |      |      Tools       |
|                  |      |                  |
| what/why/how     |      | what can be done |
+--------+---------+      +--------+---------+
         |                         |
         +------------+------------+
                      |
                      v
               +-------------+
               |   Context   |
               +------+------+
                      |
                      v
               +-------------+
               |   Runtime   |
               +------+------+
                      |
                      v
                  Execution
```

---

## 2. Knowledge Boundary

### Input

```ts
string query
```

### Output

```ts
KnowledgeSearchResult[]
```

### Knowledge owns

- source modeling;
- documents;
- chunks;
- semantic classification;
- indexing;
- retrieval;
- reranking.

### Knowledge does not own

- LLM reasoning;
- tool execution;
- Agent state;
- UI;
- runtime-specific tool objects.

---

## 3. Retrieval Boundary

The retrieval subsystem exposes:

```ts
search(query, options): Promise<...>
```

Internally it may perform:

```text
lexical
semantic
hybrid
reranking
```

The caller must not depend on a specific retrieval algorithm.

---

## 4. Tool Catalog Boundary

Tool catalog entries are descriptive:

```text
ToolDefinition
ToolExample
ToolCatalogEntry
```

They answer:

```text
What is this capability?
When might it be useful?
How is it typically used?
```

They do not execute the tool.

---

## 5. Tool Runtime Boundary

The runtime registry contains executable objects.

Conceptually:

```text
Tool Catalog
   ≠
Executable Tool
```

A catalog entry can exist even when its runtime implementation is unavailable.

This distinction is important for discovery and JIT loading.

---

## 6. Context Boundary

The Context Builder receives:

```text
user input
knowledge candidates
tool candidates
examples
conversation
```

and produces:

```text
BuiltContext
```

It decides what becomes model-visible.

The Context Builder does not perform tool execution.

---

## 7. Runtime Boundary

The runtime receives the final model-visible context and executable tools.

It owns:

```text
Agent loop
LLM interaction
Tool invocation
Tool result handling
Continuation
Abort
```

It does not decide which documents are relevant.

---

## 8. Orchestration Boundary

Orchestration connects the pieces.

Conceptually:

```text
route
 ↓
retrieve/discover
 ↓
build context
 ↓
run runtime
 ↓
observe
 ↓
possibly retrieve/discover again
```

It is the policy layer.

---

## 9. Demo Boundary

Demo code represents a fictional product environment.

It owns:

```text
fixtures
native tool examples
benchmark scenarios
```

It must not become a second framework.

---

## 10. Evaluation Boundary

Evaluation consumes the system as a black box where practical.

It records:

```text
task outcome
retrieval outcome
tool outcome
context cost
latency
```

It should not alter production behavior merely to make tests pass.

---

## 11. Dependency Rules

### Allowed

```text
orchestration → knowledge
orchestration → tools
orchestration → context
orchestration → runtime

context → knowledge model
context → tool model

runtime → Pi

demo → orchestration
demo → tools
demo → knowledge fixtures
```

### Forbidden

```text
knowledge → Pi
knowledge → orchestration
retrieval → Agent
tool catalog → Pi runtime object
context → concrete vector database
demo → internal retrieval implementation
```

The exact TypeScript dependency graph can evolve, but these conceptual boundaries should remain.

---

## 12. JIT Loading Contract

Discovery should return enough information to choose a tool without necessarily returning its full runtime definition.

```text
search()
 ↓
ToolSearchResult
 ↓
Agent decision
 ↓
load(toolId)
 ↓
runtime definition
```

This enables experiments with large tool catalogs.

---

## 13. Knowledge-to-Tool Relationship

Knowledge may refer to tools:

```text
Knowledge
  |
  +-- relatedTools[]
```

Example:

```text
Negative feedback is represented by downvotes.
relatedTools:
  - search_conversations
  - get_feedback
```

This relationship is useful for discovery but must not become a hard-coded execution command.

The Agent still needs to reason about whether and how to use the capability.

---

## 14. Observation Loop

The architecture supports iterative retrieval:

```text
User
 ↓
Knowledge retrieval
 ↓
Tool discovery
 ↓
Tool call
 ↓
Observation
 ↓
New information need
 ↓
Knowledge retrieval again
 ↓
Another tool call
```

This matters because knowledge requirements can emerge only after observing a tool result.

---

## 15. Error Boundary

Each layer should report failures in its own domain.

Examples:

```text
Retrieval failure
Tool discovery failure
Tool loading failure
Tool execution failure
Context budget failure
Runtime failure
```

Do not collapse all errors into:

```text
Agent failed
```

The failure source is part of the learning objective.

---

## 16. What Counts as "Knowledge"?

A piece of information belongs in Knowledge when it helps the Agent:

- understand a product/domain concept;
- understand a capability;
- respect a constraint;
- perform a procedure;
- choose or parameterize a tool;
- understand an example.

Pure conversation history is not Knowledge.

Live tool output is not Knowledge by default.

The same information may later be persisted as Knowledge if the product explicitly treats it as reusable domain knowledge.

---

## 17. What Counts as "Context"?

Context is any information intentionally made available to the model for the current reasoning step.

It may include:

```text
system instructions
conversation history
retrieved knowledge
tool definitions
tool examples
tool observations
```

Context is therefore an assembly result, not a storage layer.

---

## 18. What Counts as "Capability Discovery"?

Capability discovery occurs when the Agent must determine:

```text
Which available operation can satisfy this intent?
```

This is distinct from:

```text
How do I understand the product concept?
```

A task may require both.

Example:

```text
"What does my OAuth integration mean?"

1. list_integrations → live state
2. docs search → meaning
```

---

## 19. Final Contract

The cleanest conceptual contract is:

```text
KnowledgeSearch
    "Tell me what is relevant."

ToolDiscovery
    "Tell me what I can do."

ToolLoader
    "Give me the capability definition."

ContextBuilder
    "Decide what the model should see."

AgentRuntime
    "Reason and execute."

Evaluation
    "Tell me whether it worked."
```

Everything else is implementation detail.
