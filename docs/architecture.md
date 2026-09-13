# Nano Agent Knowledge — Architecture Specification

## 1. Purpose

Nano Agent Knowledge is a deliberately small TypeScript laboratory for studying how an Agent becomes more capable when it can retrieve product/domain knowledge and discover the tools that knowledge tells it how to use.

The project is **not** intended to be:

- a production RAG framework;
- a replacement for LlamaIndex, LangChain, LangGraph, or a vector database;
- a complete MCP implementation;
- an Agent runtime;
- a general-purpose enterprise knowledge platform.

The project is intended to isolate and make observable one specific capability:

> **How should an Agent acquire the right knowledge, discover the right capability, construct the minimum useful context, and then act?**

The central hypothesis is:

```text
Agent capability
≈
Tool capability
×
Tool discoverability
×
Tool-usage knowledge
×
Domain/product semantics
×
Context quality
×
Planning quality
```

A collection of powerful tools does not automatically produce a capable Agent. The Agent must understand what the product means, what the tools can do, when a tool should be used, how it should be called, and what evidence should be retrieved before acting.

---

## 2. Core Architecture

```text
                           User Request
                                |
                                v
                    +------------------------+
                    |    Knowledge Agent      |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |   Knowledge Router     |
                    +-----------+------------+
                                |
              +-----------------+-----------------+
              |                                   |
              v                                   v
      +---------------+                    +---------------+
      | Knowledge     |                    | Tool          |
      | Search        |                    | Discovery     |
      +-------+-------+                    +-------+-------+
              |                                    |
              v                                    v
      +---------------+                    +---------------+
      | Retrieval     |                    | Tool Catalog  |
      | Pipeline      |                    | + Examples    |
      +-------+-------+                    +-------+-------+
              |                                    |
              +----------------+-------------------+
                               |
                               v
                    +------------------------+
                    |     Context Builder    |
                    |  + Token Budget Policy |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |   Pi Agent Runtime     |
                    | @earendil-works/       |
                    | pi-agent-core          |
                    +-----------+------------+
                                |
                                v
                       Native Tool Calls
                                |
                                v
                           Observations
                                |
                                +--------> Agent Loop
```

The architecture intentionally separates five concepts:

1. **Knowledge** — what the Agent can learn.
2. **Tools** — what the Agent can do.
3. **Retrieval/Discovery** — how the Agent finds relevant knowledge/capabilities.
4. **Context** — what is actually presented to the model for the current turn.
5. **Runtime** — how the Agent reasons, calls tools, receives observations, and continues.

---

## 3. Responsibility Boundaries

### 3.1 `runtime/`

Owns the external Agent runtime integration.

Primary dependency:

```text
@earendil-works/pi-agent-core
```

Responsibilities:

- create/configure the Pi Agent;
- expose a small runtime-neutral interface;
- forward user messages;
- continue/abort execution;
- isolate Pi-specific APIs from the rest of the repository.

It must **not** own:

- document chunking;
- retrieval;
- reranking;
- tool discovery;
- knowledge routing;
- evaluation policy.

The runtime is infrastructure.

---

### 3.2 `knowledge/`

Owns product/domain knowledge.

It answers:

> "What information can the Agent learn from documentation and other knowledge sources?"

It contains four conceptual stages:

```text
Source
  ↓
Document
  ↓
Chunk
  ↓
Knowledge
```

and:

```text
Query
  ↓
Retrieve
  ↓
Fuse
  ↓
Rerank
  ↓
Knowledge Results
```

The Agent-facing API is intentionally narrow:

```ts
knowledgeSearch.search(query, options)
```

The Agent should not care whether the backend is:

- BM25;
- SQLite FTS5;
- embeddings;
- vector search;
- hybrid retrieval;
- Reciprocal Rank Fusion;
- a cross-encoder reranker.

---

### 3.3 `tools/`

Owns capability discovery metadata and the boundary to executable tools.

It separates:

```text
Tool Knowledge
        from
Tool Execution
```

A catalog can say:

```text
search_conversations
  - searches customer conversations
  - supports feedback filters
  - useful for customer-feedback tasks
```

without immediately exposing the complete executable runtime definition.

The intended lifecycle is:

```text
Tool Catalog
    ↓
Tool Discovery
    ↓
Candidate Tool
    ↓
JIT Tool Loader
    ↓
Full Tool Definition
    ↓
Runtime Registry
    ↓
Execution
```

This is deliberately similar to the JIT tool-loading idea used by modern Agent systems.

---

### 3.4 `context/`

Owns the final decision:

> "Which retrieved information should actually enter the model context?"

