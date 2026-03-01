import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  draft?: boolean;
};

export type PostData = PostMeta & {
  content: string;
};

function listPostFiles() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));
}

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function getAllPosts(): PostData[] {
  const files = listPostFiles();

  const posts = files.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(source);

    const slug = fileName.replace(/\.mdx$/, "");

    return {
      title: data.title ?? slug,
      slug,
      date: data.date ?? "1970-01-01",
      description: data.description ?? "",
      tags: Array.isArray(data.tags) ? data.tags.map(String).map(normalizeTag) : [],
      category: String(data.category ?? "general").toLowerCase(),
      draft: Boolean(data.draft),
      content
    } satisfies PostData;
  });

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  return {
    title: data.title ?? slug,
    slug,
    date: data.date ?? "1970-01-01",
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags.map(String).map(normalizeTag) : [],
    category: String(data.category ?? "general").toLowerCase(),
    draft: Boolean(data.draft),
    content
  };
}

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                ariaHidden: "true"
              }
            }
          ]
        ]
      }
    }
  });

  return content;
}

export function getAllTags(posts = getAllPosts()) {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

export function getAllCategories(posts = getAllPosts()) {
  return [...new Set(posts.map((post) => post.category))].sort();
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function plainText(content: string) {
  return content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`\-\[\]()]/g, " ").replace(/\s+/g, " ").trim();
}
