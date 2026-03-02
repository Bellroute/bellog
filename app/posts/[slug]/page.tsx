import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { displayCategory, formatDate, getAllPosts, getPostBySlug, renderMDX } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "글을 찾을 수 없음" };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/posts/${post.slug}`
    }
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const mdx = await renderMDX(post.content);

  return (
    <article className="post-detail">
      <div className="post-detail-top">
        <Link className="back-link" href="/">
          ← 목록으로
        </Link>
        <div className="post-detail-meta">
          <time className="meta" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          <span className="post-meta-sep">/</span>
          <span className="post-detail-category">{displayCategory(post.category)}</span>
        </div>
      </div>

      <header className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        {post.description ? <p className="post-detail-description">{post.description}</p> : null}
        <div className="chip-row">
          {post.tags.map((tag) => (
            <Link className="tag-pill" href={`/tags/${tag}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <section className="prose post-prose">{mdx}</section>
    </article>
  );
}
