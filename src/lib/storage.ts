export type Progress = {
  xp: number
  streak: number
  bestStreak: number
  masteredIds: string[]
  wrongIds: string[]
  unlockedYokai: string[]
  lastPlayed: string
  // Daily counters for the Home quests. dailyDate is the YYYY-MM-DD
  // the two counters belong to; when the date changes the counters
  // reset to zero before the new day's play is added.
  dailyDate: string
  answeredToday: number
  xpToday: number
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
  dailyDate: '',
  answeredToday: 0,
  xpToday: 0,
})

export function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

// The daily quest numbers as of today. A stale dailyDate means the
// counters belong to an earlier day, so they read as zero until the
// next finished session writes fresh ones.
export function todayStats(progress: Progress): { answeredToday: number; xpToday: number; playedToday: boolean } {
  const today = todayString()
  return {
    answeredToday: progress.dailyDate === today ? progress.answeredToday : 0,
    xpToday: progress.dailyDate === today ? progress.xpToday : 0,
    playedToday: progress.lastPlayed === today,
  }
}

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
