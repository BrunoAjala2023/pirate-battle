import { api } from "./api";

export interface MatchHistoryEntry {
  id: string;
  score: number;
  duration: number;
  result: "victory" | "defeat";
  createdAt: string;
}

interface HistoryResponse {
  data: MatchHistoryEntry[];
  total: number;
}

export async function getMatchHistory(): Promise<HistoryResponse> {
  const response =
    await api.get<HistoryResponse>("/history");

  return response.data;
}

export interface CreateMatchInput {
  score: number;
  duration: number;
  result: "victory" | "defeat";
}

export async function createMatch(
  match: CreateMatchInput
): Promise<MatchHistoryEntry> {
  const response =
    await api.post<MatchHistoryEntry>(
      "/history",
      match
    );

  return response.data;
}