import { formatCompactDate, getAllPosts } from "@/lib/posts";
import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const { category, page } = await searchParams;
  const posts = getAllPosts();
  const pageSize = 10;
  const categories = ["생각", "독서", "일상", "기록", "테크"] as const;
  const categoryMap: Record<string, string> = {
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

  const getDisplayCategory = (raw: string) => categoryMap[raw.toLowerCase()] ?? raw;
  const activeCategory = category && categories.includes(category as (typeof categories)[number]) ? category : "all";
  const filteredPosts =
    activeCategory === "all" ? posts : posts.filter((post) => getDisplayCategory(post.category) === activeCategory);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const parsedPage = Number.parseInt(page ?? "1", 10);
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.min(Math.max(parsedPage, 1), totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagePosts = filteredPosts.slice(pageStart, pageStart + pageSize);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  const pagesToRender = (() => {
    const set = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    return [...set].filter((num) => num >= 1 && num <= totalPages).sort((a, b) => a - b);
  })();

  return (
    <section className="home-shell">
      <div className="filter-row">
        <Link className={`filter-pill ${activeCategory === "all" ? "active" : ""}`} href="/">
          전체
        </Link>
        {categories.map((item) => (
          <Link
            className={`filter-pill ${activeCategory === item ? "active" : ""}`}
            href={`/?category=${item}`}
            key={item}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="post-table">
        {pagePosts.map((post) => (
          <Link className="post-row" href={`/posts/${post.slug}`} key={post.slug}>
            <span className="post-category">
              {getDisplayCategory(post.category)}
            </span>
            <h2 className="post-title">{post.title}</h2>
            <time className="post-date" dateTime={post.date}>
              {formatCompactDate(post.date)}
            </time>
          </Link>
        ))}
      </div>

      <nav aria-label="페이지 이동" className="pager">
        {currentPage > 1 ? (
          <Link className="pager-link" href={buildHref(currentPage - 1)}>
            이전
          </Link>
        ) : (
          <span className="pager-muted">이전</span>
        )}

        {pagesToRender.map((pageNum, index) => {
          const prev = pagesToRender[index - 1];
          const hasGap = prev && pageNum - prev > 1;

          return (
            <span className="pager-item" key={pageNum}>
              {hasGap ? <span className="pager-num">...</span> : null}
              {pageNum === currentPage ? (
                <span className="pager-current">{pageNum}</span>
              ) : (
                <Link className="pager-link pager-num" href={buildHref(pageNum)}>
                  {pageNum}
                </Link>
              )}
            </span>
          );
        })}

        {currentPage < totalPages ? (
          <Link className="pager-link" href={buildHref(currentPage + 1)}>
            다음
          </Link>
        ) : (
          <span className="pager-muted">다음</span>
        )}
      </nav>

      <div className="home-divider" />
      <div className="home-credit">@kyorlv</div>
    </section>
  );
}
