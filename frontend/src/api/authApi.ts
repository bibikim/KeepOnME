import { apiClient } from './client'
import type { AuthResponse, LoginPayload, SignupPayload, User } from '../types'

export const authApi = {
  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((res) => res.data),

  me: () => apiClient.get<User>('/users/me').then((res) => res.data),
}
