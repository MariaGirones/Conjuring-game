import useGameStore from '../hooks/useGameStore'

interface EndingScreenProps {
  ending: 'SURVIVED' | 'POSSESSED' | 'DEAD'
  sanity: number
  evidence: string[]
}

function EndingScreen({ ending, sanity, evidence }: EndingScreenProps) {
  const { playerName, resetGame } = useGameStore()

  const getEndingContent = () => {
    switch (ending) {
      case 'SURVIVED':
        return {
          title: 'You Survived',
          subtitle: 'THE NIGHT IS OVER',
          // green-700 readable on both light and dark backgrounds
          color: 'text-green-700 dark:text-green-400',
          description: [
            `The morning sun breaks through the mansion windows, and for the first time in what feels like an eternity, you feel warmth on your skin.`,
            `You clutch your evidence—the recordings, the photographs, the artifacts. Proof that something impossible exists in this world.`,
            `As you step through the front door, the house seems to shriek one last time. But it cannot follow you into the daylight. You are free.`,
            `Though you will never truly be free. The memories of this night will haunt you forever. The things you've seen, the entity you've encountered—they've changed you irreversibly.`,
            `But at least you will live to tell of it.`,
          ],
          stats: [
            { label: 'Sanity Remaining', value: `${sanity}/100` },
            { label: 'Evidence Collected', value: evidence.length },
            { label: 'Status', value: 'SURVIVOR' },
          ],
        }
      case 'POSSESSED':
        return {
          title: 'Possessed',
          subtitle: 'THE ENTITY CLAIMS YOU',
          color: 'text-purple-700 dark:text-purple-400',
          description: [
            `The Entity's laugh echoes through your mind as foreign consciousness floods your awareness.`,
            `You feel yourself slipping away, your identity dissolving like morning mist. Your body is no longer your own.`,
            `Hours pass. Days pass. You exist in a twilight state, watching helplessly from somewhere deep within yourself as your body remains trapped in the mansion.`,
            `You are now part of the house. Part of its consciousness. One of countless voices that whisper to the next poor souls who enter.`,
            `Welcome home.`,
          ],
          stats: [
            { label: 'Sanity Final', value: `${sanity}/100` },
            { label: 'Evidence Gathered', value: evidence.length },
            { label: 'Status', value: 'ETERNALLY BOUND' },
          ],
        }
      case 'DEAD':
        return {
          title: 'Game Over',
          subtitle: 'YOUR SANITY HAS SHATTERED',
          color: 'text-red-700 dark:text-red-500',
          description: [
            `The pressure in your mind becomes unbearable. Reality fragments around you.`,
            `You see things that shouldn't exist. You hear voices that shouldn't be possible. The line between what is real and what is imagination dissolves completely.`,
            `In the end, your mind gives out. You collapse, unaware of whether you're alive or dead, conscious or insane.`,
            `The mansion claims another victim.`,
          ],
          stats: [
            { label: 'Sanity Final', value: `${sanity}/100` },
            { label: 'Evidence Collected', value: evidence.length },
            { label: 'Status', value: 'LOST TO MADNESS' },
          ],
        }
    }
  }

  const content = getEndingContent()

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative
      bg-stone-100 text-stone-900 dark:bg-black dark:text-white">

      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-transparent dark:to-black"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className={`text-5xl md:text-6xl font-serif font-bold mb-2 ${content.color}`}>
          {content.title}
        </h1>
        <h2 className="text-2xl mb-8 font-serif italic text-stone-600 dark:text-gray-400">
          {content.subtitle}
        </h2>

        {/* Story paragraphs */}
        <div className="game-panel border-2 rounded p-8 mb-8">
          {content.description.map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-lg leading-relaxed font-serif
              text-stone-800 dark:text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>

        {/* End-game stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {content.stats.map((stat, idx) => (
            <div key={idx} className="rounded p-4
              bg-stone-200 border border-stone-300
              dark:bg-gray-900 dark:border-gray-700">
              <div className="text-sm mb-1 text-stone-500 dark:text-gray-500">{stat.label}</div>
              <div className={`text-2xl font-bold ${content.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Player info */}
        <div className="mb-8 text-stone-600 dark:text-gray-400">
          <p className="text-sm">
            A story witnessed by{' '}
            <span className="font-serif text-stone-900 dark:text-white">{playerName}</span>
          </p>
        </div>

        <button
          onClick={resetGame}
          className="horror-button px-8 py-3 text-lg font-serif"
        >
          Return to the Beginning
        </button>
      </div>
    </div>
  )
}

export default EndingScreen
