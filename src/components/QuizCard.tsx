type Props = {
  kanji: string
  prompt: string
  choices: string[]
  selected: string | null
  correct: string
  onSelect: (choice: string) => void
}

export default function QuizCard({ kanji, prompt, choices, selected, correct, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-amber-500/40 bg-slate-900 p-6 text-center">
      <p className="text-sm uppercase tracking-widest text-amber-300">{prompt}</p>
      <p className="my-6 text-7xl text-white">{kanji}</p>
      <div className="grid gap-3">
        {choices.map((choice) => {
          const isCorrect = selected !== null && choice === correct
          const isWrong = selected === choice && choice !== correct
          const style = isCorrect
            ? 'border-amber-400 bg-amber-400/20 text-amber-100'
            : isWrong
              ? 'border-red-500 bg-red-500/20 text-red-100'
              : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-amber-400'
          return (
            <button key={choice} type="button" disabled={selected !== null} onClick={() => onSelect(choice)} className={`rounded-lg border px-4 py-3 text-left ${style}`}>
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
