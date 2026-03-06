import { useState, useCallback, useEffect } from 'react'

/**
 * Audio system — uses the Web Audio API to synthesize horror ambience
 * and sound effects in real time. No external audio files are required,
 * so the game works as a fully static site.
 *
 * Sound design principles used here:
 *  - Filtered noise instead of raw oscillators → cleaner, less harsh
 *  - BiquadFilter (lowpass / bandpass) smooths the frequency spectrum
 *  - Short ADSR envelopes prevent clicks/pops
 *  - Gain values kept low to avoid clipping
 */

interface AudioSettings {
  enabled: boolean
  masterVolume: number
  ambientVolume: number
  effectsVolume: number
}

class AudioManager {
  private audioContext: AudioContext | null = null

  // Ambient drone: noise source + filter chain + master gain
  private noiseSource:    AudioBufferSourceNode | null = null
  private ambientFilter:  BiquadFilterNode | null = null
  private ambientGain:    GainNode | null = null

  // Subtle tone layer under the noise
  private droneLFO: OscillatorNode | null = null
  private droneOsc: OscillatorNode | null = null
  private droneGain: GainNode | null = null

  private heartbeatInterval: number | null = null

  private settings: AudioSettings = {
    enabled: true,
    masterVolume: 0.3,
    ambientVolume: 0.25,
    effectsVolume: 0.5,
  }

  constructor() {
    this.loadSettings()
  }

  private loadSettings() {
    const stored = localStorage.getItem('audio-settings')
    if (stored) {
      try { this.settings = JSON.parse(stored) } catch {}
    }
  }

  private saveSettings() {
    localStorage.setItem('audio-settings', JSON.stringify(this.settings))
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  /** Build a 2-second white-noise buffer for looping ambient use. */
  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const seconds = 2
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  getSettings() {
    return { ...this.settings }
  }

  setMasterVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.applyVolume()
  }

  setAmbientVolume(volume: number) {
    this.settings.ambientVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.applyVolume()
  }

  setEffectsVolume(volume: number) {
    this.settings.effectsVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  toggleAudio() {
    this.settings.enabled = !this.settings.enabled
    this.saveSettings()
    this.applyVolume()
  }

  private applyVolume() {
    const target = this.settings.enabled
      ? this.settings.masterVolume * this.settings.ambientVolume
      : 0
    const ctx = this.audioContext
    if (this.ambientGain && ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.1)
    }
    if (this.droneGain && ctx) {
      this.droneGain.gain.linearRampToValueAtTime(target * 0.4, ctx.currentTime + 0.1)
    }
  }

  /**
   * Start the ambient soundscape:
   *   1. Looping white noise → lowpass BiquadFilter (dark rumble)
   *   2. Slow sine LFO modulates the filter cutoff for an eerie sweep
   *   3. Subtle low-frequency sine drone underneath
   */
  startAmbient() {
    if (!this.settings.enabled) return
    const ctx = this.getContext()
    if (!ctx || this.noiseSource) return  // already running

    const vol = this.settings.masterVolume * this.settings.ambientVolume

    // ── Noise layer ──────────────────────────────────
    const noiseBuffer = this.createNoiseBuffer(ctx)

    this.noiseSource = ctx.createBufferSource()
    this.noiseSource.buffer = noiseBuffer
    this.noiseSource.loop = true

    // Lowpass filter: cuts harsh high frequencies, leaves a deep rumble
    this.ambientFilter = ctx.createBiquadFilter()
    this.ambientFilter.type = 'lowpass'
    this.ambientFilter.frequency.setValueAtTime(300, ctx.currentTime)
    this.ambientFilter.Q.setValueAtTime(1.5, ctx.currentTime)

    // Slow LFO sweeps the filter cutoff: 200 Hz – 600 Hz over ~8 s
    const filterLFO = ctx.createOscillator()
    const filterLFOGain = ctx.createGain()
    filterLFO.frequency.setValueAtTime(0.12, ctx.currentTime)
    filterLFOGain.gain.setValueAtTime(200, ctx.currentTime)
    filterLFO.connect(filterLFOGain)
    filterLFOGain.connect(this.ambientFilter.frequency)

    this.ambientGain = ctx.createGain()
    this.ambientGain.gain.setValueAtTime(vol, ctx.currentTime)

    this.noiseSource.connect(this.ambientFilter)
    this.ambientFilter.connect(this.ambientGain)
    this.ambientGain.connect(ctx.destination)

    filterLFO.start()
    this.noiseSource.start()

    // ── Drone layer ───────────────────────────────────
    // Very slow LFO (0.05 Hz) wobbles the drone pitch slightly
    this.droneLFO = ctx.createOscillator()
    const droneLFOGain = ctx.createGain()
    this.droneLFO.frequency.setValueAtTime(0.05, ctx.currentTime)
    droneLFOGain.gain.setValueAtTime(2, ctx.currentTime)
    this.droneLFO.connect(droneLFOGain)

    this.droneOsc = ctx.createOscillator()
    this.droneOsc.type = 'sine'
    this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime)  // low A
    droneLFOGain.connect(this.droneOsc.frequency)

    this.droneGain = ctx.createGain()
    this.droneGain.gain.setValueAtTime(vol * 0.4, ctx.currentTime)

