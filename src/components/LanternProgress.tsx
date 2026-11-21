/*
  The lantern line: the product's signature element. One paper lantern
  per question in the session. A lantern is lit amber (#f2b33d, the only
  data hue) for each correct answer so far, and grey for the rest.
  Drawn as inline SVG, never an emoji. The same lantern mark, lit, is
  the product mark in the sidebar wordmark.
*/

export function LanternIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true" className="flex-none">
      <rect x="7" y="0" width="4" height="2" rx="1" fill={lit ? '#f2b33d' : '#444444'} />
      <path
        d="M9 2.5 C 4.5 2.5 2 6 2 11 C 2 16 4.5 19.5 9 19.5 C 13.5 19.5 16 16 16 11 C 16 6 13.5 2.5 9 2.5 Z"
        fill={lit ? '#f2b33d' : '#2a2a2a'}
        stroke={lit ? '#f2b33d' : '#444444'}
        strokeWidth="1"
      />
      <path
        d="M6.5 3.5 C 5.5 7 5.5 15 6.5 18.5 M11.5 3.5 C 12.5 7 12.5 15 11.5 18.5"
        fill="none"
        stroke={lit ? 'rgba(14, 13, 12, 0.35)' : '#444444'}
        strokeWidth="1"
      />
      <rect x="7" y="20" width="4" height="2" rx="1" fill={lit ? '#f2b33d' : '#444444'} />
    </svg>
  )
}

type Props = {
  current: number
  total: number
}

export default function LanternProgress({ current, total }: Props) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2" aria-label={`${current} of ${total} lanterns lit`}>
        {Array.from({ length: total }, (_, index) => (
          <span key={index} title={`Lantern ${index + 1}`}>
            <LanternIcon lit={index < current} />
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[13px] font-bold tabular-nums text-faint">
        {current} of {total} lanterns lit
      </p>
    </div>
  )
}
