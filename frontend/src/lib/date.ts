import { WEEK_DAYS, type WeekDay } from '../types'

export function todayISO(): string {
  return formatISO(new Date())
}

const WEEKDAY_LABELS_KO = ['일', '월', '화', '수', '목', '금', '토']

export function todayLabel(): string {
  const today = new Date()
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
    today.getDate(),
  ).padStart(2, '0')} (${WEEKDAY_LABELS_KO[today.getDay()]})`
}

export function formatRelativeTime(isoDateTime: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoDateTime).getTime()) / 1000))
  if (diffSec < 60) return '방금 전'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${Math.floor(diffHour / 24)}일 전`
}

export function todayWeekDay(): WeekDay {
  return weekDayOf(todayISO())
}

export function weekDayOf(dateISO: string): WeekDay {
  return WEEK_DAYS[(parseISO(dateISO).getDay() + 6) % 7]
}

/** dateISO가 속한 주(월~일)의 월요일 날짜. */
export function mondayOf(dateISO: string): string {
  const date = parseISO(dateISO)
  const mondayOffset = (date.getDay() + 6) % 7
  return formatISO(new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset))
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = parseISO(dateISO)
  return formatISO(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days))
}

/** mondayISO를 시작으로 하는 한 주의 월~일 7일치 날짜. */
export function weekDatesFrom(mondayISO: string): string[] {
  return WEEK_DAYS.map((_, index) => addDaysISO(mondayISO, index))
}

export function dayOfMonth(dateISO: string): number {
  return parseISO(dateISO).getDate()
}

export function formatDateLabel(dateISO: string): string {
  const date = parseISO(dateISO)
  const weekDay = weekDayOf(dateISO)
  return `${date.getMonth() + 1}/${date.getDate()} (${weekDayKoreanLabel(weekDay)})`
}

export function formatWeekRangeLabel(mondayISO: string): string {
  const sundayISO = addDaysISO(mondayISO, 6)
  const monday = parseISO(mondayISO)
  const sunday = parseISO(sundayISO)
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getMonth() + 1}월 ${monday.getDate()}일 - ${sunday.getDate()}일`
  }
  return `${monday.getMonth() + 1}월 ${monday.getDate()}일 - ${sunday.getMonth() + 1}월 ${sunday.getDate()}일`
}

const WEEK_DAY_KOREAN: Record<WeekDay, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
}

function weekDayKoreanLabel(day: WeekDay): string {
  return WEEK_DAY_KOREAN[day]
}

/** 달력 모달용: year/month(0-indexed)가 속한 월요일 시작 6주(42일) 그리드. */
export function monthGridDates(year: number, month: number): string[] {
  const firstOfMonth = formatISO(new Date(year, month, 1))
  const gridStart = mondayOf(firstOfMonth)
  return Array.from({ length: 42 }, (_, index) => addDaysISO(gridStart, index))
}

export function isSameMonth(dateISO: string, year: number, month: number): boolean {
  const date = parseISO(dateISO)
  return date.getFullYear() === year && date.getMonth() === month
}

function parseISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
