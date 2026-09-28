import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

interface Question {
  id: number
  prompt: string
  hint: string
  answer: string
  relatedFiles: string[]
}

const STORAGE_KEY = 'keeponme-learning-goal-answers'

const questions: Question[] = [
  {
    id: 1,
    prompt: 'GET /api/goals 요청이 들어온 뒤 어떤 순서로 클래스와 메서드를 거치는지 작성하세요.',
    hint: '화면에서 API를 호출하는 부분부터 시작해보세요.',
    answer: 'DashboardTab → useGoals → goalApi.getGoals → GoalController.getGoals → GoalService.getGoals → GoalRepository.findAllByUserAndTypeAndTargetDate → Goal Entity 순서입니다.',
    relatedFiles: ['App.tsx', 'useGoals.ts', 'goalApi.ts', 'GoalController.java', 'GoalService.java'],
  },
  {
    id: 2,
    prompt: 'GoalController가 GoalRepository를 직접 호출하지 않고 GoalService를 호출하는 이유는 무엇인가요?',
    hint: 'HTTP 요청 처리와 비즈니스 규칙의 책임을 나누어 생각해보세요.',
    answer: 'Controller는 요청과 응답을 담당하고, 날짜 계산·메이트 권한 검사·목표 조회 같은 비즈니스 로직은 Service가 담당하기 때문입니다. 이렇게 책임을 나누면 각 계층을 독립적으로 테스트하고 변경하기 쉬워집니다.',
    relatedFiles: ['GoalController.java', 'GoalService.java'],
  },
  {
    id: 3,
    prompt: 'findAllByUserAndTypeAndTargetDate 메서드 이름을 조건별로 분해해 설명하세요.',
    hint: 'findAllBy 뒤에 나오는 단어들이 Entity의 어떤 필드와 연결되는지 찾아보세요.',
    answer: 'User가 같은 데이터 중에서 Type과 TargetDate가 모두 일치하는 Goal을 여러 건 조회한다는 뜻입니다. Spring Data JPA가 메서드 이름을 분석해 쿼리를 생성합니다.',
    relatedFiles: ['GoalRepository.java', 'Goal.java'],
  },
  {
    id: 4,
    prompt: '다른 사용자의 Goal을 조회할 때 GoalService에서 어떤 권한 검사를 수행하나요?',
    hint: 'resolveTargetUser 메서드와 MateRepository를 확인해보세요.',
    answer: '조회 대상 사용자를 찾은 뒤, 현재 사용자와 연결 상태가 CONNECTED인 메이트인지 확인합니다. 연결된 메이트가 아니면 NOT_A_MATE 예외를 발생시킵니다.',
    relatedFiles: ['GoalService.java', 'MateRepository.java', 'MateStatus.java'],
  },
]

function loadAnswers(): Record<number, string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export function LearningTab() {
  const [answers, setAnswers] = useState<Record<number, string>>(loadAnswers)
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})

  const updateAnswer = (questionId: number, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value }
    setAnswers(nextAnswers)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers))
  }

  const submitAnswer = (questionId: number) => {
    setSubmitted((current) => ({ ...current, [questionId]: true }))
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl">📚</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">학습 미션</h1>
              <Badge tone="amber">Mission 1</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">Goal 조회 흐름을 직접 설명하며 Controller와 Service의 역할을 익혀보세요.</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
          먼저 <strong>개발자</strong> 탭에서 흐름을 확인하고, 아래 질문에 자신의 말로 답해보세요. 답변은 이 브라우저에 자동 저장됩니다.
        </div>
      </Card>

      {questions.map((question) => {
        const isSubmitted = submitted[question.id]
        return (
          <Card as="section" key={question.id}>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {question.id}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold leading-6 text-gray-900">{question.prompt}</h2>
                <p className="mt-2 text-xs text-gray-500">힌트: {question.hint}</p>

                <textarea
                  value={answers[question.id] ?? ''}
                  onChange={(event) => updateAnswer(question.id, event.target.value)}
                  placeholder="내가 이해한 내용을 작성해보세요."
                  rows={4}
                  className="mt-4 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => submitAnswer(question.id)}
                    disabled={!answers[question.id]?.trim()}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    답변 제출
                  </button>
                  <Badge tone={isSubmitted ? 'emerald' : 'neutral'}>{isSubmitted ? '제출 완료' : '작성 중'}</Badge>
                </div>

                {isSubmitted && (
                  <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">모범 설명</p>
                      <p className="mt-1 text-sm leading-6 text-emerald-900">{question.answer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">관련 파일</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {question.relatedFiles.map((file) => (
                          <Badge key={file}>{file}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
