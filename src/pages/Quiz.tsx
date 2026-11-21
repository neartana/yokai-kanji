import { useMemo, useState } from 'react'
import QuizCard from '../components/QuizCard'
import LanternProgress from '../components/LanternProgress'
import { buildChoices, firstReading, pickSession, type KanjiEntry } from '../lib/srs'
import type { Progress } from '../lib/storage'

type Props = {
  mode: 'meaning' | 'reading'
  progress: Progress
  onFinish: (earnedXp: number, correctCount: number, wrong: KanjiEntry[]) => void
  onExit: () => void
}

export default function Quiz({ mode, progress, onFinish, onExit }: Props) {
  const session = useMemo(() => pickSession(progress.wrongIds, 10), [progress.wrongIds])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrong, setWrong] = useState<KanjiEntry[]>([])

  const entry = session[index]
  const choices = useMemo(() => buildChoices(entry, mode), [entry, mode])
  const correct = mode === 'meaning' ? entry.meaning : firstReading(entry)
  const prompt = mode === 'meaning' ? 'Pick the correct meaning' : 'Pick the correct reading'

  function select(choice: string) {
    if (selected !== null) return
    setSelected(choice)
    if (choice === correct) {
      setCorrectCount((value) => value + 1)
    } else {
      setWrong((items) => [...items, entry])
    }
  }

  function next() {
    if (index + 1 >= session.length) {
      onFinish(correctCount + (selected === correct ? 1 : 0), correctCount + (selected === correct ? 1 : 0), wrong)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onExit} className="text-sm text-slate-400">Exit quiz</button>
        <span className="text-sm text-slate-300">Score: {correctCount}</span>
      </div>
      <LanternProgress current={index + 1} total={session.length} />
      <div className="mt-4">
        <QuizCard kanji={entry.kanji} prompt={prompt} choices={choices} selected={selected} correct={correct} onSelect={select} />
      </div>
      {selected !== null && (
        <div className="mt-4 rounded-lg bg-slate-900 p-4 text-center">
          <p className="text-slate-200">{selected === correct ? 'Correct. The yokai retreats.' : `Wrong. Correct answer: ${correct}.`}</p>
          <p className="mt-1 text-sm text-slate-400">Example: {entry.example} ({entry.exampleReading}) means {entry.exampleEnglish}.</p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-amber-500 px-4 py-2 font-bold text-slate-950">{index + 1 >= session.length ? 'See results' : 'Next question'}</button>
        </div>
      )}
    </div>
  )
}
