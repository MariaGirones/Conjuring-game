import useGameStore from '../hooks/useGameStore'

// Classify evidence by keywords to assign an icon
function getIcon(entry: string): string {
  const e = entry.toLowerCase()
  if (e.includes('audio') || e.includes('evp') || e.includes('recording') || e.includes('voice')) return '🎙'
  if (e.includes('photo') || e.includes('camera') || e.includes('image') || e.includes('photograph')) return '📷'
  if (e.includes('ritual') || e.includes('symbol') || e.includes('glyph') || e.includes('inscription')) return '✦'
  if (e.includes('entity') || e.includes('bathsheba') || e.includes('contact') || e.includes('possession')) return '☠'
  if (e.includes('cross') || e.includes('prayer') || e.includes('holy') || e.includes('sacred')) return '✝'
  if (e.includes('cold') || e.includes('temperature') || e.includes('spot')) return '❄'
  if (e.includes('temporal') || e.includes('spatial') || e.includes('paranormal')) return '◈'
  if (e.includes('ghost') || e.includes('sighting') || e.includes('apparition')) return '◉'
  return '▪'
}

function EvidenceTracker() {
  const evidence = useGameStore(state => state.evidence)

  return (
    <div>
      {/* Header styled as a case file label */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-serif font-bold uppercase tracking-widest
          text-red-700 dark:text-red-400">
          Field Report
        </h3>
        <span className="text-xs px-2 py-0.5 rounded border font-mono font-bold
          bg-red-900/10 border-red-700/40 text-red-700
          dark:bg-red-900/50 dark:border-red-700 dark:text-red-300">
          {evidence.length} item{evidence.length !== 1 ? 's' : ''}
        </span>
      </div>

      {evidence.length === 0 ? (
        <div className="text-sm italic text-stone-500 dark:text-gray-500">
          <p>No evidence documented.</p>
          <p className="mt-1 text-xs">The Warrens always said: if you leave empty-handed, you weren't looking.</p>
        </div>
      ) : (
        <>
          {/* Case file divider */}
          <div className="mb-2 border-t border-dashed border-stone-300 dark:border-gray-700" />

          <ol className="space-y-2">
            {evidence.map((entry, idx) => (
              <li key={`${entry}-${idx}`}
                className="flex items-start gap-2 text-xs">
                {/* Entry number */}
                <span className="shrink-0 font-mono text-stone-400 dark:text-gray-600 w-4 text-right">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Icon */}
                <span className="shrink-0 text-sm leading-none mt-0.5">{getIcon(entry)}</span>
                {/* Description */}
                <span className="leading-snug text-stone-700 dark:text-gray-300">{entry}</span>
              </li>
            ))}
          </ol>

          {/* Case status footer */}
          <div className="mt-3 pt-2 border-t border-dashed border-stone-300 dark:border-gray-700">
            <p className="text-xs text-stone-400 dark:text-gray-600 italic font-mono">
              WARREN CASE FILE #19 — ACTIVE
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default EvidenceTracker
