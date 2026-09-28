# KeepOnMe Java/Spring 학습 정리

이 문서는 KeepOnMe 프로젝트의 실제 코드를 읽으며 Java와 Spring의 어노테이션을 이해하기 위한 학습 기록이다.

## 1. 어노테이션이란?

어노테이션은 클래스, 메서드, 필드 등에 붙여서 해당 코드를 어떻게 처리할지 알려주는 표시다.

어노테이션 자체가 모든 일을 직접 실행하는 것은 아니다. 다음과 같은 도구들이 어노테이션을 읽고 필요한 동작을 수행한다.

| 읽는 주체 | 대표 어노테이션 | 역할 |
| --- | --- | --- |
| Java 컴파일러 | `@Override` | 문법과 상속 관계 확인 |
| Spring | `@Service`, `@RestController` | 객체를 만들고 관리하거나 HTTP 요청과 연결 |
| JPA/Hibernate | `@Entity`, `@Column` | Java 객체와 DB 테이블 연결 |
| Lombok | `@Getter`, `@Builder` | 반복적인 Java 코드 자동 생성 |
| Bean Validation | `@NotBlank`, `@Size` | 요청 데이터 검증 |

어노테이션을 볼 때는 다음 세 가지를 질문한다.

1. 이 어노테이션은 누가 읽는가?
2. 이 어노테이션이 없다면 어떤 기능이 사라지는가?
3. 이 클래스나 메서드가 맡는 책임은 무엇인가?

## 2. Goal 조회 흐름

현재 프로젝트의 Goal 조회는 다음 순서로 실행된다.

```text
DashboardTab
  → useGoals
  → goalApi.getGoals()
  → GET /api/goals
  → GoalController.getGoals()
  → GoalService.getGoals()
  → GoalRepository.findAllByUserAndTypeAndTargetDate()
  → Goal Entity
  → goals 테이블
```

관련 파일:

- `frontend/src/App.tsx`
- `frontend/src/hooks/useGoals.ts`
- `frontend/src/api/goalApi.ts`
- `backend/src/main/java/com/keeponme/domain/goal/GoalController.java`
- `backend/src/main/java/com/keeponme/domain/goal/GoalService.java`
- `backend/src/main/java/com/keeponme/domain/goal/GoalRepository.java`
- `backend/src/main/java/com/keeponme/domain/goal/Goal.java`

### Controller

HTTP 요청을 받고 파라미터를 해석한 뒤 Service를 호출한다.

### Service

날짜 계산, 사용자 권한 확인, Repository 호출, 응답 조립 같은 비즈니스 로직을 담당한다.

### Repository

DB 조회와 저장을 담당한다. Spring Data JPA에서는 메서드 이름으로 조회 조건을 표현할 수 있다.

### Entity

DB 테이블의 데이터를 Java 객체로 표현한다.

## 3. Spring Boot 시작과 객체 관리

### `@SpringBootApplication`

```java
@SpringBootApplication
public class KeepOnMeApplication {
}
```

Spring Boot 애플리케이션의 시작점이다. Component Scan, 자동 설정, Spring Boot 설정을 함께 활성화한다.

### `@Service`

```java
@Service
public class GoalService {
}
```

비즈니스 로직을 담당하는 클래스를 Spring Bean으로 등록한다. Spring이 객체를 생성하고 관리하므로 다른 Bean에 주입할 수 있다.

### `@Component`

일반적인 Spring 관리 객체를 등록한다. 프로젝트에서는 `SseEmitters`, `InviteCodeGenerator`, `AuthUserArgumentResolver` 등에 사용한다.

### `@Configuration`

Spring 설정을 담은 클래스임을 나타낸다. `SecurityConfig`, `WebConfig`, `CorsConfig` 등에 사용된다.

### `@Bean`

설정 클래스의 메서드가 반환하는 객체를 Spring Bean으로 등록한다.

```java
@Bean
public SecurityFilterChain securityFilterChain(...) {
    // Spring Security 설정 객체 반환
}
```

## 4. Controller와 HTTP 요청

### `@RestController`

클래스가 REST API Controller임을 나타낸다. 메서드의 반환값을 일반적으로 JSON 응답으로 변환한다.

### `@RequestMapping`

Controller 또는 메서드의 공통 URL 경로를 지정한다.

```java
@RequestMapping("/api/goals")
public class GoalController {
}
```

이 Controller의 메서드는 `/api/goals`를 기준으로 동작한다.

