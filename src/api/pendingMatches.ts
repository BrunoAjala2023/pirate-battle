import type { CreateMatchInput } from "./historyApi";

const STORAGE_KEY =
  "pirate-battle-pending-matches";

export function getPendingMatches(): CreateMatchInput[] {
  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as CreateMatchInput[];
  } catch {
    return [];
  }
}

export function savePendingMatch(
  match: CreateMatchInput,
): void {
  const pending = getPendingMatches();

  pending.push(match);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(pending),
  );
}

export function removePendingMatch(
  match: CreateMatchInput,
): void {
  const pending = getPendingMatches();

  const index = pending.findIndex(
    (item) =>
      item.score === match.score &&
      item.duration === match.duration &&
      item.result === match.result,
  );

  if (index === -1) {
    return;
  }

  pending.splice(index, 1);

  if (pending.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(pending),
  );
}