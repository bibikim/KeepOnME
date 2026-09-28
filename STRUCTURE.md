# 📂 KeepOnMe - Directory Structure & Implementation Guide

> 이 문서는 실제 코드 구조를 반영해 갱신됨 (2026-09-20). 최신 상태의 단일 소스는 `CLAUDE.md`이며, 이 문서는 그 구조를 트리 형태로 보기 쉽게 정리한 것.

## 1. Frontend 구조 (`frontend/`) - Vite + React (TypeScript)

```text
frontend/
 └── src/
      ├── api/                        # Axios 인스턴스 및 엔드포인트 함수
      │    ├── client.ts              # Base Axios (JWT 헤더 인터셉터 포함)
      │    ├── authApi.ts
      │    ├── goalApi.ts             # 목표 CRUD API 호출
      │    ├── mateApi.ts             # 메이트 연결/목록 API 호출
      │    └── pokeApi.ts             # 찌르기 전송/조회/읽음처리 API 호출
      │
      ├── components/
      │    ├── auth/
      │    │    └── AuthModal.tsx           # 로그인/회원가입 모달
      │    ├── calendar/
      │    │    ├── WeekdayTabs.tsx         # 요일 탭
      │    │    ├── WeekNavigator.tsx       # 주차 이동(</>)
      │    │    └── DatePickerModal.tsx     # 자체 제작 미니 달력
      │    ├── dashboard/                   # 내 대시보드 뷰
      │    │    ├── ProgressSummary.tsx
      │    │    ├── WeeklyGoalList.tsx
      │    │    ├── DailyTodoList.tsx
      │    │    └── GoalListItem.tsx
      │    ├── mate/                        # 메이트 감시소 뷰
      │    │    ├── MateSelector.tsx        # 연결된 메이트 선택 탭
      │    │    ├── MateConnectModal.tsx    # 초대코드로 메이트 연결
      │    │    ├── MateListModal.tsx       # 메이트 목록/연결 끊기 관리
      │    │    └── MateTodoList.tsx        # 찌르기 버튼이 포함된 목록
      │    ├── layout/
      │    │    ├── Header.tsx              # 날짜, 프로필, 알림 벨
      │    │    ├── TabNavigation.tsx       # [내 대시보드] ↔ [메이트 감시소] 탭
      │    │    ├── InviteCodeModal.tsx     # 내 초대코드 확인/복사
      │    │    └── NotificationBell.tsx    # 안읽음 뱃지 + 알림 목록
      │    └── ui/                          # 공용 프리미티브 (createPortal 렌더링)
      │         ├── Card.tsx
      │         ├── Badge.tsx
      │         ├── Button.tsx
      │         ├── Modal.tsx
      │         └── Toast.tsx
      │
      ├── context/
      │    └── AuthContext.tsx         # 로그인 상태, 토큰 localStorage 저장
      │
      ├── hooks/
      │    ├── useGoals.ts             # TanStack Query 기반 목표 상태 관리
      │    ├── useMate.ts              # 메이트 목록/연결/해제 Query & Mutation
      │    ├── usePoke.ts              # 찌르기 Query & Mutation
      │    ├── useSse.ts               # SSE 알림 구독 및 토스트 트리거
      │    └── useToast.ts             # 토스트 상태 (컴포넌트별 개별 상태)
      │
      ├── lib/
      │    ├── date.ts                 # 날짜 계산 유틸 (targetDate 산출 등)
      │    ├── clipboard.ts            # 초대코드 복사
      │    └── notify.ts               # 브라우저 Notification API 래퍼
      │
      ├── types/
      │    └── index.ts                # 백엔드 DTO와 1:1 대응하는 TS 타입
      │
      ├── App.tsx                      # 탭 상태(activeTab) 기반 메인 컨테이너
      ├── index.css                    # Tailwind v4 엔트리
      └── main.tsx
```

**참고**: `react-router-dom`은 설치돼 있으나 미사용 (라우팅 없이 `activeTab` 상태로 화면 전환). `components/mate/PokeModal.tsx`, `components/mate/VerificationModal.tsx`는 기획 문서(PRD)에는 있지만 **아직 구현되지 않음**.

---

