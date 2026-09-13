# Nano Agent Knowledge — Experiment Plan

## 1. Purpose

This project is designed as a sequence of controlled experiments rather than a framework-building exercise.

The key question is:

> **How much does each additional Knowledge capability improve an Agent's ability to select, parameterize, and execute tools?**

The benchmark should therefore compare progressively richer systems against a common set of scenarios.

---

## 2. Experimental Variables

The primary independent variables are:

```text
A. No Knowledge
B. Documentation Retrieval
C. Tool Discovery
D. Tool Usage Examples
E. Hybrid Retrieval
F. Reranking
G. JIT Context
```

Do not change multiple unrelated variables in a single experiment unless the experiment explicitly studies their interaction.

---

## 3. Baseline — V0

### Configuration

```text
Pi Agent
+
Native Tools
```

No documentation retrieval.

No dynamic tool discovery.

All selected baseline tools may be exposed directly.

### Purpose

Establish how far a capable LLM can get from tool schemas alone.

### Expected failure modes

- inventing nonexistent fields;
- misunderstanding product terminology;
- selecting an almost-correct tool;
- incorrect tool arguments;
- refusing tasks that documentation could explain.

---

## 4. V1 — Documentation Retrieval

### Configuration

```text
Pi Agent
+
Native Tools
+
Knowledge Search
```

### Key question

Can documentation solve tasks that native tools alone cannot?

### Representative scenarios

```text
How do I configure Slack integration?

Why does the widget produce a CORS error?

What does OAuth integration mean?

Find conversations with negative sentiment.
```

The last scenario is particularly important because documentation changes the Agent's interpretation of the task rather than simply providing an answer.

---

## 5. V2 — Tool Discovery

### Configuration

```text
Pi Agent
+
Tool Catalog
+
Tool Discovery
+
JIT Tool Loading
```

### Key question

Can the Agent identify the correct capability without exposing every tool definition up front?

### Scaling experiment

Increase the number of available tools:

```text
5
10
30
50
100
300
500
```

Observe:

- tool selection accuracy;
- prompt/context size;
- latency;
- irrelevant tool selection;
- argument correctness.

The purpose is to study the relationship between tool count and tool discoverability.

---

## 6. V3 — Tool Usage Examples

### Configuration

```text
Tool Schema
+
Tool Usage Examples
```

### Key question

Does an Agent perform better when it sees examples of correct tool use?

Compare:

```text
Schema only
```

against:

```text
Schema + Examples
```

Example:

```text
Intent:
Find negative conversations.

Tool:
search_conversations

Arguments:
{
  "feedback": "downvote"
}
```

Measure argument accuracy separately from tool-selection accuracy.

---

## 7. V4 — Hybrid Retrieval

### Configuration

```text
Lexical Retrieval
+
Semantic Retrieval
+
Fusion
```

### Key question

Does combining lexical and semantic evidence improve retrieval quality?

Create query groups:

### Exact terminology

```text
"OAuth"
"CORS"
"downvote"
```

### Paraphrase

```text
How is delegated access configured?
```

### Conceptual mismatch

```text
Find unhappy customers.
```

Compare:

```text
Lexical only
Semantic only
Hybrid
```

---

## 8. V5 — Reranking

### Configuration

```text
Candidate Retrieval
 ↓
Reranker
 ↓
Final Context
```

### Key question

Does second-stage relevance judgment improve the quality of the context actually shown to the Agent?

Measure:

- Recall@K;
- Precision@K;
- MRR;
- nDCG where appropriate;
- task success.

Do not assume retrieval metrics automatically imply Agent success.

---

## 9. V6 — JIT Context

### Configuration

```text
Large Knowledge Base
        ↓
Task-specific retrieval
        ↓
Context Builder
        ↓
Token Budget
        ↓
Agent
```

For tools:

```text
Large Tool Catalog
        ↓
Tool Discovery
        ↓
JIT Tool Loader
        ↓
Agent
```

### Key question

Can the Agent maintain task performance while reducing context size?

Compare:

```text
All knowledge/tools
```

against:

```text
JIT selected knowledge/tools
```

Measure:

- context tokens;
- task success;
- tool selection;
- latency;
- number of tool calls.

---

## 10. V7 — Full Evaluation Matrix

The benchmark matrix should include:

