# Pirate Battle

A 2D top-down naval shooter developed as a Frontend Game Developer technical challenge for Jungle Gaming.

The project combines React for the application interface with PixiJS for the real-time game engine, using TypeScript, TanStack Query, Axios, MSW and Playwright.

## Live Demo

**Production:**
Add the public Vercel URL here.

## GitHub

**Repository:**
https://github.com/BrunoAjala2023/pirate-battle

## Features

* 2D top-down naval shooter
* Player movement and rotation
* Front shooting
* Lateral three-projectile attacks
* Chaser enemies
* Shooter enemies
* Enemy projectiles
* Island collision
* Player health system
* Score system
* Configurable match duration
* Configurable enemy spawn interval
* Pause and restart
* Automatic pause when the browser loses focus
* Result screen after each match
* Ranking screen
* Match history
* Persistent game options using localStorage
* Mock REST API using MSW
* Server-state management with TanStack Query
* End-to-end tests with Playwright
* Desktop and mobile browser test configurations

## Controls

| Key   | Action               |
| ----- | -------------------- |
| W     | Move forward         |
| S     | Move backward        |
| A     | Rotate left          |
| D     | Rotate right         |
| Space | Front shot           |
| Q     | Left lateral attack  |
| E     | Right lateral attack |
| P     | Pause / Resume       |
| R     | Restart              |

## Game Configuration

The game configuration is centralized in:

```text
src/game/config/gameConfig.ts
```

Player and enemy parameters such as speed, health, damage, projectile speed and score values are defined in one place.

Player-configurable settings are handled by:

```text
src/game/config/gameSettings.ts
```

Available options:

* Match duration: 60, 90, 120 or 180 seconds
* Enemy spawn interval: 1000, 1500, 2000 or 3000 milliseconds

Settings are persisted using `localStorage`.

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

## Architecture

The application separates the React interface from the real-time PixiJS game engine.

React is responsible for:

* Application screens
* Navigation
* HUD
* Options
* Ranking
* Match history
* Result screen

PixiJS is responsible for:

* Game rendering
* Player movement
* Enemy behavior
* Projectiles
* Collisions
* Score
* Timer
* Game state

The architecture is documented in detail in:

```text
ARCHITECTURE.md
```

## API and Mocking

Axios is used as the HTTP client.

The API layer provides endpoints for:

```text
GET  /api/ranking
POST /api/ranking

GET  /api/history
POST /api/history
```

MSW intercepts these requests and provides the mocked backend used by the application.

The mock API allows the ranking and match history features to work without an external backend.

## Pending Match Persistence

Match submissions can be persisted locally when a request cannot be completed.

The pending queue is implemented in:

```text
src/api/pendingMatches.ts
```

The queue uses `localStorage` so pending submissions can remain available for later synchronization.

## Project Structure

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

## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/BrunoAjala2023/pirate-battle.git
cd pirate-battle
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available through the local Vite development server.

## Production Build

To generate a production build:

```bash
npm run build
```

The project uses Vite to build the application.

## Testing

The project uses Playwright for end-to-end testing.

Run the complete test suite:

```bash
npx playwright test
```

The tests cover:

* Main menu
* Options
* Ranking
* Match history
* Starting a game

The suite is executed using:

* Desktop Chromium
* Mobile browser configuration

The current suite contains 5 scenarios executed across both configurations.

## Deployment

The application is deployed using Vercel.

The production version uses the same frontend architecture and mocked API layer used during development.

## Development Notes

The real-time game loop is intentionally isolated from React rendering.

`GameCanvas.tsx` creates the PixiJS application and connects the game state to React through a controlled callback.

This approach keeps high-frequency game updates inside the game engine while React handles application-level UI.

## Author

**Bruno Ajala**

Frontend Developer in training
React • TypeScript • JavaScript • PixiJS
