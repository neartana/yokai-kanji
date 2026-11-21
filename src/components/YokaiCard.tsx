type Props = {
  name: string
  kanji: string
  story: string
  unlocked: boolean
  image?: string
}

export default function YokaiCard({ name, kanji, story, unlocked, image }: Props) {
  if (!unlocked) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
        <p className="text-4xl">?</p>
        <p className="mt-2 text-slate-500">Locked yokai</p>
        <p className="text-sm text-slate-600">Answer 10 in a row to unlock</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border border-amber-500/40 bg-slate-900 text-center">
      {image ? (
        <img src={image} alt={`${name} chibi mascot`} className="h-44 w-full object-cover" />
      ) : (
        <p className="py-6 text-4xl">{kanji}</p>
      )}
      <div className="p-4">
        <p className="font-bold text-amber-200">{name}</p>
        <p className="mt-1 text-sm text-slate-300">{story}</p>
        <p className="mt-2 text-xs text-slate-500">Kanji: {kanji}</p>
      </div>
    </div>
  )
}
