import { useState } from 'react'
import useGameStore from '../hooks/useGameStore'
import itemsData from '../data/items.json'

// Build a lookup map from the items data file
const ITEM_MAP = Object.fromEntries(
  itemsData.items.map(item => [item.id, item])
)

function InventoryPanel() {
  const { inventory, useItem } = useGameStore()
  // Track which item just had its "use" feedback shown
  const [recentlyUsed, setRecentlyUsed] = useState<string | null>(null)

  const handleUse = (itemId: string) => {
    const def = ITEM_MAP[itemId]
    if (!def?.usable || !('sanityRestore' in def)) return

    useItem(itemId, def.sanityRestore as number)
    setRecentlyUsed(def.useEffect as string)
    setTimeout(() => setRecentlyUsed(null), 4000)
  }

  return (
    <div>
      <h3 className="text-base font-serif font-bold mb-3 uppercase tracking-widest
        text-red-700 dark:text-red-400">
        Inventory
      </h3>

      {/* Use-effect feedback */}
      {recentlyUsed && (
        <div className="mb-3 p-2 rounded border text-xs italic animate-pulse
          bg-green-100 border-green-400 text-green-800
          dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
          {recentlyUsed}
        </div>
      )}

      {inventory.length === 0 ? (
        <p className="text-sm italic text-stone-500 dark:text-gray-500">
          You carry nothing but dread.
        </p>
      ) : (
        <ul className="space-y-2">
          {inventory.map(itemId => {
            const def = ITEM_MAP[itemId]
            const isUsable = def?.usable === true

            return (
              <li key={itemId} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="mt-1 shrink-0 text-red-600 dark:text-red-500">●</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-stone-800 dark:text-gray-200 truncate">
                      {def?.name ?? itemId}
                    </div>
                    {def?.description && (
                      <div className="text-xs italic leading-tight mt-0.5
                        text-stone-500 dark:text-gray-500">
                        {def.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Use button — only rendered for consumable items */}
                {isUsable && (
                  <button
                    onClick={() => handleUse(itemId)}
                    className="shrink-0 text-xs px-2 py-0.5 rounded border transition-colors
                      bg-stone-200 hover:bg-stone-300 border-stone-400 text-stone-700
                      dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
                  >
                    {(def as any).useLabel ?? 'Use'}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default InventoryPanel
