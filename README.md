# Yokai Kanji

Learn JLPT N5 kanji with yokai. Answer quiz questions about kanji meaning and reading to collect ofuda and unlock a yokai collection. Built for Kiroween 2026, Costume Contest category.

## How to play

1. Start a quiz session from the home screen.
2. Meaning quiz: see a kanji, pick the correct English meaning.
3. Reading quiz: see a kanji, pick the correct hiragana reading.
4. Correct answers earn ofuda and XP. Wrong answers return later in the same session.
5. Unlock a new yokai for every 10 correct answers in a row.

## Tech

Vite, React, TypeScript, Tailwind CSS. No backend. Progress is stored in LocalStorage. Built with Kiro using spec driven development. See the specs in `.kiro/specs/yokai-kanji/`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal, usually http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project status

Scope for Kiroween 2026: 50 N5 kanji, meaning quiz, reading quiz, light SRS, XP and streak, yokai collection. Out of scope for this version: accounts, online leaderboard, stroke writing, audio, N4.

## Demo video with Remotion

Remotion is installed in this project, version 4.0.545 for remotion, @remotion/cli, and @remotion/player. The demo video is code, not a screen recording.

Composition: YokaiKanjiDemo
Entry point: remotion/index.ts
Size: 1920 by 1080, 30 fps, 2250 frames, 75 seconds
Scenes: intro, sample quiz with kanji for sun and day, yokai collection, closing

Run the studio:

```bash
npm run studio
```

Render the video:

```bash
npm run render:demo
```

The render writes out/yokai-kanji-demo.mp4. The demo is under 3 minutes, as required for the Devpost submission.

Render note, 21 Nov 2026: a 1 second test render failed on this VM because Remotion could not download Chrome Headless Shell. Exact error: Could not download Chrome Headless Shell from https://remotion.media/chromium-headless-shell-linux-x64-158.0.8127.2.zip?clear: Tried to download file, but the server sent no data for 20 seconds. No MP4 was produced. Try the render again on your PC, or pass an existing browser executable to Remotion. The composition itself passes TypeScript checks and the Vite build passes.

You can also preview the video inside the app with the DemoPlayer component in src/components/DemoPlayer.tsx. It uses @remotion/player with the same composition.

## Design with FigCraft

FigCraft is the Figma plugin used for UI design review. See figcraft-notes.md in the parent folder for the full status.

Source: DivikWu/figcraft, version 0.1.0 in its package.json, MIT license, Node 20 or later. It is not yet on Figma Community and not yet published to npm, so it is built from source.

Build status on this VM: not built. The clone is at ~/workspace/tools/figcraft-src, but install, build, typecheck, and test were not run there, because the cloned content failed an execution risk check. Do not treat FigCraft as ready until that step is approved in plain words.

What still needs Figma Desktop on your own PC: Figma Desktop does not work on this headless VM. After the build produces manifest.json, open Figma Desktop, go to Plugins, Development, Import plugin from manifest, and select manifest.json. Then use FigCraft in Figma to create and review the Home, Quiz, and Collection screens, and to lint contrast, spacing, and target size.

## License

MIT. See LICENSE.
