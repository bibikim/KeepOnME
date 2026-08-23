import { useState } from 'react'
import { KeyRound, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../ui/Toast'
import { InviteCodeModal } from './InviteCodeModal'
import { NotificationBell } from './NotificationBell'
import { todayLabel } from '../../lib/date'

export function Header() {
  const { user, logout } = useAuth()
  const { message, showToast } = useToast()
  const [showInviteCode, setShowInviteCode] = useState(false)
  const dateLabel = todayLabel()

  const handleCopied = (succeeded: boolean) => {
    showToast(succeeded ? '초대 코드가 클립보드에 복사되었습니다' : '복사에 실패했습니다. 직접 선택해 복사해주세요.')
  }

  return (
    <header className="border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="shrink-0 text-base font-semibold text-gray-900 sm:text-lg">🎯 KeepOnMe</h1>
          <span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-gray-500 sm:inline-flex">
            {dateLabel}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {user && <NotificationBell />}
          {user && (
            <button
              type="button"
              onClick={() => setShowInviteCode(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
              aria-label="내 초대 코드 보기"
            >
              <KeyRound size={15} />
            </button>
          )}
          <span className="max-w-[6rem] truncate text-sm font-medium whitespace-nowrap text-gray-700">
            {user?.nickname}
          </span>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="로그아웃"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {showInviteCode && user && (
        <InviteCodeModal
          inviteCode={user.inviteCode}
          onClose={() => setShowInviteCode(false)}
          onCopied={handleCopied}
        />
      )}
      {message && <Toast message={message} />}
    </header>
  )
}
