import { apiClient } from './client'
import type { Goal, GoalCreatePayload, GoalListResponse, WeekDay } from '../types'

export interface GoalQueryParams {
  targetDate?: string
  userId?: number
  dayOfWeek?: WeekDay
}

export const goalApi = {
  getGoals: (params: GoalQueryParams) =>
    apiClient.get<GoalListResponse>('/goals', { params }).then((res) => res.data),

  createGoal: (payload: GoalCreatePayload) =>
    apiClient.post<Goal>('/goals', payload).then((res) => res.data),

  toggleStatus: (id: number) =>
    apiClient.patch<Goal>(`/goals/${id}/status`).then((res) => res.data),

  deleteGoal: (id: number) => apiClient.delete<void>(`/goals/${id}`).then((res) => res.data),
}