## 2. Backend 구조 (`backend/`) - Spring Boot (Java 17, Maven)

```text
backend/src/main/java/com/keeponme/
 ├── domain/
 │    ├── user/
 │    │    ├── User.java                    # 엔티티
 │    │    ├── Role.java                    # USER/ADMIN (필드만 존재, 권한 분기 로직 없음)
 │    │    ├── UserRepository.java
 │    │    ├── AuthController.java          # 회원가입/로그인
 │    │    ├── AuthService.java
 │    │    ├── UserController.java          # 내 정보 조회 등
 │    │    ├── InviteCodeGenerator.java     # 6~8자리 랜덤 초대코드 생성
 │    │    ├── AdminAccountInitializer.java # admin 계정 최초 기동 시 자동 생성
 │    │    └── dto/
 │    │         ├── SignupRequest.java
 │    │         ├── LoginRequest.java
 │    │         ├── AuthResponse.java
 │    │         └── UserResponse.java
 │    │
 │    ├── goal/
 │    │    ├── Goal.java                    # targetDate가 단일 진실 소스, dayOfWeek는 파생 필드
 │    │    ├── GoalType.java                # DAILY/WEEKLY
 │    │    ├── GoalStatus.java
 │    │    ├── WeekDay.java
 │    │    ├── GoalAchievementCalculator.java # 일간/주간 달성률(%) 계산
 │    │    ├── GoalRepository.java
 │    │    ├── GoalController.java
 │    │    ├── GoalService.java
 │    │    └── dto/
 │    │         ├── GoalCreateRequest.java
 │    │         ├── GoalListResponse.java
 │    │         └── GoalResponse.java
 │    │
 │    ├── mate/
 │    │    ├── Mate.java                    # "나→상대" 단방향 레코드 (1:N 다중 연결)
 │    │    ├── MateStatus.java              # CONNECTED
 │    │    ├── MateRepository.java
 │    │    ├── MateController.java
 │    │    ├── MateService.java
 │    │    └── dto/
 │    │         ├── MateConnectRequest.java
 │    │         └── MateSummaryResponse.java
 │    │
 │    ├── poke/
 │    │    ├── Poke.java
 │    │    ├── PokeStatus.java              # PENDING/READ
 │    │    ├── PokeRepository.java
 │    │    ├── PokeController.java
 │    │    ├── PokeService.java
 │    │    └── dto/
 │    │         ├── PokeSendRequest.java
 │    │         └── PokeResponse.java
 │    │
 │    └── verification/                     # ⚠️ 엔티티/레포지토리만 존재, Controller/Service·API 미구현
 │         ├── Verification.java
 │         ├── ReviewStatus.java
 │         └── VerificationRepository.java
 │
 ├── global/
 │    ├── common/
 │    │    └── BaseTimeEntity.java          # createdAt (JPA Auditing)
 │    ├── config/
 │    │    ├── SecurityConfig.java
 │    │    ├── CorsConfig.java              # ⚠️ ngrok 와일드카드 항상 포함, 정리 대상
 │    │    ├── WebConfig.java
 │    │    └── JpaAuditingConfig.java
 │    ├── jwt/
 │    │    ├── JwtTokenProvider.java
 │    │    ├── JwtAuthenticationFilter.java # /api/sse/connect에 한해 쿼리 파라미터 토큰 허용
 │    │    ├── JwtAuthenticationEntryPoint.java
 │    │    ├── AuthUser.java                # @AuthUser 커스텀 애너테이션
 │    │    └── AuthUserArgumentResolver.java
 │    ├── error/
 │    │    ├── CustomException.java
 │    │    ├── ErrorResponse.java
 │    │    └── GlobalExceptionHandler.java
 │    └── sse/
 │         ├── SseEmitters.java             # 유저별 다중 SseEmitter 관리
 │         ├── SseController.java           # GET /api/sse/connect
 │         └── NotificationService.java
 │
 └── KeepOnMeApplication.java
```

**참고**: `UserDetailsService`는 사용하지 않고 `@AuthUser` 리졸버로 인증 유저를 직접 주입 (섹션 5 참고, `CLAUDE.md`). 테스트 코드(JUnit)는 아직 없음.
