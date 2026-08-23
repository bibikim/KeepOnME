import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { goalApi, type GoalQueryParams } from '../api/goalApi'
import type { GoalCreatePayload } from '../types'

export function useGoals(params: GoalQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => goalApi.getGoals(params),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GoalCreatePayload) => goalApi.createGoal(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useToggleGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => goalApi.toggleStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => goalApi.deleteGoal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}