Retrieval and context are intentionally different.

A retriever may return:

```text
20 candidates
```

while the context builder may select:

```text
4 knowledge items
1 tool definition
2 tool examples
```

because context has a finite budget.

The context layer therefore controls:

- relevance;
- ordering;
- deduplication;
- token budget;
- inclusion/exclusion;
- traceability.

---

### 3.5 `orchestration/`

Owns the behavior that connects Knowledge, Tools, Context, and Runtime.

This is the project's primary experimental layer.

The orchestration layer asks:

```text
Do I need knowledge?
Do I need tool discovery?
What should I retrieve?
What should I load?
What should enter context?
When should I retrieve again?
```

It should not reimplement the low-level Agent loop.

---

## 4. Knowledge Model

A document is not the same thing as knowledge.

### Document

A complete source:

```text
Slack Integration Guide
```

### Chunk

A retrievable fragment:

```text
OAuth integrations are authorized by a user...
```

### Knowledge

A semantically useful proposition:

```text
OAuth integration means delegated user authorization.
```

Knowledge has explicit semantic roles:

```ts
type KnowledgeType =
  | "concept"
  | "capability"
  | "constraint"
  | "procedure"
  | "tool_usage"
  | "example";
```

### Concept

Explains terminology.

Example:

```text
OAuth integration = delegated authorization.
```

### Capability

Describes what the product can do.

Example:

```text
Conversation search supports downvote filtering.
```

### Constraint

Describes what the product cannot do or restrictions.

Example:

```text
There is no sentiment field.
```

### Procedure

Explains how something should be done.

Example:

```text
Slack integration must be configured through the supported integration flow.
```

### Tool Usage

Explains how product semantics map onto a tool.

Example:

```text
When the user asks for negative conversations, use the downvote filter.
```

### Example

Demonstrates a concrete task-to-action mapping.

Example:

```text
Intent:
Find negative conversations.

Tool:
search_conversations

Arguments:
{ "feedback": "downvote" }
```

This distinction prevents the project from collapsing into "vector-search Markdown chunks."

---

## 5. The Three Important Product-Documentation Roles

The project's design is based on three observed roles of documentation.

### Role A — Documentation as Fallback Knowledge

Native tools may answer:

```text
What is my account state?
```

but cannot answer:

```text
How do I configure Slack integration?
Why does this widget produce CORS errors?
```

Documentation provides product-specific knowledge unavailable through the native API.

Flow:

```text
User
 ↓
Agent
 ↓
Native tools cannot answer
 ↓
Knowledge Search
 ↓
Product documentation
 ↓
Answer
```

---

### Role B — Documentation as Semantic Interpretation

Native tools expose state:

```json
{
  "integration": {
    "type": "oauth"
  }
}
```

Documentation explains the meaning:

```text
OAuth means delegated user authorization.
API-key integration uses workspace/admin credentials.
```

Therefore:

```text
Live Tool Result
       +
Documentation
       ↓
Correct Interpretation
```

Neither source is sufficient by itself.

---

### Role C — Documentation as Tool-Usage / Planning Knowledge

This is the most important role for this project.

User:

```text
Find conversations with negative sentiment.
```

The product does not have:

```text
sentiment = negative
```

Documentation says:

```text
Negative signals are represented by downvotes and feedback comments.
```

The Agent can then change its plan:

```text
Incorrect mental model:
search sentiment=negative

Correct mental model:
search feedback/downvote
```

The documentation therefore does not directly answer the user.

It changes the Agent's **action space**.

This is why the project treats documentation as an Agent capability rather than merely a user-facing FAQ corpus.

---

## 6. Tool Knowledge vs Tool Schema

A JSON schema answers:

```text
What arguments are structurally valid?
```

It does not necessarily answer:

```text
When should I use this tool?
What does this product concept map to?
Which arguments should I combine?
What are common mistakes?
```

Therefore the project models:

```text
Tool Definition
+
Tool Usage Examples
+
Constraints
+
Product Knowledge
```

as complementary sources.

Example:

```ts
{
  tool: "search_conversations",
  intent: "Find negative customer feedback",
  arguments: {
    feedback: "downvote"
  },
  explanation:
    "The product does not expose sentiment; downvote is a supported negative signal."
}
```

This allows experiments comparing:

```text
Schema only
vs
Schema + Examples
vs
Schema + Documentation
vs
Schema + Documentation + Examples
```

---

## 7. Retrieval Architecture

The retrieval pipeline is deliberately modular.

