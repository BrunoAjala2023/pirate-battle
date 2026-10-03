import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { Game } from "./Game";

interface GameCanvasProps {
  onStateChange: (state: {
    health: number;
    score: number;
    time: number;
    gameOver: boolean;
  }) => void;
}

export function GameCanvas({
  onStateChange,
}: GameCanvasProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application();

    let cancelled = false;
    let initialized = false;

    async function startPixi() {
      await app.init({
        width: 800,
        height: 600,
        background: "#1b7fa3",
      });

      initialized = true;

      if (cancelled) {
        app.destroy(true);
        return;
      }

      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      const game = new Game();

      app.stage.addChild(
        game.getWorld()
      );

      app.ticker.add((ticker) => {
        game.update(
          ticker.deltaMS / 1000
        );

        onStateChange(
          game.getState()
        );
      });

      container.appendChild(
        app.canvas as unknown as Node
      );
    }

    startPixi();

    return () => {
      cancelled = true;

      if (initialized) {
        app.destroy(true);
      }
    };
  }, [onStateChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}