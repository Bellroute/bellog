"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SearchItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  body: string;
};

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.tags.join(" ")} ${item.category} ${item.body}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  return (
    <section className="grid">
      <input
        aria-label="게시글 검색"
        className="search-input"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목, 태그, 본문으로 검색"
        type="search"
        value={query}
      />
      <div className="meta">{filtered.length}개의 결과</div>
      {filtered.map((item) => (
        <article className="card" key={item.slug}>
          <h3>
            <Link href={`/posts/${item.slug}`}>{item.title}</Link>
          </h3>
          <p>{item.description}</p>
          <div className="chip-row">
            <span className="category-badge">{item.category}</span>
            {item.tags.map((tag) => (
              <span className="tag-pill" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
