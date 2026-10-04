# Little Hanzi Quest

A kid-friendly Chinese learning game built with Phaser, Vite, and TypeScript.

## Features

- Level-based gameplay with themed lessons
- Audio pronunciation for each word (browser speech synthesis + custom audio files)
- Mini-game style quiz and drag-and-drop matching
- Spaced repetition tracking for vocabulary review
- Keep practicing loop for missed words
- Save progress in the browser using localStorage
- No external art assets required; everything is drawn in code

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal.

## Adding custom audio

To add real voice recordings for better pronunciation:

1. Create a `public/audio/` folder in your project root
2. Add MP3 files with pinyin names. Example:
   - `public/audio/yi.mp3` (for character 一)
   - `public/audio/er.mp3` (for character 二)
   - `public/audio/ni-hao.mp3` (for phrase 你好)

The AudioManager will automatically use these files if they exist, and fall back to browser speech synthesis if not.

## Game flow

- Home screen
- Level selection screen
- Game rounds:
  - Round 1, 3, 5: Multiple-choice quiz
  - Round 2, 4: Drag-and-drop matching
- Results screen with stars and progression
- **Keep practicing** option appears if you missed any words
- Practice mode focuses on words you struggled with

## Practice Mode

After completing a level, if you missed any words:
- Tap "Keep Practicing"
- Review only the words you missed
- Get real-time feedback
- Earn bonus stars for improvement

## Suggested next improvements

- Add sound effects for correct/incorrect answers
- Add animations for word matches
- Add more levels and a map screen
- Add a statistics dashboard
- Add multiplayer or competitive leaderboard
- Add stroke-order animation for Chinese characters
- Turn it into a mobile app (React Native / Expo)

## License

MIT
