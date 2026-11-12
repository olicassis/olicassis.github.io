import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
    year: z.number(),
    draft: z.boolean().default(false),
  }),
});

const career = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
  schema: z.object({
    kind: z.enum(["work", "study"]),
    title: z.string(),
    org: z.string(),
    start: z.string(), // "2021" or "2021-03"
    end: z.string().optional(), // omit for current
    location: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const progress = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/progress" }),
  schema: z.object({
    kind: z.enum(["course", "certification", "book"]),
    title: z.string(),
    by: z.string().optional(),
    value: z.number().min(0).max(100),
    finished: z.string().optional(),
    url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, career, progress };
