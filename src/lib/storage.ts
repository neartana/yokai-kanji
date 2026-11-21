export type Progress = {
  xp: number
  streak: number
  bestStreak: number
  masteredIds: string[]
  wrongIds: string[]
  unlockedYokai: string[]
  lastPlayed: string
}

const KEY = 'yokai-kanji-progress-v1'

export const emptyProgress = (): Progress => ({
  xp: 0,
  streak: 0,
  bestStreak: 0,
  masteredIds: [],
  wrongIds: [],
  unlockedYokai: [],
  lastPlayed: '',
})

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Progress
    return { ...emptyProgress(), ...parsed }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress))
}
