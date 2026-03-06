import { useState } from 'react'
import useGameStore from '../hooks/useGameStore'
import ThemeToggle from './ThemeToggle'

function StartScreen() {
  const [inputName, setInputName] = useState('')
  const { setPlayerName } = useGameStore()

  const handleStart = () => {
    if (inputName.trim().length > 0) {
      setPlayerName(inputName)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputName.trim().length > 0) {
      handleStart()
    }
  }

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative
      bg-stone-100 text-stone-900 dark:bg-black dark:text-white">

      {/* Theme toggle — top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Atmospheric background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent dark:to-black"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2 flicker
          text-stone-900 dark:text-white">
          THE CONJURING
        </h1>
        <h2 className="text-xl mb-8 font-serif italic text-red-700 dark:text-red-400">
          A Dark Night Awaits
        </h2>

        <div className="mb-8 text-sm leading-relaxed text-stone-700 dark:text-gray-300">
          <p className="mb-4">
            You stand before an abandoned mansion. A place where the boundaries between worlds grow thin.
          </p>
          <p>
            To survive this night, you must face what lurks within. Enter your name to begin your journey into darkness.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your name..."
            maxLength={30}
            className="w-full px-4 py-3 rounded border-2 font-serif text-center transition-colors focus:outline-none
              bg-stone-200 border-red-800 text-stone-900 placeholder-stone-400 focus:border-red-600
              dark:bg-gray-900 dark:border-red-900 dark:text-white dark:placeholder-gray-600 dark:focus:border-red-600"
            autoFocus
          />
        </div>

        <button
          onClick={handleStart}
          disabled={inputName.trim().length === 0}
          className="w-full horror-button text-lg font-serif"
        >
          Enter the Mansion
        </button>

        <div className="mt-12 text-xs text-stone-500 dark:text-gray-500">
          <p>This game contains psychological horror themes</p>
          <p className="mt-2">Your sanity is fragile. Use caution.</p>
        </div>
      </div>
    </div>
  )
}

export default StartScreen
