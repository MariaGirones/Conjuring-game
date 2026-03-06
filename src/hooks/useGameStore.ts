import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  playerName: string
  currentLevel: number
  inventory: string[]
  evidence: string[]
  sanity: number
  alive: boolean
  setPlayerName: (name: string) => void
  setCurrentLevel: (level: number) => void
  addItem: (item: string) => void
  removeItem: (item: string) => void
  addEvidence: (evidence: string) => void
  decreaseSanity: (amount: number) => void
  // Consume a usable item and restore sanity by the given amount (clamps to 100)
  useItem: (item: string, sanityRestore: number) => void
  setAlive: (alive: boolean) => void
  resetGame: () => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      currentLevel: 1,
      inventory: [],
      evidence: [],
      sanity: 100,
      alive: true,
      setPlayerName: (name) => set({ playerName: name }),
      setCurrentLevel: (level) => set({ currentLevel: level }),
      addItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
      removeItem: (item) => set((state) => ({ inventory: state.inventory.filter(i => i !== item) })),
      addEvidence: (evidence) => set((state) => ({ evidence: [...state.evidence, evidence] })),
      decreaseSanity: (amount) => set((state) => ({ sanity: Math.max(0, state.sanity - amount) })),
      // Remove the item from inventory and restore sanity in one atomic update
      useItem: (item, sanityRestore) => set((state) => ({
        inventory: state.inventory.filter(i => i !== item),
        sanity: Math.min(100, Math.max(0, state.sanity + sanityRestore)),
      })),
      setAlive: (alive) => set({ alive }),
      resetGame: () => set({
        playerName: '',
        currentLevel: 1,
        inventory: [],
        evidence: [],
        sanity: 100,
        alive: true,
      }),
    }),
    {
      name: 'conjuring-game-storage',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        inventory: state.inventory,
        evidence: state.evidence,
        sanity: state.sanity,
      }),
    }
  )
)

export default useGameStore
