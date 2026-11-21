# Tech

## Stack

Vite, React, TypeScript, Tailwind CSS. No backend. Static web app.

## Data

Kanji data lives in `src/data/kanji-n5.json`. Each entry has kanji, English meaning, onyomi, kunyomi, example word, example reading, example English, and yokai. Start with 50 entries. The file is prepared for 101 N5 kanji.

## State

Progress lives in LocalStorage under the key `yokai-kanji-progress-v1`. No login. No server. Functions in `src/lib/storage.ts` read and write progress. Functions in `src/lib/srs.ts` decide which kanji return after a wrong answer.

## Styling

Tailwind CSS. Dark theme only. Use lantern amber for progress and correct answers, mist blue for secondary text, and paper white for main text. Keep buttons large enough for touch.

## Quality

TypeScript strict mode. No `any` in new code unless a library forces it. Every component has one clear job. Quiz logic stays in `src/lib`, not in components.
