interface Decision {
  text: string
}

interface Props {
  decisions: Decision[]
  onChoice: (index: number) => void
}

function DecisionButtons({ decisions, onChoice }: Props) {
  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs mb-2 uppercase tracking-wide text-stone-500 dark:text-gray-500">
        What do you do?
      </div>
      {decisions.map((d, i) => (
        <button
          key={i}
          onClick={() => onChoice(i)}
          className="horror-button block w-full text-left group"
        >
          {/* Number label — slightly lighter in hover state */}
          <span className="text-red-300 group-hover:text-red-200 transition-colors">[{i + 1}]</span>{' '}
          {d.text}
        </button>
      ))}
    </div>
  )
}

export default DecisionButtons
