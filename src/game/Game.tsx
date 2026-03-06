import { useState, useEffect } from 'react'
import useGameStore from '../hooks/useGameStore'
import { useAudio } from '../hooks/useAudio'
import StoryEngine from '../engine/StoryEngine'
import StoryPanel from '../components/StoryPanel'
import DecisionButtons from '../components/DecisionButtons'
import InventoryPanel from '../components/InventoryPanel'
import SanityMeter from '../components/SanityMeter'
import EvidenceTracker from '../components/EvidenceTracker'
import StartScreen from '../components/StartScreen'
import EndingScreen from '../components/EndingScreen'
import AudioToggle from '../components/AudioToggle'
import ThemeToggle from '../components/ThemeToggle'

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

  const { startAmbient, playEffect } = useAudio()
  const [currentStory, setCurrentStory] = useState('')
  const [decisions, setDecisions] = useState<any[]>([])
  const [ending, setEnding] = useState<EndingType>(null)
  const [showPsychologicalEffect, setShowPsychologicalEffect] = useState(false)

  // Reset ending when returning to start screen
  useEffect(() => {
    if (!playerName) setEnding(null)
  }, [playerName])

  // Start ambient audio when game begins
  useEffect(() => {
    if (playerName) startAmbient()
  }, [playerName, startAmbient])

  // Update story when level or game state changes
  useEffect(() => {
    if (!playerName || !alive) return

    const level = engine.getLevel(currentLevel)
    if (!level) return

    // Filter choices by sanity threshold and required items
    const availableDecisions = level.decisions.filter(d => {
      if (d.minSanity && sanity < d.minSanity) return false
      if (d.requiredItem && !inventory.includes(d.requiredItem)) return false
      return true
    })

    setCurrentStory(level.description.replace(/\{playerName\}/g, playerName))
    setDecisions(availableDecisions)

    if (sanity < 40) {
      playEffect('whisper')
      setShowPsychologicalEffect(true)
      setTimeout(() => setShowPsychologicalEffect(false), 3000)
    }
    if (sanity < 20) playEffect('heartbeat')

  }, [playerName, currentLevel, alive, sanity, playEffect])

  const handleChoice = (index: number) => {
    const consequence = engine.makeChoice(currentLevel, index)
    if (!consequence) return

    setCurrentStory(consequence.text.replace(/\{playerName\}/g, playerName))

    if (consequence.sanityChange) {
      // sanityChange is negative (e.g. -10 means lose 10). Compute new value
      // before dispatching so the death check uses accurate data, not stale state.
      const newSanity = Math.max(0, sanity + consequence.sanityChange)
      decreaseSanity(consequence.sanityChange)
      if (newSanity <= 0) {
        setEnding('DEAD')
        setAlive(false)
        return
      }
    }

    if (consequence.item)     addItem(consequence.item)
    if (consequence.evidence) addEvidence(consequence.evidence)

    if (consequence.dead) {
      setEnding('POSSESSED')
      setAlive(false)
      return
    }

    if (consequence.ending) {
      setEnding(consequence.ending as EndingType)
      return
    }

    if (consequence.nextLevel) setCurrentLevel(consequence.nextLevel)
  }

  if (!playerName)  return <StartScreen />
  if (ending)       return <EndingScreen ending={ending} sanity={sanity} evidence={evidence} />
  if (!alive)       return <EndingScreen ending="DEAD"   sanity={sanity} evidence={evidence} />

  const locationTitle = engine.getLevel(currentLevel)?.title ?? 'Unknown Location'

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>

      {/* ── Header ───────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>

        <div className="flex items-center gap-4">
          {/* Cinzel Decorative via font-display utility class */}
          <h1 className="font-display text-xl tracking-widest"
            style={{ color: 'var(--color-text-primary)' }}>
            THE CONJURING
          </h1>
          <span className="hidden sm:block text-xs uppercase tracking-widest font-mono border-l pl-4"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            {locationTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {currentLevel}/10
          </span>
          <ThemeToggle />
          <AudioToggle />
        </div>
      </header>

      {/* ── Main layout ──────────────────────────── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-3 p-3">

        {/* Left: story + decisions — scrolls as a unit */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className={`transition-all ${
            showPsychologicalEffect ? 'sanity-low' : ''
          } ${sanity < 20 ? 'sanity-critical' : ''}`}>
            <StoryPanel story={currentStory} sanity={sanity} />
          </div>
          <DecisionButtons decisions={decisions} onChoice={handleChoice} />
        </div>

        {/* Right sidebar — horizontal scroll on mobile, vertical on desktop */}
        <aside className="w-full md:w-64 xl:w-72 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto shrink-0">
          <div className="game-panel min-w-[160px] md:min-w-0"><SanityMeter /></div>
          <div className="game-panel min-w-[180px] md:min-w-0"><InventoryPanel /></div>
          <div className="game-panel min-w-[200px] md:min-w-0"><EvidenceTracker /></div>
        </aside>
      </div>

      {/* Psychological effect whisper */}
      {showPsychologicalEffect && sanity < 40 && (
        <p className="fixed bottom-4 left-5 text-sm italic fade-in"
          style={{ color: 'var(--color-red)' }}>
          ★ &nbsp; You feel something watching you...
        </p>
      )}
    </div>
  )
}

export default Game
