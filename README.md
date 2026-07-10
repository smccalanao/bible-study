# Bible Study

Mobile-first Bible reader with highlights, notes, search, stories, and offline support.

## Translations

| ID | Name | Notes |
| --- | --- | --- |
| `nkjv` | New King James Version | From your EasyWorship license (personal use) |
| `kjv` | King James Version | Public domain |
| `bbe` | Bible in Basic English | Public domain |

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For full offline / installable PWA:

```bash
npm run build
npm start
```

Then open the site once online (so the service worker can cache Bibles), and you can use it offline afterward. On phone Chrome/Edge: **Add to Home Screen**.

## Features

- Bible TOC with Old / New Testament filter (Genesis → Revelation)
- Verse reader, parallel mode, Listen (TTS)
- Search by keyword or reference (`John 3:16`)
- Highlights, notes, bookmarks (local)
- Verse of the Day + Bible stories
- Reading streak / progress

## NKJV source

Converted from your EasyWorship `paid-nkjv.ewb` via `scripts/convert-nkjv.js`.
NKJV text © Thomas Nelson — keep the repo private and use only with your license.
