import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="grid">
      {posts.map((post) => (
        <article className="card" key={post.slug}>
          <div className="meta">{formatDate(post.date)}</div>
          <h2>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <p>{post.description}</p>
          <div className="chip-row">
            <Link className="chip" href={`/categories/${post.category}`}>
              {post.category}
            </Link>
            {post.tags.map((tag) => (
              <Link className="chip" href={`/tags/${tag}`} key={tag}>
                #{tag}
              </Link>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
