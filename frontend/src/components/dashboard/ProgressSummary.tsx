import { Flame, Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface ProgressSummaryProps {
  dailyAchievementRate: number
  weeklyAchievementRate: number
}

interface StatTileProps {
  label: string
  rate: number
  tone: 'indigo' | 'emerald'
  icon: typeof Flame
}

const TONE_STYLES = {
  indigo: { bar: 'bg-indigo-500', iconBg: 'bg-indigo-50', iconText: 'text-indigo-600' },
  emerald: { bar: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
} as const

function StatTile({ label, rate, tone, icon: Icon }: StatTileProps) {
  const styles = TONE_STYLES[tone]
  const clamped = Math.min(100, Math.max(0, rate))

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}>
          <Icon size={16} />
        </span>
        <Badge tone={tone}>{clamped}%</Badge>
      </div>
      <span className="break-keep text-sm text-gray-500">{label}</span>
      <div className="text-3xl font-semibold tracking-tight text-gray-900">{clamped}%</div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </Card>
  )
}

export function ProgressSummary({ dailyAchievementRate, weeklyAchievementRate }: ProgressSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatTile label="오늘의 달성률" rate={dailyAchievementRate} tone="indigo" icon={Target} />
      <StatTile label="이번 주 달성률" rate={weeklyAchievementRate} tone="emerald" icon={Flame} />
    </div>
  )
}
