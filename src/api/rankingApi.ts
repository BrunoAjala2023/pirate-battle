import { api } from "./api";

export interface RankingEntry {
  id: string;
  player: string;
  score: number;
  duration: number;
  createdAt: string;
}

interface RankingResponse {
  data: RankingEntry[];
  total: number;
}

export async function getRanking(): Promise<RankingResponse> {
  const response =
    await api.get<RankingResponse>("/ranking");

  return response.data;
}

export interface CreateRankingInput {
  player: string;
  score: number;
  duration: number;
}

export async function createRankingEntry(
  entry: CreateRankingInput,
): Promise<RankingEntry> {
  const response =
    await api.post<RankingEntry>(
      "/ranking",
      entry,
    );

  return response.data;
}