import { useState } from 'react'
import useGameStore from '../hooks/useGameStore'

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
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2 flicker">
          THE CONJURING
        </h1>
        <h2 className="text-xl text-red-400 mb-8 font-serif italic">A Dark Night Awaits</h2>

        <div className="mb-8 text-gray-300 text-sm leading-relaxed">
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
            className="w-full px-4 py-3 bg-gray-900 border-2 border-red-900 text-white rounded focus:border-red-600 focus:outline-none transition-colors placeholder-gray-600 font-serif text-center"
            autoFocus
          />
        </div>

        <button
          onClick={handleStart}
          disabled={inputName.trim().length === 0}
          className="w-full horror-button text-lg font-serif disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter the Mansion
        </button>

        <div className="mt-12 text-xs text-gray-500">
          <p>⚠️ This game contains psychological horror themes</p>
          <p className="mt-2">Your sanity is fragile. Use caution.</p>
        </div>
      </div>
    </div>
  )
}

export default StartScreen
