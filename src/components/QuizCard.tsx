type Props = {
  kanji: string
  prompt: string
  choices: string[]
  selected: string | null
  correct: string
  checked: boolean
  onSelect: (choice: string) => void
}

// One question, Duolingo style: one big kanji with plenty of air above
// it, then four chunky answer pills. Tapping an answer only selects it,
// it never advances and never reveals whether it is right. The selected
// pill takes an amber border until CHECK is tapped; only then does the
// correct answer go green and a wrong pick go red.
export default function QuizCard({ kanji, prompt, choices, selected, correct, checked, onSelect }: Props) {
  return (
    <div className="rounded-[20px] bg-surface p-6 text-center md:p-8">
      <p className="text-base font-bold text-muted">{prompt}</p>
      <p className="my-8 font-display text-6xl font-extrabold tracking-tight text-white">{kanji}</p>
      <div className="grid gap-4">
        {choices.map((choice) => {
          const isSelected = selected === choice
          const isCorrect = checked && choice === correct
          const isWrong = checked && isSelected && choice !== correct
          const style = isCorrect
            ? 'border-correct bg-correctPale text-correctInk'
            : isWrong
              ? 'border-negative bg-negativePale text-negative'
              : isSelected
                ? 'border-lantern bg-lanternPale text-lantern'
                : 'border-control bg-surface text-white hover:border-faint'
          return (
            <button
              key={choice}
              type="button"
              disabled={checked}
              onClick={() => onSelect(choice)}
              aria-pressed={isSelected}
              className={`h-14 rounded-2xl border-2 px-6 text-left text-base font-bold ${style}`}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
