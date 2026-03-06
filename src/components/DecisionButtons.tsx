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
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">What do you do?</div>
      {decisions.map((d, i) => (
        <button
          key={i}
          onClick={() => onChoice(i)}
          className="horror-button block w-full text-left group"
        >
          <span className="text-red-400 group-hover:text-red-300 transition-colors">[{i + 1}]</span> {d.text}
        </button>
      ))}
    </div>
  )
}

export default DecisionButtons