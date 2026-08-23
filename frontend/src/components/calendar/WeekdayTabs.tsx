import { WEEK_DAY_LABELS } from '../../types'
import { dayOfMonth, weekDayOf } from '../../lib/date'

interface WeekdayTabsProps {
  weekDates: string[]
  selectedDate: string
  today: string
  onSelect: (date: string) => void
}

export function WeekdayTabs({ weekDates, selectedDate, today, onSelect }: WeekdayTabsProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date) => {
        const day = weekDayOf(date)
        const isSelected = date === selectedDate
        const isToday = date === today
        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm'
                : isToday
                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs font-medium">{WEEK_DAY_LABELS[day]}</span>
            <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>{dayOfMonth(date)}</span>
          </button>
        )
      })}
    </div>
  )
}
