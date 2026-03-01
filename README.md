# bellog

Next.js(App Router) + TypeScript + MDX 기반 개인 블로그입니다.

## 기능

- MDX 글 작성 (`content/posts/*.mdx`)
- 태그/카테고리 페이지 자동 생성
- 클라이언트 검색(제목/설명/태그/본문)
- 다크모드(`next-themes`)
- 기본 SEO 메타데이터
- Vercel Analytics 연동

## 로컬 실행

```bash
npm install
npm run dev
```

## 새 글 작성

`content/posts/your-slug.mdx` 파일을 만들고 frontmatter를 작성하세요.

```mdx
---
title: 글 제목
date: 2026-03-01
description: 글 설명
tags: [tag1, tag2]
category: notes
---

본문
```

## Vercel 배포

1. GitHub 레포를 Vercel에 Import
2. Framework Preset: Next.js
3. Build Command: `next build` (기본값)
4. Output 설정은 기본값 유지
5. 배포 후 생성된 `https://<project>.vercel.app` 도메인을 `lib/site-config.ts`의 `url`에 반영

무료 플랜에서도 Vercel Analytics 사용 가능합니다.
