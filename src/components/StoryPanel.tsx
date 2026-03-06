interface Props {
  story: string
  sanity: number
}

function StoryPanel({ story, sanity }: Props) {
  return (
    <div className="game-panel h-full flex flex-col justify-start">
      <p className="story-text text-white whitespace-pre-wrap">{story}</p>

      {/* Low sanity warning */}
      {sanity < 40 && (
        <div className="mt-4 pt-4 border-t border-red-900/50 text-red-400 text-sm italic animate-pulse">
          ★ Your mind feels fractured. Reality seems uncertain.
        </div>
      )}

      {/* Critical sanity warning */}
      {sanity < 20 && (
        <div className="mt-2 text-red-600 font-bold text-sm animate-heartbeat">
          ⚠️ Your sanity is critical. You may not survive much longer.
        </div>
      )}
    </div>
  )
}

export default StoryPanel