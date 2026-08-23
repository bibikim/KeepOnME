import { Check, Trash2 } from 'lucide-react'
import type { Goal } from '../../types'
import { Badge } from '../ui/Badge'

interface GoalListItemProps {
  goal: Goal
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function GoalListItem({ goal, onToggle, onDelete }: GoalListItemProps) {
  const done = goal.status !== 'PENDING'
  const verified = goal.status === 'VERIFIED'

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-gray-100 px-3.5 py-3 transition-colors hover:border-gray-200 hover:bg-gray-50/60">
      <button
        type="button"
        onClick={() => onToggle(goal.id)}
        aria-pressed={done}
        aria-label={done ? '완료 취소' : '완료 처리'}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          done ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white hover:border-indigo-400'
        }`}
      >
        <Check
          size={12}
          strokeWidth={3}
          className={`text-white transition-all duration-200 ${done ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        />
      </button>

      <span className={`flex-1 text-sm transition-colors ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
        {goal.title}
      </span>

      {verified && <Badge tone="indigo">인증완료</Badge>}
      {done && !verified && <Badge tone="emerald">완료</Badge>}

      <button
        type="button"
        onClick={() => onDelete(goal.id)}
        className="text-gray-300 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
        aria-label="삭제"
      >
        <Trash2 size={16} />
      </button>
    </li>
  )
}
