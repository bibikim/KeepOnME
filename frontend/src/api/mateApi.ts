import { apiClient } from './client'
import type { Mate } from '../types'

export const mateApi = {
  getMyMates: () => apiClient.get<Mate[]>('/mates/me').then((res) => res.data),

  connectMate: (inviteCode: string) =>
    apiClient.post<Mate>('/mates/connect', { inviteCode }).then((res) => res.data),

  disconnectMate: (mateId: number) => apiClient.delete<void>(`/mates/${mateId}`).then((res) => res.data),
}
