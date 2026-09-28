# 🏗️ KeepOnMe - System Architecture & API Specification

> 실제 코드 기준으로 갱신됨 (2026-09-20). 최신 상태의 단일 소스는 `CLAUDE.md`이며, 구조 상세는 `STRUCTURE.md`, 스키마 상세는 `SCHEMA.md` 참고.

## 1. 기술 스택 (Tech Stack)

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS v4(`@tailwindcss/vite`), TanStack Query v5, Axios, Lucide-React
- **Backend**: Java 17, Spring Boot 3.3.5, Maven, Spring Data JPA, Spring Security(커스텀 JWT 필터, `UserDetailsService` 미사용), Bean Validation
- **Database**: H2 파일 기반(`local` 프로필, `jdbc:h2:file:./data/keeponme`) / MySQL(`prod` 프로필, **실제 기동 검증 안 됨**). 정식 마이그레이션 툴(Flyway/Liquibase) 없음 — `ddl-auto: update` 사용
- **Real-Time Communication**: SSE(`SseEmitter`, 순수 서블릿 기반, WebSocket 아님) — Poke 알림에 한해 사용. Verification 알림은 해당 기능 자체가 미구현

---

## 2. 데이터베이스 스키마 (ERD)

테이블 구조/컬럼 상세는 `SCHEMA.md`가 최신 소스이므로 여기서는 중복하지 않는다. 요약:

- `users` (`id`, `email`, `password`, `nickname`, `invite_code`, `role`, `created_at`)
- `mates` — 1:N 다중 연결, `(user_id, mate_id)` 단방향 레코드 두 개로 양방향 연결 표현 (❌ `mate_couples` 1:1 구조 아님)
- `goals` — `type`(DAILY/WEEKLY), `target_date`가 단일 진실 소스, `day_of_week`는 파생 필드
- `verifications` — 엔티티/테이블만 존재, 이를 사용하는 API·서비스 로직 없음
- `pokes` — `sender_id`, `receiver_id`, `status`(PENDING/READ)만 존재 (❌ `goal_id`, `message` 컬럼 없음 — 단순화됨)

---

## 3. REST API 명세 (Key Endpoints)

인증이 필요한 엔드포인트는 `Authorization: Bearer {accessToken}` 헤더 필요 (SSE 제외). 인증 유저는 컨트롤러에서 `@AuthUser User user` / `@AuthUser Long userId`로 주입받음.

| 도메인      | HTTP     | Endpoint                | 요청 바디 / 파라미터                                   | 설명                                                        |
| :---------- | :------- | :----------------------- | :------------------------------------------------------ | :------------------------------------------------------------ |
| **Auth**    | `POST`   | `/api/auth/signup`       | `{ email, password, nickname }`                          | 회원가입 + 초대코드 자동 생성, JWT 즉시 발급               |
|             | `POST`   | `/api/auth/login`        | `{ email, password }` (email은 `admin` 리터럴도 허용)    | 로그인 & JWT 토큰 발급                                       |
| **User**    | `GET`    | `/api/users/me`          | —                                                         | 내 프로필 조회 (`id, email, nickname, inviteCode, role`)     |
| **Mate**    | `GET`    | `/api/mates/me`          | —                                                         | 연결된 메이트 목록 조회                                      |
|             | `POST`   | `/api/mates/connect`     | `{ inviteCode }`                                          | 초대 코드로 메이트 연결 (양방향 레코드 생성)                 |
|             | `DELETE` | `/api/mates/{mateId}`    | —                                                         | 메이트 연결 끊기 (양방향 레코드 함께 삭제)                   |
| **Goals**   | `GET`    | `/api/goals`             | Query: `userId?, targetDate?, dayOfWeek?`                 | 일간/주간 목표 목록 + 달성률(%) 조회 (`userId` 없으면 본인)  |
|             | `POST`   | `/api/goals`              | `{ type, title, targetDate?, dayOfWeek? }`                | 목표 등록 (`targetDate`/`dayOfWeek` 상호 검증은 서버가 수행) |
|             | `PATCH`  | `/api/goals/{id}/status` | —                                                         | 목표 완료 체크 토글                                          |
|             | `DELETE` | `/api/goals/{id}`        | —                                                         | 목표 삭제                                                    |
| **Poke**    | `POST`   | `/api/pokes/send`         | `{ receiverId }`                                          | 찌르기 발송 (메이트 검증 후 생성 + SSE 발송)                 |
|             | `GET`    | `/api/pokes`              | —                                                         | 내가 보내거나 받은 찌르기 목록 조회                          |
|             | `PATCH`  | `/api/pokes/{id}/read`    | —                                                         | 찌르기 읽음 처리                                             |
| **SSE**     | `GET`    | `/api/sse/connect`        | Query: `token` (JWT, `EventSource`가 커스텀 헤더 불가라 예외 허용) | 실시간 알림 스트림 연결 (`text/event-stream`)          |

### 미구현 (문서에는 있었으나 실제로 없는 API)

- `POST /api/goals/{id}/verify` — 인증 사진/메모 제출
- `POST /api/verifications/{id}/review` — 메이트 인증 승인/반려
- 비밀번호 변경/재설정 API 전체
- `Role.ADMIN` 기반 권한 분기 (필드만 존재, 어떤 API도 관리자 전용으로 막혀있지 않음)
