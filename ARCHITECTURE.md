# 🏗️ KeepOnME - System Architecture & API Specification

## 1. 기술 스택 (Tech Stack)

- **Frontend**: React 18+, Vite, TypeScript, Tailwind CSS, TanStack Query (React Query), Lucide-React
- **Backend**: Java 17+, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT)
- **Database**: PostgreSQL or MySQL
- **Real-Time Communication**: SSE (Server-Sent Events) for Poke/Verification Notifications

---

## 2. 데이터베이스 스키마 (ERD)

### `users` (사용자)

- `id`: BIGINT (PK, Auto Increment)
- `email`: VARCHAR(100) (Unique)
- `nickname`: VARCHAR(50)
- `invite_code`: VARCHAR(20) (Unique)
- `created_at`: TIMESTAMP

### `mate_couples` (1:1 메이트 매칭)

- `id`: BIGINT (PK, Auto Increment)
- `user_a_id`: BIGINT (FK -> users.id)
- `user_b_id`: BIGINT (FK -> users.id)
- `status`: VARCHAR(20) (`ACTIVE`, `PENDING`)
- `penalty_rule`: VARCHAR(255)
- `created_at`: TIMESTAMP

### `goals` (목표 및 할 일)

- `id`: BIGINT (PK, Auto Increment)
- `user_id`: BIGINT (FK -> users.id)
- `type`: VARCHAR(10) (`DAILY`, `WEEKLY`)
- `title`: VARCHAR(200)
- `target_date`: DATE (주간 목표는 해당 주 월요일 날짜)
- `status`: VARCHAR(20) (`PENDING`, `COMPLETED`, `VERIFIED`)
- `created_at`: TIMESTAMP

### `verifications` (인증 내역)

- `id`: BIGINT (PK, Auto Increment)
- `goal_id`: BIGINT (FK -> goals.id)
- `image_url`: VARCHAR(500) (Nullable)
- `comment`: TEXT
- `reviewed_by`: BIGINT (FK -> users.id, Nullable)
- `review_status`: VARCHAR(20) (`PENDING`, `APPROVED`, `REJECTED`)
- `created_at`: TIMESTAMP

### `pokes` (찌르기 로그)

- `id`: BIGINT (PK, Auto Increment)
- `sender_id`: BIGINT (FK -> users.id)
- `receiver_id`: BIGINT (FK -> users.id)
- `goal_id`: BIGINT (FK -> goals.id, Nullable)
- `message`: VARCHAR(100)
- `created_at`: TIMESTAMP

---

## 3. REST API 명세 (Key Endpoints)

| 도메인     | HTTP     | Endpoint                                       | 설명                                              |
| :--------- | :------- | :--------------------------------------------- | :------------------------------------------------ |
| **Auth**   | `POST`   | `/api/auth/login`                              | 로그인 & JWT 토큰 발급                            |
| **User**   | `GET`    | `/api/users/me`                                | 내 프로필 및 메이트 매칭 상태 조회                |
| **Mate**   | `POST`   | `/api/mates/connect`                           | 초대 코드로 메이트 연결 (`{ inviteCode }`)        |
|            | `GET`    | `/api/mates/status`                            | 연결된 메이트의 오늘 진행 상황 요약               |
| **Goals**  | `GET`    | `/api/goals?targetDate=YYYY-MM-DD&userId={id}` | 일간/주간 목표 목록 조회                          |
|            | `POST`   | `/api/goals`                                   | 목표 등록 (`{ type, title, targetDate }`)         |
|            | `PATCH`  | `/api/goals/{id}/status`                       | 목표 완료 체크 토글                               |
|            | `DELETE` | `/api/goals/{id}`                              | 목표 삭제                                         |
| **Verify** | `POST`   | `/api/goals/{id}/verify`                       | 인증 사진/메모 제출 (`multipart/form-data`)       |
|            | `POST`   | `/api/verifications/{id}/review`               | 메이트 인증 승인/반려 (`APPROVED` / `REJECTED`)   |
| **Poke**   | `POST`   | `/api/pokes`                                   | 찌르기 발송 (`{ targetGoalId, message }`)         |
|            | `GET`    | `/api/notifications/subscribe`                 | SSE 실시간 알림 스트림 연결 (`text/event-stream`) |
