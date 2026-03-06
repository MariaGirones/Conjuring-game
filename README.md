# 🏚️ The Conjuring Game

An interactive dark fiction horror web application inspired by The Conjuring house. Explore a cursed mansion, collect paranormal evidence, and survive the night while managing your mental sanity.

**Play the game online:** [https://mariagirones.github.io/Conjuring-game/](https://mariagirones.github.io/Conjuring-game/)

## 🎮 Game Features

- **10 Immersive Levels** - Navigate through different areas of the haunted mansion
- **Sanity System** - Your mental state deteriorates as you encounter supernatural phenomena
- **Evidence Collection** - Gather proof of paranormal activity to unlock the true ending
- **Multiple Endings** - Survive, get possessed, or lose your mind - three different outcomes
- **Audio System** - Atmospheric horror sounds and ambient music
- **Dark Mode Only** - Optimized for creepy atmosphere and reduced eye strain
- **Persistent Progress** - Your game state is saved to localStorage automatically
- **Responsive Design** - Play on desktop, tablet, or mobile

## 🚀 Quick Start

### Play Online
Simply visit [https://mariagirones.github.io/Conjuring-game/](https://mariagirones.github.io/Conjuring-game/) to play.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/MariaGirones/Conjuring-game.git
cd Conjuring-game

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
npm run build    # Creates optimized build in /dist
npm run preview  # Preview production build locally
```

## 🏗️ Project Architecture

```
/src
├── /components        # React UI components
│   ├── AudioToggle.tsx
│   ├── DecisionButtons.tsx
│   ├── EndingScreen.tsx
│   ├── EvidenceTracker.tsx
│   ├── InventoryPanel.tsx
│   ├── SanityMeter.tsx
│   ├── StartScreen.tsx
│   ├── StoryPanel.tsx
│   └── ThemeToggle.tsx
├── /engine           # Game logic
│   └── StoryEngine.ts
├── /game            # Main game component
│   └── Game.tsx
├── /hooks           # Custom React hooks
│   ├── useAudio.ts
│   ├── useGameStore.ts
│   └── useTheme.tsx
├── /data            # Game content (JSON)
│   ├── levels.json
│   ├── items.json
│   └── events.json
├── /styles         # Global styles
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Tailwind setup
```

### Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Language**: TypeScript
- **Persistence**: Browser localStorage

## 🎮 How the Game Engine Works

The game uses a **JSON-based narrative engine** that loads story content from data files:

### Game Flow

1. **Player enters name** → Game initializes with level 1
2. **Story text displays** → Current level description renders
3. **Decisions presented** → 2-4 choices for player to make
4. **Consequence triggers** → Choice leads to:
   - Sanity changes
   - Item acquisition
   - Evidence collection
   - Level progression or death
5. **Multiple endings** → Based on final choices and sanity level

### Level Structure

Each level in `src/data/levels.json` contains:

```json
{
  "id": 1,
  "title": "Entrance Hall",
  "description": "You stand before the mansion...",
  "decisions": [
    {
      "text": "Go left",
      "consequence": {
        "text": "You walk into darkness...",
        "sanityChange": -5,
        "item": "flashlight",
        "evidence": "cold spot",
        "nextLevel": 2
      }
    }
  ]
}
```

### Consequence Objects

```typescript
interface Consequence {
  text: string              // What happens after choice
  sanityChange?: number     // -50 to +10 (negative = loss)
  item?: string            // Item to add to inventory
  evidence?: string        // Clue to add to evidence list
  nextLevel?: number       // Level to progress to
  ending?: string          // "SURVIVED" | "POSSESSED"
  dead?: boolean           // Immediate game over
}
```

## ➕ Adding New Levels

1. Open `src/data/levels.json`
2. Add a new level object with a unique `id`:

```json
{
  "id": 11,
  "title": "New Room",
  "description": "A terrifying new location...",
  "decisions": [
    {
      "text": "First choice",
      "consequence": {
        "text": "What happens...",
        "sanityChange": -10,
        "nextLevel": 12
      }
    }
  ]
}
```

3. Reference the new level from other levels' `nextLevel` properties
4. Build: `npm run build`

## ➕ Adding New Items

Items are defined in `src/data/items.json`:

```json
{
  "id": "new-item",
  "name": "Item Display Name",
  "description": "What is this item?",
  "effect": "What does it do?",
  "rarity": "common|uncommon|rare|epic"
}
```

Then add it to consequences:

```json
"consequence": {
  "text": "You find something...",
  "item": "new-item"
}
```

## 🎯 Adding New Endings

Modify `src/game/Game.tsx` to add ending logic:

```typescript
if (consequence.ending === 'NEW_ENDING') {
  setEnding('NEW_ENDING')
}
```

Then create the ending screen UI in `src/components/EndingScreen.tsx`.

## 📚 Available Game Commands

```bash
npm run dev      # Start dev server on :5173
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
```

## 🌐 GitHub Pages Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions:

1. **Automatic Deployment**: Push to `main` branch triggers build
2. **Live URL**: [https://mariagirones.github.io/Conjuring-game/](https://mariagirones.github.io/Conjuring-game/)
3. **Manual Override**: Run `npm run build` locally and commit `/dist` folder

### Enable GitHub Pages

1. Go to **Settings** → **Code and automation** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Let the workflow run automatically on push

## 💾 Data Persistence

The game automatically saves to browser localStorage:
- Player name
- Current level
- Sanity level
- Inventory items
- Collected evidence
- Game alive/dead status

Clear localStorage to reset the game.

## 🎨 Customization

### Change Game Colors

Edit `src/index.css`:
```css
.horror-button {
  @apply bg-red-900;  /* Change button colors */
}
```

### Adjust Sanity Thresholds

In `src/game/Game.tsx`:
```typescript
if (sanity < 40) {  // Change threshold
  playEffect('whisper')
}
```

### Modify Audio

Create audio files and reference in `src/hooks/useAudio.ts`:
```typescript
playEffect('custom-sound')  // Needs /audio/effects/custom-sound.mp3
```

## 📖 Story Levels Overview

1. **Entrance Hall** - Introduction to the mansion
2. **Chapel** - Religious horrors
3. **Basement** - Ritual chamber
4. **Attic** - Child spirits
5. **Confessional** - Voices from the past
6. **Ritual Room** - Dark magic pentagon
7. **Hidden Tunnel** - Underground passages
8. **Library** - Forbidden knowledge
9. **Bedroom Corridor** - Endless doors
10. **Final Chamber** - The Entity awaits

## 🤝 Contributing

Want to improve the game? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👻 Warnings

⚠️ This game contains:
- Psychological horror themes
- Disturbing imagery and narrative
- References to dark religious themes
- Content that may affect mental state in players with anxiety

Play at your own discretion. Remember, it's just a game! 🎮