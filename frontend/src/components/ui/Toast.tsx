import { createPortal } from 'react-dom'

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return createPortal(
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
      {message}
    </div>,
    document.body,
  )
}
