import { Copy } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { copyToClipboard } from '../../lib/clipboard'

interface InviteCodeModalProps {
  inviteCode: string
  onClose: () => void
  onCopied: (succeeded: boolean) => void
}

export function InviteCodeModal({ inviteCode, onClose, onCopied }: InviteCodeModalProps) {
  const handleCopy = async () => {
    const succeeded = await copyToClipboard(inviteCode)
    onCopied(succeeded)
    onClose()
  }

  return (
    <Modal title="내 초대 코드" onClose={onClose}>
      <p className="mb-4 break-keep text-sm text-gray-500">
        메이트에게 이 코드를 공유하면 1:1로 연결할 수 있어요.
      </p>
      <div className="mb-4 rounded-2xl bg-indigo-50 py-5 text-center">
        <span className="text-xl font-bold tracking-widest text-indigo-700">{inviteCode}</span>
      </div>
      <Button onClick={handleCopy} className="w-full">
        <Copy size={14} />
        복사하기
      </Button>
    </Modal>
  )
}
