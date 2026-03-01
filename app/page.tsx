import { PostList } from "@/components/post-list";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/posts";
import Link from "next/link";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  const categories = getAllCategories(posts);

  return (
    <section className="grid">
      <article className="card">
        <h1>뜬눈으로 꾸는 꿈</h1>
        <p className="meta">기술과 생각을 기록하는 미니멀 개인 블로그</p>
      </article>

      <article className="card">
        <h2>카테고리</h2>
        <div className="chip-row">
          {categories.map((category) => (
            <Link className="chip" href={`/categories/${category}`} key={category}>
              {category}
            </Link>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>태그</h2>
        <div className="chip-row">
          {tags.map((tag) => (
            <Link className="chip" href={`/tags/${tag}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
      </article>

      <PostList posts={posts} />
    </section>
  );
}
