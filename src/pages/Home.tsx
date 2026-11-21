import type { Progress } from '../lib/storage'
import { kanjiList } from '../lib/srs'

type Props = {
  progress: Progress
  onStart: (mode: 'meaning' | 'reading') => void
  onCollection: () => void
}

export default function Home({ progress, onStart, onCollection }: Props) {
  return (
    <div className="text-center">
      <img src="/mascots/kitsune.png" alt="Kitsune chibi mascot holding a lantern" className="mx-auto h-44 w-44 rounded-2xl border border-amber-500/40 object-cover" />
      <h1 className="mt-4 text-4xl font-bold text-white">Yokai Kanji</h1>
      <p className="mt-2 text-slate-300">Learn N5 kanji with yokai. Answer correctly to collect ofuda and unlock yokai.</p>
      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-slate-900 p-3"><p className="text-xl font-bold text-amber-300">{progress.xp}</p><p className="text-xs text-slate-400">XP</p></div>
        <div className="rounded-lg bg-slate-900 p-3"><p className="text-xl font-bold text-amber-300">{progress.streak}</p><p className="text-xs text-slate-400">Streak</p></div>
        <div className="rounded-lg bg-slate-900 p-3"><p className="text-xl font-bold text-amber-300">{progress.masteredIds.length} / {kanjiList.length}</p><p className="text-xs text-slate-400">Mastered</p></div>
      </div>
      <div className="mx-auto mt-6 grid max-w-md gap-3">
        <button type="button" onClick={() => onStart('meaning')} className="rounded-lg bg-amber-500 px-4 py-3 font-bold text-slate-950">Start meaning quiz</button>
        <button type="button" onClick={() => onStart('reading')} className="rounded-lg border border-amber-500 px-4 py-3 font-bold text-amber-200">Start reading quiz</button>
        <button type="button" onClick={onCollection} className="rounded-lg border border-slate-700 px-4 py-3 text-slate-200">View yokai collection</button>
      </div>
    </div>
  )
}
