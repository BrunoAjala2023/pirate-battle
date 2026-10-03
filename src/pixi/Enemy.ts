import { Graphics } from "pixi.js";
import { gameConfig } from "../game/config/gameConfig";

export type EnemyType = "chaser" | "shooter";

export class Enemy {
  public sprite: Graphics;
  public health: number;

  private speed: number;
  private type: EnemyType;
  private shootTimer = 0;

  constructor(
    x: number,
    y: number,
    type: EnemyType
  ) {
    this.type = type;

    this.sprite = new Graphics();

    this.sprite.circle(0, 0, 20);

    if (type === "chaser") {
      this.sprite.fill("#d94a4a");
    } else {
      this.sprite.fill("#8e44ad");
    }

    this.sprite.x = x;
    this.sprite.y = y;

    if (type === "chaser") {
      this.health = gameConfig.enemies.chaser.health;
      this.speed = gameConfig.enemies.chaser.speed;
    } else {
      this.health = gameConfig.enemies.shooter.health;
      this.speed = gameConfig.enemies.shooter.speed;
    }
  }

  public update(
    deltaTime: number,
    targetX: number,
    targetY: number
  ): boolean {

    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      return false;
    }

    if (this.type === "chaser") {
        
    this.sprite.x +=
      (dx / distance) * this.speed * deltaTime;

    this.sprite.y +=
      (dy / distance) * this.speed * deltaTime;

      return false;
    }

    this.shootTimer += deltaTime;

    if (
      this.shootTimer >=
      gameConfig.enemies.shooter.shootInterval / 1000
    ) {
      this.shootTimer = 0;
      return true;
    }

    return false;

  }

  public getType(): EnemyType {
    return this.type;
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  
}