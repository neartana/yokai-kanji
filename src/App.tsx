/*
  Shell: ruled T-frame (true-black-flat, seed 323912568).
  Sidebar 210px, top bar 64px, divided only by 1px rules #1a1a1a on the
  warm near-black ground #0e0d0c. The active nav item is marked only by
  its label going from #bbb to #fff. On the phone the sidebar becomes a
  56px bottom bar of the four destinations and the top bar stays 52px.

  Grid arithmetic, at 1440: 1440 - 210 sidebar - 2 x 29 gutter = 1172
  canvas. Home: 1172 - 384 rail - 24 gap = 764 main column. KPI strip:
  3 equal cells split by 1px dividers. One gutter (24px) horizontally
  and vertically. Duolingo round: Baloo 2 display + Nunito body, tactile
  amber primary buttons, fixed CHECK / CONTINUE bar in the quiz.

  Games round: recordSession is the one place progress changes. A
  finished session is 10 answered questions, so the daily quest
  counters advance here by the exact numbers the session produced,
  never by guessing. Meeting a yokai is gated on 10 correct in a row:
  a perfect 10-question session meets the next yokai in yokaiList()
  order, and a boss victory meets the next yokai too. The boss and
  memory match screens are states here, not nav items; the sidebar
  and bottom bar stay Home, Meaning quiz, Reading quiz, Collection.
*/
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Boss from './pages/Boss'
import Match from './pages/Match'
import Collection from './pages/Collection'
import LanternProgress, { LanternIcon } from './components/LanternProgress'
import { loadProgress, saveProgress, type Progress } from './lib/storage'
import { yokaiList, type KanjiEntry } from './lib/srs'
import { images } from './lib/yokai'
import { isSoundMuted, setSoundMuted } from './lib/sound'

type Screen =
  | { name: 'home' }
  | { name: 'quiz'; mode: 'meaning' | 'reading' }
  | { name: 'boss' }
  | { name: 'match' }
  | { name: 'collection' }
  | { name: 'results'; xp: number; correct: number; metYokai?: string | null }

type NavId = 'home' | 'meaning' | 'reading' | 'collection'

const NAV: { id: NavId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'meaning', label: 'Meaning quiz' },
  { id: 'reading', label: 'Reading quiz' },
  { id: 'collection', label: 'Collection' },
]

