export type ScoreEntry = {
  id: string;
  name: string;
  game: string;
  score: number;
  maxScore?: number;
  details?: string;
  date: string;
};

const STORAGE_KEY = "cyrus-birthday-game-scores";

export function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry) {
  if (typeof window === "undefined") return;
  const existing = loadScores();
  const next = [entry, ...existing].slice(0, 100);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function createScoreEntry(
  name: string,
  game: string,
  score: number,
  maxScore?: number,
  details?: string,
): ScoreEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || "Guest",
    game,
    score,
    maxScore,
    details,
    date: new Date().toISOString(),
  };
}
