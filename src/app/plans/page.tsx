"use client";

import Link from "next/link";
import { READING_PLANS } from "@/lib/plans/daily";

export default function PlansPage() {
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
          Simple reading plans to build a steady habit. Progress sync comes
          later.
        </p>
      </header>

      <ul className="space-y-3">
        {READING_PLANS.map((plan) => (
          <li
            key={plan.id}
            className="rounded-2xl border border-line bg-paper-elevated px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {plan.title}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">
                  {plan.days} days
                </p>
              </div>
            </div>
            <ol className="mt-4 space-y-1.5">
              {plan.readings.slice(0, 5).map((r) => (
                <li key={r.day}>
                  <Link
                    href={`/bible/${r.bookAbbrev}/${r.chapter}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-paper"
                  >
                    <span className="text-ink-soft">Day {r.day}</span>
                    <span className="font-medium text-ink">{r.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
            {plan.readings.length > 5 && (
              <details className="mt-2">
                <summary className="cursor-pointer px-2 text-sm font-medium text-accent">
                  Show all days
                </summary>
                <ol className="mt-1 space-y-1.5">
                  {plan.readings.slice(5).map((r) => (
                    <li key={r.day}>
                      <Link
                        href={`/bible/${r.bookAbbrev}/${r.chapter}`}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-paper"
                      >
                        <span className="text-ink-soft">Day {r.day}</span>
                        <span className="font-medium text-ink">{r.label}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
