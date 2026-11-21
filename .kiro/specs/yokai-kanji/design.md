# Design

## Overview

A single page React app with three screens: Home, Quiz, Collection. No router library is needed for the first version. App state selects the screen.

## Data model

KanjiEntry: kanji, meaning, onyomi, kunyomi, example, exampleReading, exampleEnglish, yokai.
Progress: xp, streak, bestStreak, masteredIds, wrongIds, unlockedYokai, lastPlayed.

## Quiz flow

1. Pick 10 kanji from the data file, shuffled.
2. For each kanji, build a question with 1 correct choice and 3 distractors from other entries.
3. Show feedback at once: correct in amber, wrong in red, with the correct answer shown.
4. Wrong kanji go back into the queue for this session.
5. At the end, show score, XP earned, and any newly unlocked yokai.

## SRS

Wrong answers add the kanji id to `wrongIds`. The next session starts with wrong ids first, then new ids. A kanji leaves `wrongIds` after two correct answers in a row.

## Visual design

Background: deep night blue, almost black. Cards: dark slate with a thin amber border. Lantern progress: a row of lantern dots that light up as the session advances. Buttons: large, rounded, paper white text on dark slate, amber on hover. Kanji display: large, white, centered. No image assets are required for the first version. Yokai are shown as a name, a short story, and a simple SVG mark.

## Files

`src/lib/srs.ts` holds question building and queue logic. `src/lib/storage.ts` holds load and save. `src/components/QuizCard.tsx` shows one question. `src/components/YokaiCard.tsx` shows one yokai. `src/components/LanternProgress.tsx` shows session progress.
