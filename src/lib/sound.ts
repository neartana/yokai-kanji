// Tiny WebAudio sounds. OscillatorNode only, no audio files.
// Sounds play on quiz feedback, boss hits, and victories, and
// nowhere else. Mute is one toggle, kept in LocalStorage, on by
// default. Sound is garnish: any failure stays silent and never
// blocks play.
const KEY = 'yokai-kanji-sound'

let audio: AudioContext | null = null
let muted = false
try {
  muted = localStorage.getItem(KEY) === 'off'
} catch {
  muted = false
}

export function isSoundMuted(): boolean {
  return muted
}

export function setSoundMuted(value: boolean): void {
  muted = value
  try {
    localStorage.setItem(KEY, value ? 'off' : 'on')
  } catch {
    // storage unavailable; the toggle still works for this visit
  }
}

function tone(freq: number, delay: number, length: number, type: OscillatorType, volume: number): void {
  if (muted) return
  try {
    if (!audio) audio = new AudioContext()
    if (audio.state === 'suspended') void audio.resume()
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = type
    osc.frequency.value = freq
    const start = audio.currentTime + delay
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, start + length)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(start)
    osc.stop(start + length + 0.05)
  } catch {
    // silent failure; sound never blocks play
  }
}

export function playCorrect(): void {
  tone(660, 0, 0.14, 'sine', 0.08)
  tone(880, 0.09, 0.2, 'sine', 0.08)
}

export function playWrong(): void {
  tone(180, 0, 0.28, 'triangle', 0.06)
}

export function playVictory(): void {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, index) => tone(freq, index * 0.12, 0.24, 'sine', 0.08))
}
