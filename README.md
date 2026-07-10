# Bible Study

Mobile-first PWA for reading Scripture with highlights, notes, search, and daily plans.

## MVP stack

- **Next.js** (App Router) + TypeScript + Tailwind
- **Public-domain Bibles**: KJV + BBE (bundled JSON for offline use)
- **Local storage** for highlights, notes, and bookmarks
- **Web Speech API** for listen / TTS

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tabs

| Tab | Purpose |
| --- | --- |
| Home | Verse of the Day, continue reading, offline cache status |
| Bible | Chapter reader, parallel translations, highlights / notes / audio |
| Search | Keyword search + reference jump (`John 3:16`) |
| Notes | Notes, highlights, saved chapters |
| Plans | Simple reading plans |

## Later

NIV/ESV (licensed APIs), auth sync (Supabase/Firebase), native mobile, commentaries, AI study tools.
