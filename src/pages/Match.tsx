import { useMemo, useRef, useState } from 'react'
import { LanternIcon } from '../components/LanternProgress'
import { kanjiList, shuffle, type KanjiEntry } from '../lib/srs'
import { images } from '../lib/yokai'
import { playVictory } from '../lib/sound'

type Props = {
  onAwardXp: () => void
  onExit: () => void
}

type CardFace = {
  id: number
  entry: KanjiEntry
  kind: 'kanji' | 'meaning'
}

function buildDeck(): CardFace[] {
  const picked = shuffle(kanjiList).slice(0, 6)
  const cards: CardFace[] = []
  picked.forEach((entry, index) => {
    cards.push({ id: index * 2, entry, kind: 'kanji' })
    cards.push({ id: index * 2 + 1, entry, kind: 'meaning' })
  })
  return shuffle(cards)
}

// Memory match: 12 cards, 6 pairs, each pair one kanji card and one
// meaning card from 6 randomly picked kanji of the 50. Cards start
// face down and turn on tap with a CSS flip. Two face-up cards are
// compared: a matching pair stays open, a miss turns back after a
// short delay. A pair that is met shows the yokai portrait for that
// kanji when one exists, otherwise the kanji character. No timer.
// Matching all 6 pairs wins 30 XP, kept in the same store as quiz XP.
export default function Match({ onAwardXp, onExit }: Props) {
  const [round, setRound] = useState(0)
  const deck = useMemo(() => buildDeck(), [round])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [phase, setPhase] = useState<'play' | 'won'>('play')
  const awardedRef = useRef(false)

  function flip(card: CardFace) {
    if (locked || phase !== 'play') return
    if (flipped.includes(card.id) || matched.includes(card.entry.kanji)) return
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length < 2) return
    setMoves((value) => value + 1)
    const first = deck.find((item) => item.id === next[0])
    const second = deck.find((item) => item.id === next[1])
    if (!first || !second) return
    if (first.entry.kanji === second.entry.kanji) {
      const newMatched = [...matched, first.entry.kanji]
      setMatched(newMatched)
      setFlipped([])
      if (newMatched.length === 6 && !awardedRef.current) {
        awardedRef.current = true
        onAwardXp()
        playVictory()
        setPhase('won')
      }
    } else {
      setLocked(true)
      window.setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, 900)
    }
  }

  function playAgain() {
    awardedRef.current = false
    setRound((value) => value + 1)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setLocked(false)
    setPhase('play')
  }

  if (phase === 'won') {
    return (
      <div className="mx-auto max-w-xl pt-6 text-center">
        <img src="/mascots/kitsune.png" alt="Kitsune celebrating" className="anim-bounce-once mx-auto h-28 w-28 object-contain" />
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">You matched all 6 pairs</h1>
        <p className="mt-2 text-base font-bold text-muted">Six pairs in {moves} moves. You earned 30 XP.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button type="button" onClick={playAgain} className="btn-primary">
            Play again
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
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Memory match</h1>
          <p className="mt-2 text-base font-bold tabular-nums text-muted">
            Matches {matched.length} / 6 · Moves {moves}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-12 items-center rounded-full border-2 border-control px-5 font-display text-sm font-extrabold uppercase tracking-[0.8px] text-white"
        >
          Back to home
        </button>
      </div>

      <p className="mt-8 text-base font-bold text-muted">Find the 6 pairs. Tap a card to flip it, then match each kanji with its meaning.</p>

      <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-4">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.entry.kanji)
          const isMatched = matched.includes(card.entry.kanji)
          const portrait = images[card.entry.yokai]
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              aria-label={isUp ? `${card.kind === 'kanji' ? card.entry.kanji : card.entry.meaning}` : 'Face-down card, tap to flip'}
              className="match-card h-28 md:h-32"
            >
              <span className={`match-card-inner ${isUp ? 'is-flipped' : ''}`}>
                <span className="match-card-face match-card-front">
                  <LanternIcon lit={false} />
                </span>
                <span className={`match-card-face match-card-back ${isMatched ? 'is-matched' : ''}`}>
                  {isMatched && portrait ? (
                    <>
                      <img src={portrait} alt={`${card.entry.yokai} plush mascot`} className="h-12 w-12 object-contain md:h-14 md:w-14" />
                      <span className="text-[13px] font-bold text-muted">{card.kind === 'kanji' ? card.entry.kanji : card.entry.meaning}</span>
                    </>
                  ) : isMatched ? (
                    <span className="font-display text-3xl font-extrabold tracking-tight text-white">{card.entry.kanji}</span>
                  ) : card.kind === 'kanji' ? (
                    <span className="font-display text-3xl font-extrabold tracking-tight text-white">{card.entry.kanji}</span>
                  ) : (
                    <span className="text-center text-base font-bold leading-6 text-white">{card.entry.meaning}</span>
                  )}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-[20px] bg-surface px-6 py-4">
        <span className="text-base font-bold text-muted">Matches</span>
        <span className="font-display text-xl font-extrabold tabular-nums text-white">{matched.length} / 6</span>
      </div>
    </div>
  )
}
