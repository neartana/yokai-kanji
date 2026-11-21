type Props = {
  current: number
  total: number
}

export default function LanternProgress({ current, total }: Props) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Question ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < current ? 'text-amber-300' : 'text-slate-700'} title={`Lantern ${index + 1}`}>
          🏮
        </span>
      ))}
    </div>
  )
}
