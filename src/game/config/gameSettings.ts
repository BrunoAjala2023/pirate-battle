export interface GameSettings {
  duration: number;
  spawnInterval: number;
}

export const defaultGameSettings: GameSettings = {
  duration: 120,
  spawnInterval: 2000,
};

export function getGameSettings(): GameSettings {
  const saved = localStorage.getItem(
    "pirate-battle-settings"
  );

  if (!saved) {
    return defaultGameSettings;
  }

  try {
    return {
      ...defaultGameSettings,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultGameSettings;
  }
}

export function saveGameSettings(
  settings: GameSettings
): void {
  localStorage.setItem(
    "pirate-battle-settings",
    JSON.stringify(settings)
  );
}