export type SessionRecord = {
  correctCount: number
  wrong: KanjiEntry[]
  answered: number
  correctEntries: KanjiEntry[]
  bonusXp?: number
  meetNext?: boolean
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [soundOn, setSoundOn] = useState<boolean>(() => !isSoundMuted())

  // A new screen always starts at the top. Without this, opening a
  // game from a scrolled Home keeps the old scroll offset, so the
  // boss portrait or the match title starts cut off at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  // The one place progress changes. XP is correct answers x 10 plus
  // any bonus (a boss victory carries a 50 XP bonus). A kanji answered
  // correctly in a finished session counts as mastered. Meeting a
  // yokai needs 10 correct in a row: a perfect 10-question session
  // meets the next yokai in yokaiList() order, and a boss victory
  // meets the next yokai too. Returns what the session met and earned,
  // so the caller can show it on its end screen.
  function recordSession(record: SessionRecord): { metYokai: string | null; totalXp: number } {
    const today = new Date().toISOString().slice(0, 10)
    const freshDay = progress.dailyDate !== today
    const perfectRun = record.answered >= 10 && record.correctCount === record.answered
    const shouldMeet = record.meetNext === true || perfectRun
    const nextToMeet = shouldMeet ? yokaiList().find((item) => !progress.unlockedYokai.includes(item.name)) : undefined
    const totalXp = record.correctCount * 10 + (record.bonusXp ?? 0)
    const next: Progress = {
      ...progress,
      xp: progress.xp + totalXp,
      streak: record.correctCount > 0 ? progress.streak + 1 : 0,
      bestStreak: Math.max(progress.bestStreak, record.correctCount > 0 ? progress.streak + 1 : progress.streak),
      masteredIds: [...new Set([...progress.masteredIds, ...record.correctEntries.map((item) => item.kanji)])],
      wrongIds: [...new Set(record.wrong.map((item) => item.kanji))],
      unlockedYokai: nextToMeet ? [...progress.unlockedYokai, nextToMeet.name] : progress.unlockedYokai,
      lastPlayed: today,
      dailyDate: today,
      answeredToday: (freshDay ? 0 : progress.answeredToday) + record.answered,
      xpToday: (freshDay ? 0 : progress.xpToday) + totalXp,
    }
    setProgress(next)
    saveProgress(next)
    return { metYokai: nextToMeet?.name ?? null, totalXp }
  }

  function finishQuiz(earnedXp: number, correctCount: number, wrong: KanjiEntry[], answered: number, correctEntries: KanjiEntry[]) {
    const { metYokai } = recordSession({ correctCount, wrong, answered, correctEntries })
    setScreen({ name: 'results', xp: earnedXp, correct: correctCount, metYokai })
  }

  // A memory match win is worth 30 XP, kept in the same store as
  // quiz XP, so the daily XP quest and the XP total both move. It
  // counts as playing today, but it is not a quiz session, so the
  // streak, the mastered list, and the review list stay as they are.
  function awardMatchXp(): void {
    const today = new Date().toISOString().slice(0, 10)
    const freshDay = progress.dailyDate !== today
    const next: Progress = {
      ...progress,
      xp: progress.xp + 30,
      lastPlayed: today,
      dailyDate: today,
      answeredToday: freshDay ? 0 : progress.answeredToday,
      xpToday: (freshDay ? 0 : progress.xpToday) + 30,
    }
    setProgress(next)
    saveProgress(next)
  }

  function toggleSound(): void {
    const next = !soundOn
    setSoundOn(next)
    setSoundMuted(!next)
  }

  function go(id: NavId) {
    if (id === 'home') setScreen({ name: 'home' })
    if (id === 'meaning') setScreen({ name: 'quiz', mode: 'meaning' })
    if (id === 'reading') setScreen({ name: 'quiz', mode: 'reading' })
    if (id === 'collection') setScreen({ name: 'collection' })
  }

  const activeNav: NavId =
    screen.name === 'collection'
      ? 'collection'
      : screen.name === 'quiz'
        ? screen.mode
        : 'home'

  const topLabel =
    screen.name === 'home'
      ? 'Home'
      : screen.name === 'quiz'
        ? screen.mode === 'meaning'
          ? 'Meaning quiz'
          : 'Reading quiz'
        : screen.name === 'boss'
          ? 'Boss battle'
          : screen.name === 'match'
            ? 'Memory match'
            : screen.name === 'collection'
              ? 'Collection'
              : 'Session complete'

  const topScope =
    screen.name === 'home'
      ? `Streak ${progress.streak} · XP ${progress.xp}`
      : screen.name === 'quiz'
        ? '10 questions · N5 kanji'
        : screen.name === 'boss'
          ? 'Oni · 100 HP'
          : screen.name === 'match'
            ? '6 pairs · Ofuda'
            : screen.name === 'collection'
              ? `${progress.unlockedYokai.length} of 36 met`
              : `Earned ${screen.xp} XP`

  // Results screen: the next unmet yokai with a portrait, Kappa first,
  // then Tengu, Oni, Yuki-onna, Tanuki, Kodama, Kitsune. Kitsune is the fallback when all seven
  // are already met.
  const portraitOrder = ['Kappa', 'Tengu', 'Oni', 'Yuki-onna', 'Tanuki', 'Kodama', 'Kitsune']
  const nextPortrait = portraitOrder.find((name) => !progress.unlockedYokai.includes(name)) ?? 'Kitsune'
  const metEntry = screen.name === 'results' && screen.metYokai ? yokaiList().find((item) => item.name === screen.metYokai) : undefined

  return (
    <div className="min-h-screen bg-ground font-sans text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-[210px] flex-col border-r border-line bg-ground md:flex">
        <div className="flex h-16 flex-none items-center gap-2.5 border-b border-line px-5">
          <LanternIcon lit />
          <div>
            <p className="font-display text-base font-extrabold leading-5 tracking-tight text-white">Yokai Kanji</p>
            <p className="text-xs leading-4 text-faint">N5 · 50 kanji</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4" aria-label="Sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={activeNav === item.id ? 'page' : undefined}
              className={`flex h-[34px] w-full items-center rounded-lg px-2 text-left text-sm font-bold ${
                activeNav === item.id ? 'text-white' : 'text-[#bbbbbb]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex-none border-t border-line px-5 py-4">
          <p className="text-xs tabular-nums text-faint">Best streak {progress.bestStreak}</p>
        </div>
      </aside>

      <div className="md:pl-[210px]">
        <header className="flex h-[52px] items-center justify-between border-b border-line px-6 md:h-16">
          <p className="text-sm text-muted">{topLabel}</p>
          <div className="flex items-center gap-4">
            <p className="text-sm tabular-nums text-muted">{topScope}</p>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="text-sm font-bold text-muted"
            >
              {soundOn ? 'Sound on' : 'Sound off'}
            </button>
          </div>
        </header>
        <main className="px-6 pb-24 pt-8 md:px-6 md:pb-10">
          {screen.name === 'home' && (
            <Home
              progress={progress}
              onStart={(mode) => setScreen({ name: 'quiz', mode })}
              onBoss={() => setScreen({ name: 'boss' })}
              onMatch={() => setScreen({ name: 'match' })}
            />
          )}
          {screen.name === 'quiz' && <Quiz mode={screen.mode} progress={progress} onFinish={finishQuiz} onExit={() => setScreen({ name: 'home' })} />}
          {screen.name === 'boss' && <Boss progress={progress} onBattleEnd={recordSession} onExit={() => setScreen({ name: 'home' })} />}
          {screen.name === 'match' && <Match onAwardXp={awardMatchXp} onExit={() => setScreen({ name: 'home' })} />}
          {screen.name === 'collection' && <Collection progress={progress} onBack={() => setScreen({ name: 'home' })} />}
          {screen.name === 'results' && (
            <div className="mx-auto max-w-xl pt-6 text-center">
              {screen.metYokai && metEntry ? (
                <>
                  {images[screen.metYokai] ? (
                    <img src={images[screen.metYokai]} alt={`${screen.metYokai} plush mascot`} className="anim-bounce-once mx-auto h-28 w-28 object-contain" />
                  ) : (
                    <span className="mx-auto flex h-28 w-28 items-center justify-center text-6xl text-faint">{metEntry.kanji}</span>
                  )}
                  <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-lantern">You met {screen.metYokai}!</p>
                </>
              ) : (
                <>
                  <img src={images[nextPortrait]} alt={`${nextPortrait} plush mascot`} className="mx-auto h-28 w-28 object-contain" />
                  <p className="mt-2 text-base font-bold text-muted">Next yokai to meet: {nextPortrait}</p>
                </>
              )}
              <div className="mt-6">
                <LanternProgress current={screen.correct} total={10} />
              </div>
              <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Session complete</h1>
              <p className="mt-2 text-base font-bold text-muted">
                You answered {screen.correct} of 10 correctly and earned {screen.correct * 10} XP.
              </p>
              <button type="button" onClick={() => setScreen({ name: 'home' })} className="btn-primary mt-8">
                Back to home
              </button>
            </div>
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex h-14 items-stretch border-t border-line bg-ground md:hidden" aria-label="Sections">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center text-xs font-bold ${
              activeNav === item.id ? 'text-white' : 'text-[#bbbbbb]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Home only: START MEANING QUIZ is always visible, fixed above
          the mobile bottom nav and above the page bottom on desktop.
          The quiz, boss, match and collection screens keep their own
          bottom bars and never get a second one. Home adds its own
          bottom padding so the last learning-path station scrolls
          clear of this bar. */}
      {screen.name === 'home' && (
        <div className="fixed inset-x-0 bottom-14 z-10 border-t border-line bg-ground px-6 py-4 md:bottom-0 md:left-[210px] md:px-6">
          <div className="mx-auto max-w-xl">
            <button type="button" onClick={() => setScreen({ name: 'quiz', mode: 'meaning' })} className="btn-primary w-full">
              Start meaning quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
