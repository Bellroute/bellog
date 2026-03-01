import type { Metadata } from "next";
import { PostList } from "@/components/post-list";
import { getAllPosts } from "@/lib/posts";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: category,
    description: `${category} 카테고리 글 모음`
  };
}

export async function generateStaticParams() {
  const categories = [...new Set(getAllPosts().map((post) => post.category))];
  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getAllPosts().filter((post) => post.category === category);

  return (
    <section className="grid">
      <article className="card">
        <h1>{category}</h1>
        <p className="meta">{posts.length}개의 글</p>
      </article>
      <PostList posts={posts} />
    </section>
  );
}
