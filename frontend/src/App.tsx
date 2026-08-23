import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { AuthModal } from './components/auth/AuthModal'
import { Header } from './components/layout/Header'
import { TabNavigation, type Tab } from './components/layout/TabNavigation'
import { ProgressSummary } from './components/dashboard/ProgressSummary'
import { WeeklyGoalList } from './components/dashboard/WeeklyGoalList'
import { DailyTodoList } from './components/dashboard/DailyTodoList'
import { WeekNavigator } from './components/calendar/WeekNavigator'
import { MateTodoList } from './components/mate/MateTodoList'
import { MateSelector } from './components/mate/MateSelector'
import { MateConnectModal } from './components/mate/MateConnectModal'
import { Card } from './components/ui/Card'
import { Button } from './components/ui/Button'
import { Toast } from './components/ui/Toast'
import { useGoals, useCreateGoal, useToggleGoal, useDeleteGoal } from './hooks/useGoals'
import { useMyMates } from './hooks/useMate'
import { useSse } from './hooks/useSse'
import { useToast } from './hooks/useToast'
import { todayISO, todayLabel, weekDayOf, formatDateLabel } from './lib/date'
import { notifyBrowser } from './lib/notify'
import type { Poke } from './types'

function LandingScreen() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
          🎯
        </span>
        <h1 className="text-2xl font-semibold text-gray-900">KeepOnMe</h1>
        <p className="mt-2 text-sm text-gray-500">메이트와 함께하는 선한 감시, 목표 달성 체크</p>
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          시작하기
        </button>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

interface DateScopedTabProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

function DashboardTab({ selectedDate, onSelectDate }: DateScopedTabProps) {
  const { data, isLoading } = useGoals({ targetDate: selectedDate })
  const createGoal = useCreateGoal()
  const toggleGoal = useToggleGoal()
  const deleteGoal = useDeleteGoal()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <Card>
          <WeekNavigator selectedDate={selectedDate} onSelectDate={onSelectDate} />
        </Card>
      </div>

      <div className="lg:col-span-12">
        <ProgressSummary
          dailyAchievementRate={data?.dailyAchievementRate ?? 0}
          weeklyAchievementRate={data?.weeklyAchievementRate ?? 0}
        />
      </div>

      <div className="lg:col-span-5">
        <WeeklyGoalList
          goals={data?.weekly ?? []}
          isAdding={createGoal.isPending}
          onAdd={(title) => createGoal.mutate({ type: 'WEEKLY', title, targetDate: selectedDate })}
          onToggle={(id) => toggleGoal.mutate(id)}
          onDelete={(id) => deleteGoal.mutate(id)}
        />
      </div>

      <div className="lg:col-span-7">
        <DailyTodoList
          goals={data?.daily ?? []}
          dayLabel={formatDateLabel(selectedDate)}
          isAdding={createGoal.isPending || isLoading}
          onAdd={(title) =>
            createGoal.mutate({
              type: 'DAILY',
              title,
              targetDate: selectedDate,
              dayOfWeek: weekDayOf(selectedDate),
            })
          }
          onToggle={(id) => toggleGoal.mutate(id)}
          onDelete={(id) => deleteGoal.mutate(id)}
        />
      </div>
    </div>
  )
}

function MateTab({ selectedDate, onSelectDate }: DateScopedTabProps) {
  const { data: mates, isLoading: matesLoading, isError: matesError } = useMyMates()
  const [selectedMateId, setSelectedMateId] = useState<number | null>(null)
  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    if (!mates) return
    if (selectedMateId !== null && mates.some((mate) => mate.mateUserId === selectedMateId)) return
    setSelectedMateId(mates[0]?.mateUserId ?? null)
  }, [mates, selectedMateId])

  const selectedMate = mates?.find((mate) => mate.mateUserId === selectedMateId) ?? null

  const { data: mateGoals, isLoading } = useGoals(
    { targetDate: selectedDate, userId: selectedMateId ?? undefined },
    { enabled: !!selectedMateId },
  )

  if (matesLoading) {
    return <p className="py-14 text-center text-sm text-gray-400">불러오는 중...</p>
  }

  if (matesError || !mates) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed py-14 text-center shadow-none">
        <p className="text-sm text-rose-500">메이트 목록을 불러오지 못했어요. 새로고침 후 다시 시도해주세요.</p>
      </Card>
    )
  }

  if (mates.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed py-14 text-center shadow-none">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Users size={22} />
        </span>
        <p className="text-sm text-gray-500">아직 연결된 메이트가 없어요.</p>
        <Button onClick={() => setShowConnectModal(true)}>초대 코드로 메이트 연결하기</Button>
        {showConnectModal && <MateConnectModal onClose={() => setShowConnectModal(false)} />}
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <WeekNavigator selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </Card>
      <MateSelector mates={mates} selectedMateId={selectedMateId} onSelect={setSelectedMateId} />
      {selectedMate && (
        <MateTodoList
          mate={selectedMate}
          mateGoals={mateGoals?.daily ?? []}
          achievementRate={mateGoals?.dailyAchievementRate ?? 0}
          dayLabel={formatDateLabel(selectedDate)}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const { data: mates } = useMyMates()
  const queryClient = useQueryClient()
  const { message, showToast } = useToast()

  useSse((poke: Poke) => {
    queryClient.invalidateQueries({ queryKey: ['pokes'] })
    showToast(`${poke.senderNickname}님이 찔렀어요 👉`)
    notifyBrowser('KeepOnMe', `${poke.senderNickname}님이 찔렀어요 👉`)
  })

  return (
    <div className="min-h-svh bg-gray-50">
      <div className="mx-auto flex min-h-svh max-w-5xl flex-col">
        <Header />
        <div className="flex justify-center px-6 pt-4 sm:hidden">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-gray-500">
            {todayLabel()}
          </span>
        </div>
        <TabNavigation activeTab={activeTab} onChange={setActiveTab} mateConnected={(mates?.length ?? 0) > 0} />
        <main className="flex-1 px-6 py-6">
          {activeTab === 'dashboard' ? (
            <DashboardTab selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          ) : (
            <MateTab selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          )}
        </main>
      </div>
      {message && <Toast message={message} />}
    </div>
  )
}

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gray-50 text-sm text-gray-400">
        불러오는 중...
      </div>
    )
  }

  return user ? <AuthenticatedApp /> : <LandingScreen />
}

export default App
