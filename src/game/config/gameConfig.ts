export interface GameConfig {
  duration: number;
  spawnInterval: number;

  player: {
    speed: number;
    rotationSpeed: number;
    health: number;
  };

  enemies: {
    chaser: {
        health: number;
        speed: number;
        damage: number;
    };

    shooter: {
        health: number;
        speed: number;
        damage: number;
        shootInterval: number;
    };
  };

  projectiles: {
    player: {
        speed: number;
        damage: number;
  };

  enemy: {
    speed: number;
    damage: number;
  };
};

  score: {
    chaser: number;
    shooter: number;
  };
}

export const gameConfig: GameConfig = {
  duration: 120, // Duration of the game in seconds
  spawnInterval: 2000, // Interval in milliseconds for spawning new entities
 
  player: {
    speed: 250,
    rotationSpeed: 3,
    health: 100,
  },
  enemies: {
    chaser: {
      health: 30,
      speed: 100,
      damage: 15,
    },
    shooter: {
      health: 40,
      speed: 70,
      damage: 10,
      shootInterval: 2000,
    }
  },
  projectiles: {
    player: {
      speed: 500,
      damage: 20,
    },
    enemy: {
      speed: 300,
      damage: 10,
    }
  },
  score: {
    chaser: 100,
    shooter: 150,
  }
};

