import { useEffect, useMemo, useRef, useState } from 'react'
import QuizCard from '../components/QuizCard'
import LanternProgress from '../components/LanternProgress'
import { buildChoices, firstReading, pickSession, type KanjiEntry } from '../lib/srs'
import { images } from '../lib/yokai'
import type { Progress } from '../lib/storage'

type Props = {
  mode: 'meaning' | 'reading'
  progress: Progress
  onFinish: (earnedXp: number, correctCount: number, wrong: KanjiEntry[], answered: number, correctEntries: KanjiEntry[]) => void
  onExit: () => void
}

const PRAISE = ['Excellent!', 'Great job!', 'Perfect!', 'Well done!']
const GENTLE = ['Oops!', 'Not quite', 'Almost!']

// Duolingo flow: select an answer, tap CHECK in the fixed bottom bar,
// read the feedback band, tap CONTINUE in the same spot, next question.
// Tapping an answer never advances and never reveals whether it is
// right. The lantern line at the top is the progress bar. The mascot
// beside the feedback is the yokai tied to the question's kanji when
// that kanji has a portrait, otherwise Kitsune as fallback: cheerful
// when correct, subdued when wrong. No new images.
export default function Quiz({ mode, progress, onFinish, onExit }: Props) {
  const session = useMemo(() => pickSession(progress.wrongIds, 10), [progress.wrongIds])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrong, setWrong] = useState<KanjiEntry[]>([])
  const feedbackRef = useRef<HTMLDivElement | null>(null)

  // After CHECK the feedback band sits below the fold on a short
  // screen, behind the fixed bottom bar. Bring it into the middle of
  // the viewport so the learner sees it without scrolling.
  useEffect(() => {
    if (checked) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [checked])

  const entry = session[index]
  const choices = useMemo(() => buildChoices(entry, mode), [entry, mode])
  // The feedback mascot is the yokai of this question's kanji when it
  // has a portrait (Kappa, Kitsune, Tengu, Oni), otherwise Kitsune.
  const feedbackYokai = images[entry.yokai] ? entry.yokai : 'Kitsune'
  const correct = mode === 'meaning' ? entry.meaning : firstReading(entry)
  const prompt = mode === 'meaning' ? 'Pick the correct meaning' : 'Pick the correct reading'
  const isCorrect = checked && selected === correct
  const review = progress.wrongIds
    .map((kanji) => session.find((item) => item.kanji === kanji))
    .filter((item): item is KanjiEntry => item !== undefined)
    .slice(0, 3)

  function select(choice: string) {
    if (checked) return
    setSelected(choice)
  }

  function check() {
    if (selected === null || checked) return
    setChecked(true)
    if (selected === correct) {
      setCorrectCount((value) => value + 1)
    } else {
      setWrong((items) => [...items, entry])
    }
  }

  function next() {
    if (index + 1 >= session.length) {
      const correctEntries = session.filter((item) => !wrong.some((entry) => entry.kanji === item.kanji))
      onFinish(correctCount * 10, correctCount, wrong, session.length, correctEntries)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
    setChecked(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">{mode === 'meaning' ? 'Meaning quiz' : 'Reading quiz'}</h1>
          <p className="mt-2 text-base font-bold tabular-nums text-muted">
            Question {index + 1} of {session.length} · Score {correctCount}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-12 items-center rounded-full border-2 border-control px-5 font-display text-sm font-extrabold uppercase tracking-[0.8px] text-white"
        >
          Exit quiz
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_384px]">
        <div>
          <LanternProgress current={correctCount} total={session.length} />
          <div className="mt-6">
            <QuizCard kanji={entry.kanji} prompt={prompt} choices={choices} selected={selected} correct={correct} checked={checked} onSelect={select} />
          </div>

          {checked && (
            <div
              ref={feedbackRef}
              className={`mt-8 flex items-center gap-6 rounded-[20px] p-6 ${
                isCorrect ? 'bg-correct text-[#0e0d0c]' : 'bg-negative text-white'
              }`}
              role="status"
            >
              <img
                src={images[feedbackYokai]}
                alt={isCorrect ? `${feedbackYokai} cheering` : `${feedbackYokai} looking sorry`}
                className={`h-24 w-24 flex-none object-contain ${isCorrect ? '' : 'opacity-70 grayscale-[35%]'}`}
              />
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold tracking-tight">
                  {isCorrect ? PRAISE[index % PRAISE.length] : GENTLE[index % GENTLE.length]}
                </p>
                {isCorrect ? (
                  <p className="mt-1 text-base font-bold">
                    {entry.kanji} means {entry.meaning}.
                  </p>
                ) : (
                  <p className="mt-1 text-base font-bold">Correct answer: {correct}.</p>
                )}
                <p className="mt-1 text-base">
                  Example: {entry.example} ({entry.exampleReading}) means {entry.exampleEnglish}.
                </p>
              </div>
            </div>
          )}
          <div className="h-28" aria-hidden="true" />
        </div>

        <aside>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-white">This session</h2>
          <div className="mt-3 rounded-[20px] bg-surface px-6 py-2">
            <div className="flex items-center justify-between py-4">
              <span className="text-base font-bold text-muted">Score</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{correctCount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Question</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">
                {index + 1} of {session.length}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Kanji to review</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{progress.wrongIds.length}</span>
            </div>
          </div>

          <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-white">Kanji to review</h2>
          <div className="mt-3 rounded-[20px] bg-surface px-6 py-2">
            {review.length === 0 ? (
              <p className="py-4 text-base text-muted">Nothing to review yet. Wrong answers will appear here.</p>
            ) : (
              review.map((item) => (
                <div key={item.kanji} className="flex items-baseline justify-between gap-6 border-t border-rule py-4 first:border-t-0">
                  <span className="text-xl font-bold text-white">{item.kanji}</span>
                  <span className="text-base text-muted">{item.meaning}</span>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-14 z-10 border-t border-line bg-ground px-6 py-4 md:bottom-0 md:left-[210px] md:px-6">
        <div className="mx-auto max-w-xl">
          {checked ? (
            <button type="button" onClick={next} className="btn-primary w-full">
              {index + 1 >= session.length ? 'See results' : 'Continue'}
            </button>
          ) : (
            <button type="button" onClick={check} disabled={selected === null} className="btn-primary w-full">
              Check
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
