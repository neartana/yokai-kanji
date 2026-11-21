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
*/
import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Collection from './pages/Collection'
import LanternProgress, { LanternIcon } from './components/LanternProgress'
import { loadProgress, saveProgress, type Progress } from './lib/storage'
import type { KanjiEntry } from './lib/srs'
import { images } from './lib/yokai'

type Screen = { name: 'home' } | { name: 'quiz'; mode: 'meaning' | 'reading' } | { name: 'collection' } | { name: 'results'; xp: number; correct: number }
type NavId = 'home' | 'meaning' | 'reading' | 'collection'

const NAV: { id: NavId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'meaning', label: 'Meaning quiz' },
  { id: 'reading', label: 'Reading quiz' },
  { id: 'collection', label: 'Collection' },
]

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  // finishQuiz is the only place progress changes. A finished session
  // is 10 answered questions, so the daily quest counters advance here
  // by the exact numbers the session produced, never by guessing.
  // masteredIds was a no-op before (it spread an empty list); a kanji
  // answered correctly in a finished session now counts as mastered,
  // which is what the Mastered KPI and the learning path read.
  function finishQuiz(earnedXp: number, correctCount: number, wrong: KanjiEntry[], answered: number, correctEntries: KanjiEntry[]) {
    const today = new Date().toISOString().slice(0, 10)
    const freshDay = progress.dailyDate !== today
    const next: Progress = {
      ...progress,
      xp: progress.xp + correctCount * 10,
      streak: correctCount > 0 ? progress.streak + 1 : 0,
      bestStreak: Math.max(progress.bestStreak, correctCount > 0 ? progress.streak + 1 : progress.streak),
      masteredIds: [...new Set([...progress.masteredIds, ...correctEntries.map((item) => item.kanji)])],
      wrongIds: [...new Set(wrong.map((item) => item.kanji))],
      unlockedYokai: progress.unlockedYokai,
      lastPlayed: today,
      dailyDate: today,
      answeredToday: (freshDay ? 0 : progress.answeredToday) + answered,
      xpToday: (freshDay ? 0 : progress.xpToday) + correctCount * 10,
    }
    setProgress(next)
    saveProgress(next)
    setScreen({ name: 'results', xp: earnedXp, correct: correctCount })
  }

  function go(id: NavId) {
    if (id === 'home') setScreen({ name: 'home' })
    if (id === 'meaning') setScreen({ name: 'quiz', mode: 'meaning' })
    if (id === 'reading') setScreen({ name: 'quiz', mode: 'reading' })
    if (id === 'collection') setScreen({ name: 'collection' })
  }

  const activeNav: NavId =
    screen.name === 'home' || screen.name === 'results'
      ? 'home'
      : screen.name === 'collection'
        ? 'collection'
        : screen.mode

  const topLabel =
    screen.name === 'home'
      ? 'Home'
      : screen.name === 'quiz'
        ? screen.mode === 'meaning'
          ? 'Meaning quiz'
          : 'Reading quiz'
        : screen.name === 'collection'
          ? 'Collection'
          : 'Session complete'

  const topScope =
    screen.name === 'home'
      ? `Streak ${progress.streak} · XP ${progress.xp}`
      : screen.name === 'quiz'
        ? '10 questions · N5 kanji'
        : screen.name === 'collection'
          ? `${progress.unlockedYokai.length} of 36 met`
          : `Earned ${screen.xp} XP`

  // Results screen: the next unmet yokai with a portrait, Kappa first,
  // then Tengu, Oni, Kitsune. Kitsune is the fallback when all four
  // are already met. (unlockedYokai is never populated by the current
  // finish logic, so in practice this is Kappa until that changes.)
  const portraitOrder = ['Kappa', 'Tengu', 'Oni', 'Kitsune']
  const nextPortrait = portraitOrder.find((name) => !progress.unlockedYokai.includes(name)) ?? 'Kitsune'

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
          <p className="text-sm tabular-nums text-muted">{topScope}</p>
        </header>
        <main className="px-6 pb-24 pt-8 md:px-6 md:pb-10">
          {screen.name === 'home' && <Home progress={progress} onStart={(mode) => setScreen({ name: 'quiz', mode })} />}
          {screen.name === 'quiz' && <Quiz mode={screen.mode} progress={progress} onFinish={finishQuiz} onExit={() => setScreen({ name: 'home' })} />}
          {screen.name === 'collection' && <Collection progress={progress} onBack={() => setScreen({ name: 'home' })} />}
          {screen.name === 'results' && (
            <div className="mx-auto max-w-xl pt-6 text-center">
              <img src={images[nextPortrait]} alt={`${nextPortrait} plush mascot`} className="mx-auto h-28 w-28 object-contain" />
              <p className="mt-2 text-base font-bold text-muted">Next yokai to meet: {nextPortrait}</p>
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
          The quiz and collection screens keep their own bottom bars
          and never get a second one. Home adds its own bottom padding
          so the last learning-path station scrolls clear of this bar. */}
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
