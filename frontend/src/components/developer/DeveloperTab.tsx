import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

const flow = [
  {
    layer: '화면',
    name: 'DashboardTab → useGoals',
    description: '선택한 날짜를 기준으로 Goal 조회 Hook을 호출합니다.',
    concept: 'React Component, Custom Hook',
  },
  {
    layer: 'API',
    name: 'GET /api/goals',
    description: 'Axios가 JWT와 조회 조건(targetDate, userId, dayOfWeek)을 함께 전송합니다.',
    concept: 'HTTP, TypeScript type',
  },
  {
    layer: 'Controller',
    name: 'GoalController.getGoals()',
    description: '요청 파라미터와 인증 사용자를 받아 GoalService에 전달합니다.',
    concept: '@RestController, @RequestParam',
  },
  {
    layer: 'Service',
    name: 'GoalService.getGoals()',
    description: '조회 대상, 주간 시작일, 일간/주간 목표와 달성률을 계산합니다.',
    concept: 'Business Logic, Transaction',
  },
  {
    layer: 'Repository',
    name: 'GoalRepository.findAllByUserAndTypeAndTargetDate()',
    description: '사용자, 목표 종류, 기준 날짜 조건으로 DB 조회를 요청합니다.',
    concept: 'Spring Data JPA Query Method',
  },
  {
    layer: 'Entity / DB',
    name: 'Goal → goals 테이블',
    description: 'JPA Entity가 goals 테이블의 행을 객체로 표현합니다.',
    concept: '@Entity, @ManyToOne, Enum',
  },
]

export function DeveloperTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl">🧭</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">개발자 모드</h1>
              <Badge tone="indigo">첫 번째 해부 대상</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              현재 사이트의 Goal 조회 기능이 화면에서 DB까지 어떻게 흐르는지 정리한 공간입니다.
            </p>
          </div>
        </div>
      </Card>

      <Card as="section">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Goal 조회 흐름</h2>
            <p className="mt-1 text-sm text-gray-500">화면에서 요청을 시작해 Entity까지 내려가는 순서입니다.</p>
          </div>
          <Badge tone="emerald">현재 코드 기준</Badge>
        </div>

        <ol className="flex flex-col gap-3">
          {flow.map((step, index) => (
            <li key={step.layer} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{step.layer}</Badge>
                  <code className="break-all text-sm font-medium text-gray-800">{step.name}</code>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
                <p className="mt-1 text-xs text-indigo-600">공부할 개념: {step.concept}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card as="section">
          <h2 className="text-base font-semibold text-gray-900">내가 이해한 동작</h2>
          <p className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
            선택한 날짜의 주간 시작일을 계산한 뒤, 일간 목표와 주간 목표를 각각 조회하고 응답 DTO로 변환합니다.
          </p>
        </Card>

        <Card as="section">
          <h2 className="text-base font-semibold text-gray-900">아직 이해하지 못한 부분</h2>
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            다음 단계에서 이 영역을 입력 가능한 학습 메모로 바꾸고, 직접 확인한 내용을 기록합니다.
          </p>
        </Card>
      </div>
    </div>
  )
}
