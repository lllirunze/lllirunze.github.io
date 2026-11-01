---
name: blog-writing
description: Write, revise, or review Markdown blog posts for this Astro repository, following its content schema, house style, links, images, directives, and validation workflow. Use for work under src/content/posts; do not use for general project documentation or application code.
---

# Blog Writing

Create publication-ready posts that fit this repository rather than generic
Markdown articles.

Before writing, read [references/writing-guide.md](references/writing-guide.md).
Inspect two or three recent posts on the same topic to reuse established tags,
category names, terminology, image locations, and links to related articles.
For every new or revised Frontmatter block, enforce a single-word category with
an uppercase first letter. Tags must be lowercase and preferably one word; a tag
may contain at most two words joined with a hyphen.

## Workflow

1. Infer the topic, audience, purpose, and expected depth from the request. Ask
   only when missing information would materially change the article.
2. Check existing posts before choosing a slug or repeating material. Use a
   lowercase kebab-case filename under `src/content/posts/`.
3. Research facts when the subject depends on current or exact information.
   Prefer primary sources and preserve useful source links. Never invent commands,
   behavior, benchmarks, citations, dates, or product capabilities.
4. Draft the complete article with valid Frontmatter, a useful opening paragraph,
   descriptive sections, examples, and references where appropriate.
5. Add diagrams or images only when they improve understanding. Reuse relevant
   repository assets before introducing new ones.
6. Review title hierarchy, code fences, link targets, image paths and alt text,
   Mermaid syntax, factual consistency, and overlap with other posts.
7. Run `pnpm type-check` and `pnpm build` after meaningful post changes. If the
   build cannot refresh GitHub Trending because the network is unavailable,
   report that separately from content errors.

Do not publish, commit, push, or change unrelated code unless the user requests
it. Preserve the author's intended viewpoint and voice while improving clarity,
structure, and technical accuracy.

