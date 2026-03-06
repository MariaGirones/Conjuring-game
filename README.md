# Conjuring Game

An interactive fiction horror web application inspired by The Conjuring house.

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` to start the development server
4. Open your browser to `http://localhost:5173`

## How to Run

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Game Overview

Navigate through 10 levels of the cursed mansion, collect evidence, manage sanity, and survive the night.

## Architecture

- **Frontend**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Game Engine**: JSON-based narrative engine

## How the Game Engine Works

The game engine loads level data from `src/data/levels.json`. Each level has a description and decisions with consequences that affect sanity, inventory, evidence, and progression.

## Adding New Levels

1. Add a new object to `src/data/levels.json` with id, title, description, and decisions array.
2. Each decision has text and consequence object with text, optional sanityChange, item, evidence, nextLevel, or dead.

## Adding New Items

Items are added via consequences. To define item effects, modify the game logic in `src/game/Game.tsx` or `src/engine/StoryEngine.ts`.

## Adding New Endings

Endings are determined by conditions in `src/game/Game.tsx`. Modify the win/lose conditions based on sanity, evidence, etc.