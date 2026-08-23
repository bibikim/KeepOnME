import { useState } from 'react'
import { Bell } from 'lucide-react'
import { usePokes, useReadPoke } from '../../hooks/usePoke'
import { Modal } from '../ui/Modal'
import { formatRelativeTime } from '../../lib/date'

export function NotificationBell() {
  const [showList, setShowList] = useState(false)
  const { data: pokes } = usePokes()
  const readPoke = useReadPoke()

  const unreadCount = pokes?.filter((poke) => poke.status === 'PENDING').length ?? 0

  return (
    <>
      <button
        type="button"
        onClick={() => setShowList(true)}
        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="찌르기 알림"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showList && (
        <Modal title="찌르기 알림" onClose={() => setShowList(false)}>
          {!pokes || pokes.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">받은 알림이 없어요.</p>
          ) : (
            <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {pokes.map((poke) => (
                <li key={poke.id}>
                  <button
                    type="button"
                    onClick={() => poke.status === 'PENDING' && readPoke.mutate(poke.id)}
                    className={`w-full rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
                      poke.status === 'PENDING'
                        ? 'border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50'
                        : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{poke.senderNickname}</span>
                    <span className="text-gray-500"> 님이 찔렀어요 👉</span>
                    <div className="mt-1 text-xs text-gray-400">{formatRelativeTime(poke.createdAt)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  )
}
