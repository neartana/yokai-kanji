# Tasks

## 1. Project setup

- [ ] Create Vite React TypeScript project with Tailwind CSS
- [ ] Add README, LICENSE, and .gitignore that does not ignore `.kiro`
- [ ] Verify `npm run dev` and `npm run build` work

## 2. Kanji data

- [ ] Add `src/data/kanji-n5.json` with 50 N5 entries
- [ ] Check every entry has kanji, meaning, onyomi, kunyomi, example, exampleReading, exampleEnglish, and yokai

## 3. Progress and SRS

- [ ] Add `src/lib/storage.ts` for LocalStorage load and save
- [ ] Add `src/lib/srs.ts` for question building and wrong answer queue

## 4. Quiz

- [ ] Add `src/components/QuizCard.tsx` for one question with 4 choices and feedback
- [ ] Add `src/pages/Quiz.tsx` for a 10 question session, meaning mode and reading mode
- [ ] Add `src/components/LanternProgress.tsx` for session progress

## 5. Collection and home

- [ ] Add `src/components/YokaiCard.tsx`
- [ ] Add `src/pages/Collection.tsx`
- [ ] Add `src/pages/Home.tsx` with mode choice, XP, streak, and mastered count

## 6. Polish and submit

- [ ] Check dark theme contrast on phone and desktop
- [ ] Deploy to GitHub Pages or Cloudflare Pages
- [ ] Record a public YouTube demo under 3 minutes
- [ ] Write the Devpost submission with app URL, repo URL, and Kiro usage notes
