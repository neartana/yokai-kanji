import data from '../data/kanji-n5.json'

export type KanjiEntry = {
  kanji: string
  meaning: string
  onyomi: string
  kunyomi: string
  example: string
  exampleReading: string
  exampleEnglish: string
  yokai: string
}

export const kanjiList = data as KanjiEntry[]

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

export function buildChoices(entry: KanjiEntry, mode: 'meaning' | 'reading'): string[] {
  const correct = mode === 'meaning' ? entry.meaning : firstReading(entry)
  const pool = shuffle(kanjiList.filter((item) => item.kanji !== entry.kanji))
  const distractors = pool
    .slice(0, 3)
    .map((item) => (mode === 'meaning' ? item.meaning : firstReading(item)))
  return shuffle([correct, ...distractors])
}

export function firstReading(entry: KanjiEntry): string {
  const source = entry.kunyomi || entry.onyomi
  return source.split(',')[0].trim()
}

export function pickSession(wrongIds: string[], count = 10): KanjiEntry[] {
  const wrong = kanjiList.filter((item) => wrongIds.includes(item.kanji))
  const rest = shuffle(kanjiList.filter((item) => !wrongIds.includes(item.kanji)))
  return shuffle([...wrong, ...rest]).slice(0, count)
}

// The learning path: 10 stations of 5 kanji each, in data order.
// Station 1 covers kanji 1-5, station 2 covers 6-10, and so on.
export function pathStations(): KanjiEntry[][] {
  const stations: KanjiEntry[][] = []
  for (let i = 0; i < 10; i += 1) {
    stations.push(kanjiList.slice(i * 5, i * 5 + 5))
  }
  return stations
}

// Distinct yokai in the order they first appear in the kanji data.
// One source of truth: Home (next yokai) and Collection (the full list)
// both read this, so the two screens can never disagree about the order
// or the count (36 yokai across 50 kanji).
export function yokaiList(): { name: string; kanji: string }[] {
  const seen = new Map<string, string>()
  for (const item of kanjiList) {
    if (!seen.has(item.yokai)) seen.set(item.yokai, item.kanji)
  }
  return [...seen.entries()].map(([name, kanji]) => ({ name, kanji }))
}
