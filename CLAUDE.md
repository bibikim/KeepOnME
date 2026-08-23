# 🎯 KeepOnMe - Claude Code Development Guide

## 1. Project Overview

- **Service**: KeepOnMe — 메이트와 함께하는 선한 감시(Friendly Surveillance) 목표 달성 트래커
- **Architecture**: Decoupled Client-Server (Spring Boot Backend + Vite/React Frontend)
- **Key Docs**: `PRD.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `SCHEMA.md` — 단, 이 문서들은 초기 기획 스냅샷이라 실제 구현과 어긋나는 부분이 있다. 이 CLAUDE.md가 "지금 실제로 뭐가 있는지"의 최신 소스다.

---

## 2. 프로젝트 구조와 기술 스택

### Backend (`backend/`)

- Java 17, Spring Boot **3.3.5**, Maven (`pom.xml`, Maven Wrapper 포함)
- Spring Data JPA, Spring Security(커스텀 JWT 필터, `UserDetailsService` 미사용), Bean Validation
- DB: **H2 파일 기반**(`local` 프로필, `jdbc:h2:file:./data/keeponme`) / MySQL(`prod` 프로필, 미검증)
- 실시간: SSE (`SseEmitter`, 순수 서블릿 기반, WebSocket 아님)
- JWT: `jjwt` 0.12.6

디렉터리 구조 (`domain/{feature}/[Entity, Repository, Service, Controller, dto/]` 패턴):

```
backend/src/main/java/com/keeponme/
├── domain/
│   ├── user/          User, Role, AuthController/Service, UserController, InviteCodeGenerator, AdminAccountInitializer
│   ├── goal/           Goal, GoalType, GoalStatus, WeekDay, GoalAchievementCalculator, Controller/Service/Repository
│   ├── mate/           Mate(1:N), MateStatus(CONNECTED), Controller/Service/Repository
│   ├── poke/            Poke, PokeStatus(PENDING/READ), Controller/Service/Repository
│   └── verification/  Verification, ReviewStatus — 엔티티/레포지토리만 존재, API 미구현
└── global/
    ├── common/        BaseTimeEntity (createdAt)
    ├── config/        SecurityConfig, CorsConfig, WebConfig, JpaAuditingConfig
    ├── jwt/             JwtTokenProvider, JwtAuthenticationFilter, JwtAuthenticationEntryPoint, @AuthUser + Resolver
    ├── error/           CustomException, GlobalExceptionHandler, ErrorResponse
    └── sse/             SseEmitters, SseController, NotificationService
