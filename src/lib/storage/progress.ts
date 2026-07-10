export type ProgressState = {
  /** ISO date strings YYYY-MM-DD that count as reading days */
  readDays: string[];
  /** Unique chapter keys: "gn:1" */
  chaptersRead: string[];
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
};

const KEY = "bs:progress";

const EMPTY: ProgressState = {
  readDays: [],
  chaptersRead: [],
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
};

function readJson(): ProgressState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as ProgressState) };
  } catch {
    return { ...EMPTY };
  }
}

function writeJson(state: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

/** Local calendar date YYYY-MM-DD */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return todayKey(dt);
}

export function computeStreak(readDays: string[], today = todayKey()): number {
  const set = new Set(readDays);
  // Streak can include today or yesterday (still "alive" until day ends)
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  if (!set.has(cursor)) return 0;

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export function getProgress(): ProgressState {
  const state = readJson();
  const currentStreak = computeStreak(state.readDays);
  return {
    ...state,
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
  };
}

export function chapterKey(bookAbbrev: string, chapter: number): string {
  return `${bookAbbrev}:${chapter}`;
}

/**
 * Call when the user opens/reads a chapter.
 * Counts once per calendar day for streak; chapters are unique forever.
 */
export function recordChapterRead(
  bookAbbrev: string,
  chapter: number,
): ProgressState {
  const state = readJson();
  const today = todayKey();
  const key = chapterKey(bookAbbrev, chapter);

  const readDays = state.readDays.includes(today)
    ? state.readDays
    : [...state.readDays, today].sort();

  const chaptersRead = state.chaptersRead.includes(key)
    ? state.chaptersRead
    : [...state.chaptersRead, key];

  const currentStreak = computeStreak(readDays, today);
  const longestStreak = Math.max(state.longestStreak, currentStreak);

  const next: ProgressState = {
    readDays,
    chaptersRead,
    currentStreak,
    longestStreak,
    lastReadDate: today,
  };
  writeJson(next);
  return next;
}

/** Last 7 days ending today — true if read that day */
export function getWeekActivity(today = todayKey()): boolean[] {
  const { readDays } = getProgress();
  const set = new Set(readDays);
  return Array.from({ length: 7 }, (_, i) => {
    const day = shiftDay(today, i - 6);
    return set.has(day);
  });
}

export function getPlanProgress(planId: string, totalDays: number): {
  completed: number;
  percent: number;
} {
  if (typeof window === "undefined") {
    return { completed: 0, percent: 0 };
  }
  const raw = localStorage.getItem(`bs:plan:${planId}`);
  const done = raw ? (JSON.parse(raw) as number[]) : [];
  const completed = done.length;
  return {
    completed,
    percent: totalDays ? Math.round((completed / totalDays) * 100) : 0,
  };
}

export function togglePlanDay(planId: string, day: number): number[] {
  if (typeof window === "undefined") return [];
  const key = `bs:plan:${planId}`;
  const raw = localStorage.getItem(key);
  const done: number[] = raw ? (JSON.parse(raw) as number[]) : [];
  const idx = done.indexOf(day);
  if (idx >= 0) done.splice(idx, 1);
  else done.push(day);
  done.sort((a, b) => a - b);
  localStorage.setItem(key, JSON.stringify(done));
  return done;
}

export function getPlanDaysDone(planId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`bs:plan:${planId}`);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}
