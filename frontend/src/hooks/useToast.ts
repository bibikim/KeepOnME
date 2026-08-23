import { useCallback, useRef, useState } from 'react'

export function useToast(durationMs = 2000) {
  const [message, setMessage] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback(
    (text: string) => {
      setMessage(text)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setMessage(null), durationMs)
    },
    [durationMs],
  )

  return { message, showToast }
}
