import { notFound } from "next/navigation";
import { StoryDetail } from "@/components/StoryDetail";
import { BIBLE_STORIES, getStory } from "@/lib/stories/stories";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return BIBLE_STORIES.map((story) => ({ id: story.id }));
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = getStory(id);
  if (!story) notFound();
  return <StoryDetail story={story} />;
}
