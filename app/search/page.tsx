import type { Metadata } from "next";
import { SearchClient } from "@/components/search-client";
import { getAllPosts, plainText } from "@/lib/posts";

export const metadata: Metadata = {
  title: "검색",
  description: "블로그 게시글 검색"
};

export default function SearchPage() {
  const items = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    category: post.category,
    body: plainText(post.content)
  }));

  return (
    <section className="grid">
      <article className="card">
        <h1>검색</h1>
        <p className="meta">제목, 설명, 태그, 본문으로 검색할 수 있습니다.</p>
      </article>
      <SearchClient items={items} />
    </section>
  );
}
