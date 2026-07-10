"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BIBLE_STORIES, storiesByTestament } from "@/lib/stories/stories";

type Filter = "all" | "OT" | "NT";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "OT", label: "Old Testament" },
  { id: "NT", label: "New Testament" },
];

export default function StoriesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const stories = useMemo(() => storiesByTestament(filter), [filter]);

  return (
    <div className="page space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Narratives
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
          Bible Stories
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Short retellings that lead you into the real passages.
        </p>
      </header>

      <div
        className="flex gap-1 rounded-full border border-line bg-paper-elevated p-1"
        role="tablist"
        aria-label="Story filter"
      >
        {FILTERS.map(({ id, label }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(id)}
              className={`flex-1 rounded-full px-2 py-2 text-center text-xs font-semibold transition sm:text-sm ${
                active
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink-soft">
        {stories.length} {stories.length === 1 ? "story" : "stories"}
      </p>

      <ul className="space-y-3">
        {stories.map((story) => (
          <li key={story.id}>
            <Link
              href={`/stories/${story.id}`}
              className="block rounded-2xl border border-line bg-paper-elevated px-4 py-4 transition hover:border-accent/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                    {story.theme}
                  </p>
                  <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
                    {story.title}
                  </h2>
                </div>
                <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
                  {story.testament}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-2">
                {story.summary}
              </p>
              <p className="mt-3 text-sm font-medium text-accent">
                Read story →
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {stories.length === 0 && (
        <p className="text-sm text-ink-soft">No stories in this filter.</p>
      )}

      <p className="text-xs text-ink-soft">
        {BIBLE_STORIES.length} stories total · more can be added anytime
      </p>
    </div>
  );
}
