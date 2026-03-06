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
          colorStyle: { color: '#15803d' },
          description: [
            `The morning sun breaks through the farmhouse windows, and for the first time in what feels like an eternity, you feel warmth on your skin, ${playerName}.`,
            `You clutch your evidence — the recordings, the photographs, the artifacts. Proof that something impossible walks this world.`,
            `As you step through the front door, the house seems to shriek one last time. But it cannot follow you into the daylight. You are free.`,
            `Though you will never truly be free. The memories of this night will haunt you forever. The things you have seen, the entity you encountered — they have changed you irreversibly.`,
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
          colorStyle: { color: '#7e22ce' },
          description: [
            `Bathsheba's laughter echoes through your mind as a foreign consciousness floods your awareness, ${playerName}.`,
            `You feel yourself slipping away, your identity dissolving like morning mist. Your body is no longer your own.`,
            `Hours pass. Days pass. You exist in a twilight state, watching helplessly from somewhere deep within as your body remains trapped in the farmhouse.`,
            `You are now part of the house. Part of its hunger. One of countless voices that whisper to the next poor souls who enter.`,
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
          colorStyle: { color: '#b91c1c' },
          description: [
            `The pressure in your mind becomes unbearable. Reality fragments around you, ${playerName}.`,
            `You see things that should not exist. You hear voices that should not be possible. The line between what is real and what is imagination dissolves completely.`,
            `In the end, your mind gives out. You collapse, unaware of whether you are alive or dead, conscious or insane.`,
            `The farmhouse claims another victim.`,
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
    <div className="flex items-center justify-center h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>

      {/* Background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(120,0,0,0.4), transparent 70%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2" style={content.colorStyle}>
          {content.title}
        </h1>
        <h2 className="text-2xl mb-8 font-serif italic" style={{ color: 'var(--color-text-secondary)' }}>
          {content.subtitle}
        </h2>

        {/* Story paragraphs */}
        <div className="game-panel border-2 rounded p-8 mb-8">
          {content.description.map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-lg leading-relaxed font-serif"
              style={{ color: 'var(--color-text-secondary)' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* End-game stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {content.stats.map((stat, idx) => (
            <div key={idx} className="rounded p-4"
              style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
              <div className="text-2xl font-bold" style={content.colorStyle}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Player info */}
        <div className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm">
            A case witnessed by{' '}
            <span className="font-serif" style={{ color: 'var(--color-text-primary)' }}>{playerName}</span>
            {' '}— Warren Case File #19
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
