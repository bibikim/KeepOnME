import { Hand } from 'lucide-react'
import type { Goal, Mate } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Toast } from '../ui/Toast'
import { useSendPoke } from '../../hooks/usePoke'
import { useToast } from '../../hooks/useToast'

interface MateTodoListProps {
  mate: Mate
  mateGoals: Goal[]
  achievementRate: number
  dayLabel: string
  isLoading: boolean
}

export function MateTodoList({ mate, mateGoals, achievementRate, dayLabel, isLoading }: MateTodoListProps) {
  const sendPoke = useSendPoke()
  const { message, showToast } = useToast()

  const handlePoke = async () => {
    try {
      await sendPoke.mutateAsync(mate.mateUserId)
      showToast(`${mate.nickname}님을 찔렀어요 👉`)
    } catch {
      showToast('찌르기에 실패했습니다.')
    }
  }

  return (
    <Card as="section">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
          🕵️ {mate.nickname}님의 {dayLabel}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <Badge tone="indigo">{achievementRate}%</Badge>
          <button
            type="button"
            onClick={handlePoke}
            disabled={sendPoke.isPending}
            className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
          >
            <Hand size={12} />
            찌르기
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {mateGoals.length === 0 && (
            <li className="py-8 text-center text-sm text-gray-400">{dayLabel} 등록된 할 일이 없어요.</li>
          )}
          {mateGoals.map((goal) => {
            const done = goal.status !== 'PENDING'
            return (
              <li
                key={goal.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 px-3.5 py-3"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full transition-colors ${done ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={`flex-1 text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {goal.title}
                </span>
                {done && <Badge tone="emerald">완료</Badge>}
              </li>
            )
          })}
        </ul>
      )}

      {message && <Toast message={message} />}
    </Card>
  )
}
