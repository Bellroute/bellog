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

const categoryLabels: Record<string, string> = {
  thoughts: "생각",
  thought: "생각",
  book: "독서",
  books: "독서",
  reading: "독서",
  diary: "일상",
  life: "일상",
  daily: "일상",
  notes: "기록",
  record: "기록",
  log: "기록",
  dev: "테크",
  tech: "테크",
  engineering: "테크"
};

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return "1970-01-01";
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
      date: normalizeDate(data.date),
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
    date: normalizeDate(data.date),
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

export function displayCategory(category: string) {
  return categoryLabels[category.toLowerCase()] ?? category;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function formatCompactDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}.`;
}

export function plainText(content: string) {
  return content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`\-\[\]()]/g, " ").replace(/\s+/g, " ").trim();
}
