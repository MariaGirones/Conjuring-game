import useGameStore from '../hooks/useGameStore'

function SanityMeter() {
  const sanity = useGameStore(state => state.sanity)
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Sanity: {sanity}/100</h2>
      <div className="bg-gray-700 h-4 rounded">
        <div className={`h-full rounded transition-all ${sanity > 50 ? 'bg-green-500' : sanity > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${sanity}%`}}></div>
      </div>
    </div>
  )
}

export default SanityMeter