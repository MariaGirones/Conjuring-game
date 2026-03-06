interface Props {
  story: string
  sanity: number
}

function StoryPanel({ story, sanity }: Props) {
  return (
    <div className="game-panel h-full flex flex-col justify-start">
      {/* story-text color is driven by --color-text-primary CSS variable */}
      <p className="story-text whitespace-pre-wrap">{story}</p>

      {/* Low sanity warning */}
      {sanity < 40 && (
        <div className="mt-4 pt-4 border-t border-red-800/50 text-sm italic animate-pulse
          text-red-700 dark:text-red-400">
          ★ Your mind feels fractured. Reality seems uncertain.
        </div>
      )}

      {/* Critical sanity warning */}
      {sanity < 20 && (
        <div className="mt-2 font-bold text-sm animate-heartbeat text-red-700 dark:text-red-500">
          Your sanity is critical. You may not survive much longer.
        </div>
      )}
    </div>
  )
}

export default StoryPanel
