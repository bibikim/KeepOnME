import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mateApi } from '../api/mateApi'

export function useMyMates() {
  return useQuery({
    queryKey: ['mates'],
    queryFn: () => mateApi.getMyMates(),
  })
}

export function useConnectMate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (inviteCode: string) => mateApi.connectMate(inviteCode),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mates'] }),
  })
}

export function useDisconnectMate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mateId: number) => mateApi.disconnectMate(mateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mates'] }),
  })
}
