import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getAllPosts, getPostBySlug, renderMDX } from "@/lib/posts";
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
    <article className="card prose">
      <div className="meta">{formatDate(post.date)}</div>
      <h1>{post.title}</h1>
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
      {mdx}
    </article>
  );
}
