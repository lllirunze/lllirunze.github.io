import { z } from 'astro/zod'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const recipeCategories = [
  '家常',
  '荤菜',
  '素菜',
  '主食',
  '汤羹',
  '甜点',
  '饮品',
] as const
const image = z
  .object({
    file: z
      .string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:webp|avif|jpe?g|png)$/i),
    alt: z.string().trim().min(1),
    caption: z.string().trim().optional(),
  })
  .strict()

const portrait = z
  .object({
    template: z.literal('portrait'),
    variant: z.enum(['image-left', 'image-right']).default('image-left'),
    cover: image,
  })
  .strict()

const duet = z
  .object({
    template: z.literal('duet'),
    variant: z.enum([
      'large-left-small-top',
      'large-left-small-bottom',
      'large-right-small-top',
      'large-right-small-bottom',
    ]),
    cover: image,
    detail: image,
  })
  .strict()

const ingredient = z
  .object({
    id: z.string().regex(slugPattern),
    name: z.string().trim().min(1),
    amount: z.number().positive().optional(),
    unit: z.string().trim().min(1).optional(),
    note: z.string().trim().min(1).optional(),
    group: z.string().trim().min(1).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      Boolean(value.note) === Boolean(value.amount !== undefined && value.unit)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: '填写 amount + unit 或 note，且只能选择一种',
      })
    }
    if ((value.amount === undefined) !== (value.unit === undefined)) {
      ctx.addIssue({ code: 'custom', message: 'amount 和 unit 必须同时填写' })
    }
  })

type RecipeImage = {
  file: string
  alt: string
  caption?: string
}

export type RecipeData = {
  schemaVersion: 1
  recipe: {
    title: string
    subtitle?: string
    category: (typeof recipeCategories)[number]
    tags: string[]
    summary?: string
    servings: number
    prepMinutes?: number
    cookMinutes?: number
  }
  presentation:
    | {
        template: 'portrait'
        variant: 'image-left' | 'image-right'
        cover: RecipeImage
      }
    | {
        template: 'duet'
        variant:
          | 'large-left-small-top'
          | 'large-left-small-bottom'
          | 'large-right-small-top'
          | 'large-right-small-bottom'
        cover: RecipeImage
        detail: RecipeImage
      }
  ingredients: {
    id: string
    name: string
    amount?: number
    unit?: string
    note?: string
    group?: string
  }[]
  steps: { text: string; uses?: string[]; tip?: string }[]
  publication: {
    status: 'draft' | 'published'
    order?: number
    featured: boolean
  }
}

export const recipeSchema: z.ZodType<RecipeData> = z
  .object({
    schemaVersion: z.literal(1),
    recipe: z
      .object({
        title: z.string().trim().min(1),
        subtitle: z.string().trim().optional(),
        category: z.enum(recipeCategories),
        tags: z.array(z.string().trim().min(1)).default([]),
        summary: z.string().trim().optional(),
        servings: z.number().int().positive(),
        prepMinutes: z.number().int().nonnegative().optional(),
        cookMinutes: z.number().int().nonnegative().optional(),
      })
      .strict(),
    presentation: z.preprocess(
      value =>
        value && typeof value === 'object' && !Array.isArray(value)
          ? { template: 'portrait', ...value }
          : value,
      z.discriminatedUnion('template', [portrait, duet]),
    ),
    ingredients: z.array(ingredient).min(1),
    steps: z
      .array(
        z
          .object({
            text: z.string().trim().min(1),
            uses: z.array(z.string().regex(slugPattern)).optional(),
            tip: z.string().trim().min(1).optional(),
          })
          .strict(),
      )
      .min(1),
    publication: z
      .object({
        status: z.enum(['draft', 'published']),
        order: z.number().int().positive().optional(),
        featured: z.boolean().default(false),
      })
      .strict(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const ids = new Set<string>()
    value.ingredients.forEach((item, index) => {
      if (ids.has(item.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['ingredients', index, 'id'],
          message: '食材 ID 重复',
        })
      }
      ids.add(item.id)
    })
    value.steps.forEach((step, index) => {
      for (const id of step.uses || []) {
        if (!ids.has(id)) {
          ctx.addIssue({
            code: 'custom',
            path: ['steps', index, 'uses'],
            message: `未知食材 ID: ${id}`,
          })
        }
      }
    })
    if (value.publication.status === 'published' && !value.publication.order) {
      ctx.addIssue({
        code: 'custom',
        path: ['publication', 'order'],
        message: '已发布菜谱必须填写 order',
      })
    }
    if (
      value.presentation.template === 'duet' &&
      value.presentation.cover.file === value.presentation.detail.file
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['presentation', 'detail', 'file'],
        message: '主图与次图不能是同一文件',
      })
    }
  })
