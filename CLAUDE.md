# 🎯 KeepOnMe - Claude Code Development Guide

## 1. Project Overview

- **Service**: KeepOnMe (1:1 Mate Accountability & Goal Tracking Platform)
- **Architecture**: Decoupled Client-Server (Spring Boot Backend + Vite/React Frontend)
- **Key Docs**: Refer to `PRD.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, and `SCHEMA.md` for full specifications.

---

## 2. Tech Stack & Environment

### Backend (`backend/`)

- Java 17, Spring Boot 3.3.x, **Maven (`pom.xml`)**
- Spring Data JPA, Spring Security (JWT), Validation
- Database: H2 (dev/test) / PostgreSQL (prod)
- Real-time: SSE (Server-Sent Events)

### Frontend (`frontend/`)

- Node.js, Vite, React 18+, TypeScript
- Styling: Tailwind CSS v4, Lucide-React
- State/Data Fetching: TanStack Query (React Query) v5, Axios
- Router: React Router DOM v6

---

## 3. Build & Run Commands

### Backend Commands (Run inside `backend/`)

- Build/Compile: `./mvnw clean compile`
- Run Server: `./mvnw spring-boot:run`
- Run Tests: `./mvnw test`

### Frontend Commands (Run inside `frontend/`)

- Install Dependencies: `npm install`
- Run Dev Server: `npm run dev` (Port: 5173)
- Build: `npm run build`
- Lint: `npm run lint`

---

## 4. Coding Conventions & Best Practices

### Backend (Spring Boot / Maven)

- **Architecture**: Domain-driven layered structure (`domain/{feature}/[controller, service, repository, dto, entity]`).
- **Entity Guidelines**:
  - Use `@NoArgsConstructor(access = AccessLevel.PROTECTED)` and `@Getter`.
  - Avoid `@Setter` on entities; use explicit business methods (e.g., `toggleStatus()`, `approve()`).
  - Set column definitions strictly matching `SCHEMA.md`.
- **API Standards**:
  - RESTful endpoints returning standard JSON responses.
  - Global error handling via `@RestControllerAdvice`.
- **Security**: Inject authenticated user context using custom annotation (`@AuthUser`) or `@AuthenticationPrincipal`.

### Frontend (React / TypeScript)

- **Component Structure**:
  - Strictly maintain the tab-based single view (No split-screen layout).
  - Domain components belong to `components/dashboard/` (My board) or `components/mate/` (Mate board).
  - Reusable/primitive components belong to `components/ui/`.
- **API & State**:
  - All API calls must route through `src/api/` using the configured Axios instance.
  - Manage server state exclusively with TanStack Query (`useQuery`, `useMutation`).
  - Do not use raw `fetch()` or inline Axios calls within UI components.
- **TypeScript**: Define strict interfaces in `src/types/index.ts` matching backend DTOs.

---

## 5. Development Workflow (Step-by-Step)

1. **Step 1: Auth & JWT** - Email/Password signup/login, JWT token provider/filter, Auth UI.
2. **Step 2: Core Goals** - Daily/Weekly goals CRUD, toggle status, progress calculation, Dashboard UI.
3. **Step 3: Mate Connection** - Invite code matching, Mate status summary, Mate board view.
4. **Step 4: Realtime Pokes & Verification** - SSE notification stream, Poke modal, Photo/text verification.
5. **Step 5: Polish & Deployment** - Production configs, error handling, and QA.

---

## 6. Strict Rules for Claude Code

- Always run and verify verification commands (`./mvnw compile` in `backend/` and `npm run build` in `frontend/`) before marking a step as complete.
- Do not create Gradle build files (`build.gradle`, `settings.gradle`); this project exclusively uses Maven (`pom.xml`).
- Do not modify database schemas arbitrarily; strictly follow `SCHEMA.md`.

## 7. Git & Commit Rules

- Commit only when explicitly asked; never auto-push.
- Commit message format: `[Step N] type: description` (e.g., `[Step 2] feat: add goal CRUD API`)

## 8. Security & Secrets

- Never hardcode credentials, API keys, or JWT secrets in code.
- All secrets must be read from `.env` (frontend) / `application-*.yml` + env vars (backend), never committed.

## 9. Definition of Done (per step)

- Backend compiles and `./mvnw test` passes.
- Frontend builds (`npm run build`) and `npm run lint` passes with no errors.
- No new dependency added without explicit approval.
- If requirements are ambiguous or not covered by PRD/SCHEMA, ask before proceeding.
