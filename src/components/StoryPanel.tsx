interface Props {
  story: string
  sanity: number
}

function StoryPanel({ story, sanity }: Props) {
  return (
    <div className="story-panel">
      <p className="story-text whitespace-pre-wrap">{story}</p>

      {sanity < 40 && (
        <div className="mt-6 pt-4 border-t border-red-900/40 text-sm italic whisper"
          style={{ color: 'var(--color-red)' }}>
          ★ &nbsp; Your mind feels fractured. Reality seems uncertain.
        </div>
      )}

      {sanity < 20 && (
        <div className="mt-2 text-sm font-semibold heartbeat"
          style={{ color: 'var(--color-red)' }}>
          Your sanity is critical. You may not survive much longer.
        </div>
      )}
    </div>
  )
}

export default StoryPanel
