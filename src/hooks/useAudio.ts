import { useState, useCallback, useEffect } from 'react'

interface AudioSettings {
  enabled: boolean
  masterVolume: number
  ambientVolume: number
  effectsVolume: number
}

class AudioManager {
  private audioContext: AudioContext | null = null
  private ambientAudio: HTMLAudioElement | null = null
  private settings: AudioSettings = {
    enabled: true,
    masterVolume: 0.5,
    ambientVolume: 0.3,
    effectsVolume: 0.6,
  }

  constructor() {
    this.loadSettings()
  }

  private loadSettings() {
    const stored = localStorage.getItem('audio-settings')
    if (stored) {
      this.settings = JSON.parse(stored)
    }
  }

  private saveSettings() {
    localStorage.setItem('audio-settings', JSON.stringify(this.settings))
  }

  initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  getSettings() {
    return this.settings
  }

  setMasterVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.updateVolumes()
  }

  setAmbientVolume(volume: number) {
    this.settings.ambientVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.updateVolumes()
  }

  setEffectsVolume(volume: number) {
    this.settings.effectsVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  toggleAudio() {
    this.settings.enabled = !this.settings.enabled
    this.saveSettings()
    this.updateVolumes()
  }

  private updateVolumes() {
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.settings.enabled
        ? this.settings.masterVolume * this.settings.ambientVolume
        : 0
    }
  }

  startAmbient() {
    if (!this.settings.enabled) return

    if (!this.ambientAudio) {
      this.ambientAudio = new Audio('/audio/ambient-horror.mp3')
      this.ambientAudio.loop = true
      this.ambientAudio.volume = this.settings.masterVolume * this.settings.ambientVolume
    }

    if (this.ambientAudio.paused) {
      this.ambientAudio.play().catch(() => {
        // Audio autoplay prevented
      })
    }
  }

  stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause()
    }
  }

  playEffect(effectName: string) {
    if (!this.settings.enabled) return

    const audio = new Audio(`/audio/effects/${effectName}.mp3`)
    audio.volume = this.settings.masterVolume * this.settings.effectsVolume
    audio.play().catch(() => {
      // Audio autoplay prevented
    })
  }

  playHeartbeat() {
    if (!this.settings.enabled) return
    this.playEffect('heartbeat')
  }

  playWhisper() {
    if (!this.settings.enabled) return
    this.playEffect('whisper')
  }

  playScare() {
    if (!this.settings.enabled) return
    this.playEffect('scare')
  }
}

const audioManager = new AudioManager()

export function useAudio() {
  const [audioEnabled, setAudioEnabled] = useState(audioManager.getSettings().enabled)
  const [masterVolume, setMasterVolume] = useState(audioManager.getSettings().masterVolume)

  useEffect(() => {
    audioManager.initAudioContext()
  }, [])

  const toggleAudio = useCallback(() => {
    audioManager.toggleAudio()
    setAudioEnabled(audioManager.getSettings().enabled)
  }, [])

  const setVolume = useCallback((volume: number) => {
    audioManager.setMasterVolume(volume)
    setMasterVolume(volume)
  }, [])

  const playEffect = useCallback((effect: string) => {
    audioManager.playEffect(effect)
  }, [])

  const startAmbient = useCallback(() => {
    audioManager.startAmbient()
  }, [])

  const stopAmbient = useCallback(() => {
    audioManager.stopAmbient()
  }, [])

  return {
    audioEnabled,
    masterVolume,
    toggleAudio,
    setVolume,
    playEffect,
    startAmbient,
    stopAmbient,
  }
}

export default audioManager
