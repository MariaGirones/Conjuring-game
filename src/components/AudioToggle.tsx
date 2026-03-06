import { useAudio } from '../hooks/useAudio'

/**
 * AudioToggle — mutes / unmutes all game audio.
 * The preference is persisted in localStorage via AudioManager.
 */
function AudioToggle() {
  const { settings, toggleAudio } = useAudio()

  return (
    <button
      onClick={toggleAudio}
      className="px-3 py-1 rounded text-sm transition-colors
        bg-stone-200 hover:bg-stone-300 text-stone-800
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
      title={settings.enabled ? 'Disable Audio' : 'Enable Audio'}
      aria-label={settings.enabled ? 'Disable Audio' : 'Enable Audio'}
    >
      {settings.enabled ? '🔊' : '🔇'}
    </button>
  )
}

export default AudioToggle
