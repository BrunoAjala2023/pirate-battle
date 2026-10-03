import { http, HttpResponse } from "msw";

const MOCK_HISTORY_ERROR = false;

interface MockMatch {
  id: string;
  score: number;
  duration: number;
  result: "victory" | "defeat";
  createdAt: string;
}

const matches: MockMatch[] = [
  {
    id: "match-1",
    score: 1500,
    duration: 120,
    result: "victory",
    createdAt: "2026-10-02T20:00:00Z",
  },
  {
    id: "match-2",
    score: 850,
    duration: 78,
    result: "defeat",
    createdAt: "2026-10-02T21:30:00Z",
  },
  {
    id: "match-3",
    score: 1100,
    duration: 120,
    result: "victory",
    createdAt: "2026-10-02T23:00:00Z",
  },
];

interface MockRankingEntry {
  id: string;
  player: string;
  score: number;
  duration: number;
  createdAt: string;
}

const ranking: MockRankingEntry[] = [
  {
    id: "1",
    player: "Captain Jack",
    score: 1500,
    duration: 120,
    createdAt: "2026-10-01T12:00:00Z",
  },
  {
    id: "2",
    player: "Black Pearl",
    score: 1200,
    duration: 120,
    createdAt: "2026-10-01T13:00:00Z",
  },
  {
    id: "3",
    player: "Sea Wolf",
    score: 950,
    duration: 90,
    createdAt: "2026-10-01T14:00:00Z",
  },
];

export const handlers = [
  // =========================
  // RANKING
  // =========================

  http.get("/api/ranking", () => {
  const sortedRanking = [...ranking].sort(
    (a, b) => b.score - a.score,
  );

  return HttpResponse.json({
    data: sortedRanking,
    total: sortedRanking.length,
  });
}),
  
http.post("/api/ranking", async ({ request }) => {
  const body = (await request.json()) as {
    player: string;
    score: number;
    duration: number;
  };

  const newEntry: MockRankingEntry = {
    id: crypto.randomUUID(),
    player: body.player,
    score: body.score,
    duration: body.duration,
    createdAt: new Date().toISOString(),
  };

  ranking.push(newEntry);

  console.log(
    "Pontuação registrada:",
    newEntry,
  );

  return HttpResponse.json(
    newEntry,
    {
      status: 201,
    },
  );
}),

  // =========================
  // HISTÓRICO - GET
  // =========================

  http.get("/api/history", () => {
    return HttpResponse.json({
      data: matches,
      total: matches.length,
    });
  }),

  // =========================
  // HISTÓRICO - POST
  // =========================

  http.post("/api/history", async ({ request }) => {

    if (MOCK_HISTORY_ERROR) {
      return HttpResponse.json(
        {
            message: "Erro simulado no servidor",
        },
        {
          status: 500,
        }
      );
    }

    const body = (await request.json()) as {
      score: number;
      duration: number;
      result: "victory" | "defeat";
    };

    const newMatch: MockMatch = {
      id: crypto.randomUUID(),
      score: body.score,
      duration: body.duration,
      result: body.result,
      createdAt: new Date().toISOString(),
    };

    matches.unshift(newMatch);

    console.log(
      "Partida registrada:",
      newMatch,
    );

    return HttpResponse.json(
      newMatch,
      {
        status: 201,
      },
    );
  }),
];