    this.droneOsc.connect(this.droneGain)
    this.droneGain.connect(ctx.destination)

    this.droneLFO.start()
    this.droneOsc.start()
  }

  stopAmbient() {
    try { this.noiseSource?.stop() } catch {}
    try { this.droneOsc?.stop() } catch {}
    try { this.droneLFO?.stop() } catch {}

    this.noiseSource = null
    this.ambientFilter = null
    this.ambientGain = null
    this.droneOsc = null
    this.droneLFO = null
    this.droneGain = null

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * One-shot sound effects.
   *
   * 'whisper'   — bandpass-filtered noise burst, fades in/out
   * 'heartbeat' — rhythmic sine pulses with low-shelf boost
   */
  playEffect(effectName: string) {
    if (!this.settings.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const effVol = this.settings.masterVolume * this.settings.effectsVolume

    switch (effectName) {

      case 'whisper': {
        // Bandpass-filtered noise sounds like a distant breathy whisper
        for (let i = 0; i < 3; i++) {
          const buf = this.createNoiseBuffer(ctx)
          const src = ctx.createBufferSource()
          src.buffer = buf

          const bp = ctx.createBiquadFilter()
          bp.type = 'bandpass'
          bp.frequency.setValueAtTime(1200 + Math.random() * 600, ctx.currentTime)
          bp.Q.setValueAtTime(8, ctx.currentTime)

          const env = ctx.createGain()
          const start = ctx.currentTime + i * 0.3
          env.gain.setValueAtTime(0, start)
          env.gain.linearRampToValueAtTime(effVol * 0.15, start + 0.4)
          env.gain.exponentialRampToValueAtTime(0.0001, start + 1.5)

          src.connect(bp)
          bp.connect(env)
          env.connect(ctx.destination)

          src.start(start)
          src.stop(start + 1.6)
        }
        break
      }

      case 'heartbeat': {
        // Clear stale interval first
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval)
          this.heartbeatInterval = null
        }

        const beat = (delay: number, peakVol: number) => {
          if (!ctx) return
          // Body of the beat: low sine
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(65, ctx.currentTime + delay)

          // Low-shelf boosts body / punchiness
          const shelf = ctx.createBiquadFilter()
          shelf.type = 'lowshelf'
          shelf.frequency.setValueAtTime(120, ctx.currentTime + delay)
          shelf.gain.setValueAtTime(6, ctx.currentTime + delay)

          const env = ctx.createGain()
          env.gain.setValueAtTime(0, ctx.currentTime + delay)
          env.gain.linearRampToValueAtTime(peakVol * effVol, ctx.currentTime + delay + 0.04)
          env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.35)

          osc.connect(shelf)
          shelf.connect(env)
          env.connect(ctx.destination)

          osc.start(ctx.currentTime + delay)
          osc.stop(ctx.currentTime + delay + 0.4)
        }

        beat(0, 0.6)    // lub
        beat(0.4, 0.4)  // dub

        this.heartbeatInterval = window.setInterval(() => {
          if (this.settings.enabled) {
            beat(0, 0.6)
            beat(0.4, 0.4)
          }
        }, 1200)
        break
      }

      case 'click': {
        // Ominous creak: short highpass noise burst + falling pitch
        const buf = this.createNoiseBuffer(ctx)
        const src = ctx.createBufferSource()
        src.buffer = buf

        const hp = ctx.createBiquadFilter()
        hp.type = 'bandpass'
        hp.frequency.setValueAtTime(800, ctx.currentTime)
        hp.Q.setValueAtTime(4, ctx.currentTime)

        const env = ctx.createGain()
        env.gain.setValueAtTime(effVol * 0.18, ctx.currentTime)
        env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)

        src.connect(hp)
        hp.connect(env)
        env.connect(ctx.destination)

        src.start()
        src.stop(ctx.currentTime + 0.2)
        break
      }

      default: {
        // Soft sine blip fallback
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(330, ctx.currentTime)

        const env = ctx.createGain()
        env.gain.setValueAtTime(effVol * 0.2, ctx.currentTime)
        env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)

        osc.connect(env)
        env.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.4)
      }
    }
  }
}

// Singleton — shared across the whole app lifetime
const audioManager = new AudioManager()

export function useAudio() {
  const [settings, setSettings] = useState(() => audioManager.getSettings())

  const updateSettings = useCallback(() => {
    setSettings(audioManager.getSettings())
  }, [])

  useEffect(() => {
    updateSettings()
  }, [updateSettings])

  return {
    settings,
    startAmbient:    useCallback(() => audioManager.startAmbient(), []),
    stopAmbient:     useCallback(() => audioManager.stopAmbient(), []),
    playEffect:      useCallback((effect: string) => audioManager.playEffect(effect), []),
    toggleAudio:     useCallback(() => { audioManager.toggleAudio(); updateSettings() }, [updateSettings]),
    setMasterVolume: useCallback((v: number) => { audioManager.setMasterVolume(v); updateSettings() }, [updateSettings]),
    setAmbientVolume:useCallback((v: number) => { audioManager.setAmbientVolume(v); updateSettings() }, [updateSettings]),
    setEffectsVolume:useCallback((v: number) => { audioManager.setEffectsVolume(v); updateSettings() }, [updateSettings]),
  }
}
