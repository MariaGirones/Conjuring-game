import { useAudio } from '../hooks/useAudio'

function AudioToggle() {
  const { settings, toggleAudio } = useAudio()

  return (
    <button
      onClick={toggleAudio}
      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
      title={settings.enabled ? 'Disable Audio' : 'Enable Audio'}
    >
      {settings.enabled ? '🔊' : '🔇'}
    </button>
  )
}

export default AudioToggle