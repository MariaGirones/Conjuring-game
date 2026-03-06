interface Props {
  story: string
  sanity: number
}

function StoryPanel({ story, sanity }: Props) {
  const distorted = sanity < 50 ? 'blur-sm opacity-75' : ''
  return (
    <div className={`bg-gray-800 p-4 rounded text-white transition-all ${distorted}`}>
      <p className="text-lg leading-relaxed">{story}</p>
    </div>
  )
}

export default StoryPanel