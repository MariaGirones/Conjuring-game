import useGameStore from '../hooks/useGameStore'

function InventoryPanel() {
  const inventory = useGameStore(state => state.inventory)

  return (
    <div>
      <h3 className="text-lg font-serif font-bold mb-3 text-red-700 dark:text-red-400">
        Inventory
      </h3>
      {inventory.length === 0 ? (
        <p className="text-sm italic text-stone-500 dark:text-gray-500">
          You carry nothing but dread.
        </p>
      ) : (
        <ul className="space-y-1">
          {inventory.map(item => (
            <li key={item} className="text-sm flex items-center text-stone-700 dark:text-gray-300">
              <span className="mr-2 text-red-600 dark:text-red-500">●</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InventoryPanel
