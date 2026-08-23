# 📂 KeepOnMe - Directory Structure & Implementation Guide

## 1. Frontend 구조 (`frontend/`) - Vite + React (TypeScript)

```text
frontend/
 ├── src/
 │    ├── api/                 # Axios 인스턴스 및 엔드포인트 함수
 │    │    ├── client.ts       # Base Axios (JWT 헤더 인터셉터 포함)
 │    │    ├── goalApi.ts      # 목표 CRUD API 호출
 │    │    ├── mateApi.ts      # 메이트 상태 및 찌르기 API 호출
 │    │    └── authApi.ts
 │    │
 │    ├── components/
 │    │    ├── layout/
 │    │    │    ├── Header.tsx         # 날짜, 프로필, SSE 알림 벨
 │    │    │    └── TabNavigation.tsx  # [내 대시보드] ↔ [메이트 감시소] 탭
 │    │    ├── dashboard/             # 내 대시보드 뷰
 │    │    │    ├── ProgressSummary.tsx
 │    │    │    ├── WeeklyGoalList.tsx
 │    │    │    └── DailyTodoList.tsx
 │    │    ├── mate/                  # 메이트 감시소 뷰
 │    │    │    ├── MateTodoList.tsx   # 찌르기 버튼이 포함된 목록
 │    │    │    ├── PokeModal.tsx      # 찌르기 메시지 프리셋 팝업
 │    │    │    └── VerificationModal.tsx # 인증 확인 및 승인/반려
 │    │    └── ui/                    # Button, Input, Modal, Badge, Toast
 │    │
 │    ├── hooks/
 │    │    ├── useGoals.ts            # TanStack Query 기반 목표 상태 관리
 │    │    ├── usePoke.ts             # 찌르기 Mutation
 │    │    └── useSse.ts              # SSE 알림 구독 및 토스트 트리거
 │    │
 │    ├── types/                      # TypeScript Interface 정의
 │    │    └── index.ts
 │    ├── App.tsx                     # 탭 상태(activeTab) 기반 메인 컨테이너
 │    └── main.tsx


 backend/src/main/java/com/keeponme/
 ├── domain/
 │    ├── user/              # User 엔티티, Controller, Service, Repository
 │    ├── mate/              # MateCouple 엔티티, 매칭 로직
 │    ├── goal/              # Goal 엔티티, 상태 토글 및 계산 로직
 │    ├── verification/      # 인증 업로드 및 메이트 검수 로직
 │    └── poke/              # 찌르기 이벤트 처리 및 SSE 푸시 트리거
 │
 ├── global/
 │    ├── config/            # SecurityConfig, SseConfig, CorsConfig
 │    ├── jwt/               # JwtTokenProvider, JwtAuthenticationFilter
 │    ├── sse/               # SseEmitterRepository, SseNotificationService
 │    └── error/             # GlobalExceptionHandler, CustomException
 └── KeepOnMeApplication.java
```
