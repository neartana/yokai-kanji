import type { Progress } from '../lib/storage'
import { todayStats } from '../lib/storage'
import { firstReading, kanjiList, pathStations, yokaiList, type KanjiEntry } from '../lib/srs'
import { images, stories } from '../lib/yokai'
import { LanternIcon } from '../components/LanternProgress'

type Props = {
  progress: Progress
  onStart: (mode: 'meaning' | 'reading') => void
  onBoss: () => void
  onMatch: () => void
}

type Quest = {
  title: string
  detail: string
  value: number
  target: number
  yokai: string
}

// Screen question: "What should I practise next, and how close am I to
// meeting the next yokai?" The biggest block answers it: the practise
// card with Kitsune large beside the kanji first in line.
//
// Duolingo round: one primary action only, START MEANING QUIZ. It now
// lives in a fixed bottom bar rendered by App on the Home screen only,
// so it is always visible; the in-flow button is gone. Home adds its
// own bottom padding so the last path station scrolls clear of it.
//
// Path + quests round: the main column gains a daily quests row under
// the KPI strip and a 10-station learning path under the practise card.
// Both read only real stored data, never invented numbers.
export default function Home({ progress, onStart, onBoss, onMatch }: Props) {
  const all = yokaiList()
  const next = all.find((item) => !progress.unlockedYokai.includes(item.name))

  const stats = todayStats(progress)
  // Each quest is guided by a different yokai: Tengu watches the
  // questions, Oni cheers the XP, Kappa guards the streak. The
  // thumbnails are decorative only; quest logic is unchanged.
  const quests: Quest[] = [
    { title: 'Answer 10 questions', detail: 'Any quiz, today', value: stats.answeredToday, target: 10, yokai: 'Tengu' },
    { title: 'Earn 50 XP', detail: 'Correct answers, today', value: stats.xpToday, target: 50, yokai: 'Oni' },
    { title: 'Keep your streak', detail: 'Play once today', value: stats.playedToday ? 1 : 0, target: 1, yokai: 'Kappa' },
  ]

  const stations = pathStations()
  const doneCounts = stations.map((entries) => entries.filter((item) => progress.masteredIds.includes(item.kanji)).length)
  const currentStation = doneCounts.findIndex((count) => count < 5)
  const stationState = (index: number): 'done' | 'current' | 'locked' => {
    if (doneCounts[index] === 5) return 'done'
    if (index === currentStation) return 'current'
    return 'locked'
  }
  // The path zigzags like Duolingo's: left, centre, right, centre, ...
  const stationAlign = ['justify-start', 'justify-center', 'justify-end', 'justify-center']
  // The current-station guide rotates through the seven portraits by
  // station number: 1 Kitsune, 2 Kappa, 3 Tengu, 4 Oni, 5 Yuki-onna,
  // 6 Tanuki, 7 Kodama, 8 Kitsune, ...
  const stationGuides = ['Kitsune', 'Kappa', 'Tengu', 'Oni', 'Yuki-onna', 'Tanuki', 'Kodama']

  const review: KanjiEntry[] = []
  for (const item of kanjiList) {
    if (review.length >= 5) break
    if (progress.wrongIds.includes(item.kanji)) review.push(item)
  }
  for (const item of kanjiList) {
    if (review.length >= 5) break
    if (!review.includes(item)) review.push(item)
  }

  return (
    <div className="relative pb-24">
      {/* Floating lanterns: a few small lanterns drifting slowly
          upward on the Home background, low opacity, pointer-events
          none, pure CSS. The content below is positioned, so it
          paints above them and stays readable. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: '6%', top: '12%', scale: 1.6, delay: '0s', duration: '17s' },
          { left: '88%', top: '30%', scale: 2.2, delay: '4s', duration: '21s' },
          { left: '14%', top: '55%', scale: 1.2, delay: '8s', duration: '15s' },
          { left: '80%', top: '70%', scale: 1.8, delay: '2s', duration: '19s' },
          { left: '45%', top: '8%', scale: 1.1, delay: '11s', duration: '16s' },
          { left: '68%', top: '48%', scale: 1.4, delay: '6s', duration: '22s' },
        ].map((item, index) => (
          <span
            key={index}
            className="lantern-drift absolute"
            style={{ left: item.left, top: item.top, animationDelay: item.delay, animationDuration: item.duration }}
          >
            <span style={{ display: 'block', transform: `scale(${item.scale})` }}>
              <LanternIcon lit />
            </span>
          </span>
        ))}
      </div>

      <div className="relative">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[32px]">Yokai Kanji</h1>
        <p className="mt-2 text-base font-bold text-muted">What should I practise next, and how close am I to meeting the next yokai?</p>
      </div>

      <div className="relative mt-8 grid gap-8 lg:grid-cols-[1fr_384px]">
        <div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-line sm:grid-cols-3">
            <div className="bg-surface p-6">
              <p className="text-base font-bold text-muted">XP</p>
              <p className="mt-2 font-display text-[28px] font-extrabold tabular-nums text-white">{progress.xp}</p>
              <p className="mt-1 text-[13px] font-bold text-faint">all time</p>
            </div>
            <div className="bg-surface p-6">
              <p className="text-base font-bold text-muted">Streak</p>
              <p className="mt-2 font-display text-[28px] font-extrabold tabular-nums text-white">{progress.streak}</p>
              <p className="mt-1 text-[13px] font-bold text-faint">scoring sessions</p>
            </div>
            <div className="col-span-2 bg-surface p-6 sm:col-span-1">
              <p className="text-base font-bold text-muted">Mastered</p>
              <p className="mt-2 font-display text-[28px] font-extrabold tabular-nums text-white">
                {progress.masteredIds.length} <span className="text-base text-faint">/ {kanjiList.length}</span>
              </p>
              <p className="mt-1 text-[13px] font-bold text-faint">of 50 N5 kanji</p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-white">Daily quests</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            {quests.map((quest) => {
              const done = quest.value >= quest.target
              const percent = Math.min(100, Math.round((quest.value / quest.target) * 100))
              return (
                <div
                  key={quest.title}
                  className={`rounded-[20px] p-6 ${done ? 'border-2 border-lantern bg-lanternPale' : 'bg-surface'}`}
                >
                  <img
                    src={images[quest.yokai]}
                    alt={`${quest.yokai} guides this quest`}
                    className="h-12 w-12 object-contain"
                  />
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <p className="min-w-0 font-display text-base font-extrabold tracking-tight text-white">{quest.title}</p>
                    <p className="flex-none font-display text-base font-extrabold tabular-nums text-white">
                      {Math.min(quest.value, quest.target)}<span className="text-faint">/{quest.target}</span>
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] font-bold text-faint">{quest.detail}</p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={quest.title}>
                    <div className="h-full rounded-full bg-lantern" style={{ width: `${percent}%` }} />
                  </div>
                  <p className={`mt-3 text-sm font-bold ${done ? 'text-lantern' : 'text-faint'}`}>
                    {done ? 'Done' : `${percent}% complete`}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-[20px] bg-surface p-6 md:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <img
                src="/mascots/kitsune.png"
                alt="Kitsune plush mascot holding a lantern"
                className="h-72 w-72 flex-none self-center object-contain"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-white">Practise next</h2>
                <p className="mt-2 text-base font-bold text-muted">Kitsune carries your lantern. Wrong answers come back first, then the next kanji in the set.</p>
                <div className="mt-4 divide-y divide-rule">
                  {review.map((item) => (
                    <div key={item.kanji} className="flex items-baseline gap-6 py-4">
                      <span className="text-xl font-bold text-white">{item.kanji}</span>
                      <span className="min-w-0 flex-1 text-base text-muted">{item.meaning}</span>
                      <span className="text-base font-bold tabular-nums text-faint">{firstReading(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-white">More games</h2>
          <p className="mt-2 text-base font-bold text-muted">Two more ways to play with the same 50 kanji.</p>
          <div className="mt-3 grid gap-6 sm:grid-cols-2">
            <button type="button" onClick={onBoss} aria-label="Challenge the Oni" className="rounded-[20px] bg-surface p-6 text-left">
              <img src="/mascots/oni.png" alt="Oni plush mascot" className="h-16 w-16 object-contain" />
              <span className="mt-3 block font-display text-lg font-extrabold tracking-tight text-white">Challenge the Oni</span>
              <span className="mt-1 block text-base leading-6 text-muted">Answer to deal damage. Five hits win the battle, three wrong answers and your lanterns go out.</span>
              <span className="mt-3 block text-sm font-bold text-lantern">Boss battle · 50 XP bonus</span>
            </button>
            <button type="button" onClick={onMatch} aria-label="Memory match" className="rounded-[20px] bg-surface p-6 text-left">
              <img src="/mascots/kitsune.png" alt="Kitsune plush mascot" className="h-16 w-16 object-contain" />
              <span className="mt-3 block font-display text-lg font-extrabold tracking-tight text-white">Memory match</span>
              <span className="mt-1 block text-base leading-6 text-muted">Flip the cards and pair each kanji with its meaning. Match all 6 pairs.</span>
              <span className="mt-3 block text-sm font-bold text-lantern">12 cards · 30 XP</span>
            </button>
          </div>

          <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-white">Learning path</h2>
          <p className="mt-2 text-base font-bold text-muted">10 stations, 5 kanji each. Tap a station to start a meaning quiz.</p>
          <div className="relative mt-8">
            <div className="absolute bottom-8 left-1/2 top-8 -translate-x-1/2 border-l-2 border-dashed border-control" aria-hidden="true" />
            <div className="relative flex flex-col gap-8">
              {stations.map((entries, index) => {
                const state = stationState(index)
                const guide = stationGuides[index % stationGuides.length]
                const label = `Station ${index + 1} · ${doneCounts[index]} of 5 mastered`
                return (
                  <div key={index} className={`flex ${stationAlign[index % stationAlign.length]}`}>
                    <button
                      type="button"
                      onClick={() => onStart('meaning')}
                      aria-label={`${label}. Tap to start a meaning quiz.`}
                      className="flex items-center gap-4 text-left"
                    >
                      {state === 'current' && (
                        <img src={images[guide]} alt={`${guide} marks your current station`} className="h-16 w-16 flex-none object-contain" />
                      )}
                      <span
                        className={`flex flex-none items-center justify-center rounded-full font-display font-extrabold ${
                          state === 'done'
                            ? 'h-16 w-16 bg-lantern text-[#0e0d0c]'
                            : state === 'current'
                              ? 'h-20 w-20 border-4 border-lantern bg-surface text-2xl text-white'
                              : 'h-16 w-16 bg-raised text-faint'
                        }`}
                      >
                        {state === 'done' ? (
                          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 12.5l5 5L20 6.5" />
                          </svg>
                        ) : state === 'locked' ? (
                          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                            <rect x="5" y="10" width="14" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg font-extrabold tracking-tight text-white">Station {index + 1}</span>
                        <span className="mt-1 block text-xl font-bold tracking-wide text-muted">{entries.map((item) => item.kanji).join(' ')}</span>
                        <span className={`mt-1 block text-[13px] font-bold ${state === 'done' ? 'text-lantern' : 'text-faint'}`}>
                          {state === 'done' ? 'Done' : state === 'current' ? 'You are here' : `${doneCounts[index]} of 5 mastered`}
                        </span>
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <aside>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-white">Next yokai</h2>
          <div className="mt-3 rounded-[20px] bg-surface p-6">
            {next ? (
              <div className="flex items-center gap-6">
                {images[next.name] ? (
                  <img src={images[next.name]} alt={`${next.name} plush mascot`} className="h-28 w-28 flex-none object-contain opacity-45" />
                ) : (
                  <span className="flex h-28 w-28 flex-none items-center justify-center text-[40px] text-faint">{next.kanji}</span>
                )}
                <div className="min-w-0">
                  <p className="font-display text-lg font-extrabold tracking-tight text-white">{next.name}</p>
                  <p className="mt-1 text-base leading-6 text-muted">{stories[next.name] ?? 'A mysterious spirit of the night.'}</p>
                  <p className="mt-2 text-[13px] font-bold text-faint">Not met yet · Answer 10 in a row to meet {next.name}.</p>
                </div>
              </div>
            ) : (
              <p className="text-base text-muted">All 36 yokai met. The night is yours.</p>
            )}
          </div>

          <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-white">Recent progress</h2>
          <div className="mt-3 rounded-[20px] bg-surface px-6 py-2">
            <div className="flex items-center justify-between py-4">
              <span className="text-base font-bold text-muted">Last played</span>
              <span className="text-base font-bold tabular-nums text-white">{progress.lastPlayed || '—'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Best streak</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{progress.bestStreak}</span>
            </div>
            <div className="flex items-center justify-between border-t border-rule py-4">
              <span className="text-base font-bold text-muted">Kanji to review</span>
              <span className="font-display text-xl font-extrabold tabular-nums text-white">{progress.wrongIds.length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
