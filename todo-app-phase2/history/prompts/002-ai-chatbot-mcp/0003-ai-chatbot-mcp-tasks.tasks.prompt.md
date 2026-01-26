---
id: 0003
title: ai-chatbot-mcp-tasks
stage: tasks
date: 2026-01-18
surface: agent
model: claude-opus-4-5-20251101
feature: 002-ai-chatbot-mcp
branch: 002-ai-chatbot-mcp
user: default
command: /sp.tasks
labels: ["tasks", "ai-chatbot", "mcp-server", "implementation", "task-breakdown"]
links:
  spec: specs/002-ai-chatbot-mcp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-ai-chatbot-mcp/tasks.md
tests:
  - none
---

## Prompt

/sp.tasks (no additional arguments)

Generate implementation tasks from the design documents for the AI Chatbot feature including:
- plan.md (tech stack, project structure)
- spec.md (6 user stories with priorities P1-P3)
- data-model.md (Conversation, Message, MCPToolCall entities)
- contracts/chat-api.yaml (chat and conversation endpoints)
- contracts/mcp-tools.md (7 MCP tools)

## Response snapshot

Generated comprehensive tasks.md with 68 total tasks organized by user story:

**Phase 1: Setup (4 tasks)**
- Add dependencies (openai-agents, mcp)
- Create module directory structures
- Configure environment variables

**Phase 2: Foundational (19 tasks)**
- Database models: Conversation, Message, MCPToolCall
- Migration for new tables
- MCP tools: create_task, list_tasks, get_task, complete_task, update_task, delete_task, search_tasks
- AI agent configuration with OpenAI Agents SDK
- ConversationService and ChatService

**Phase 3: US1 - Create Task (12 tasks, P1)**
- Chat endpoint with JWT auth
- Message persistence
- AI agent invocation
- Frontend chat UI components

**Phase 4: US2 - List Tasks (4 tasks, P1)**
- Task filtering enhancements
- Frontend task list display

**Phase 5: US3 - Complete Tasks (3 tasks, P2)**
- Task matching logic
- Already completed handling

**Phase 6: US4 - Update Tasks (4 tasks, P2)**
- Task matching and date parsing
- Changed fields tracking

**Phase 7: US5 - Delete Tasks (4 tasks, P3)**
- Confirmation flow state
- Yes/no response handling

**Phase 8: US6 - Context Persistence (10 tasks, P2)**
- Conversation history loading
- 20-message context window
- Conversation management endpoints
- ConversationList sidebar

**Phase 9: Polish (8 tasks)**
- Error handling for API/DB failures
- Input validation and rate limiting
- Loading states and error display

**Parallel Opportunities**: 22 tasks can run in parallel
**MVP Scope**: US1 + US2 (create and list tasks via chat)

## Outcome

- ✅ Impact: Complete task breakdown ready for implementation via Claude Code
- 🧪 Tests: N/A - tests not requested in spec
- 📁 Files: Created specs/002-ai-chatbot-mcp/tasks.md with 68 tasks
- 🔁 Next prompts: Run /sp.implement to execute tasks or implement manually
- 🧠 Reflection: Tasks organized by user story enable independent delivery of each feature increment

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All tasks follow checklist format with ID, labels, file paths
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