### HTTP 매핑 어노테이션

| 어노테이션 | HTTP 메서드 | 예시 |
| --- | --- | --- |
| `@GetMapping` | GET | 목표 조회 |
| `@PostMapping` | POST | 목표 생성 |
| `@PatchMapping` | PATCH | 목표 상태 변경 |
| `@DeleteMapping` | DELETE | 목표 삭제 |

### `@RequestParam`

URL의 쿼리 파라미터를 받는다.

```java
@RequestParam(required = false) Long userId
```

다음 요청의 `userId=3`을 `Long userId`로 변환한다.

```text
GET /api/goals?userId=3
```

### `@PathVariable`

URL 경로에 포함된 값을 받는다.

```java
@PatchMapping("/{id}/status")
public GoalResponse toggleStatus(@PathVariable Long id) {
}
```

```text
PATCH /api/goals/10/status
```

위 요청의 `10`이 `id`에 들어간다.

### `@RequestBody`

HTTP 요청 JSON을 Java 객체로 변환한다.

```java
@RequestBody GoalCreateRequest request
```

### `@Valid`

Request DTO에 작성한 검증 규칙을 실제로 실행한다.

```java
public ResponseEntity<GoalResponse> create(
        @Valid @RequestBody GoalCreateRequest request
) {
}
```

`@Valid`가 없으면 DTO에 붙은 `@NotBlank`, `@Size` 등의 검증이 자동으로 실행되지 않는다.

## 5. 의존성 주입

### `@RequiredArgsConstructor`

Lombok이 `final` 필드를 매개변수로 받는 생성자를 자동으로 만든다.

```java
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;
}
```

컴파일 시 다음과 비슷한 생성자가 만들어진다.

```java
public GoalController(GoalService goalService) {
    this.goalService = goalService;
}
```

Spring은 이 생성자를 이용해 `GoalService` 객체를 넣어준다. 이것이 생성자 주입이다.

## 6. Service와 Transaction

### `@Transactional`

메서드를 하나의 DB 작업 단위로 실행한다. 작업 도중 예외가 발생하면 변경 내용을 되돌릴 수 있다.

### `@Transactional(readOnly = true)`

조회 전용 트랜잭션임을 나타낸다.

현재 `GoalService`에는 클래스 수준에서 다음이 선언되어 있다.

```java
@Transactional(readOnly = true)
public class GoalService {
}
```

따라서 기본적으로 모든 메서드는 조회 전용이다. 생성, 수정, 삭제 메서드는 별도로 `@Transactional`을 붙여 변경 가능하게 한다.

```java
@Transactional
public GoalResponse create(...) {
}
```

기억할 규칙:

```text
조회 → @Transactional(readOnly = true)
생성/수정/삭제 → @Transactional
```

## 7. JPA Entity와 DB 매핑

### `@Entity`

Java 클래스를 JPA가 관리하는 Entity로 등록한다. Entity는 DB 테이블의 행을 Java 객체로 표현한다.

### `@Table`

매핑할 테이블 이름을 지정한다.

```java
@Entity
@Table(name = "goals")
public class Goal {
}
```

### `@Id`

Entity의 기본 키를 나타낸다.

### `@GeneratedValue`

ID를 DB에서 자동으로 생성하도록 설정한다.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### `@Column`

컬럼 이름, null 허용 여부, 길이, unique 등의 제약조건을 설정한다.

```java
@Column(nullable = false, length = 200)
private String title;
```

### `@Enumerated(EnumType.STRING)`

Java Enum을 DB에 문자열로 저장한다.

```java
@Enumerated(EnumType.STRING)
private GoalType type;
```

`GoalType.DAILY`가 숫자 `0`이 아니라 문자열 `DAILY`로 저장된다.

### `@ManyToOne`

여러 Entity가 하나의 Entity에 속하는 관계를 나타낸다.

```java
@ManyToOne(fetch = FetchType.LAZY)
private User user;
```

여러 Goal이 한 User에 속한다는 뜻이다.

### `@OneToMany`

하나의 Entity가 여러 Entity를 가지는 관계를 나타낸다.

```java
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
private List<Mate> mates;
```

### `@JoinColumn`

외래 키로 사용할 컬럼을 지정한다.

```java
@JoinColumn(name = "user_id", nullable = false)
private User user;
```

### `FetchType.LAZY`

연관된 Entity를 즉시 조회하지 않고 실제로 사용할 때 조회한다. 불필요한 DB 조회를 줄이는 데 사용된다.

