export type GoalType = 'DAILY' | 'WEEKLY'
export type GoalStatus = 'PENDING' | 'COMPLETED' | 'VERIFIED'
export type WeekDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export const WEEK_DAYS: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
}

export type Role = 'USER' | 'ADMIN'

export interface User {
  id: number
  email: string
  nickname: string
  inviteCode: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface SignupPayload {
  email: string
  password: string
  nickname: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface Goal {
  id: number
  userId: number
  type: GoalType
  title: string
  targetDate: string
  dayOfWeek: WeekDay | null
  status: GoalStatus
  createdAt: string
}

export interface GoalListResponse {
  daily: Goal[]
  weekly: Goal[]
  dailyAchievementRate: number
  weeklyAchievementRate: number
}

export interface GoalCreatePayload {
  type: GoalType
  title: string
  // WEEKLY는 targetDate 필수. DAILY는 targetDate 또는 dayOfWeek 중 하나만 있으면 되고,
  // dayOfWeek만 보내면 서버가 이번 주 해당 요일 날짜로 계산한다.
  targetDate?: string
  dayOfWeek?: WeekDay
}

export type MateLinkStatus = 'CONNECTED'

export interface Mate {
  id: number
  mateUserId: number
  nickname: string
  status: MateLinkStatus
}

export interface ApiErrorResponse {
  code: string
  message: string
}

export type PokeStatus = 'PENDING' | 'READ'

export interface Poke {
  id: number
  senderId: number
  senderNickname: string
  receiverId: number
  status: PokeStatus
  createdAt: string
}
