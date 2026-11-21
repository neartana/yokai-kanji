# Structure

```
yokai-kanji/
  .kiro/
    steering/
      product.md
      tech.md
      structure.md
    specs/
      yokai-kanji/
        requirements.md
        design.md
        tasks.md
  src/
    data/
      kanji-n5.json
    components/
      QuizCard.tsx
      YokaiCard.tsx
      LanternProgress.tsx
    pages/
      Home.tsx
      Quiz.tsx
      Collection.tsx
    lib/
      srs.ts
      storage.ts
  public/
    favicon.svg
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  README.md
  LICENSE
```

## Rules

Keep the `.kiro` folder in the repo root. Never add it to `.gitignore`.
Keep data in JSON. Keep quiz logic in `src/lib`. Keep presentation in `src/components` and `src/pages`.
Add a new page only when a new screen is needed. Do not create a folder for one file.
