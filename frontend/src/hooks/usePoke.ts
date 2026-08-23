import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pokeApi } from '../api/pokeApi'

export function usePokes() {
  return useQuery({
    queryKey: ['pokes'],
    queryFn: () => pokeApi.getPokes(),
  })
}

export function useSendPoke() {
  return useMutation({
    mutationFn: (receiverId: number) => pokeApi.sendPoke(receiverId),
  })
}

export function useReadPoke() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pokeApi.readPoke(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pokes'] }),
  })
}
