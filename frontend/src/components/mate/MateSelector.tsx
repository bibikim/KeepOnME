import { useState } from 'react'
import { Plus, Settings2 } from 'lucide-react'
import type { Mate } from '../../types'
import { MateConnectModal } from './MateConnectModal'
import { MateListModal } from './MateListModal'

interface MateSelectorProps {
  mates: Mate[]
  selectedMateId: number | null
  onSelect: (mateUserId: number) => void
}

export function MateSelector({ mates, selectedMateId, onSelect }: MateSelectorProps) {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {mates.map((mate) => (
        <button
          key={mate.id}
          type="button"
          onClick={() => onSelect(mate.mateUserId)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            selectedMateId === mate.mateUserId
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {mate.nickname}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setShowConnectModal(true)}
        className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
      >
        <Plus size={16} />
        메이트 추가
      </button>
      <button
        type="button"
        onClick={() => setShowListModal(true)}
        className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200"
        aria-label="메이트 관리"
      >
        <Settings2 size={16} />
      </button>

      {showConnectModal && <MateConnectModal onClose={() => setShowConnectModal(false)} />}
      {showListModal && <MateListModal mates={mates} onClose={() => setShowListModal(false)} />}
    </div>
  )
}
