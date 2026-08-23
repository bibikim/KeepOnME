## 데이터베이스 스키마 (ERD)

```
  ┌──────────────┐       1:N       ┌──────────────┐
  │    users     ├────────────────<│    goals     │
  └──────┬───────┘                 └──────┬───────┘
         │ 1:N                            │ 1:N
         │                                │
  ┌──────┴───────┐                 ┌──────┴───────┐
  │    mates     │                 │verifications │
  └──────────────┘                 └──────────────┘
         │ 1:N
  ┌──────┴───────┐
  │    pokes     │
  └──────────────┘
```

# 🗄️ KeepOnMe - Database Schema Specification

## 1. 테이블 관계 다이어그램 (ERD)

```text
 ┌────────────────────────┐
 │        users           │
 │ ────────────────────── │
 │ PK  id                 │
 │     email              │◀─────────────┐ (1:N)
 │     nickname           │              │
 │     invite_code        │◀──────┐ (1:N)│
 └───────────┬────────────┘       │      │
             │ (1:N)              │      │
             ▼                    │      │
 ┌────────────────────────┐       │      │
 │        goals           │       │      │
 │ ────────────────────── │       │      │
 │ PK  id                 │       │      │
 │ FK  user_id            │       │      │
 │     type               │       │      │
 │     title              │       │      │
 │     status             │       │      │
 └───────────┬────────────┘       │      │
             │ (1:N)              │      │
             ▼                    │      │
 ┌────────────────────────┐       │      │
 │     verifications      │       │      │
 │ ────────────────────── │       │      │
 │ PK  id                 │       │      │
 │ FK  goal_id            │       │      │
 │ FK  reviewed_by ───────┼───────┘      │
 │     review_status      │              │
 └────────────────────────┘              │
                                         │
 ┌────────────────────────┐              │
 │         mates          │              │
 │ ────────────────────── │              │
 │ PK  id                 │              │
 │ FK  user_id ───────────┼──────────────┤
 │ FK  mate_id ───────────┼──────────────┤
 │     status             │              │
 └────────────────────────┘              │
                                         │
 ┌────────────────────────┐              │
 │         pokes          │              │
 │ ────────────────────── │              │
 │ PK  id                 │              │
 │ FK  sender_id ─────────┼──────────────┤
 │ FK  receiver_id ───────┼──────────────┘
 │ FK  goal_id ───────────┼──────────────┐
 │     message            │              │
 └────────────────────────┘              │
             ▲                           │
             └───────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 TABLE: users (회원 계정 및 초대 코드 관리)                              │
├──────────────────┬─────────────────┬──────────┬─────────────────────────────┤
│ Column           │ Type            │ Key/Null │ Description / Default       │
├──────────────────┼─────────────────┼──────────┼─────────────────────────────┤
│ [PK] id          │ BIGINT          │ NOT NULL │ Auto Increment (사용자 식별)│
│ [UQ] email       │ VARCHAR(100)    │ NOT NULL │ 계정 로그인 이메일          │
│      password    │ VARCHAR(255)    │ NOT NULL │ BCrypt 암호화 비밀번호      │
│      nickname    │ VARCHAR(50)     │ NOT NULL │ 서비스 닉네임               │
│ [UQ] invite_code │ VARCHAR(20)     │ NOT NULL │ 1:1 매칭용 고유 난수 코드   │
│      created_at  │ TIMESTAMP       │ NOT NULL │ CURRENT_TIMESTAMP (가입일시)│
└──────────────────┴─────────────────┴──────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🤝 TABLE: mates (1:N 메이트 연결 — user 기준 단방향 레코드)                 │
├──────────────────┬─────────────────┬──────────┬─────────────────────────────┤
│ Column           │ Type            │ Key/Null │ Description / Default       │
├──────────────────┼─────────────────┼──────────┼─────────────────────────────┤
│ [PK] id          │ BIGINT          │ NOT NULL │ Auto Increment (연결 식별)  │
│ [FK] user_id     │ BIGINT          │ NOT NULL │ Ref -> users.id (나)        │
│ [FK] mate_id     │ BIGINT          │ NOT NULL │ Ref -> users.id (연결된 친구)│
│      status      │ VARCHAR(20)     │ NOT NULL │ DEFAULT 'CONNECTED'         │
│                  │                 │          │ ['CONNECTED']               │
│      created_at  │ TIMESTAMP       │ NOT NULL │ CURRENT_TIMESTAMP (연결일시)│
│ [UQ] (user_id, mate_id) 복합 유니크 — 동일 쌍 중복 연결 방지                │
│ 1회 연결 성공 시 (A,B)/(B,A) 두 레코드가 함께 생성/삭제된다.                 │
└──────────────────┴─────────────────┴──────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🎯 TABLE: goals (주간 핵심 목표 및 일일 투두)                               │
├──────────────────┬─────────────────┬──────────┬─────────────────────────────┤
│ Column           │ Type            │ Key/Null │ Description / Default       │
├──────────────────┼─────────────────┼──────────┼─────────────────────────────┤
│ [PK] id          │ BIGINT          │ NOT NULL │ Auto Increment (목표 식별)  │
│ [FK] user_id     │ BIGINT          │ NOT NULL │ Ref -> users.id (작성자)    │
│      type        │ VARCHAR(10)     │ NOT NULL │ DEFAULT 'DAILY'             │
│                  │                 │          │ ['DAILY', 'WEEKLY']         │
│      title       │ VARCHAR(200)    │ NOT NULL │ 목표 및 할 일 내용          │
│      target_date │ DATE            │ NOT NULL │ 대상 일자 (주간: 해당 주 월)│
│      day_of_week │ VARCHAR(10)     │ NULL     │ target_date로부터 파생된 요일│
│                  │                 │          │ ['MON'...'SUN'], WEEKLY는 NULL│
│      status      │ VARCHAR(20)     │ NOT NULL │ DEFAULT 'PENDING'           │
│                  │                 │          │ ['PENDING','COMPLETED',...] │
│      created_at  │ TIMESTAMP       │ NOT NULL │ CURRENT_TIMESTAMP (생성일시)│
└──────────────────┴─────────────────┴──────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 📸 TABLE: verifications (목표 인증 및 메이트 검수)                          │
├──────────────────┬─────────────────┬──────────┬─────────────────────────────┤
│ Column           │ Type            │ Key/Null │ Description / Default       │
├──────────────────┼─────────────────┼──────────┼─────────────────────────────┤
│ [PK] id          │ BIGINT          │ NOT NULL │ Auto Increment (인증 식별)  │
│ [FK] goal_id     │ BIGINT          │ NOT NULL │ Ref -> goals.id (대상 목표) │
│      image_url   │ VARCHAR(500)    │ NULL     │ 인증 사진 S3/로컬 URL       │
│      comment     │ TEXT            │ NULL     │ 작성자 인증 메모/소감       │
│ [FK] reviewed_by │ BIGINT          │ NULL     │ Ref -> users.id (검수 메이트│
│      review_status│ VARCHAR(20)    │ NOT NULL │ DEFAULT 'PENDING'           │
│                  │                 │          │ ['PENDING','APPROVED',...]  │
│      reject_reason│ VARCHAR(255)   │ NULL     │ 반려 시 사유 기록           │
│      created_at  │ TIMESTAMP       │ NOT NULL │ CURRENT_TIMESTAMP (제출일시)│
└──────────────────┴─────────────────┴──────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 👉 TABLE: pokes (실시간 찌르기 및 SSE 알림 로그)                            │
├──────────────────┬─────────────────┬──────────┬─────────────────────────────┤
│ Column           │ Type            │ Key/Null │ Description / Default       │
├──────────────────┼─────────────────┼──────────┼─────────────────────────────┤
│ [PK] id          │ BIGINT          │ NOT NULL │ Auto Increment (찌르기 식별)│
│ [FK] sender_id   │ BIGINT          │ NOT NULL │ Ref -> users.id (찌른 유저) │
│ [FK] receiver_id │ BIGINT          │ NOT NULL │ Ref -> users.id (찔린 유저) │
│      status      │ VARCHAR(20)     │ NOT NULL │ DEFAULT 'PENDING'           │
│                  │                 │          │ ['PENDING','READ']          │
│      created_at  │ TIMESTAMP       │ NOT NULL │ CURRENT_TIMESTAMP (발송일시)│
└──────────────────┴─────────────────┴──────────┴─────────────────────────────┘

```