```text
                 Query
                   |
        +----------+----------+
        |                     |
        v                     v
   Lexical Search       Semantic Search
        |                     |
        +----------+----------+
                   |
                   v
              Hybrid Fusion
                   |
                   v
                Reranker
                   |
                   v
             Final Knowledge
```

### Lexical Retrieval

Good for:

- exact terminology;
- product names;
- API names;
- field names;
- error messages;
- identifiers.

Potential implementation:

```text
BM25
SQLite FTS5
```

### Semantic Retrieval

Good for:

- paraphrases;
- conceptual similarity;
- natural-language questions;
- terminology mismatch.

Potential implementation:

```text
embedding model
vector index
```

### Hybrid Retrieval

Combines both evidence types.

The implementation should make the fusion algorithm explicit.

Possible strategies:

```text
weighted normalized scores
Reciprocal Rank Fusion
```

### Reranking

Retrieval should be treated as candidate generation.

The reranker performs second-stage relevance judgment:

```text
Query
 ↓
Top 50 candidates
 ↓
Reranker
 ↓
Top 5 useful items
```

The project intentionally keeps this stage separate so its contribution can be measured.

---

## 8. Retrieval vs Context Selection

These are not interchangeable.

Retrieval asks:

> What might be relevant?

Context construction asks:

> What is worth spending context tokens on?

Example:

```text
Retriever:
20 results

Context Builder:
- 2 high-confidence constraints
- 2 procedures
- 1 tool-usage example
- 1 tool definition
```

This distinction becomes essential as the Agent's context grows.

---

## 9. Tool Discovery Architecture

The project separates tool discovery from tool execution.

```text
User Task
   ↓
Tool Discovery
   ↓
Candidate Metadata
   ↓
Select relevant capability
   ↓
JIT Tool Loader
   ↓
Full runtime definition
   ↓
Native execution
```

### Catalog

Contains lightweight metadata:

```text
id
name
description
tags
constraints
examples
executable
```

### Discovery

Answers:

```text
Which tools can solve this task?
```

### Loader

Answers:

```text
Give me the complete definition of the selected tool.
```

### Runtime Registry

Answers:

```text
Which executable implementation is available right now?
```

This boundary supports experiments with large tool counts without placing every tool schema into the initial prompt.

---

## 10. Tool Discovery vs Knowledge Retrieval

They look similar but answer different questions.

```text
Knowledge Retrieval:
"What should I know?"

Tool Discovery:
"What can I do?"
```

The two often interact:

```text
Documentation
    ↓
Product semantics
    ↓
Tool Discovery
    ↓
Tool Usage Example
    ↓
Tool Call
```

Therefore neither should be treated as a simple synonym for RAG.

---

## 11. Context Engineering

The context layer is where retrieved information becomes model-visible information.

A conceptual context can contain:

```text
System Instructions
User Request
Conversation History
Retrieved Knowledge
Discovered Tool Definitions
Tool Usage Examples
Previous Tool Results
```

The context builder should decide:

1. What enters?
2. In what order?
3. How much?
4. What is redundant?
5. What is excluded?
6. Why was it included?

The project records a trace:

```ts
{
  includedKnowledgeIds: [],
  includedToolIds: [],
  includedExampleIds: [],
  excludedItems: []
}
```

This makes context decisions observable.

---

## 12. Token Budget

Context is a constrained resource.

A conceptual budget is:

```text
Total Context Window
|
+-- System Reservation
+-- Input / Knowledge
+-- Tool Definitions
+-- Tool Results
+-- Output Reservation
```

The budgeter should prevent knowledge retrieval from consuming all space needed for tool execution and model output.

This is deliberately included because:

> Better retrieval is not necessarily better Agent performance if it produces excessive context.

---

## 13. JIT Context

The project supports the concept of Just-in-Time context:

```text
Huge knowledge base
       ↓
Current task
       ↓
Retrieve only relevant knowledge
       ↓
Build minimal useful context
       ↓
Agent
```

Likewise for tools:

```text
Hundreds of tools
       ↓
Current task
       ↓
Tool Discovery
       ↓
Load only relevant tools
       ↓
Agent
```

The combined architecture is:

```text
                 Huge Knowledge
                       |
                    Retrieval
                       |
                       v
                 Relevant Context
                       ^
                       |
                 Tool Discovery
                       |
                 Huge Tool Catalog
```

This is preferable to indiscriminately stuffing all documentation and all tool schemas into the initial prompt.

---

## 14. Knowledge Router

The first implementation should remain simple.

Possible routes:

```ts
type KnowledgeRoute =
  | "none"
  | "knowledge"
  | "tool-discovery"
  | "knowledge-and-tools";
```

The router should not initially become a complicated classifier.

