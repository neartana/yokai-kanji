import { useMemo, useState } from 'react'
import QuizCard from '../components/QuizCard'
import { LanternIcon } from '../components/LanternProgress'
import { buildChoices, pickSession, yokaiList, type KanjiEntry } from '../lib/srs'
import { images } from '../lib/yokai'
import { playCorrect, playVictory, playWrong } from '../lib/sound'
import type { Progress } from '../lib/storage'
import type { SessionRecord } from '../App'

type Props = {
  progress: Progress
  onBattleEnd: (record: SessionRecord) => { metYokai: string | null; totalXp: number }
  onExit: () => void
}

type Phase = 'fight' | 'won' | 'lost'

const PRAISE = ['Excellent!', 'Great job!', 'Perfect!', 'Well done!']
const GENTLE = ['Oops!', 'Not quite', 'Almost!']

// Boss battle: the same quiz engine as a normal meaning quiz, but
// every correct answer is a hit on the Oni. Five hits (20 damage
// each) bring its 100 HP to zero and win the battle. Every wrong
// answer costs one of the player's 3 lanterns; losing all three
// loses the battle. The battle ends early on a win or a loss, or
// after the 10th question with the Oni still standing. A win meets
// the next yokai and carries a 50 XP bonus; a loss still keeps the
// session XP and the daily quest counters, exactly like a quiz.
export default function Boss({ progress, onBattleEnd, onExit }: Props) {
  const [round, setRound] = useState(0)
  const session = useMemo(() => pickSession(progress.wrongIds, 10), [progress.wrongIds, round])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrong, setWrong] = useState<KanjiEntry[]>([])
  const [bossHp, setBossHp] = useState(100)
  const [lanterns, setLanterns] = useState(3)
  const [phase, setPhase] = useState<Phase>('fight')
  const [lostReason, setLostReason] = useState<'lanterns' | 'stood'>('lanterns')
  const [hitCount, setHitCount] = useState(0)
  const [damage, setDamage] = useState<{ key: number } | null>(null)
  const [endInfo, setEndInfo] = useState<{ metYokai: string | null; totalXp: number } | null>(null)

  const entry = session[index]
  const choices = useMemo(() => buildChoices(entry, 'meaning'), [entry])
  const correct = entry.meaning
  const feedbackYokai = images[entry.yokai] ? entry.yokai : 'Kitsune'
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
      setBossHp((value) => Math.max(0, value - 20))
      const key = hitCount + 1
      setHitCount(key)
      setDamage({ key })
      playCorrect()
    } else {
      setWrong((items) => [...items, entry])
      setLanterns((value) => value - 1)
      playWrong()
    }
  }

  function endBattle(won: boolean, reason: 'lanterns' | 'stood') {
    const answered = index + 1
    const correctEntries = session.slice(0, answered).filter((item) => !wrong.some((w) => w.kanji === item.kanji))
    const info = onBattleEnd({
      correctCount,
      wrong,
      answered,
      correctEntries,
      bonusXp: won ? 50 : 0,
      meetNext: won,
    })
    setEndInfo(info)
    if (won) {
      setPhase('won')
      playVictory()
    } else {
      setLostReason(reason)
      setPhase('lost')
    }
  }

  function next() {
    if (bossHp <= 0) {
      endBattle(true, 'lanterns')
      return
    }
    if (lanterns <= 0) {
      endBattle(false, 'lanterns')
      return
    }
    if (index + 1 >= session.length) {
      endBattle(false, 'stood')
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
    setChecked(false)
  }

  function reset() {
    setRound((value) => value + 1)
    setIndex(0)
    setSelected(null)
    setChecked(false)
    setCorrectCount(0)
    setWrong([])
    setBossHp(100)
    setLanterns(3)
    setPhase('fight')
    setDamage(null)
    setEndInfo(null)
  }

  const metEntry = endInfo?.metYokai ? yokaiList().find((item) => item.name === endInfo.metYokai) : undefined

  if (phase === 'won') {
    return (
      <div className="mx-auto max-w-xl pt-6 text-center">
        <img src="/mascots/oni.png" alt="Oni defeated" className="mx-auto h-40 w-40 object-contain opacity-40 grayscale" />
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Oni defeated!</h1>
        {endInfo?.metYokai && metEntry && (
          <div className="mt-6 rounded-[20px] bg-surface p-6">
            {images[endInfo.metYokai] ? (
              <img src={images[endInfo.metYokai]} alt={`${endInfo.metYokai} plush mascot`} className="anim-bounce-once mx-auto h-28 w-28 object-contain" />
            ) : (
              <span className="mx-auto flex h-28 w-28 items-center justify-center text-6xl text-faint">{metEntry.kanji}</span>
            )}
            <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-lantern">You met {endInfo.metYokai}!</p>
          </div>
        )}
        <p className="mt-6 text-base font-bold text-muted">
          You earned {endInfo?.totalXp ?? 0} XP, including a 50 XP boss bonus.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button type="button" onClick={onExit} className="btn-primary">
            Back to home
          </button>
          <button type="button" onClick={reset} className="btn-secondary">
            Battle again
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'lost') {
    return (
      <div className="mx-auto max-w-xl pt-6 text-center">
        <img src="/mascots/oni.png" alt="Oni still standing" className="mx-auto h-40 w-40 object-contain" />
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">The Oni stands strong.</h1>
        <p className="mt-2 text-base font-bold text-muted">
          {lostReason === 'lanterns' ? 'You lost all 3 lanterns.' : 'Ten questions, and the Oni is still standing.'}
        </p>
        <p className="mt-2 text-base font-bold text-muted">You still earned {endInfo?.totalXp ?? 0} XP from the battle.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Retry
          </button>
          <button type="button" onClick={onExit} className="btn-secondary">
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Boss battle: Oni</h1>
          <p className="mt-2 text-base font-bold tabular-nums text-muted">
            Question {index + 1} of {session.length} · Hits {correctCount}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-12 items-center rounded-full border-2 border-control px-5 font-display text-sm font-extrabold uppercase tracking-[0.8px] text-white"
        >
          Exit battle
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_384px]">
        <div>
          <div className="relative mx-auto w-fit">
            <img
              key={hitCount}
              src="/mascots/oni.png"
              alt="Oni plush mascot"
              className={`h-44 w-44 object-contain ${hitCount > 0 ? 'anim-shake-once' : ''}`}
            />
            {damage && (
              <span key={damage.key} className="damage-float pointer-events-none absolute -top-1 right-0 font-display text-2xl font-extrabold text-lantern">
                -20
              </span>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <p className="text-base font-bold text-muted">Oni HP</p>
              <p className="font-display text-xl font-extrabold tabular-nums text-white">{bossHp} / 100</p>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={bossHp} aria-valuemin={0} aria-valuemax={100} aria-label="Oni HP">
              <div className="h-full rounded-full bg-negative transition-[width] duration-300 ease-out" style={{ width: `${bossHp}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <p className="text-base font-bold text-muted">Your lanterns</p>
              {[0, 1, 2].map((i) => (
                <LanternIcon key={i} lit={i < lanterns} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <QuizCard kanji={entry.kanji} prompt="Pick the correct meaning" choices={choices} selected={selected} correct={correct} checked={checked} onSelect={select} />
          </div>

          {checked && (
            <div
              className={`mt-8 flex items-center gap-6 rounded-[20px] p-6 ${
                isCorrect ? 'bg-correct text-[#0e0d0c]' : 'bg-negative text-white'
              }`}
              role="status"
            >
              <img
                src={images[feedbackYokai]}
                alt={isCorrect ? `${feedbackYokai} cheering` : `${feedbackYokai} looking sorry`}
                className={`h-24 w-24 flex-none object-contain ${isCorrect ? 'anim-bounce-once' : 'anim-shake-once opacity-70 grayscale-[35%]'}`}
              />
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold tracking-tight">
                  {isCorrect ? PRAISE[index % PRAISE.length] : GENTLE[index % GENTLE.length]}
                </p>
                {isCorrect ? (
                  <p className="mt-1 text-base font-bold">
                    {entry.kanji} means {entry.meaning}. The Oni takes 20 damage.
                  </p>
                ) : (
                  <p className="mt-1 text-base font-bold">Correct answer: {correct}. The Oni strikes back.</p>
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
          <h2 className="font-display text-xl font-extrabold tracking-tight text-white">This battle</h2>
          <div className="mt-3 rounded-[20px] bg-surface px-6 py-2">
            <div className="flex items-center justify-between py-4">
              <span className="text-base font-bold text-muted">Hits landed</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{correctCount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Lanterns left</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{lanterns} / 3</span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Question</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">
                {index + 1} of {session.length}
              </span>
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
