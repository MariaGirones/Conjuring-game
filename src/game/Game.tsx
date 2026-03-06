import { useState, useEffect } from 'react'
import useGameStore from '../hooks/useGameStore'
import StoryEngine from '../engine/StoryEngine'
import StoryPanel from '../components/StoryPanel'
import DecisionButtons from '../components/DecisionButtons'
import InventoryPanel from '../components/InventoryPanel'
import SanityMeter from '../components/SanityMeter'
import EvidenceTracker from '../components/EvidenceTracker'
import StartScreen from '../components/StartScreen'
import EndingScreen from '../components/EndingScreen'

const engine = new StoryEngine()

type EndingType = 'SURVIVED' | 'POSSESSED' | 'DEAD' | null

function Game() {
  const {
    playerName,
    currentLevel,
    sanity,
    alive,
    inventory,
    evidence,
    setCurrentLevel,
    addItem,
    addEvidence,
    decreaseSanity,
    setAlive,
    resetGame,
  } = useGameStore()

  const [currentStory, setCurrentStory] = useState('')
  const [decisions, setDecisions] = useState<any[]>([])
  const [ending, setEnding] = useState<EndingType>(null)
  const [showPsychologicalEffect, setShowPsychologicalEffect] = useState(false)

  // Start ambient audio when game begins
  useEffect(() => {
    if (playerName) {
      // Audio removed
    }
  }, [playerName])

  // Update story when level or game state changes
  useEffect(() => {
    if (!playerName || !alive) return

    const level = engine.getLevel(currentLevel)
    if (level) {
      let availableDecisions = level.decisions

      // Filter decisions based on conditions
      availableDecisions = availableDecisions.filter(decision => {
        if (decision.minSanity && sanity < decision.minSanity) return false
        if (decision.requiredItem && !inventory.includes(decision.requiredItem)) return false
        return true
      })

      setCurrentStory(level.description)
      setDecisions(availableDecisions)

      // Trigger psychological effects at low sanity
      if (sanity < 40) {
        setShowPsychologicalEffect(true)
        setTimeout(() => setShowPsychologicalEffect(false), 3000)
      }

      if (sanity < 20) {
        // Audio removed
      }
    }
  }, [playerName, currentLevel, alive, sanity, playEffect])

  const handleChoice = (index: number) => {
    const consequence = engine.makeChoice(currentLevel, index)
    if (!consequence) return

    setCurrentStory(consequence.text)

    // Handle sanity changes
    if (consequence.sanityChange) {
      decreaseSanity(-consequence.sanityChange)
      const newSanity = sanity + consequence.sanityChange

      if (newSanity <= 0) {
        setEnding('DEAD')
        setAlive(false)
        return
      }
    }

    // Collect items and evidence
    if (consequence.item) addItem(consequence.item)
    if (consequence.evidence) addEvidence(consequence.evidence)

    // Handle death
    if (consequence.dead) {
      setEnding('POSSESSED')
      setAlive(false)
      return
    }

    // Handle endings
    if (consequence.ending) {
      if (consequence.ending === 'SURVIVED') {
        setEnding('SURVIVED')
      } else if (consequence.ending === 'POSSESSED') {
        setEnding('POSSESSED')
      }
      return
    }

    // Progress to next level
    if (consequence.nextLevel) {
      setCurrentLevel(consequence.nextLevel)
    }
  }

  // Show start screen
  if (!playerName) {
    return <StartScreen />
  }

  // Show ending screen
  if (ending) {
    return <EndingScreen ending={ending} sanity={sanity} evidence={evidence} />
  }

  // Show game over if not alive (shouldn't reach here with proper ending handling)
  if (!alive) {
    return <EndingScreen ending="DEAD" sanity={sanity} evidence={evidence} />
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-serif font-bold">THE CONJURING</h1>
          <span className="text-sm text-gray-500">Level {currentLevel}/10</span>
        </div>
        <div className="flex gap-2">
          {/* Audio and theme toggles removed */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Main game area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className={`flex-1 overflow-y-auto mb-4 transition-all ${
              showPsychologicalEffect ? 'sanity-low' : ''
            } ${sanity < 20 ? 'sanity-critical' : ''}`}
          >
            <StoryPanel story={currentStory} sanity={sanity} />
          </div>

          {/* Decision buttons */}
          <div className="overflow-y-auto">
            <DecisionButtons decisions={decisions} onChoice={handleChoice} />
          </div>
        </div>

        {/* Right sidebar - Game status */}
        <div className="w-72 flex flex-col gap-4 overflow-y-auto">
          <div className="game-panel">
            <SanityMeter />
          </div>

          <div className="game-panel">
            <InventoryPanel />
          </div>

          <div className="game-panel">
            <EvidenceTracker />
          </div>

          {/* Player info */}
          <div className="game-panel text-xs">
            <div className="text-gray-500">Currently in</div>
            <div className="text-white font-serif">{engine.getLevel(currentLevel)?.title || 'Unknown Location'}</div>
          </div>
        </div>
      </div>

      {/* Psychological effect messages */}
      {showPsychologicalEffect && sanity < 40 && (
        <div className="fixed bottom-4 left-4 text-red-400 text-sm italic animate-pulse">
          <p>★ You feel something watching you...</p>
        </div>
      )}
    </div>
  )
}

export default Game