import useGameStore from '../hooks/useGameStore'

function InventoryPanel() {
  const inventory = useGameStore(state => state.inventory)
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Inventory</h2>
      <ul className="list-disc list-inside">
        {inventory.length === 0 ? <li>None</li> : inventory.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default InventoryPanel