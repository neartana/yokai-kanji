import { useState } from 'react'
import YokaiRow from '../components/YokaiRow'
import { yokaiList } from '../lib/srs'
import { images, stories } from '../lib/yokai'
import type { Progress } from '../lib/storage'

type Props = {
  progress: Progress
  onBack: () => void
}

type Filter = 'all' | 'met' | 'toMeet'

// List pattern: count cards that filter. The selected card takes a 1.5px
// lantern-amber border and a pale amber fill. Rows carry a 72px mascot
// thumbnail for the four portraits; yokai with no portrait yet show
// their kanji in the same slot. No portrait file is invented.
export default function Collection({ progress, onBack }: Props) {
  const all = yokaiList()
  const metCount = progress.unlockedYokai.length
  const [filter, setFilter] = useState<Filter>('all')

  const rows = all.filter((item) => {
    if (filter === 'met') return progress.unlockedYokai.includes(item.name)
    if (filter === 'toMeet') return !progress.unlockedYokai.includes(item.name)
    return true
  })

  const cards: { id: Filter; label: string; value: number }[] = [
    { id: 'all', label: 'All yokai', value: all.length },
    { id: 'met', label: 'Met', value: metCount },
    { id: 'toMeet', label: 'Still to meet', value: all.length - metCount },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Yokai collection</h1>
          <p className="mt-2 text-base font-bold tabular-nums text-muted">
            {metCount} of {all.length} met · {Object.keys(images).length} with portraits
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 items-center rounded-full border-2 border-control px-5 font-display text-sm font-extrabold uppercase tracking-[0.8px] text-white"
        >
          Back to home
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setFilter(card.id)}
            aria-pressed={filter === card.id}
            className={`h-[76px] rounded-[20px] p-3 text-left ${
              filter === card.id ? 'border-[1.5px] border-lantern bg-lanternPale' : 'border border-line bg-surface'
            }`}
          >
            <span className="block text-sm font-bold text-muted">{card.label}</span>
            <span className="mt-1 block font-display text-xl font-extrabold tabular-nums text-white">{card.value}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-rule">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-control p-6 text-center">
            <p className="text-base text-muted">No yokai met yet. Answer 10 in a row in a quiz to meet your first one.</p>
          </div>
        ) : (
          rows.map((item) => (
            <YokaiRow
              key={item.name}
              name={item.name}
              kanji={item.kanji}
              story={stories[item.name] ?? 'A mysterious spirit of the night.'}
              met={progress.unlockedYokai.includes(item.name)}
              image={images[item.name]}
            />
          ))
        )}
      </div>
      <p className="mt-6 text-[13px] font-bold tabular-nums text-faint">
        {rows.length === 0 ? '0' : `1-${rows.length}`} of {rows.length} shown
      </p>
    </div>
  )
}
