import useGameStore from '../hooks/useGameStore'

function EvidenceTracker() {
  const evidence = useGameStore(state => state.evidence)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-serif font-bold text-red-700 dark:text-red-400">Evidence</h3>
        <span className="text-xs px-2 py-1 rounded font-bold
          bg-red-900/20 text-red-700
          dark:bg-red-900/50 dark:text-red-300">
          {evidence.length}
        </span>
      </div>
      {evidence.length === 0 ? (
        <p className="text-sm italic text-stone-500 dark:text-gray-500">
          Gather proof of the supernatural.
        </p>
      ) : (
        <ul className="space-y-1">
          {evidence.map((e, idx) => (
            <li key={`${e}-${idx}`} className="text-sm flex items-start text-stone-700 dark:text-gray-300">
              <span className="mr-2 mt-1 text-red-600 dark:text-red-500">▪</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default EvidenceTracker
