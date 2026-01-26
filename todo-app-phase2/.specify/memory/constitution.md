<!-- SYNC IMPACT REPORT
Version change: 1.1.0 → 1.2.0
Modified principles:
  - V. Environment & Configuration Management: Expanded to include MCP and AI SDK configuration
Added sections:
  - VII. AI Chatbot & Conversational Interface
  - VIII. MCP Server Architecture
  - IX. Agent State Management
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ No changes needed (generic template)
  - .specify/templates/spec-template.md: ✅ No changes needed (generic template)
  - .specify/templates/tasks-template.md: ✅ No changes needed (generic template)
Follow-up TODOs: None
-->

# Todo App Phase II Constitution

## Core Principles

### I. Spec Compliance
All development must strictly adhere to the defined specifications. Before implementing any
feature, read and understand the relevant spec files: @specs/overview.md,
@specs/features/task-crud.md, @specs/features/authentication.md, @specs/api/rest-endpoints.md,
@specs/database/schema.md, @specs/ui/components.md, @specs/ui/pages.md. Flag any missing details,
inconsistencies, or conflicts in the specs before proceeding.

### II. User Isolation & Security
Every API request must be filtered by authenticated user_id to ensure users can only access and
modify their own tasks. JWT tokens issued by Better Auth must be verified in backend FastAPI
endpoints. This is a non-negotiable security requirement that must be enforced in all API
endpoints, including MCP tool operations.

### III. Frontend Architecture Standards
Follow Next.js 16+ App Router conventions strictly: use Server components by default, Client
components only for interactivity, API calls only through /lib/api.ts, and Tailwind CSS for
styling with no inline styles. The conversational chat interface must follow these same standards.

### IV. Backend Architecture Standards
Implement backend using FastAPI + SQLModel with database connection via DATABASE_URL environment
variable. CRUD routes must be under /api/, use Pydantic models for validation, and enforce secure
task operations where only the owner can modify their tasks. This maintains consistent backend
patterns.

### V. Environment & Configuration Management
Consistently use required environment variables: DATABASE_URL, BETTER_AUTH_SECRET, and OPENAI_API_KEY
(for AI agent operations). Maintain separation of concerns between frontend, backend, authentication,
database, MCP server, and AI agent layers. Always produce outputs consistent with Spec-Kit conventions.

### VI. Cross-Layer Consistency
Ensure frontend, backend, authentication, database, MCP server, and AI agents are always aligned.
Verify that API endpoints match database models and UI requirements. Any deviation between layers
must be flagged immediately to maintain system integrity.

### VII. AI Chatbot & Conversational Interface
The AI-powered chatbot must implement natural language processing for all Basic Level task
management features. Use OpenAI Agents SDK for AI logic. The conversational interface must:
- Accept natural language input for creating, updating, completing, and deleting tasks
- Parse user intent accurately and map to appropriate MCP tools
- Provide clear, helpful responses that confirm actions taken
- Handle ambiguous requests by asking clarifying questions
- Maintain conversation context while remaining stateless at the endpoint level

### VIII. MCP Server Architecture
Build the MCP server using the Official MCP SDK that exposes task operations as tools. MCP server
requirements:
- All task operations (create, read, update, delete, list, complete) exposed as MCP tools
- MCP tools must be stateless and store all state in the database
- Each tool must validate user authentication before executing operations
- Tools must enforce user isolation (users only access their own tasks)
- Tool schemas must be well-defined with clear parameter validation
- Error responses must be structured and informative

### IX. Agent State Management
Implement a stateless chat endpoint architecture that persists conversation state to database:
- Chat endpoint must be stateless (no in-memory session state)
- Conversation history stored in database with user association
- AI agents use MCP tools to manage tasks (no direct database access from agent logic)
- Each chat interaction must be traceable and auditable
- Conversation context retrieved from database on each request

## Additional Constraints

Technology stack requirements:
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI + SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT
- Styling: Tailwind CSS
- API: REST endpoints with JWT authentication
- AI/ML: OpenAI Agents SDK
- MCP: Official MCP SDK for Python

Security requirements:
- All API requests must include JWT tokens
- User isolation: each user sees only their own tasks
- Proper validation and sanitization of all inputs
- Secure handling of environment variables
- MCP tools must validate authentication on every operation
- AI agent prompts must not expose sensitive system information

Performance standards:
- Efficient database queries with proper indexing
- Optimized API responses
- Minimal client-side JavaScript where possible
- Conversation state retrieval must be efficient
- MCP tool execution must be fast and non-blocking

## Development Workflow

### Feature Implementation Process:
1. Analyze specs for the feature or task
2. Confirm user stories and acceptance criteria
3. Implement backend or frontend as per CLAUDE.md guidelines
4. Integrate JWT authentication securely
5. For AI features: implement MCP tools before agent logic
6. Test & validate against specs
7. Report completion or issues back to user

### Code Review Requirements:
- All PRs must verify compliance with this constitution
- Verify that all changes maintain user isolation
- Confirm proper JWT authentication implementation
- Ensure consistency with frontend and backend architecture standards
- Validate that database schema changes align with spec requirements
- Verify MCP tools follow stateless patterns
- Ensure AI agent logic does not bypass MCP tools

### Quality Gates:
- All features must be implemented according to spec files
- No implementation without explicit spec guidance
- Proper error handling and validation in all API endpoints
- Comprehensive testing coverage for new features
- MCP tools must have defined schemas and validation
- AI agent responses must be tested for accuracy and safety

## Governance

This constitution supersedes all other practices and development guidelines for the Todo App
Phase II project. All development activities must comply with these principles and constraints.
Amendments to this constitution require explicit documentation, approval from project stakeholders,
and a clear migration plan for any breaking changes.

All PRs and code reviews must verify compliance with this constitution. Complexity must be
justified with clear reasoning in the implementation approach. Use CLAUDE.md files for runtime
development guidance and reference the spec files for feature requirements.

**Version**: 1.2.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-18
