import { useState, useCallback, useEffect } from 'react'

interface AudioSettings {
  enabled: boolean
  masterVolume: number
  ambientVolume: number
  effectsVolume: number
}

class AudioManager {
  private audioContext: AudioContext | null = null
  private ambientOscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private settings: AudioSettings = {
    enabled: true,
    masterVolume: 0.3,
    ambientVolume: 0.2,
    effectsVolume: 0.5,
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
    if (this.gainNode) {
      this.gainNode.gain.value = this.settings.enabled
        ? this.settings.masterVolume * this.settings.ambientVolume
        : 0
    }
  }

  startAmbient() {
    if (!this.settings.enabled) return

    const ctx = this.initAudioContext()
    if (!ctx) return

    if (!this.ambientOscillator) {
      this.ambientOscillator = ctx.createOscillator()
      this.gainNode = ctx.createGain()

      // Create a low-frequency oscillator for ambient horror sound
      this.ambientOscillator.frequency.setValueAtTime(80, ctx.currentTime)
      this.ambientOscillator.type = 'sawtooth'

      this.gainNode.gain.setValueAtTime(this.settings.masterVolume * this.settings.ambientVolume, ctx.currentTime)

      this.ambientOscillator.connect(this.gainNode)
      this.gainNode.connect(ctx.destination)

      this.ambientOscillator.start()
    }
  }

  stopAmbient() {
    if (this.ambientOscillator) {
      this.ambientOscillator.stop()
      this.ambientOscillator = null
      this.gainNode = null
    }
  }

  playEffect(effectName: string) {
    if (!this.settings.enabled) return

    const ctx = this.initAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    switch (effectName) {
      case 'whisper':
        oscillator.frequency.setValueAtTime(200 + Math.random() * 400, ctx.currentTime)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)
        break
      case 'heartbeat':
        oscillator.frequency.setValueAtTime(60, ctx.currentTime)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
        break
      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    }

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + (effectName === 'whisper' ? 2 : 1))
  }
}

const audioManager = new AudioManager()

export function useAudio() {
  const [settings, setSettings] = useState(audioManager.getSettings())

  const updateSettings = useCallback(() => {
    setSettings(audioManager.getSettings())
  }, [])

  useEffect(() => {
    updateSettings()
  }, [updateSettings])

  return {
    settings,
    startAmbient: useCallback(() => audioManager.startAmbient(), []),
    stopAmbient: useCallback(() => audioManager.stopAmbient(), []),
    playEffect: useCallback((effect: string) => audioManager.playEffect(effect), []),
    toggleAudio: useCallback(() => {
      audioManager.toggleAudio()
      updateSettings()
    }, [updateSettings]),
    setMasterVolume: useCallback((vol: number) => {
      audioManager.setMasterVolume(vol)
      updateSettings()
    }, [updateSettings]),
    setAmbientVolume: useCallback((vol: number) => {
      audioManager.setAmbientVolume(vol)
      updateSettings()
    }, [updateSettings]),
    setEffectsVolume: useCallback((vol: number) => {
      audioManager.setEffectsVolume(vol)
      updateSettings()
    }, [updateSettings]),
  }
}