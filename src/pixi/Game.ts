import { Container, Graphics } from "pixi.js";
import { Projectile } from "./Projectile";
import { EnemyProjectile } from "./EnemyProjectile";
import { gameConfig } from "../game/config/gameConfig";
import { Enemy } from "./Enemy";
import { getGameSettings, } from "../game/config/gameSettings";
import type { GameSettings, } from "../game/config/gameSettings";

export class Game {
  private world: Container;
  private player: Graphics;
  private keys = new Set<string>();
  private projectiles: Projectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private enemies: Enemy[] = [];
  private islands: Graphics[] = [];
  private playerHealth: number = gameConfig.player.health;
  private gameOver = false;
  private paused = false;
  private spawnTimer = 0;
  private gameTime = 0;
  private score = 0;
  private settings: GameSettings;
  
  

  private checkEnemyCollisions(): void {
  for (let i = this.enemies.length - 1; i >= 0; i--) {
    const enemy = this.enemies[i];

    const dx = this.player.x - enemy.sprite.x;
    const dy = this.player.y - enemy.sprite.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 25) {
      const damage =
        enemy.getType() === "chaser"
          ? gameConfig.enemies.chaser.damage
          : gameConfig.enemies.shooter.damage;

      this.playerHealth -= damage;

      console.log(
        "Vida do jogador:",
        this.playerHealth
      );

      // Remove o inimigo depois da colisão
      this.world.removeChild(enemy.sprite);
      this.enemies.splice(i, 1);

      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
        this.gameOver = true;

        console.log("Game Over!");
      }
    }
  }
}

  private enemyShoot(enemy: Enemy): void {
    const dx = this.player.x - enemy.sprite.x;
    const dy = this.player.y - enemy.sprite.y;

    const angle = Math.atan2(dy, dx);

    const projectile = new EnemyProjectile(
      enemy.sprite.x,
      enemy.sprite.y,
      angle,
      gameConfig.projectiles.enemy.speed
    );

    this.enemyProjectiles.push(projectile);
    this.world.addChild(projectile.sprite);
  }

  private spawnEnemy(): void {
    const x = Math.random() * 800;
    const y = Math.random() * 600;

    const type = Math.random() < 0.7 ? "chaser" : "shooter";

    const enemy = new Enemy (x, y, type);

    this.enemies.push(enemy);
    this.world.addChild(enemy.sprite);
  }

  private checkEnemyProjectileCollisions(): void {
  for (
    let i = this.enemyProjectiles.length - 1;
    i >= 0;
    i--
  ) {
    const projectile = this.enemyProjectiles[i];

    const dx =
      projectile.sprite.x - this.player.x;

    const dy =
      projectile.sprite.y - this.player.y;

    const distance =
      Math.sqrt(dx * dx + dy * dy);

    if (distance < 25) {
      this.playerHealth -=
        gameConfig.enemies.shooter.damage;

      console.log(
        "Jogador atingido pelo Shooter:",
        this.playerHealth
      );

      this.world.removeChild(
        projectile.sprite
      );

      this.enemyProjectiles.splice(i, 1);

      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
        this.gameOver = true;

        console.log("Game Over!");
      }
    }
  }
}

  private checkProjectileCollisions(): void {
  for (let i = this.projectiles.length - 1; i >= 0; i--) {
    const projectile = this.projectiles[i];

    for (let j = this.enemies.length - 1; j >= 0; j--) {
      const enemy = this.enemies[j];

      const dx = projectile.sprite.x - enemy.sprite.x;
      const dy = projectile.sprite.y - enemy.sprite.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 25) {
        enemy.takeDamage(
          gameConfig.projectiles.player.damage
        );

        this.world.removeChild(projectile.sprite);
        this.projectiles.splice(i, 1);

        if (enemy.isDead()) {

          const points = enemy.getType() === "chaser"
            ? gameConfig.score.chaser
            : gameConfig.score.shooter;

          this.score += points;

          console.log("Score:", this.score);

          this.world.removeChild(enemy.sprite);
          this.enemies.splice(j, 1);
        }

        break;
      }
    }
  }
}

  private createIslands(): void {
  const positions = [
    { x: 150, y: 150, radius: 60 },
    { x: 650, y: 150, radius: 80 },
    { x: 200, y: 480, radius: 70 },
    { x: 650, y: 450, radius: 55 },
  ];

  for (const position of positions) {
    const island = new Graphics();

    island.circle(
      0,
      0,
      position.radius
    );

    island.fill("#4f8a45");

    island.x = position.x;
    island.y = position.y;

    this.islands.push(island);

    this.world.addChild(island);
  }
  }

  constructor(
    settings: GameSettings = getGameSettings()
  ) {
    this.settings = {
      ...settings,
    };
    this.world = new Container();

    this.player = this.createPlayer();

    this.world.addChild(this.player);

    this.createIslands();
    this.projectiles = [];

    this.setupKeyboard();

    window.addEventListener("keydown", this.handleShoot);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  private handleWindowBlur = (): void => {
    if (!this.gameOver) {
      this.paused = true;
      console.log("Jogo pausado: Janela perdeu o foco");
    }
  };

  private handleShoot = (event: KeyboardEvent): void => {
    if (event.code !== "Space") {
      return; 
    }

    event.preventDefault();

    this.shoot();
  }

  private shoot(): void {
    const projectile = new Projectile(
      this.player.x,
      this.player.y,
      this.player.rotation,
      gameConfig.projectiles.player.speed
    );
    this.projectiles.push(projectile);
    this.world.addChild(projectile.sprite);
  }

  private shootSide(direction: "left" | "right"): void {
  const sideAngle =
    direction === "left"
      ? this.player.rotation - Math.PI / 2
      : this.player.rotation + Math.PI / 2;

  const spread = 0.25;

  const angles = [
    sideAngle - spread,
    sideAngle,
    sideAngle + spread,
  ];

  for (const angle of angles) {
    const projectile = new Projectile(
      this.player.x,
      this.player.y,
      angle,
      gameConfig.projectiles.player.speed
    );

    this.projectiles.push(projectile);

    this.world.addChild(projectile.sprite);
  }
}

  private createPlayer(): Graphics {
    const ship = new Graphics();

    ship.moveTo(0, -30);
    ship.lineTo(20, 20);
    ship.lineTo(0, 30);
    ship.lineTo(-20, 20);
    ship.closePath();

    ship.fill("#e6e6e6");

    ship.x = 400;
    ship.y = 300;

    return ship;
  }

  private setupKeyboard(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {

    if (event.repeat) {
      return;
    }

  const key = event.key.toLowerCase();

  if (
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d" ||
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright" ||
    key === " "
  ) {
    event.preventDefault();
  }

  this.keys.add(key);

  if (key === "q") {
    this.shootSide("left");
  }
  if (key === "e") {
    this.shootSide("right");
  }

  if (key === "p") {
    this.paused = !this.paused;
    console.log(
      this.paused ? "Jogo pausado" : "Jogo retomado"
    );
  }

  if (event.key.toLowerCase() === "r") {
    this.restart();
    return;
  }

  this.keys.add(key);
};

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
  };

  private checkIslandCollisions(): void {
  const playerRadius = 15;

  for (const island of this.islands) {
    const dx = this.player.x - island.x;
    const dy = this.player.y - island.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    const islandRadius =
      island.width / 2;

    const minimumDistance =
      islandRadius + playerRadius;

    if (distance < minimumDistance) {
      const angle = Math.atan2(dy, dx);

      this.player.x =
        island.x +
        Math.cos(angle) * minimumDistance;

      this.player.y =
        island.y +
        Math.sin(angle) * minimumDistance;
    }
  }
}

private restart(): void {
  // Remove inimigos
  for (const enemy of this.enemies) {
    this.world.removeChild(enemy.sprite);
  }

  // Remove projéteis do jogador
  for (const projectile of this.projectiles) {
    this.world.removeChild(projectile.sprite);
  }

  // Remove projéteis dos inimigos
  for (const projectile of this.enemyProjectiles) {
    this.world.removeChild(projectile.sprite);
  }

  // Limpa os arrays
  this.enemies = [];
  this.projectiles = [];
  this.enemyProjectiles = [];

  // Reinicia estado
  this.playerHealth = gameConfig.player.health;
  this.score = 0;
  this.gameTime = 0;
  this.spawnTimer = 0;
  this.gameOver = false;
  this.paused = false;

  // Reposiciona o jogador
  this.player.x = 400;
  this.player.y = 300;
  this.player.rotation = 0;

  console.log("Jogo reiniciado!");
}


public update(deltaTime: number): void {

  if (this.gameOver || this.paused) {
    return;
  }

  this.gameTime += deltaTime;

  if (this.gameTime >= this.settings.duration) {
    this.gameOver = true;
    console.log("Game Over! Time's up!");
    return;
  }

  const speed = gameConfig.player.speed * deltaTime;

  const rotationSpeed =
    gameConfig.player.rotationSpeed * deltaTime;

  // Movimento do jogador
  if (this.keys.has("a")) {
    this.player.rotation -= rotationSpeed;
  }

  if (this.keys.has("d")) {
    this.player.rotation += rotationSpeed;
  }

  if (this.keys.has("w")) {
    this.player.x +=
      Math.sin(this.player.rotation) * speed;

    this.player.y -=
      Math.cos(this.player.rotation) * speed;
  }

  if (this.keys.has("s")) {
    this.player.x -=
      Math.sin(this.player.rotation) * speed;

    this.player.y +=
      Math.cos(this.player.rotation) * speed;
  }

  // Atualiza projéteis do jogador
  for (const projectile of this.projectiles) {
    projectile.update(deltaTime);
  }

  // Atualiza inimigos
  for (const enemy of this.enemies) {
    const shouldShoot = enemy.update(
      deltaTime,
      this.player.x,
      this.player.y
    );

    if (shouldShoot) {
      this.enemyShoot(enemy);
    }
  }

  // Atualiza projéteis dos inimigos
  for (const projectile of this.enemyProjectiles) {
    projectile.update(deltaTime);
  }

  // Colisões
  this.checkProjectileCollisions();
  this.checkEnemyCollisions();
  this.checkEnemyProjectileCollisions();
  this.checkIslandCollisions();
  // Spawn de inimigos
  this.spawnTimer += deltaTime * 1000;

  if (this.spawnTimer >= this.settings.spawnInterval) {
    this.spawnEnemy();
    this.spawnTimer = 0;
  }
}

  public getWorld(): Container {
    return this.world;
  }

  public destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("keydown", this.handleShoot);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  public getState() {
    return {
      health: this.playerHealth,
      score: this.score,
      time: this.gameTime,
      gameOver: this.gameOver,
  };    
}
}