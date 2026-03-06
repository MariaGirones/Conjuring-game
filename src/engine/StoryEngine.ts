import levels from '../data/levels.json'

interface Level {
  id: number
  title: string
  description: string
  decisions: Decision[]
}

interface Decision {
  text: string
  consequence: Consequence
  minSanity?: number
  requiredItem?: string
}

interface Consequence {
  text: string
  sanityChange?: number
  item?: string
  evidence?: string
  nextLevel?: number
  dead?: boolean
  ending?: string
}

class StoryEngine {
  getLevel(id: number): Level | undefined {
    return levels.find(l => l.id === id)
  }

  makeChoice(levelId: number, choiceIndex: number): Consequence | null {
    const level = this.getLevel(levelId)
    if (!level) return null
    return level.decisions[choiceIndex]?.consequence || null
  }
}

export default StoryEngine
