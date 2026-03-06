import React, { useState } from 'react'
import useGameStore from '../hooks/useGameStore'
import ThemeToggle from './ThemeToggle'

function StartScreen() {
  const [inputName, setInputName] = useState('')
  const { setPlayerName } = useGameStore()

  const handleStart = () => {
    if (inputName.trim().length > 0) setPlayerName(inputName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleStart()
  }

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>

      {/* Theme toggle — top-right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,0,0,0.18) 100%)' }} />

      <div className="relative z-10 text-center max-w-sm mx-auto px-6">

        {/* Case file label */}
        <p className="text-xs uppercase tracking-widest font-mono mb-4"
          style={{ color: 'var(--color-text-muted)' }}>
          Warren Case File #19 — Rhode Island, 1971
        </p>

        {/* Main title — Cinzel Decorative via .font-display */}
        <h1 className="font-display text-4xl md:text-5xl mb-1 flicker"
          style={{ color: 'var(--color-text-primary)' }}>
          THE CONJURING
        </h1>

        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="block h-px w-12" style={{ backgroundColor: 'var(--color-border-accent)' }} />
          <p className="text-base italic" style={{ color: 'var(--color-text-secondary)' }}>
            A Paranormal Investigation
          </p>
          <span className="block h-px w-12" style={{ backgroundColor: 'var(--color-border-accent)' }} />
        </div>

        <div className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="mb-3">
            The Perron farmhouse, Rhode Island. Ed and Lorraine Warren investigated
            here in 1971. The entity they encountered was never fully expelled.
          </p>
          <p>
            The house has been waiting since then. You are the next investigator
            to walk through that door. Enter your name to begin.
          </p>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Investigator's name..."
            maxLength={30}
            className="w-full px-4 py-3 rounded-sm border-2 font-serif text-center
              transition-colors focus:outline-none text-base"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border-accent)',
              color: 'var(--color-text-primary)',
            }}
            autoFocus
          />
        </div>

        <button
          onClick={handleStart}
          disabled={inputName.trim().length === 0}
          className="w-full horror-button text-lg"
        >
          Enter the Farmhouse
        </button>

        <p className="mt-10 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Based on the documented Warren investigations.
          <br />
          Contains themes of religious terror and psychological horror.
        </p>
      </div>
    </div>
  )
}

export default StartScreen
