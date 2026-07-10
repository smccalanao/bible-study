/**
 * Writes a PWA manifest with absolute paths for GitHub Pages,
 * or relative paths for local / root hosting.
 */
const fs = require("fs");
const path = require("path");

const isGh = process.env.GITHUB_PAGES === "true";
const base = isGh ? "/bible-study" : "";

const manifest = {
  name: "Bible Study",
  short_name: "Bible Study",
  description: "Read Scripture offline with highlights, notes, and stories.",
  start_url: `${base}/`,
  scope: `${base}/`,
  id: `${base}/`,
  display: "standalone",
  display_override: ["standalone", "window-controls-overlay", "browser"],
  background_color: "#eef2f6",
  theme_color: "#1f6f6a",
  orientation: "any",
  lang: "en",
  dir: "ltr",
  prefer_related_applications: false,
  categories: ["books", "education", "lifestyle"],
  icons: [
    {
      src: `${base}/icons/icon-192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${base}/icons/icon-512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${base}/icons/icon-192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: `${base}/icons/icon-512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const out = path.join(__dirname, "..", "public", "manifest.webmanifest");
fs.writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Wrote", out, "base=", base || "(root)");
