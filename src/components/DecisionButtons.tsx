interface Decision {
  text: string
}

interface Props {
  decisions: Decision[]
  onChoice: (index: number) => void
}

function DecisionButtons({ decisions, onChoice }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {decisions.map((d, i) => (
        <button
          key={i}
          onClick={() => onChoice(i)}
          className="block w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors"
        >
          {d.text}
        </button>
      ))}
    </div>
  )
}

export default DecisionButtons