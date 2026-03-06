import useGameStore from '../hooks/useGameStore'

function EvidenceTracker() {
  const evidence = useGameStore(state => state.evidence)
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Evidence Collected</h2>
      <ul className="list-disc list-inside">
        {evidence.length === 0 ? <li>None</li> : evidence.map(e => <li key={e}>{e}</li>)}
      </ul>
    </div>
  )
}

export default EvidenceTracker