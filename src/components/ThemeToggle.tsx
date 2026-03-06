import { useTheme } from '../hooks/useTheme'

/**
 * ThemeToggle — switches between Dark Mode and Light Mode.
 * The current theme is persisted in localStorage via useTheme.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded text-sm transition-colors
        bg-stone-200 hover:bg-stone-300 text-stone-800
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? '☀️ Light' : '🌑 Dark'}
    </button>
  )
}

export default ThemeToggle