```

### Frontend (`frontend/`)

- Vite 8, React 19, TypeScript, **Tailwind CSS v4**(`@tailwindcss/vite`, PostCSS 아님 — Safari 16.4+ 필요)
- TanStack Query v5, Axios, Lucide-React
- `react-router-dom`이 설치는 돼 있지만 **실제로는 안 씀** (라우팅 없이 탭 상태(`activeTab`)로 화면 전환) — 정리 대상

디렉터리 구조:

```
frontend/src/
├── api/          client.ts(axios+JWT 인터셉터), authApi, goalApi, mateApi, pokeApi
├── components/
│   ├── auth/       AuthModal
│   ├── calendar/  WeekdayTabs, WeekNavigator, DatePickerModal (자체 제작, 외부 캘린더 라이브러리 없음)
│   ├── dashboard/ ProgressSummary, WeeklyGoalList, DailyTodoList, GoalListItem
│   ├── mate/       MateConnectModal, MateSelector, MateListModal, MateTodoList
│   ├── layout/     Header, TabNavigation, InviteCodeModal, NotificationBell
│   └── ui/          Card, Badge, Button, Modal(portal), Toast(portal)
├── context/      AuthContext (로그인 상태, 토큰 localStorage 저장)
├── hooks/         useGoals, useMate, usePoke, useSse, useToast
├── lib/            date.ts(날짜 유틸), clipboard.ts, notify.ts(브라우저 Notification API)
└── types/index.ts  백엔드 DTO와 1:1 대응하는 TS 타입
```

---

## 3. Build & Run Commands

### Backend (`backend/`)

- Build/Compile: `./mvnw clean compile`
- Run: `./mvnw spring-boot:run` (포트 8081; 이미 점유 중이면 `--server.port=8082` 등으로 격리해서 테스트할 것)
- Test: `./mvnw test` — **주의: 테스트 코드가 아직 하나도 없다.** 이 명령은 통과하지만 아무것도 검증하지 않는다.

### Frontend (`frontend/`)

- `npm install`
- `npm run dev` (포트 5173, `/api` 프록시 → `localhost:8081`)
- `npm run build` (tsc -b && vite build)
- `npm run lint` (oxlint)

---

## 4. 지금까지 구현 완료된 기능 (MVP 범위)

1. **인증/계정**
   - 이메일+비밀번호 회원가입/로그인 (BCrypt), JWT 발급/검증(`@AuthUser`로 컨트롤러에 유저 주입)
   - 가입 시 6~8자리 랜덤 초대코드 자동 생성
   - `admin` 계정: 앱 최초 기동 시 없으면 자동 생성, 랜덤 비밀번호를 콘솔에 1회만 출력. 로그인은 이메일 형식이 기본이지만 `admin`이라는 리터럴 아이디만 예외로 허용(`@Pattern`)
   - `Role`(USER/ADMIN) 필드는 있지만 **권한 분기 로직은 아직 없음** (필드만 존재)
2. **목표(Goal) CRUD**
   - DAILY/WEEKLY 목표 등록·완료 토글·삭제
   - **요일별(day_of_week) 관리**: `targetDate` 또는 `dayOfWeek` 중 하나로 생성 가능, 서버가 상호 검증/자동 계산. 프론트는 항상 클라이언트가 계산한 정확한 `targetDate`를 함께 보내 서버-클라이언트 "오늘" 불일치 리스크 제거
   - **자유 날짜 조회**: 특정 날짜/과거/미래 자유 조회, 주차 이동(`<`/`>`), 커스텀 미니 달력(`DatePickerModal`)
   - 일간/주간 달성률(%) 계산
3. **메이트(Mate) — 1:N 다중 연결**
   - 초대코드로 연결, 한 계정이 여러 메이트와 동시 연결 가능 (특정 쌍의 중복 연결만 차단)
   - `GET /api/mates/me`(목록) / `POST /api/mates/connect` / `DELETE /api/mates/{mateId}`(연결 끊기, 양방향 레코드 함께 삭제)
   - 프론트: 메이트 선택 탭(`MateSelector`) + 관리 모달(`MateListModal`), 선택된 날짜·메이트 상태는 `App.tsx`에서 두 탭(내 대시보드/메이트)에 공유
   - 연결된 메이트의 목표만 조회 가능하도록 매 요청마다 `Mate` 테이블로 권한 검증
4. **찌르기(Poke) + 실시간 알림(SSE)**
   - `POST /api/pokes/send`(메이트 검증 후 생성 + SSE 발송) / `GET /api/pokes` / `PATCH /api/pokes/{id}/read`
   - `GET /api/sse/connect`: 유저별 다중 `SseEmitter` 관리, 브라우저 `EventSource`는 커스텀 헤더를 못 보내서 **이 엔드포인트에 한해서만** JWT를 쿼리 파라미터로 허용
   - 프론트: 알림 벨(안읽음 뱃지) + 실시간 토스트 + 브라우저 Notification API
5. **UI/UX**
   - 전면 리디자인 완료 (bento-grid 스타일, `gray/indigo/emerald` 팔레트, 공용 `Card/Badge/Button/Modal/Toast` 프리미티브)
   - 모바일 반응형 다듬기(헤더 줄바꿈, 날짜 위치 등) 여러 차례 반복 진행됨

**구현되지 않은 것** (PRD/ARCHITECTURE에는 있지만 실제로 없음):
- 사진/코멘트 인증 플로우 (`POST /api/goals/{id}/verify`, `POST /api/verifications/{id}/review`) — `Verification` 엔티티만 존재, API·프론트 전부 미구현
- 찌르기 프리셋 메시지 모달(`PokeModal`), 인증 승인/반려 모달(`VerificationModal`) — 미구현
- 비밀번호 변경/재설정 API 없음 (admin 계정도 최초 로그인 후 바꿀 방법이 없음)

---

## 5. 중요한 설계 결정과 그 이유

- **`@AuthUser` 커스텀 리졸버로 인증 유저 주입, `UserDetailsService` 미사용**: 이 앱은 소셜로그인/복잡한 권한 체계가 없어서, Spring Security의 표준 인증 흐름 대신 JWT를 직접 파싱해 SecurityContext에 `userId`만 심고, 컨트롤러 파라미터에서 `@AuthUser User user`/`Long userId`로 바로 꺼내 쓰는 경량 구조를 택함.
- **Goal의 `dayOfWeek`는 파생 필드, `targetDate`가 단일 진실 소스**: 처음엔 서버가 "지금"을 기준으로 요일→날짜를 매번 계산했는데, 생성 시점과 조회 시점의 서버 "현재 시각"이 자정 경계 등에서 어긋날 여지가 있었다. 그래서 **프론트가 선택된 요일의 실제 날짜를 직접 계산해 `targetDate`로 명시적으로 보내는 구조**로 바꿈 (`lib/date.ts`). 서버는 `targetDate`가 오면 `dayOfWeek`를 그로부터 파생/검증만 한다.
- **Mate를 대칭 테이블 하나가 아니라 "나→상대" 단방향 레코드 두 개**로 모델링: `(user_id, mate_id)` 복합 유니크 + 매 연결마다 정방향/역방향 레코드를 함께 생성·삭제. "내 메이트 목록" 조회가 `user_id = ?` 단순 쿼리 하나로 끝나서, `OR (user_a=? OR user_b=?)` 같은 양방향 쿼리보다 다루기 쉬움. 대신 연결/해제 로직에서 두 레코드를 트랜잭션으로 함께 처리해야 함.
- **SSE 인증은 `/api/sse/connect`에서만 쿼리 파라미터 토큰 허용**: 브라우저 네이티브 `EventSource`가 커스텀 헤더를 못 보내는 제약 때문에 불가피하게 예외를 뒀지만, `JwtAuthenticationFilter`에서 정확히 이 경로에만 한정해서 다른 API의 보안 수준은 그대로 유지.
- **로컬 H2를 in-memory → 파일 기반으로 전환**: 개발 중 백엔드를 자주 재기동하는데, in-memory면 재기동마다 가입/목표 데이터가 다 날아가서 테스트가 번거로웠음. 파일 기반(`backend/data/`)으로 바꿔서 재기동해도 데이터 유지. **트레이드오프**: `ddl-auto: update`는 컬럼을 삭제하지 않으므로, 엔티티에서 필드를 지우면 DB에는 예전 NOT NULL 컬럼이 그대로 남아 INSERT가 깨질 수 있음 (실제로 `Poke` 엔티티 단순화 때 이 문제로 500 에러가 나서 수동 `ALTER TABLE ... DROP COLUMN`으로 고친 적 있음 — 아래 "알려진 이슈" 참고).
- **`Modal`/`Toast`를 `createPortal`로 `document.body`에 렌더링**: 처음엔 컴포넌트 트리 안에 그냥 뒀는데, `Header`의 `backdrop-blur`(backdrop-filter)가 CSS 스펙상 그 안의 `position: fixed` 자식의 기준점을 뷰포트가 아니라 자기 자신으로 바꿔버려서, 토스트/모달이 화면 상단에 잘못 붙는 실제 버그가 났음. 포탈로 렌더링 위치를 `document.body`로 고정해서, 앞으로 어떤 조상 요소에 `backdrop-filter`/`transform`이 있어도 안전하게 만듦.
- **Tailwind v4 채택**: 최신 CSS 기능(cascade layers, `@property`) 기반이라 빠르고 유틸리티가 깔끔하지만, **Safari 16.4 미만을 지원하지 않는다**는 제약이 있음 — 모바일 테스트 시 이슈가 생기면 이것부터 의심할 것.

---

## 6. 아직 안 끝난 작업 / 알려진 이슈

- **테스트 코드 전무**: 백엔드 JUnit, 프론트 vitest 등 자동화된 테스트가 하나도 없음. 지금까지 모든 검증은 매 기능마다 별도 포트(8082)에 격리 인스턴스를 띄워 curl로 수동 E2E 테스트하는 방식으로 해왔음 — 회귀 테스트 안전망이 없다.
- **`ddl-auto: update` + 파일 기반 H2의 스키마 드리프트 위험**: 엔티티에서 컬럼을 지우거나 NOT NULL 제약을 바꾸면, 로컬 DB 파일에 이미 있는 예전 컬럼이 안 지워져서 런타임 INSERT가 깨질 수 있다. 엔티티 구조를 바꿀 때마다 `backend/data/` 파일을 지우고 재기동하거나(데이터 유실), H2 콘솔/`RunScript`로 수동 마이그레이션이 필요할 수 있음. **정식 마이그레이션 툴(Flyway/Liquibase) 없음.**
- **CORS에 ngrok 와일드카드 도메인이 코드에 항상 포함되어 있음** (`CorsConfig.java`) — 로컬에서 외부 터널링 테스트하려고 추가한 건데, 프로필 분리 없이 모든 환경에 적용됨. 실제 배포 전에 정리 필요.
- **Role(ADMIN) 필드는 있지만 실제 권한 검사 로직이 없음** — 어떤 API도 관리자 전용으로 막혀있지 않음.
- **비밀번호 변경/재설정 API 없음.**
- **인증(Verification) 도메인 미구현** — 사진 업로드, 저장 전략(로컬 디스크 vs S3 등) 결정 안 됨.
- **`react-router-dom`이 설치만 되고 미사용** — 실제로 정리하거나, 라우팅이 필요해지면 그때 도입.
- **Toast가 컴포넌트별로 개별 상태**(`useToast()`를 여러 컴포넌트가 각자 호출) — 동시에 여러 토스트가 뜨면 겹칠 수 있음. 전역 토스트 큐 없음.
- **prod 프로필(MySQL) 실제로 검증된 적 없음** — 지금까지 전부 로컬 H2로만 개발/테스트함.
- **관리자 계정을 포함해 초대코드/이메일 중복 등은 검증돼 있지만, 레이트 리미팅/브루트포스 방지 전혀 없음.**

---

## 7. 다음에 이어서 할 작업 (제안 우선순위)

1. **사진/코멘트 인증 플로우** (`Verification` API + 승인/반려 + 프론트 업로드 UI) — PRD 핵심 기능 중 유일하게 완전히 빠진 부분.
2. **찌르기 프리셋 메시지 모달(`PokeModal`)** — 지금은 버튼 클릭 한 번으로 바로 전송되는데, PRD상 메시지 프리셋 선택 UX가 있었음.
3. **백엔드 최소 테스트 추가** — 최소한 `AuthService`/`GoalService`/`MateService`/`PokeService`의 핵심 분기(권한 체크, 예외 케이스)만이라도 JUnit으로 커버.
4. **스키마 마이그레이션 도구 도입 검토** (Flyway) — `ddl-auto: update`의 드리프트 리스크를 근본적으로 없애려면 필요.
5. **관리자 권한 검사 실제 적용** — `Role.ADMIN` 필드를 실제로 쓰는 곳을 만들거나, 당장 안 쓸 거면 굳이 유지할지 재검토.
6. **prod(MySQL) 프로필 실제 기동 검증** — 로컬 MySQL이나 Docker로 최소 1회는 `--spring.profiles.active=prod`로 붙여봐야 함.
7. **비밀번호 변경 API** — 특히 admin 계정 최초 비밀번호를 바꿀 방법이 필요.

---

## 8. Coding Conventions & Best Practices

### Backend (Spring Boot / Maven)

- **Architecture**: `domain/{feature}/[Entity, Controller, Service, Repository, dto/]` 레이어드 구조 유지.
- **Entity**: `@NoArgsConstructor(access = AccessLevel.PROTECTED)` + `@Getter`, `@Setter` 금지 — 의미 있는 비즈니스 메서드로 상태 변경(`toggleComplete()`, `markRead()` 등).
- **API**: RESTful, `@RestControllerAdvice`(`GlobalExceptionHandler`)로 통일된 에러 응답. 도메인 예외는 `CustomException(HttpStatus, code, message)`.
- **인증 유저 주입**: `@AuthUser User user` 또는 `@AuthUser Long userId` 사용 (`@AuthenticationPrincipal` 아님).
- 컬럼 정의는 `SCHEMA.md`와 항상 동기화할 것 — 엔티티 필드를 바꿀 때마다 `SCHEMA.md` 표도 같이 업데이트해왔음, 계속 유지.

### Frontend (React / TypeScript)

- 스플릿 뷰 없이 탭 기반 단일 뷰 유지 (`activeTab` state, 라우터 아님).
- 도메인 컴포넌트는 `components/dashboard|mate|calendar|layout|auth/`, 재사용 프리미티브는 `components/ui/`.
- 모든 API 호출은 `src/api/`의 axios 인스턴스(`client.ts`)를 통해서만 — 컴포넌트에서 직접 fetch/axios 호출 금지.
- 서버 상태는 TanStack Query로만 관리 (`useQuery`/`useMutation`), 쿼리 키 규칙: `['goals', params]`, `['mates']`, `['pokes']`.
- `src/types/index.ts`가 백엔드 DTO와 항상 1:1로 맞도록 유지.
- 새 모달/토스트류 컴포넌트는 반드시 `createPortal`로 `document.body`에 렌더링할 것 (섹션 5의 backdrop-filter 버그 참고).
- 날짜 계산은 항상 `lib/date.ts`의 유틸을 통해서 (직접 `new Date()` 파싱 금지 — 타임존 파싱 버그 소지).

---

## 9. Strict Rules for Claude Code

- 작업 완료 전 항상 `./mvnw clean compile`(backend)와 `npm run build`(frontend) 검증.
- Gradle 파일 생성 금지 — Maven(`pom.xml`)만 사용.
- 스키마 변경 시 `SCHEMA.md`를 함께 갱신.
- 로컬 DB(`backend/data/`)는 파일 기반이라 여러 백엔드 프로세스가 동시에 같은 파일을 잠글 수 있음 — 사용자의 실행 중인 인스턴스(보통 8081)를 건드리지 말고, 검증이 필요하면 별도 포트(8082)와 별도 데이터 디렉터리로 격리해서 테스트할 것.

## 10. Git & Commit Rules

- 명시적으로 요청받았을 때만 커밋, 절대 자동 push 금지.

## 11. Security & Secrets

- 자격증명/API 키/JWT 시크릿 하드코딩 금지. `application.yml`의 `local` 프로필 시크릿은 개발용 더미값이며, `prod`는 전부 환경변수(`JWT_SECRET`, `DB_USERNAME`, `DB_PASSWORD` 등)로 주입.

## 12. Definition of Done (per step)

- 백엔드 `./mvnw clean compile` 통과, 프론트 `npm run build` 통과.
- 새 API/기능은 최소 curl 기반 수동 E2E로 성공/실패 케이스 확인 (자동화 테스트가 없으므로 이게 유일한 안전망).
- 요구사항이 모호하거나 문서와 충돌하면, 진행 전에 사용자에게 확인.
