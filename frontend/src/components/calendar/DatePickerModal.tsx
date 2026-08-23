import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { WEEK_DAYS, WEEK_DAY_LABELS } from '../../types'
import { dayOfMonth, isSameMonth, monthGridDates, todayISO } from '../../lib/date'

interface DatePickerModalProps {
  selectedDate: string
  onSelect: (date: string) => void
  onClose: () => void
}

export function DatePickerModal({ selectedDate, onSelect, onClose }: DatePickerModalProps) {
  const initial = new Date(`${selectedDate}T00:00:00`)
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const today = todayISO()

  const gridDates = monthGridDates(viewYear, viewMonth)

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handlePick = (date: string) => {
    onSelect(date)
    onClose()
  }

  return (
    <Modal title="날짜 선택" onClose={onClose}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="이전 달"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="다음 달"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-gray-400">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="py-1">
            {WEEK_DAY_LABELS[day]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {gridDates.map((date) => {
          const inMonth = isSameMonth(date, viewYear, viewMonth)
          const isSelected = date === selectedDate
          const isToday = date === today

          return (
            <button
              key={date}
              type="button"
              onClick={() => handlePick(date)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                isSelected
                  ? 'bg-indigo-600 font-semibold text-white'
                  : isToday
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : inMonth
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 hover:bg-gray-50'
              }`}
            >
              {dayOfMonth(date)}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