```text
Variant
  ×
Scenario
```

Example:

| Variant | Negative Feedback | Integration Semantics | Slack CORS |
|---|---:|---:|---:|
| V0 | ✓ | ✓ | ✓ |
| V1 | ✓ | ✓ | ✓ |
| V2 | ✓ | ✓ | ✓ |
| V3 | ✓ | ✓ | ✓ |
| V4 | ✓ | ✓ | ✓ |
| V5 | ✓ | ✓ | ✓ |
| V6 | ✓ | ✓ | ✓ |

The check marks mean "run this experiment", not "expected success".

---

## 11. Core Metrics

### Task Success

Did the Agent actually satisfy the user request?

### Tool Selection Accuracy

Did it choose the correct tool?

### Argument Accuracy

Were the tool arguments correct?

### Retrieval Recall

Did retrieval return the knowledge necessary to solve the task?

### Retrieval Precision

How much of the retrieved context was actually relevant?

### Context Tokens

How much context was consumed?

### Tool Calls

How many calls were required?

### Latency

How much additional latency did retrieval/discovery introduce?

---

## 12. Important Metric Distinction

Do not equate:

```text
Retrieval success
```

with:

```text
Agent success
```

The following failure chain is possible:

```text
Correct document retrieved
        ↓
Agent misunderstands it
        ↓
Wrong tool
        ↓
Wrong arguments
        ↓
Task failure
```

Likewise:

```text
Retrieval missed the critical fact
        ↓
Agent cannot recover
        ↓
Task failure
```

Therefore the evaluation stack should distinguish:

```text
Retrieval
   ↓
Context
   ↓
Reasoning
   ↓
Tool Selection
   ↓
Tool Arguments
   ↓
Task Outcome
```

---

## 13. Golden Scenarios

Every scenario should define:

```text
userInput
expected knowledge
expected tool
expected arguments
acceptable alternative actions
```

Do not require a single exact textual response where multiple responses are correct.

For example:

```text
Scenario:
Find negative customer conversations.

Required semantic discovery:
negative sentiment is represented by downvotes/feedback.

Expected tool:
search_conversations

Expected argument:
feedback = downvote
```

---

## 14. Failure Taxonomy

Classify failures rather than simply marking "wrong".

### F1 — Missing Knowledge

The necessary fact was never retrieved.

### F2 — Retrieval Noise

Relevant fact exists but is buried among irrelevant candidates.

### F3 — Context Loss

Relevant retrieval occurred but was excluded from final context.

### F4 — Semantic Misinterpretation

The Agent saw the correct information but misunderstood it.

### F5 — Tool Discovery Failure

Correct capability exists but was not discovered.

### F6 — Tool Usage Failure

Correct tool was selected but parameters were wrong.

### F7 — Execution Failure

Correct call was produced but the tool failed.

### F8 — Planning Failure

The Agent selected a plausible action but followed an incorrect multi-step plan.

This taxonomy is more useful than a single pass/fail score.

---

## 15. Recommended Development Order

Implement in this order:

```text
1. V0 baseline
2. Knowledge model
3. Lexical retrieval
4. V1 documentation
5. Tool catalog
6. Tool discovery
7. V2
8. Tool examples
9. V3
10. Semantic retrieval
11. Hybrid retrieval
12. V4
13. Reranker
14. V5
15. Context builder
16. Token budget
17. JIT context
18. V6
19. Evaluation runner
20. V7
```

The sequence intentionally delays infrastructure complexity.

---

## 16. What Not to Optimize Early

Do not spend early iterations on:

- distributed retrieval;
- vector database benchmarks;
- embedding model leaderboards;
- production authentication;
- multi-tenancy;
- streaming UI;
- elaborate Agent graphs;
- sophisticated autonomous planning.

The purpose is to understand the mechanisms.

---

## 17. Expected Final Learning Outcome

After V7, the system should make the following pipeline concrete:

```text
User Intent
     ↓
Knowledge Need
     ↓
Knowledge Retrieval
     ↓
Semantic Understanding
     ↓
Tool Discovery
     ↓
Tool Usage Knowledge
     ↓
Context Selection
     ↓
Agent Planning
     ↓
Tool Execution
     ↓
Observation
     ↓
Additional Retrieval if Necessary
     ↓
Final Answer
```

That is the actual learning target of the project.
