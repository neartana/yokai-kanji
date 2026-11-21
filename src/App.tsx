import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Collection from './pages/Collection'
import { loadProgress, saveProgress, type Progress } from './lib/storage'
import type { KanjiEntry } from './lib/srs'

type Screen = { name: 'home' } | { name: 'quiz'; mode: 'meaning' | 'reading' } | { name: 'collection' } | { name: 'results'; xp: number; correct: number }

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  function finishQuiz(earnedXp: number, correctCount: number, wrong: KanjiEntry[]) {
    const next: Progress = {
      ...progress,
      xp: progress.xp + correctCount * 10,
      streak: correctCount > 0 ? progress.streak + 1 : 0,
      bestStreak: Math.max(progress.bestStreak, correctCount > 0 ? progress.streak + 1 : progress.streak),
      masteredIds: [...new Set([...progress.masteredIds, ...[]])],
      wrongIds: [...new Set(wrong.map((item) => item.kanji))],
      unlockedYokai: progress.unlockedYokai,
      lastPlayed: new Date().toISOString().slice(0, 10),
    }
    setProgress(next)
    saveProgress(next)
    setScreen({ name: 'results', xp: earnedXp, correct: correctCount })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-2xl px-4 py-8">
        {screen.name === 'home' && <Home progress={progress} onStart={(mode) => setScreen({ name: 'quiz', mode })} onCollection={() => setScreen({ name: 'collection' })} />}
        {screen.name === 'quiz' && <Quiz mode={screen.mode} progress={progress} onFinish={finishQuiz} onExit={() => setScreen({ name: 'home' })} />}
        {screen.name === 'collection' && <Collection progress={progress} onBack={() => setScreen({ name: 'home' })} />}
        {screen.name === 'results' && (
          <div className="text-center">
            <p className="text-5xl">🏮</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Session complete</h2>
            <p className="mt-2 text-slate-300">You answered {screen.correct} of 10 correctly and earned {screen.correct * 10} XP.</p>
            <button type="button" onClick={() => setScreen({ name: 'home' })} className="mt-6 rounded-lg bg-amber-500 px-4 py-3 font-bold text-slate-950">Back to home</button>
          </div>
        )}
      </main>
    </div>
  )
}
