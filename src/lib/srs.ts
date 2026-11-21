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
