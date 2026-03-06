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

  const getBarClass = () => {
    if (sanity > 70) return 'from-green-600 to-green-500'
    if (sanity > 50) return 'from-yellow-600 to-yellow-500'
    if (sanity > 30) return 'from-orange-600 to-orange-500'
    if (sanity > 10) return 'from-red-700 to-red-600'
    return 'from-red-900 to-red-700 animate-heartbeat'
  }

  const getValueColor = () => {
    if (sanity > 50) return 'text-green-700 dark:text-green-400'
    if (sanity > 30) return 'text-yellow-700 dark:text-yellow-400'
    return 'text-red-700 dark:text-red-400'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-serif font-bold text-stone-700 dark:text-gray-300">Sanity</h3>
        <span className={`text-sm font-bold ${getValueColor()}`}>
          {sanity}/100
        </span>
      </div>

      {/* Bar track */}
      <div className="h-6 rounded border overflow-hidden
        bg-stone-300 border-stone-400
        dark:bg-gray-800 dark:border-gray-700">
        <div
          className={`h-full transition-all duration-300 bg-gradient-to-r ${getBarClass()}`}
          style={{ width: `${sanity}%` }}
        />
      </div>

      <div className="text-xs mt-2 text-center text-stone-500 dark:text-gray-500">
        {getStatusText()}
      </div>
    </div>
  )
}

export default SanityMeter
