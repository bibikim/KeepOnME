import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { WeekdayTabs } from './WeekdayTabs'
import { DatePickerModal } from './DatePickerModal'
import { addDaysISO, formatWeekRangeLabel, mondayOf, todayISO, weekDatesFrom } from '../../lib/date'

interface WeekNavigatorProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function WeekNavigator({ selectedDate, onSelectDate }: WeekNavigatorProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const weekStart = mondayOf(selectedDate)
  const weekDates = weekDatesFrom(weekStart)
  const today = todayISO()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectDate(addDaysISO(selectedDate, -7))}
          className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="이전 주"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="flex-1 text-center text-sm font-medium text-gray-700">
          {formatWeekRangeLabel(weekStart)}
        </span>

        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="달력 열기"
        >
          <CalendarDays size={18} />
        </button>

        <button
          type="button"
          onClick={() => onSelectDate(addDaysISO(selectedDate, 7))}
          className="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="다음 주"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <WeekdayTabs weekDates={weekDates} selectedDate={selectedDate} today={today} onSelect={onSelectDate} />

      {showCalendar && (
        <DatePickerModal
          selectedDate={selectedDate}
          onSelect={onSelectDate}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  )
}
