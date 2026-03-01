import type { Metadata } from "next";
import { PostList } from "@/components/post-list";
import { getAllPosts } from "@/lib/posts";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `${tag} 태그 글 모음`
  };
}

export async function generateStaticParams() {
  const tags = [...new Set(getAllPosts().flatMap((post) => post.tags))];
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getAllPosts().filter((post) => post.tags.includes(tag));

  return (
    <section className="grid">
      <article className="card">
        <h1>#{tag}</h1>
        <p className="meta">{posts.length}개의 글</p>
      </article>
      <PostList posts={posts} />
    </section>
  );
}
