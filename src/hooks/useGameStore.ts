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
    }
  )
)

export default useGameStore