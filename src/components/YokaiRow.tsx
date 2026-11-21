type Props = {
  name: string
  kanji: string
  story: string
  met: boolean
  image?: string
}

// One row of the collection list. The mascot portrait is the row's media
// at 72px, shown at full strength once met and dimmed until then, so the
// seven portraits stay visible while the locked state stays honest.
// The transparent PNG sits directly on the row's ground: no box, no
// border, nothing that cuts the plush fur. Yokai with no portrait yet
// show their kanji in the same slot.
export default function YokaiRow({ name, kanji, story, met, image }: Props) {
  return (
    <div className="flex min-h-[96px] items-center gap-4 py-4">
      <div className="flex h-[72px] w-[72px] flex-none items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={`${name} plush mascot`}
            className={`h-[72px] w-[72px] object-contain ${met ? '' : 'opacity-45'}`}
          />
        ) : met ? (
          <span className="text-[28px] text-faint">{kanji}</span>
        ) : (
          <span className="text-[28px] text-faint">?</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-extrabold tracking-tight text-white">{name}</p>
        <p className="mt-1 text-base leading-6 text-muted">{story}</p>
      </div>
      <div className="flex-none text-right">
        <p className="text-xl font-bold tabular-nums text-muted">{kanji}</p>
        <p className={`mt-1 text-[13px] font-bold ${met ? 'text-lantern' : 'text-faint'}`}>{met ? 'Met' : 'Not met yet'}</p>
      </div>
    </div>
  )
}
