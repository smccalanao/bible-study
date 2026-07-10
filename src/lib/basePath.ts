/** Base path for GitHub Pages project site (`/bible-study`). Empty in local/Vercel root deploys. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return `${BASE_PATH}/${path}`;
  return `${BASE_PATH}${path}`;
}
