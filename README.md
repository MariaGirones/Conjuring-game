# The Conjuring — A Warren Investigation

An interactive psychological horror text adventure based on the documented paranormal investigations of Ed and Lorraine Warren (Rhode Island, 1971). Navigate the Perron farmhouse, gather evidence, manage your sanity, and confront the entity known as Bathsheba Sherman.

**Play online:** [https://mariagirones.github.io/Conjuring-game/](https://mariagirones.github.io/Conjuring-game/)

---

## Gameplay

- **Read** each scene carefully — the story contains clues about what to do next.
- **Make decisions** that appear based on your current sanity level and the items in your inventory.
- **Collect items** — some are passive (camera, voice recorder), some are consumable.
- **Use consumables** from the Inventory panel at any time to restore sanity.
- **Document evidence** — your Field Report log tracks every piece. You'll need it at the end.
- **Survive** by gathering evidence and using the Warren's rowan cross in the Final Chamber — or by binding Bathsheba with your full case file.

### Items of note

| Item | Where to find | Effect |
|------|--------------|--------|
| Anxiety Pills | Root Cellar (Level 3) | Take them — restores +25 sanity |
| Holy Water | Chapel area (Level 2) | Anoint yourself — restores +15 sanity |
| Warren's Rowan Cross | Hidden under a pew, Chapel (Level 2) | Clutch it — restores +15 sanity; **required** for the direct exorcism ending |
| Voice Recorder | Confessional (Level 5) | Passive — captures EVP evidence |
| Film Camera | Children's Ward (Level 4) | Passive — photographs paranormal activity |

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/MariaGirones/Conjuring-game.git
cd Conjuring-game

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# Opens at http://localhost:5173/Conjuring-game/

# 4. Build for production
npm run build
# Output written to dist/

# 5. Preview the production build locally
npm run preview
```

---

## Deploying to GitHub Pages

The repository includes a CI/CD workflow at `.github/workflows/pages.yml` that automatically builds and deploys whenever you push to `main`.

### One-time setup (do this once)

1. Open your repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Save.

### Every deployment after that

```bash
git add .
git commit -m "Your message"
git push origin main
```

The workflow will:
1. Check out your code
2. Install dependencies (`npm ci`)
3. Build the project (`npm run build` → `dist/`)
4. Deploy `dist/` to GitHub Pages

Live URL after deployment:
```
https://mariagirones.github.io/Conjuring-game/
```

> **Note:** The Vite config sets `base: '/Conjuring-game/'` — this must match the repository name exactly. If you rename the repo, update this in `vite.config.ts`.

---

## Theme System

| Mode | Appearance |
|------|-----------|
| Dark (default) | Near-black background, warm off-white text, velvet atmosphere |
| Light | Aged parchment background (#f2ebe0), near-black text — still gothic |

- Toggle with the **☀️ / 🌑** button in the header or on the start screen.
- Preference is saved in `localStorage` and restored on next visit.
- Implemented with CSS custom properties (`:root` = light, `.dark` = dark) + Tailwind `darkMode: 'class'`.
- All colors meet WCAG AA contrast ratios in both modes.

---

## Project Structure

```
Conjuring-game/
├── index.html                     # Entry point — Google Fonts loaded here
├── vite.config.ts                 # base: '/Conjuring-game/', outDir: 'dist'
├── tailwind.config.js             # darkMode: 'class'
├── src/
│   ├── main.tsx                   # React root
│   ├── App.tsx                    # ThemeProvider wrapper
│   ├── index.css                  # CSS variables, Gothic typography, custom classes
│   ├── data/
│   │   ├── levels.json            # Full story — 10 levels, Warren-case inspired
│   │   └── items.json             # Item definitions (usable flag, sanityRestore value)
│   ├── engine/
│   │   └── StoryEngine.ts         # Reads levels.json, resolves choices
│   ├── hooks/
│   │   ├── useGameStore.ts        # Zustand store — inventory, sanity, evidence, useItem
│   │   ├── useTheme.tsx           # Light/dark toggle, localStorage persistence
│   │   └── useAudio.ts            # Web Audio API — filtered noise ambient + SFX
│   ├── game/
│   │   └── Game.tsx               # Main game layout and choice logic
│   └── components/
│       ├── StartScreen.tsx        # Title / entry screen
│       ├── EndingScreen.tsx       # SURVIVED / POSSESSED / DEAD endings
│       ├── StoryPanel.tsx         # Story manuscript area
│       ├── DecisionButtons.tsx    # Choice buttons
│       ├── InventoryPanel.tsx     # Item list with Use buttons for consumables
│       ├── EvidenceTracker.tsx    # Field report / investigation log
│       ├── SanityMeter.tsx        # Sanity progress bar
│       ├── AudioToggle.tsx        # Mute / unmute
│       └── ThemeToggle.tsx        # Light / Dark mode toggle
└── .github/
    └── workflows/
        └── pages.yml              # CI/CD: install → build → deploy to GitHub Pages
```

---

## Adding Content

### New level

Add an object to `src/data/levels.json`:

```json
{
  "id": 11,
  "title": "The Cellar Passage",
  "description": "You descend further than you should...",
  "decisions": [
    {
      "text": "Follow the sound",
      "consequence": {
        "text": "The sound leads you somewhere worse.",
        "sanityChange": -12,
        "evidence": "Unidentified sound source — sub-basement",
        "nextLevel": 7
      }
    }
  ]
}
```

Optional decision fields: `minSanity` (hide if player sanity is below this), `requiredItem` (hide if item not in inventory).

### New usable item

Add to `src/data/items.json`:

```json
{
  "id": "rosary",
  "name": "Ed Warren's Rosary",
  "description": "Worn wooden beads. Still warm.",
  "usable": true,
  "sanityRestore": 20,
  "useLabel": "Pray",
  "useEffect": "The prayer steadies you. The room feels briefly smaller.",
  "rarity": "rare"
}
```

Then reference it in a level consequence: `"item": "rosary"`.

---

## Audio

The game uses the **Web Audio API** — no audio files, no network requests for sound. Fully static.

- **Ambient**: Lowpass-filtered white noise with a slowly sweeping cutoff + a subtle low-frequency drone.
- **Whisper effect**: Three bandpass-filtered noise bursts, staggered.
- **Heartbeat**: Low-shelf boosted sine pulses (lub–dub) triggered at critical sanity.

To add real `.mp3` / `.ogg` files in future, place them in `src/assets/audio/` and load them via `AudioContext.decodeAudioData` in `useAudio.ts`.

---

## Commands

```bash
npm run dev      # Development server — http://localhost:5173/Conjuring-game/
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

---

*In memory of Ed Warren (1926–2006) and Lorraine Warren (1927–2019).*
*"We don't know everything about this world. But we've seen enough to know it isn't empty." — Lorraine Warren*
