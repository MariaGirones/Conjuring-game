import useGameStore from '../hooks/useGameStore'

function InventoryPanel() {
  const inventory = useGameStore(state => state.inventory)

  return (
    <div>
      <h3 className="text-lg font-serif font-bold mb-3 text-red-400">Inventory</h3>
      {inventory.length === 0 ? (
        <p className="text-gray-500 text-sm italic">You carry nothing but dread.</p>
      ) : (
        <ul className="space-y-1">
          {inventory.map(item => (
            <li key={item} className="text-sm text-gray-300 flex items-center">
              <span className="text-red-500 mr-2">●</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InventoryPanel