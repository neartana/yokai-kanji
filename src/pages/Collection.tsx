import YokaiCard from '../components/YokaiCard'
import { kanjiList } from '../lib/srs'
import type { Progress } from '../lib/storage'

type Props = {
  progress: Progress
  onBack: () => void
}

const stories: Record<string, string> = {
  'Kappa': 'A river spirit who loves cucumbers and sumo.',
  'Tengu': 'A mountain guardian with a long nose and strong winds.',
  'Kitsune': 'A clever fox spirit who can change shape.',
  'Oni': 'A strong demon with horns and a loud laugh.',
  'Yuki-onna': 'A snow woman who appears on cold winter nights.',
  'Tanuki': 'A playful raccoon dog who loves tricks and sake.',
  'Kodama': 'A quiet tree spirit who guards the forest.',
}

const images: Record<string, string> = {
  'Kappa': '/mascots/kappa.png',
  'Kitsune': '/mascots/kitsune.png',
  'Tengu': '/mascots/tengu.png',
  'Oni': '/mascots/oni.png',
}

export default function Collection({ progress, onBack }: Props) {
  const seen = new Map<string, string>()
  for (const item of kanjiList) {
    if (!seen.has(item.yokai)) seen.set(item.yokai, item.kanji)
  }
  const all = [...seen.entries()]
  return (
    <div>
      <button type="button" onClick={onBack} className="text-sm text-slate-400">Back to home</button>
      <h2 className="mt-2 text-2xl font-bold text-white">Yokai collection</h2>
      <p className="mt-1 text-slate-300">Unlocked: {progress.unlockedYokai.length} of {all.length}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {all.map(([name, kanji]) => (
          <YokaiCard key={name} name={name} kanji={kanji} story={stories[name] ?? 'A mysterious spirit of the night.'} unlocked={progress.unlockedYokai.includes(name)} image={images[name]} />
        ))}
      </div>
    </div>
  )
}
