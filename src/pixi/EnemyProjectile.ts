import { Graphics } from "pixi.js";

export class EnemyProjectile {
  public sprite: Graphics;

  private speed: number;
  private angle: number;

  constructor(
    x: number,
    y: number,
    angle: number,
    speed: number
  ) {
    this.sprite = new Graphics();

    this.sprite.circle(0, 0, 5);
    this.sprite.fill("#ff4444");

    this.sprite.x = x;
    this.sprite.y = y;

    this.speed = speed;
    this.angle = angle;
  }

  public update(deltaTime: number): void {
    this.sprite.x +=
      Math.sin(this.angle) *
      this.speed *
      deltaTime;

    this.sprite.y -=
      Math.cos(this.angle) *
      this.speed *
      deltaTime;
  }
}