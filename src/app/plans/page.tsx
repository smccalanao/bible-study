"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { READING_PLANS, type ReadingPlan } from "@/lib/plans/daily";
import {
  getPlanDaysDone,
  recordChapterRead,
  togglePlanDay,
} from "@/lib/storage/progress";

export default function PlansPage() {
  const [doneMap, setDoneMap] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const next: Record<string, number[]> = {};
    for (const plan of READING_PLANS) {
      next[plan.id] = getPlanDaysDone(plan.id);
    }
    setDoneMap(next);
  }, []);

  const onToggle = (planId: string, day: number) => {
    const updated = togglePlanDay(planId, day);
    setDoneMap((prev) => ({ ...prev, [planId]: updated }));
  };

  return (
    <div className="page space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Rhythm
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">
          Plans
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Mark days as you go. Opening a chapter also counts toward your streak.
        </p>
      </header>

      <ul className="space-y-3">
        {READING_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            done={doneMap[plan.id] ?? []}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}

function PlanCard({
  plan,
  done,
  onToggle,
}: {
  plan: ReadingPlan;
  done: number[];
  onToggle: (planId: string, day: number) => void;
}) {
  const completed = done.length;
  const percent = plan.days ? Math.round((completed / plan.days) * 100) : 0;
  const doneSet = new Set(done);

  return (
    <li className="rounded-2xl border border-line bg-paper-elevated px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">
            {plan.title}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
        </div>
        <p className="shrink-0 text-right text-xs font-semibold uppercase tracking-wide text-accent">
          {completed}/{plan.days}
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-4 space-y-1">
        {plan.readings.map((r) => {
          const isDone = doneSet.has(r.day);
          return (
            <li
              key={r.day}
              className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-paper"
            >
              <button
                type="button"
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                onClick={() => {
                  onToggle(plan.id, r.day);
                  if (!isDone) {
                    recordChapterRead(r.bookAbbrev, r.chapter);
                  }
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[0.65rem] font-bold ${
                  isDone
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-paper text-transparent"
                }`}
              >
                ✓
              </button>
              <Link
                href={`/bible/${r.bookAbbrev}/${r.chapter}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-2 text-sm"
              >
                <span className="text-ink-soft">Day {r.day}</span>
                <span
                  className={`font-medium ${isDone ? "text-ink-soft line-through" : "text-ink"}`}
                >
                  {r.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </li>
  );
}
