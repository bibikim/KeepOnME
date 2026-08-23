import { apiClient } from './client'
import type { Poke } from '../types'

export const pokeApi = {
  sendPoke: (receiverId: number) =>
    apiClient.post<Poke>('/pokes/send', { receiverId }).then((res) => res.data),

  getPokes: () => apiClient.get<Poke[]>('/pokes').then((res) => res.data),

  readPoke: (id: number) => apiClient.patch<Poke>(`/pokes/${id}/read`).then((res) => res.data),
}
