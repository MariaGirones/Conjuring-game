import useGameStore from '../hooks/useGameStore'

function SanityMeter() {
  const sanity = useGameStore(state => state.sanity)

  const getStatusText = () => {
    if (sanity > 70) return 'Stable'
    if (sanity > 50) return 'Stressed'
    if (sanity > 30) return 'Disturbed'
    if (sanity > 10) return 'Fractured'
    return 'Breaking Apart'
  }

  const getColorClass = () => {
    if (sanity > 70) return 'from-green-600 to-green-500'
    if (sanity > 50) return 'from-yellow-600 to-yellow-500'
    if (sanity > 30) return 'from-orange-600 to-orange-500'
    if (sanity > 10) return 'from-red-700 to-red-600'
    return 'from-red-900 to-red-700 animate-heartbeat'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-serif font-bold text-gray-300">Sanity</h3>
        <span className={`text-sm font-bold ${sanity > 50 ? 'text-green-400' : sanity > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
          {sanity}/100
        </span>
      </div>
      <div className="bg-gray-800 h-6 rounded border border-gray-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 bg-gradient-to-r ${getColorClass()}`}
          style={{ width: `${sanity}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">{getStatusText()}</div>
    </div>
  )
}

export default SanityMeter