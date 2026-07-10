import { notFound } from "next/navigation";
import { BibleReader } from "@/components/BibleReader";
import { BOOKS, getBook } from "@/lib/bible/books";

type Props = {
  params: Promise<{ book: string; chapter: string }>;
};

export function generateStaticParams() {
  return BOOKS.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, i) => ({
      book: book.abbrev,
      chapter: String(i + 1),
    })),
  );
}

export default async function BibleChapterPage({ params }: Props) {
  const { book, chapter: chapterStr } = await params;
  const meta = getBook(book);
  const chapter = Number(chapterStr);

  if (!meta || !Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapters) {
    notFound();
  }

  return <BibleReader bookAbbrev={meta.abbrev} chapter={chapter} />;
}
