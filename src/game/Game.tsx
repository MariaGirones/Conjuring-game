import { useState, useEffect } from 'react'
import useGameStore from '../hooks/useGameStore'
import StoryEngine from '../engine/StoryEngine'
import StoryPanel from '../components/StoryPanel'
import DecisionButtons from '../components/DecisionButtons'
import InventoryPanel from '../components/InventoryPanel'
import SanityMeter from '../components/SanityMeter'
import EvidenceTracker from '../components/EvidenceTracker'

const engine = new StoryEngine()

function Game() {
  const { playerName, currentLevel, sanity, alive, setPlayerName, setCurrentLevel, addItem, addEvidence, decreaseSanity, setAlive, resetGame } = useGameStore()
  const [currentStory, setCurrentStory] = useState('')
  const [decisions, setDecisions] = useState<any[]>([])

  useEffect(() => {
    if (playerName && currentLevel <= 10 && alive) {
      const level = engine.getLevel(currentLevel)
      if (level) {
        setCurrentStory(level.description)
        setDecisions(level.decisions)
      }
    }
  }, [playerName, currentLevel, alive])

  if (!playerName) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4 font-serif">Enter Your Name</h1>
          <input
            type="text"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name..."
          />
        </div>
      </div>
    )
  }

  if (!alive) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4 font-serif">Game Over</h1>
          <p>You have been possessed by the house.</p>
          <button onClick={resetGame} className="mt-4 bg-red-600 p-2 rounded">Restart</button>
        </div>
      </div>
    )
  }

  if (currentLevel > 10) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4 font-serif">You Survived the Night!</h1>
          <p>Evidence collected: {useGameStore.getState().evidence.length}</p>
          <button onClick={resetGame} className="mt-4 bg-red-600 p-2 rounded">Play Again</button>
        </div>
      </div>
    )
  }

  const handleChoice = (index: number) => {
    const consequence = engine.makeChoice(currentLevel, index)
    if (consequence) {
      setCurrentStory(consequence.text)
      if (consequence.sanityChange) {
        decreaseSanity(consequence.sanityChange)
        if (sanity + consequence.sanityChange <= 0) {
          setAlive(false)
          return
        }
      }
      if (consequence.item) addItem(consequence.item)
      if (consequence.evidence) addEvidence(consequence.evidence)
      if (consequence.dead) setAlive(false)
      else if (consequence.nextLevel) setCurrentLevel(consequence.nextLevel)
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 p-4 overflow-y-auto">
        <StoryPanel story={currentStory} sanity={sanity} />
        <DecisionButtons decisions={decisions} onChoice={handleChoice} />
      </div>
      <div className="w-1/4 p-4 border-l border-gray-700 bg-gray-900">
        <InventoryPanel />
        <SanityMeter />
        <EvidenceTracker />
      </div>
    </div>
  )
}

export default Game