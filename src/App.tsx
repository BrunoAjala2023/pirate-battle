import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { GameCanvas } from "./pixi/GameCanvas";

import { Ranking } from "./components/Ranking";
import { History } from "./components/History";

import {
  createMatch,
} from "./api/historyApi";

import {
  createRankingEntry,
} from "./api/rankingApi";

import {
  getPendingMatches,
  savePendingMatch,
  removePendingMatch,
} from "./api/pendingMatches";

import {
  getGameSettings,
  saveGameSettings,
} from "./game/config/gameSettings";

type Screen =
  | "menu"
  | "game"
  | "result"
  | "ranking"
  | "history"
  | "options";

interface GameState {
  health: number;
  score: number;
  time: number;
  gameOver: boolean;
}

function App() {
  const [screen, setScreen] =
    useState<Screen>("menu");

  const [gameState, setGameState] =
    useState<GameState>({
      health: 100,
      score: 0,
      time: 0,
      gameOver: false,
    });

  const [gameKey, setGameKey] =
    useState(0);

  const [settings, setSettings] =
    useState(getGameSettings());

  const matchRegisteredRef =
    useRef(false);

  const pendingSyncRef =
    useRef(false);

  const queryClient =
    useQueryClient();

  /*
   * =========================
   * MUTATION - HISTÓRICO
   * =========================
   */

  const createMatchMutation =
    useMutation({
      mutationFn: createMatch,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["match-history"],
        });

        queryClient.invalidateQueries({
          queryKey: ["ranking"],
        });
      },

      onError: (error, variables) => {
        console.error(
          "Falha ao registrar partida:",
          error,
        );

        savePendingMatch(variables);

        console.log(
          "Partida salva como pendente:",
          variables,
        );
      },
    });

  /*
   * =========================
   * MUTATION - RANKING
   * =========================
   */

  const createRankingMutation =
    useMutation({
      mutationFn: createRankingEntry,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["ranking"],
        });
      },

      onError: (error) => {
        console.error(
          "Falha ao registrar pontuação:",
          error,
        );
      },
    });

  /*
   * =========================
   * REENVIO DE PARTIDAS
   * PENDENTES
   * =========================
   */

  useEffect(() => {
    if (pendingSyncRef.current) {
      return;
    }

    pendingSyncRef.current = true;

    const pendingMatches =
      getPendingMatches();

    if (pendingMatches.length === 0) {
      return;
    }

    console.log(
      "Partidas pendentes encontradas:",
      pendingMatches,
    );

    pendingMatches.forEach(
      (match) => {
        createMatchMutation.mutate(
          match,
          {
            onSuccess: () => {
              removePendingMatch(
                match,
              );

              console.log(
                "Partida pendente reenviada com sucesso:",
                match,
              );
            },

            onError: () => {
              console.log(
                "Partida pendente continua aguardando:",
                match,
              );
            },
          },
        );
      },
    );
  }, []);

  /*
   * =========================
   * ESTADO DO JOGO
   * =========================
   */

  const handleGameState =
    useCallback(
      (state: GameState): void => {
        setGameState(state);

        if (state.gameOver) {
          setScreen("result");
        }
      },
      [],
    );

  /*
   * =========================
   * REGISTRA PARTIDA
   * =========================
   */

  useEffect(() => {
    if (
      !gameState.gameOver ||
      matchRegisteredRef.current
    ) {
      return;
    }

    matchRegisteredRef.current = true;

    const match = {
      score: gameState.score,

      duration: Math.floor(
        gameState.time,
      ),

      result:
        gameState.time >=
        settings.duration
          ? ("victory" as const)
          : ("defeat" as const),
    };

    /*
     * Salva no histórico
     */

    createMatchMutation.mutate(
      match,
    );

    /*
     * Salva no ranking
     */

    createRankingMutation.mutate({
      player: "Captain Jack",

      score: gameState.score,

      duration: Math.floor(
        gameState.time,
      ),
    });
  }, [
    gameState.gameOver,
  ]);

  /*
   * =========================
   * INICIAR JOGO
   * =========================
   */

  function startGame(): void {
    matchRegisteredRef.current =
      false;

    setGameState({
      health: 100,
      score: 0,
      time: 0,
      gameOver: false,
    });

    setGameKey(
      (value) => value + 1,
    );

    setScreen("game");
  }

  /*
   * =========================
   * VOLTAR AO MENU
   * =========================
   */

  function goToMenu(): void {
    setScreen("menu");
  }

  /*
   * =========================
   * OPÇÕES
   * =========================
   */

  function handleDurationChange(
    value: number,
  ): void {
    const newSettings = {
      ...settings,
      duration: value,
    };

    setSettings(newSettings);

    saveGameSettings(
      newSettings,
    );
  }

  function handleSpawnIntervalChange(
    value: number,
  ): void {
    const newSettings = {
      ...settings,
      spawnInterval: value,
    };

    setSettings(newSettings);

    saveGameSettings(
      newSettings,
    );
  }

  /*
   * =========================
   * MENU
   * =========================
   */

  if (screen === "menu") {
    return (
      <main className="screen">
        <div className="menu">
          <h1>
            🏴‍☠️ Pirate Battle
          </h1>

          <p>
            Controle seu navio,
            destrua os inimigos e
            sobreviva até o fim da
            batalha.
          </p>

          <button
            onClick={startGame}
          >
            Jogar
          </button>

          <button
            onClick={() =>
              setScreen("ranking")
            }
          >
            Ranking
          </button>

          <button
            onClick={() =>
              setScreen("history")
            }
          >
            Histórico
          </button>

          <button
            onClick={() =>
              setScreen("options")
            }
          >
            Opções
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * RANKING
   * =========================
   */

  if (screen === "ranking") {
    return (
      <main className="screen">
        <div className="menu">
          <Ranking />

          <button
            onClick={goToMenu}
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * HISTÓRICO
   * =========================
   */

  if (screen === "history") {
    return (
      <main className="screen">
        <div className="menu">
          <History />

          <button
            onClick={goToMenu}
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * OPÇÕES
   * =========================
   */

  if (screen === "options") {
    return (
      <main className="screen">
        <div className="menu">
          <h2>
            ⚙️ Opções
          </h2>

          <p>
            Duração da partida
          </p>

          <select
            value={settings.duration}
            onChange={(event) =>
              handleDurationChange(
                Number(
                  event.target.value,
                ),
              )
            }
          >
            <option value={60}>
              60 segundos
            </option>

            <option value={90}>
              90 segundos
            </option>

            <option value={120}>
              120 segundos
            </option>

            <option value={180}>
              180 segundos
            </option>
          </select>

          <p>
            Intervalo de spawn
          </p>

          <select
            value={
              settings.spawnInterval
            }
            onChange={(event) =>
              handleSpawnIntervalChange(
                Number(
                  event.target.value,
                ),
              )
            }
          >
            <option value={1000}>
              1 segundo
            </option>

            <option value={1500}>
              1,5 segundos
            </option>

            <option value={2000}>
              2 segundos
            </option>

            <option value={3000}>
              3 segundos
            </option>
          </select>

          <button
            onClick={goToMenu}
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * RESULTADO
   * =========================
   */

  if (screen === "result") {
    return (
      <main className="screen">
        <div className="menu">
          <h1>
            ☠️ Game Over
          </h1>

          <p>
            Pontuação:{" "}
            <strong>
              {gameState.score}
            </strong>
          </p>

          <p>
            Tempo:{" "}
            <strong>
              {Math.floor(
                gameState.time,
              )}
              s
            </strong>
          </p>

          <button
            onClick={startGame}
          >
            Jogar novamente
          </button>

          <button
            onClick={goToMenu}
          >
            Menu principal
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * JOGO
   * =========================
   */

  return (
    <main>
      <div className="hud">
        <span>
          ❤️ {gameState.health}
        </span>

        <span>
          ⭐ {gameState.score}
        </span>

        <span>
          ⏱️{" "}
          {Math.floor(
            gameState.time,
          )}
          s
        </span>
      </div>

      <GameCanvas
        key={gameKey}
        onStateChange={
          handleGameState
        }
      />
    </main>
  );
}

export default App;