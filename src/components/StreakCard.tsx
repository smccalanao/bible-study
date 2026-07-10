"use client";

import { useEffect, useState } from "react";
import {
  getProgress,
  getWeekActivity,
  type ProgressState,
} from "@/lib/storage/progress";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function weekLabels(today = new Date()): string[] {
  // Align labels to the last 7 calendar days ending today
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // getDay: 0 Sun .. 6 Sat → map to M T W T F S S
    const map = ["S", "M", "T", "W", "T", "F", "S"];
    labels.push(map[d.getDay()]);
  }
  return labels;
}

export function StreakCard() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [week, setWeek] = useState<boolean[]>([]);
  const [labels, setLabels] = useState<string[]>(DAY_LABELS);

  useEffect(() => {
    setProgress(getProgress());
    setWeek(getWeekActivity());
    setLabels(weekLabels());
  }, []);

  if (!progress) return null;

  const alive = progress.currentStreak > 0;

  return (
    <section className="rounded-2xl border border-line bg-paper-elevated px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Streak
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
            {progress.currentStreak}
            <span className="ml-1.5 text-base font-sans font-medium text-ink-soft">
              {progress.currentStreak === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            {alive
              ? `Best ${progress.longestStreak} · keep it going`
              : progress.longestStreak > 0
                ? `Best ${progress.longestStreak} · read today to start again`
                : "Open a chapter today to begin"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl font-semibold text-accent">
            {progress.chaptersRead.length}
          </p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
            chapters
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-1">
        {week.map((active, i) => (
          <div key={`${labels[i]}-${i}`} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                active ? "bg-accent" : "bg-line"
              }`}
              aria-label={active ? "Read" : "Missed"}
            />
            <span className="text-[0.65rem] font-medium text-ink-soft">
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
