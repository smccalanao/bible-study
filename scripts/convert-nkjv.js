const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const initSqlJs = require("sql.js");

function blobToBuffer(blob) {
  if (Buffer.isBuffer(blob)) return blob;
  if (blob instanceof Uint8Array) return Buffer.from(blob);
  return Buffer.from(Uint8Array.from(Object.values(blob)));
}

function getOffset(rec) {
  return rec[1] | (rec[2] << 8) | (rec[3] << 16);
}

function fallbackLen(rec) {
  if (rec[0] === 255) return rec[0] + (rec[3] << 8);
  return rec[0];
}

async function convert() {
  const dbPath = path.join(__dirname, "..", "tmp-nkjv.sqlite");
  const wasmPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "sql.js",
    "dist",
    "sql-wasm.wasm",
  );
  const SQL = await initSqlJs({ locateFile: () => wasmPath });
  const db = new SQL.Database(fs.readFileSync(dbPath));

  const APP_ABBREVS = [
    "gn","ex","lv","nm","dt","js","jud","rt","1sm","2sm","1kgs","2kgs","1ch","2ch",
    "ezr","ne","et","job","ps","prv","ec","so","is","jr","lm","ez","dn","ho","jl",
    "am","ob","jn","mi","na","hk","zp","hg","zc","ml","mt","mk","lk","jo","act",
    "rm","1co","2co","gl","eph","ph","cl","1ts","2ts","1tm","2tm","tt","phm","hb",
    "jm","1pe","2pe","1jo","2jo","3jo","jd","re",
  ];

  const books = db.exec(
    "SELECT rowid, name, book_info, verse_info FROM books ORDER BY rowid",
  )[0].values;

  const out = [];
  const report = [];

  for (let bi = 0; bi < books.length; bi++) {
    const [rowid, name, bookInfoBlob, verseInfoBlob] = books[bi];
    const bookInfo = blobToBuffer(bookInfoBlob);
    const verseInfo = blobToBuffer(verseInfoBlob);
    const chapterCount = bookInfo[0];
    const verseCounts = [...bookInfo.slice(1, 1 + chapterCount)];
    const totalVerses = verseCounts.reduce((a, b) => a + b, 0);

    const stream = zlib.inflateSync(
      blobToBuffer(
        db.exec(`SELECT stream FROM streams WHERE rowid=${rowid}`)[0].values[0][0],
      ),
    );

    const headerSkip = stream[0] === 0x01 ? 2 : 0;
    const text = stream.slice(headerSkip).toString("utf8");

    const records = [];
    for (let v = 0; v < totalVerses; v++) {
      const rec = verseInfo.slice(v * 8, v * 8 + 8);
      const raw = getOffset(rec);
      records.push({
        rec,
        off: raw % 4 === 0 ? raw / 4 : null,
        fallback: fallbackLen(rec),
      });
    }

    const lengths = new Array(totalVerses);
    let pos = 0;
    let fallbackUsed = 0;

    for (let v = 0; v < totalVerses; v++) {
      if (v === totalVerses - 1) {
        lengths[v] = Math.max(0, text.length - pos);
        pos = text.length;
        break;
      }

      const nextOff = records[v + 1].off;
      if (nextOff != null && nextOff >= pos) {
        lengths[v] = nextOff - pos;
        pos = nextOff;
      } else {
        // Resync using fallback lengths until a valid offset appears
        lengths[v] = records[v].fallback;
        pos += lengths[v];
        fallbackUsed++;
      }
    }

    // If we overshot, clamp
    let offset = 0;
    const chapters = [];
    let verseIndex = 0;
    let empty = 0;

    for (let c = 0; c < chapterCount; c++) {
      const verses = [];
      for (let v = 0; v < verseCounts[c]; v++) {
        const len = lengths[verseIndex] ?? 0;
        if (offset >= text.length) {
          verses.push("");
          empty++;
        } else {
          const end = Math.min(text.length, offset + len);
          verses.push(text.slice(offset, end).trim());
          offset = end;
        }
        verseIndex++;
      }
      chapters.push(verses);
    }

    report.push({
      name,
      fallbackUsed,
      empty,
      remaining: text.length - offset,
      sample: chapters[0]?.[0]?.slice(0, 70),
      v316: name === "John" ? chapters[2]?.[15] : undefined,
      gen22:
        name === "Genesis"
          ? chapters[21]?.[0]?.slice(0, 80)
          : undefined,
    });
    out.push({ abbrev: APP_ABBREVS[bi], chapters });
  }

  const problems = report.filter((r) => r.empty > 0 || r.remaining > 0);
  console.log("problems", problems.length);
  console.log(problems.slice(0, 10));
  console.log("Genesis", report[0]);
  console.log("John", report.find((r) => r.name === "John"));

  const outPath = path.join(__dirname, "..", "public", "data", "bibles", "nkjv.json");
  fs.writeFileSync(outPath, JSON.stringify(out));
  console.log("wrote", outPath, fs.statSync(outPath).size);

  // quick integrity: every book has expected chapter counts
  let okCh = 0;
  for (let i = 0; i < out.length; i++) {
    const expected = blobToBuffer(books[i][2])[0];
    // book_info is books[i][2] - wait structure is rowid,name,book_info,verse_info
    const bi2 = blobToBuffer(books[i][2]);
    if (out[i].chapters.length === bi2[0]) okCh++;
  }
  console.log("chapter count match", okCh, "/", out.length);
}

convert().catch((e) => {
  console.error(e);
  process.exit(1);
});