Start with explicit policies and progressively introduce:

```text
Should retrieve?
      ↓
What knowledge?
      ↓
Should discover tools?
      ↓
What tools?
      ↓
How much context?
      ↓
Retrieve again?
```

The purpose of the abstraction is to isolate policy, not to prematurely build an elaborate planning framework.

---

## 15. Pi Agent Core Boundary

`@earendil-works/pi-agent-core` is the Agent Runtime.

Conceptually:

```text
                 This repository
                       |
                       v
             KnowledgeAgent
                       |
                Context / Tools
                       |
                       v
        @earendil-works/pi-agent-core
                       |
                       v
                LLM Agent Loop
                       |
                       v
                  Tool Calls
```

Pi should provide:

- Agent loop;
- message handling;
- tool execution;
- runtime events;
- model/provider integration as exposed by the selected Pi APIs.

This repository should provide:

- Knowledge;
- Retrieval;
- Tool Discovery;
- Tool Usage Knowledge;
- Context Construction;
- Routing;
- Evaluation.

The goal is to avoid reimplementing Agent infrastructure while retaining full control over the experimental Knowledge system.

---

## 16. Explicit Non-Goals

The following are intentionally outside the initial scope:

### Not a vector database

Do not introduce Qdrant, Pinecone, Weaviate, etc. merely for architectural appearance.

### Not a production ingestion platform

No need for:

- distributed ingestion;
- queues;
- crawling infrastructure;
- document ACL systems;
- multi-tenant storage.

### Not an MCP server

MCP can be added later as an integration experiment, but the core learning model should not depend on MCP.

### Not an Agent framework

Do not build a new LangGraph-like runtime.

### Not an LLM research project

The project studies application/workflow-level Agent behavior, not transformer internals.

---

## 17. Recommended Implementation Progression

### V0 — Vanilla Agent

```text
Pi
+
native tools
```

Purpose:

Establish baseline behavior.

### V1 — Documentation

```text
Pi
+
native tools
+
Knowledge Search
```

Purpose:

Measure whether product documentation solves otherwise impossible tasks.

### V2 — Tool Discovery

```text
Pi
+
Knowledge Search
+
Tool Search
```

Purpose:

Measure whether dynamic capability discovery improves tool selection.

### V3 — Tool Usage Examples

```text
Tool Definition
+
Tool Usage Examples
```

Purpose:

Measure argument correctness and usage quality.

### V4 — Hybrid Retrieval

```text
Lexical
+
Semantic
+
Fusion
```

Purpose:

Study retrieval quality.

### V5 — Reranking

```text
Candidate Retrieval
+
Reranker
```

Purpose:

Improve useful-context precision.

### V6 — JIT Context

```text
Retrieve
 ↓
Select
 ↓
Budget
 ↓
Inject
```

Purpose:

Study context efficiency.

### V7 — Evaluation

Compare all variants systematically.

---

## 18. Recommended Dependency Direction

The intended dependency direction is:

```text
demo
  ↓
orchestration
  ↓
context
  ↓
knowledge / tools
  ↓
runtime adapter
  ↓
Pi
```

More precisely, orchestration coordinates the independent subsystems:

```text
orchestration
   |
   +--> knowledge
   +--> tools
   +--> context
   +--> runtime
```

Knowledge must not depend on the Agent.

Retrieval must not depend on Pi.

Tool catalog metadata must not depend on executable runtime types.

This allows every subsystem to be tested independently.

---

## 19. Observability

Every important decision should eventually be traceable:

```text
User Request
 ↓
Knowledge Route
 ↓
Knowledge Query
 ↓
Retrieved Candidates
 ↓
Reranked Candidates
 ↓
Selected Knowledge
 ↓
Tool Discovery Query
 ↓
Selected Tools
 ↓
Loaded Tools
 ↓
Context Budget
 ↓
LLM
 ↓
Tool Call
 ↓
Observation
```

The project should favor explicit trace structures over hidden magic.

---

## 20. Central Architectural Principle

The most important boundary in this project is:

```text
                     Capability
                         |
             +-----------+-----------+
             |                       |
             v                       v
          Knowledge                Tools
             |                       |
       "what/why/how"             "can do"
             |                       |
             +-----------+-----------+
                         |
                         v
                     Context
                         |
                         v
                       Agent
                         |
                         v
                     Runtime
```

The Agent becomes capable not merely because it has more tools or more documents, but because it can connect:

```text
User intent
    ↕
Product semantics
    ↕
Available capability
    ↕
Correct tool usage
    ↕
Execution
```

That connection is the subject of this project.
