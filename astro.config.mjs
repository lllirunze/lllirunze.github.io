import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import swup from "@swup/astro";
import Compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";/* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";/* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import {
  rehypeMermaidShikiCompat,
  rehypeMermaidTheme,
} from "./src/plugins/rehype-mermaid-theme.mjs";

import react from "@astrojs/react";
import githubTrendingHandler from "./api/github-trending.ts";

const githubTrendingDevApi = () => ({
  name: "github-trending-dev-api",
  configureServer(server) {
    server.middlewares.use("/api/github-trending", async (request, response, next) => {
      try {
        let statusCode = 200;
        let responseBody;
        await githubTrendingHandler(request, {
          setHeader(name, value) {
            response.setHeader(name, value);
          },
          status(code) {
            statusCode = code;
            return this;
          },
          json(body) {
            responseBody = body;
          },
        });

        response.statusCode = statusCode;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(responseBody));
      } catch (error) {
        next(error);
      }
    });
  },
});

// https://astro.build/config
export default defineConfig({
  site: "https://lllirunze.cn",
  base: "/",
  trailingSlash: "always",
  integrations: [tailwind(
      {
        nesting: true,
      }
  ), swup({
    theme: false,
    animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
    // the default value `transition-` cause transition delay
    // when the Tailwind class `transition-all` is used
    containers: ["main", "#toc", "#sidebar"],
    smoothScrolling: true,
    cache: true,
    preload: true,
    accessibility: true,
    updateHead: true,
    updateBodyClass: false,
    globalInstance: true,
  }), icon({
    include: {
      "preprocess: vitePreprocess(),": ["*"],
      "fa6-brands": ["*"],
      "fa6-regular": ["*"],
      "fa6-solid": ["*"],
    },
  }), svelte(), sitemap(), Compress({
    CSS: false,
    Image: false,
    Action: {
      Passed: async () => true, // https://github.com/PlayForm/Compress/issues/376
    },
  }), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    },
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      remarkSectionize,
      parseDirectiveNode,
    ],
    rehypePlugins: [
      rehypeMermaidShikiCompat,
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          colorScheme: "light",
          dark: true,
          mermaidConfig: {
            theme: "default",
            background: "#ffffff",
          },
          errorFallback: element => element,
        },
      ],
      rehypeMermaidTheme,
      rehypeKatex,
      rehypeSlug,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            note: (x, y) => AdmonitionComponent(x, y, "note"),
            tip: (x, y) => AdmonitionComponent(x, y, "tip"),
            important: (x, y) => AdmonitionComponent(x, y, "important"),
            caution: (x, y) => AdmonitionComponent(x, y, "caution"),
            warning: (x, y) => AdmonitionComponent(x, y, "warning"),
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [githubTrendingDevApi()],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // temporarily suppress this warning
          if (
            warning.message.includes("is dynamically imported by") &&
            warning.message.includes("but also statically imported by")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
