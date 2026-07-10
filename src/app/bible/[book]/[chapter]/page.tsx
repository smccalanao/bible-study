import { notFound } from "next/navigation";
import { BibleReader } from "@/components/BibleReader";
import { getBook } from "@/lib/bible/books";

type Props = {
  params: Promise<{ book: string; chapter: string }>;
};

export default async function BibleChapterPage({ params }: Props) {
  const { book, chapter: chapterStr } = await params;
  const meta = getBook(book);
  const chapter = Number(chapterStr);

  if (!meta || !Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapters) {
    notFound();
  }

  return <BibleReader bookAbbrev={meta.abbrev} chapter={chapter} />;
}
