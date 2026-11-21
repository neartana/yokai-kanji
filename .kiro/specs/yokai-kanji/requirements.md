# Requirements

## Introduction

Yokai Kanji is a web game that teaches JLPT N5 kanji through short quizzes with a yokai theme. This spec covers the minimum version for Kiroween 2026.

## Requirements

### Requirement 1: Meaning quiz

When the player starts a meaning quiz, the system shall show one kanji and 4 English meaning choices, with exactly one correct choice.

### Requirement 2: Reading quiz

When the player starts a reading quiz, the system shall show one kanji and 4 hiragana reading choices, with exactly one correct choice.

### Requirement 3: Light SRS

When the player answers a kanji wrong, the system shall show that kanji again later in the same session, and again in the next session until it is answered correctly.

### Requirement 4: Progress

When the player answers correctly, the system shall add XP and increase the streak, and shall save XP, streak, and mastered kanji count in LocalStorage.

### Requirement 5: Yokai collection

When the player reaches 10 correct answers in a row, the system shall unlock one new yokai and show it on the collection screen with its name, story, and kanji.

### Requirement 6: Data

The system shall load kanji data from `src/data/kanji-n5.json` with at least 50 N5 entries. Each entry shall have kanji, English meaning, onyomi, kunyomi, example word, example reading, example English, and yokai.

### Requirement 7: Interface language

The system shall show all interface text in English. Kanji, hiragana, and romaji appear only as study data.

### Requirement 8: Visual theme

The system shall use a dark night theme with lantern progress, ofuda score, and yokai art, while keeping main text readable with high contrast.
