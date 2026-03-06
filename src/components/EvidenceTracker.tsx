import useGameStore from '../hooks/useGameStore'

function EvidenceTracker() {
  const evidence = useGameStore(state => state.evidence)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-serif font-bold text-red-400">Evidence</h3>
        <span className="text-xs bg-red-900/50 px-2 py-1 rounded text-red-300 font-bold">
          {evidence.length}
        </span>
      </div>
      {evidence.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Gather proof of the supernatural.</p>
      ) : (
        <ul className="space-y-1">
          {evidence.map((e, idx) => (
            <li key={`${e}-${idx}`} className="text-sm text-gray-300 flex items-start">
              <span className="text-red-500 mr-2 mt-1">▪</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EvidenceTracker