import { useAudio } from '../hooks/useAudio'

interface Decision {
  text: string
}

interface Props {
  decisions: Decision[]
  onChoice: (index: number) => void
}

function DecisionButtons({ decisions, onChoice }: Props) {
  const { playEffect } = useAudio()

  const handleClick = (index: number) => {
    playEffect('click')
    onChoice(index)
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs mb-2 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
        What do you do?
      </div>
      {decisions.map((d, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className="horror-button block w-full text-left group"
        >
          <span className="text-red-300 group-hover:text-red-200 transition-colors">[{i + 1}]</span>{' '}
          {d.text}
        </button>
      ))}
    </div>
  )
}

export default DecisionButtons
