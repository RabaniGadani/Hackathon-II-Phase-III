---
id: 0002
title: ai-chatbot-mcp-plan
stage: plan
date: 2026-01-18
surface: agent
model: claude-opus-4-5-20251101
feature: 002-ai-chatbot-mcp
branch: 002-ai-chatbot-mcp
user: default
command: /sp.plan
labels: ["planning", "ai-chatbot", "mcp-server", "architecture", "openai-agents-sdk"]
links:
  spec: specs/002-ai-chatbot-mcp/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-ai-chatbot-mcp/plan.md
  - specs/002-ai-chatbot-mcp/research.md
  - specs/002-ai-chatbot-mcp/data-model.md
  - specs/002-ai-chatbot-mcp/quickstart.md
  - specs/002-ai-chatbot-mcp/contracts/chat-api.yaml
  - specs/002-ai-chatbot-mcp/contracts/mcp-tools.md
tests:
  - none
---

## Prompt

/sp.plan (no additional arguments)

Technology Stack provided in spec:
- Frontend: OpenAI ChatKit
- Backend: Python FastAPI
- AI Framework: OpenAI Agents SDK
- MCP Server: Official MCP SDK
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth

## Response snapshot

Generated complete implementation plan for AI Chatbot feature with the following artifacts:

**Phase 0: Research (research.md)**
- Researched OpenAI Agents SDK: `openai-agents` package with function tools, sessions, guardrails
- Researched Official MCP SDK: `mcp` package with FastMCP pattern
- Resolved all technology decisions for AI framework and MCP integration
- Documented authentication patterns (dependency injection hidden from LLM)
- Established stateless architecture with database-persisted state

**Phase 1: Design Artifacts**

*data-model.md*:
- Conversation entity: User chat sessions with timestamps
- Message entity: Individual messages with role (user/assistant/system)
- MCPToolCall entity: Audit log for tool invocations
- Foreign key relationships and indexes for performance

*contracts/chat-api.yaml* (OpenAPI 3.1):
- POST /api/chat - Send chat message
- GET /api/conversations - List user conversations
- GET /api/conversations/{id} - Get conversation detail
- DELETE /api/conversations/{id} - Delete conversation

*contracts/mcp-tools.md*:
- create_task, list_tasks, get_task, complete_task, update_task, delete_task, search_tasks
- All tools enforce user isolation via hidden dependency injection

*quickstart.md*:
- Installation instructions
- Test commands
- Usage examples for all supported intents

**Implementation Plan (plan.md)**:
- 6 implementation phases
- Constitution check: All 9 principles PASS
- Project structure with new files for MCP, agents, chat
- Risk assessment and mitigation strategies
- Success metrics mapping to implementation

## Outcome

- ✅ Impact: Complete architectural plan ready for task generation
- 🧪 Tests: N/A - planning phase
- 📁 Files: 6 design artifacts created
- 🔁 Next prompts: Run /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan leverages OpenAI Agents SDK native MCP support for clean integration. Stateless design with DB persistence satisfies constitution requirements.

## Evaluation notes (flywheel)

- Failure modes observed: Agent context update script failed due to missing template
- Graders run and results (PASS/FAIL): Constitution check - all 9 principles PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