### `@Lob`

긴 문자열이나 큰 데이터를 저장하는 필드임을 나타낸다. Verification의 `comment` 필드에 사용된다.

## 8. Lombok

Lombok은 반복되는 Java 코드를 컴파일 시 자동으로 만들어준다.

| 어노테이션 | 생성하는 것 |
| --- | --- |
| `@Getter` | getter 메서드 |
| `@Builder` | Builder 패턴 |
| `@NoArgsConstructor` | 기본 생성자 |
| `@RequiredArgsConstructor` | final 필드 생성자 |
| `@Slf4j` | `log` 객체 |
| `@AccessLevel.PROTECTED` | 생성자 접근 수준을 protected로 설정 |

JPA Entity에는 보통 기본 생성자가 필요하므로 다음과 같이 사용한다.

```java
@NoArgsConstructor(access = AccessLevel.PROTECTED)
```

## 9. 입력값 검증

| 어노테이션 | 역할 |
| --- | --- |
| `@NotBlank` | null, 빈 문자열, 공백만 입력 금지 |
| `@NotNull` | null 금지 |
| `@Size` | 문자열이나 컬렉션 크기 제한 |
| `@Email` | 이메일 형식 검사 |
| `@Pattern` | 정규식 검사 |

예시:

```java
@NotBlank
@Size(max = 200)
String title
```

`title`은 비어 있으면 안 되고, 최대 200자까지 허용한다는 의미다.

검증은 다음 조합으로 동작한다.

```text
DTO의 검증 어노테이션
+ Controller의 @Valid
= 요청 데이터 자동 검증
```

## 10. 전역 예외 처리

### `@RestControllerAdvice`

모든 REST Controller에서 발생하는 예외를 한 곳에서 처리한다.

### `@ExceptionHandler`

특정 예외를 어떤 메서드가 처리할지 지정한다.

```java
@ExceptionHandler(CustomException.class)
public ResponseEntity<ErrorResponse> handleCustomException(...) {
}
```

Service에서 발생한 `CustomException`을 일관된 JSON 응답으로 변환할 수 있다.

## 11. 프로젝트에서 직접 만든 `@AuthUser`

```java
public GoalListResponse getGoals(@AuthUser User user) {
}
```

`@AuthUser`는 Spring 기본 어노테이션이 아니라 프로젝트에서 직접 만든 어노테이션이다.

동작 흐름:

```text
JWT에서 사용자 ID 확인
→ AuthUserArgumentResolver 실행
→ UserRepository로 User 조회
→ Controller 파라미터에 User 주입
```

관련 파일:

- `backend/src/main/java/com/keeponme/global/jwt/AuthUser.java`
- `backend/src/main/java/com/keeponme/global/jwt/AuthUserArgumentResolver.java`
- `backend/src/main/java/com/keeponme/global/config/WebConfig.java`

## 12. 기타 Java/Spring 어노테이션

| 어노테이션 | 역할 |
| --- | --- |
| `@Override` | 부모 클래스나 인터페이스 메서드를 재정의했음을 표시 |
| `@EnableWebSecurity` | Spring Security 웹 보안 활성화 |
| `@EnableJpaAuditing` | `@CreatedDate` 같은 JPA 감사 기능 활성화 |
| `@EntityListeners` | Entity 이벤트를 감지할 리스너 지정 |
| `@CreatedDate` | Entity 생성 시각 자동 기록 |
| `@Value` | application 설정값 주입 |
| `@PostConstruct` | Bean 초기화가 끝난 뒤 한 번 실행 |
| `@Slf4j` | 로깅 객체 자동 생성 |

## 13. 첫 번째 학습 문제와 답변

### 문제 1

`GET /api/goals` 요청이 들어온 뒤 어떤 순서로 클래스와 메서드를 거치는가?

### 답변

```text
DashboardTab
→ useGoals
→ goalApi.getGoals
→ GoalController.getGoals
→ GoalService.getGoals
→ GoalRepository.findAllByUserAndTypeAndTargetDate
→ Goal Entity
→ goals 테이블
```

Frontend는 화면과 API 호출을 담당하고, Backend의 Controller가 요청을 받은 뒤 Service와 Repository를 거쳐 DB를 조회한다.

### 문제 2

`GoalController`가 `GoalRepository`를 직접 호출하지 않고 `GoalService`를 호출하는 이유는 무엇인가?

### 답변

