import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import type { ApiErrorResponse } from '../../types'

type Mode = 'login' | 'signup'

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await signup({ email, password, nickname })
      }
      onClose()
    } catch (err) {
      if (isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('요청 처리 중 문제가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={mode === 'login' ? '로그인' : '회원가입'} onClose={onClose}>
      <div className="mb-4 flex rounded-xl bg-gray-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-lg py-1.5 transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg py-1.5 transition-all ${mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          회원가입
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <input
            type="text"
            required
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        )}
        <input
          type={mode === 'login' ? 'text' : 'email'}
          required
          placeholder={mode === 'login' ? '이메일 또는 관리자 아이디' : '이메일'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? '처리 중...' : mode === 'login' ? '로그인' : '가입하고 시작하기'}
        </Button>
      </form>
    </Modal>
  )
}
