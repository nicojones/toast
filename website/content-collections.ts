import { z } from "zod";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";

// MDX Plugins:
import {
  remarkGfm,
  remarkHeading,
  remarkStructure,
} from "fumadocs-core/mdx-plugins";
import GithubSlugger from "github-slugger";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visit } from "unist-util-visit";
import { HEADING_LINK_ANCHOR } from "./src/ui/prose-headings";

// Rehype Shiki Options:
const rehypePrettyOptions: Options = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
  bypassInlineCode: true,
};

// Domain:
const domain = "toast.pheralb.dev";

// Docs Collection:
const docs = defineCollection({
  name: "docs",
  directory: "src/docs",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkHeading, remarkStructure],
      rehypePlugins: [
        // (1a) Add rawstring to pre element, to be used in the copy button:
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") return;
              node.rawstring = codeEl.children?.[0].value;
            }
          });
        },
        // (1b) Render Code Blocks with Rehype Pretty Code:
        [rehypePrettyCode, rehypePrettyOptions],
        // (2) Add rawstring to pre element, to be used in the copy button:
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "figure") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }
              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }
              preElement.properties["rawstring"] = node.rawstring;
            }
          });
        },
        // Open External Links in New Tab:
        () => (tree) => {
          visit(tree, "element", (e) => {
            if (
              e.tagName === "a" &&
              e.properties?.href &&
              e.properties.href.toString().startsWith("http") &&
              !e.properties.href.toString().includes(domain)
            ) {
              e.properties!["target"] = "_blank";
            }
          });
        },
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: [HEADING_LINK_ANCHOR],
            },
          },
        ],
      ],
    });
    const slugger = new GithubSlugger();
    const regXHeader = /\n(?<flag>#+)\s+(?<content>.+)/g;
    const tableOfContents = Array.from(
      document.content.matchAll(regXHeader),
    ).map(({ groups }) => {
      const flag = groups?.flag;
      const content = groups?.content;
      return {
        level: flag?.length,
        text: content,
        slug: content ? slugger.slug(content) : undefined,
      };
    });
    return {
      ...document,
      mdx,
      slug: document._meta.path,
      url: `/${document._meta.path}`,
      tableOfContents,
    };
  },
});

export default defineConfig({
  collections: [docs],
});