Controller는 HTTP 요청과 응답을 담당하고, 날짜 계산·메이트 권한 검사·목표 조회 같은 비즈니스 로직은 Service가 담당해야 하기 때문이다.

이렇게 계층을 나누면:

- 각 클래스의 책임이 명확해진다.
- Service를 Controller 없이 테스트할 수 있다.
- 비즈니스 로직을 다른 API에서도 재사용할 수 있다.
- Controller가 복잡해지는 것을 막을 수 있다.

### 문제 3

`findAllByUserAndTypeAndTargetDate` 메서드 이름을 조건별로 설명하라.

### 답변

Spring Data JPA의 Query Method다.

```text
findAllBy
→ 여러 건 조회

User
→ user 필드가 같은 조건

AndType
→ type 필드가 같은 조건

AndTargetDate
→ targetDate 필드가 같은 조건
```

결과적으로 특정 사용자이면서, 특정 목표 종류이고, 특정 날짜인 Goal을 여러 건 조회한다.

### 문제 4

다른 사용자의 Goal을 조회할 때 어떤 권한 검사를 수행하는가?

### 답변

`GoalService.resolveTargetUser`가 조회 대상 User를 찾은 뒤, 현재 사용자와 대상 사용자가 `CONNECTED` 상태의 메이트인지 확인한다.

연결된 메이트가 아니면 다음 예외를 발생시킨다.

```text
NOT_A_MATE
연결된 메이트의 목표만 조회할 수 있습니다.
```

## 14. 어노테이션 학습 문제와 답변

### 문제 5

`@Service`가 없다면 `GoalService`는 어떻게 되는가?

### 답변

Spring이 `GoalService`를 자동으로 Bean으로 등록하지 않는다. 따라서 `GoalController`가 생성자 주입을 받을 때 필요한 `GoalService`를 찾지 못해 애플리케이션이 시작되지 않는다.

### 문제 6

`@Entity`가 없다면 `Goal` 클래스는 DB와 어떻게 달라지는가?

### 답변

일반 Java 클래스일 뿐이며 JPA가 관리하지 않는다. `goals` 테이블과 자동으로 매핑되지 않고, Repository를 통해 조회하거나 저장할 수도 없다.

### 문제 7

`@Valid`가 없다면 DTO의 `@NotBlank`는 실행되는가?

### 답변

Controller 파라미터에 `@Valid`가 없으면 해당 요청을 받을 때 Bean Validation이 자동으로 실행되지 않는다. DTO에 검증 어노테이션이 있어도 Controller에서 검증을 시작하라는 표시가 필요하다.

### 문제 8

`@Transactional(readOnly = true)`를 클래스에 붙이고 특정 메서드에 `@Transactional`을 다시 붙인 이유는 무엇인가?

### 답변

Service의 기본 동작을 조회 전용으로 설정하고, 생성·수정·삭제 메서드에만 데이터 변경이 가능한 트랜잭션을 적용하기 위해서다.

## 15. 앞으로의 학습 순서

현재는 어노테이션의 의미를 Goal 기능과 연결해서 이해하는 단계다.

추천 순서:

1. Goal 조회 흐름 설명
2. Controller와 Service의 책임 구분
3. `@RequestBody`, `@Valid`, DTO 학습
4. `@Entity`, `@Id`, `@Column` 학습
5. `@ManyToOne`, `@JoinColumn` 학습
6. `@Transactional` 학습
7. GoalService 테스트 작성
8. VerificationService 구현
9. Verification Controller와 API 구현
10. 입력값 검증과 예외 처리 강화

학습은 다음 사이클로 진행한다.

```text
기능 사용
→ 개발자 탭에서 흐름 확인
→ 관련 소스코드 읽기
→ 학습 탭 질문에 답하기
→ 작은 코드 수정
→ 테스트 또는 직접 실행
→ 막힌 점과 배운 점 기록
```

## 16. 핵심 요약

```text
@RestController
→ HTTP 요청을 받는 클래스

@Service
→ 비즈니스 로직을 담당하는 클래스

@Repository / JpaRepository
→ DB 접근

@Entity
→ DB 테이블과 연결되는 Java 객체

@Transactional
→ DB 작업의 경계 설정

@Valid
→ 요청값 검증 실행

@RequiredArgsConstructor
→ 생성자 자동 생성과 의존성 주입 지원
```

어노테이션은 따로 외우기보다 “누가 읽고, 어떤 동작을 추가하는가?”를 기준으로 코드를 읽는다.
