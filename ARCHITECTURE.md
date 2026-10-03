# Pirate Battle — Architecture

## Overview

Pirate Battle is a 2D top-down naval shooter developed with React, TypeScript and PixiJS.

The application separates the React interface from the real-time game engine while using TanStack Query, Axios and MSW for the ranking and match history flows.

## Technology Stack

* React
* TypeScript
* Vite
* PixiJS
* TanStack Query
* Axios
* MSW
* Playwright
* CSS

## Application Structure

```text
src/
├── api/
│   ├── api.ts
│   ├── historyApi.ts
│   ├── pendingMatches.ts
│   └── rankingApi.ts
│
├── components/
│   ├── History.tsx
│   └── Ranking.tsx
│
├── game/
│   └── config/
│       ├── gameConfig.ts
│       └── gameSettings.ts
│
├── mocks/
│   ├── browser.ts
│   └── handlers.ts
│
├── pixi/
│   ├── Enemy.ts
│   ├── EnemyProjectile.ts
│   ├── Game.ts
│   ├── GameCanvas.tsx
│   └── Projectile.ts
│
├── App.tsx
├── index.css
└── main.tsx

tests/
└── basic.spec.ts
```

## React Layer

React is responsible for the application UI and navigation.

The main screens are:

* Main Menu
* Game
* Result
* Options
* Ranking
* Match History

`App.tsx` controls the current screen and connects the React interface with the game state.

React is not responsible for the real-time game loop.

## PixiJS Game Engine

PixiJS is responsible for rendering and updating the game world.

The main `Game` class handles:

* Player movement and rotation
* Player shooting
* Lateral projectile attacks
* Enemy spawning
* Enemy movement
* Enemy shooting
* Projectile collisions
* Player damage
* Island collisions
* Score
* Game timer
* Pause and restart
* Game over state

`GameCanvas.tsx` creates the PixiJS application and connects its update loop to React through a state callback.

This separation keeps the real-time rendering logic independent from React's rendering cycle.

## Game Configuration

Game constants are centralized in:

```text
src/game/config/gameConfig.ts
```

The configuration contains:

* Player speed
* Player rotation speed
* Player health
* Enemy health
* Enemy speed
* Enemy damage
* Projectile speed
* Projectile damage
* Enemy shooting interval
* Score values

This makes gameplay parameters easier to maintain and modify.

## Persistent Options

Player-configurable settings are stored in:

```text
src/game/config/gameSettings.ts
```

The current options are:

* Match duration
* Enemy spawn interval

Settings are persisted using `localStorage` and loaded when a new match starts.

A match receives a snapshot of the current settings when the `Game` instance is created. This prevents changes made later from affecting an active match.

## API Layer

The API layer is separated from the UI components.

### Ranking

`rankingApi.ts` handles:

* GET `/api/ranking`
* POST `/api/ranking`

### Match History

`historyApi.ts` handles:

* GET `/api/history`
* POST `/api/history`

Axios is centralized in `api.ts`.

## TanStack Query

TanStack Query manages server-state operations for ranking and match history.

It provides:

* Loading states
* Error states
* Retry behavior
* Query caching
* Query invalidation after mutations

Ranking and history components remain focused on presentation while the query layer manages asynchronous API state.

## Mock API

MSW provides the mocked REST API used by the application.

The handlers simulate:

* Ranking retrieval
* Ranking registration
* Match history retrieval
* Match registration

The mock data is maintained in memory during the application session.

This allows the frontend to behave as if it were communicating with a backend without requiring an external server.

## Pending Match Persistence

Failed match submissions can be stored locally through:

```text
src/api/pendingMatches.ts
```

The pending queue uses `localStorage`, allowing unsuccessful submissions to remain available for later synchronization attempts.

## Game State Flow

```text
React App
   │
   ├── Start Match
   │
   ▼
GameCanvas
   │
   ▼
PixiJS Game
   │
   ├── Update
   ├── Input
   ├── Collision
   ├── Enemies
   ├── Projectiles
   └── Score
   │
   ▼
Game State
   │
   ▼
React HUD / Result
   │
   ├── Match History API
   └── Ranking API
```

## Input

Keyboard controls currently include:

| Input | Action               |
| ----- | -------------------- |
| W     | Move forward         |
| S     | Move backward        |
| A     | Rotate left          |
| D     | Rotate right         |
| Space | Front shot           |
| Q     | Left lateral attack  |
| E     | Right lateral attack |
| P     | Pause                |
| R     | Restart              |

The game also automatically pauses when the browser window loses focus.

## Collision System

The game uses distance-based collision detection.

Collisions are checked between:

* Player and enemies
* Player and enemy projectiles
* Player projectiles and enemies
* Player and islands

The player is also constrained to the 800×600 game world boundaries.

## Testing

Playwright provides end-to-end coverage for:

* Main menu
* Options
* Ranking
* Match history
* Starting a game

The test suite runs against:

* Desktop Chromium
* Mobile browser configuration

The current test suite contains 5 scenarios executed across both browser configurations.

## Production

The application is built with Vite and deployed as a static frontend through Vercel.

The production build can be generated with:

```bash
npm run build
```

The application uses MSW to provide the mocked API endpoints for ranking and match history.

## Design Decisions

The main architectural decision was to keep React responsible for application UI and PixiJS responsible for the real-time game world.

This avoids coupling the game loop to React state updates while still allowing React to display HUD information and application screens.

Game configuration, API communication, mocked backend behavior and persistent settings are isolated into dedicated modules.

This structure keeps the project easier to maintain, test and extend.
