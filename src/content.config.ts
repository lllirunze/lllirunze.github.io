import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import type { Loader } from 'astro/loaders'
import { z } from 'astro/zod'
import { recipesLoader } from './utils/recipes/loader'
import { type RecipeData, recipeSchema } from './utils/recipes/schema'

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(''),
    lang: z.string().optional().default(''),

    /* For internal use */
    prevTitle: z.string().default(''),
    prevSlug: z.string().default(''),
    nextTitle: z.string().default(''),
    nextSlug: z.string().default(''),
  }),
})

const specCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/spec',
  }),
})

const recipesCollection: ReturnType<
  typeof defineCollection<z.ZodType<RecipeData>, Loader>
> = defineCollection({
  loader: recipesLoader(),
  schema: recipeSchema,
})

export const collections: {
  posts: typeof postsCollection
  spec: typeof specCollection
  recipes: typeof recipesCollection
} = {
  posts: postsCollection,
  spec: specCollection,
  recipes: recipesCollection,
}
