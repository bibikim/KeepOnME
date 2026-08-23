import { UserMinus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { Mate } from '../../types'
import { useDisconnectMate } from '../../hooks/useMate'

interface MateListModalProps {
  mates: Mate[]
  onClose: () => void
}

export function MateListModal({ mates, onClose }: MateListModalProps) {
  const disconnectMate = useDisconnectMate()

  return (
    <Modal title="내 메이트 목록" onClose={onClose}>
      {mates.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">연결된 메이트가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {mates.map((mate) => (
            <li
              key={mate.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-3.5 py-3"
            >
              <span className="min-w-0 truncate text-sm font-medium text-gray-900">{mate.nickname}</span>
              <button
                type="button"
                onClick={() => disconnectMate.mutate(mate.id)}
                disabled={disconnectMate.isPending}
                className="flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
              >
                <UserMinus size={12} />
                연결 끊기
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
