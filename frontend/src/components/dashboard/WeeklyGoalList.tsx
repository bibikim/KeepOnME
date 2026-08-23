import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { Goal } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { GoalListItem } from './GoalListItem'

interface WeeklyGoalListProps {
  goals: Goal[]
  onAdd: (title: string) => void
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  isAdding: boolean
}

export function WeeklyGoalList({ goals, onAdd, onToggle, onDelete, isAdding }: WeeklyGoalListProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <Card as="section">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">📌 이번 주 핵심 목표</h2>
        <Badge tone="indigo">주간</Badge>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="이번 주 핵심 목표를 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center justify-center rounded-xl bg-indigo-600 px-3.5 text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300"
        >
          <Plus size={16} />
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {goals.length === 0 && <li className="py-8 text-center text-sm text-gray-400">등록된 주간 목표가 없어요.</li>}
        {goals.map((goal) => (
          <GoalListItem key={goal.id} goal={goal} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </Card>
  )
}
