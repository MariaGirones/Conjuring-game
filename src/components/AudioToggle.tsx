import { useAudio } from '../hooks/useAudio'

function AudioToggle() {
  const { audioEnabled, toggleAudio } = useAudio()

  return (
    <button
      onClick={toggleAudio}
      className="p-2 rounded border border-gray-600 hover:border-gray-400 transition-colors"
      title={audioEnabled ? 'Disable audio' : 'Enable audio'}
      aria-label="Toggle audio"
    >
      {audioEnabled ? '🔊' : '🔇'}
    </button>
  )
}

export default AudioToggle
