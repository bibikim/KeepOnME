import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useConnectMate } from '../../hooks/useMate'
import type { ApiErrorResponse } from '../../types'

interface MateConnectModalProps {
  onClose: () => void
}

export function MateConnectModal({ onClose }: MateConnectModalProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const connectMate = useConnectMate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await connectMate.mutateAsync(inviteCode.trim().toUpperCase())
      onClose()
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('메이트 연결에 실패했습니다.')
      }
    }
  }

  return (
    <Modal title="메이트 연결하기" onClose={onClose}>
      <p className="mb-3 text-sm text-gray-500">메이트의 초대 코드를 입력해 새로운 메이트로 연결하세요.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="초대 코드 (예: AB23CD)"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm uppercase tracking-widest outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Button type="submit" disabled={connectMate.isPending} className="w-full">
          {connectMate.isPending ? '연결 중...' : '연결하기'}
        </Button>
      </form>
    </Modal>
  )
}
