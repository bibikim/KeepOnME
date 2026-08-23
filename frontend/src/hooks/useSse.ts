import { useEffect, useRef } from 'react'
import type { Poke } from '../types'
import { TOKEN_STORAGE_KEY } from '../api/client'

export function useSse(onPoke: (poke: Poke) => void) {
  const onPokeRef = useRef(onPoke)
  onPokeRef.current = onPoke

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) return

    // 브라우저 네이티브 EventSource는 커스텀 헤더를 못 보내서 토큰을 쿼리 파라미터로 전달한다.
    const eventSource = new EventSource(`/api/sse/connect?token=${encodeURIComponent(token)}`)

    eventSource.addEventListener('connected', () => {
      console.log('[SSE] 알림 스트림에 연결되었습니다.')
    })

    eventSource.addEventListener('poke', (event: MessageEvent) => {
      const poke = JSON.parse(event.data) as Poke
      console.log('[SSE] 찌르기 알림 수신:', poke)
      onPokeRef.current(poke)
    })

    eventSource.onerror = () => {
      console.warn('[SSE] 연결 오류 발생. 브라우저가 자동으로 재연결을 시도합니다.')
    }

    return () => {
      eventSource.close()
    }
  }, [])
}
