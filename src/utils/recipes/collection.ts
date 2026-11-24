import { type CollectionEntry, getCollection } from 'astro:content'
import { resolveRecipeImage } from './images'

export type RecipeEntry = CollectionEntry<'recipes'>

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function getPublishedRecipes(): Promise<RecipeEntry[]> {
  const entries = await getCollection('recipes')
  const ids = new Set<string>()
  const orders = new Map<number, string>()

  for (const entry of entries) {
    const source = entry.filePath || `src/content/recipes/${entry.id}.yaml`
    if (!slugPattern.test(entry.id) || ids.has(entry.id)) {
      throw new Error(
        `${source}: id: 菜谱文件名必须是唯一的小写 kebab-case slug`,
      )
    }
    ids.add(entry.id)
    resolveRecipeImage(
      entry.id,
      entry.data.presentation.cover.file,
      source,
      'presentation.cover.file',
    )
    if (entry.data.presentation.template === 'duet') {
      resolveRecipeImage(
        entry.id,
        entry.data.presentation.detail.file,
        source,
        'presentation.detail.file',
      )
    }
    if (entry.data.publication.status === 'published') {
      const order = entry.data.publication.order
      if (order === undefined) {
        throw new Error(
          `${source}: publication.order: 已发布菜谱必须填写 order`,
        )
      }
      const previous = orders.get(order)
      if (previous) {
        throw new Error(
          `${source}: publication.order: ${order} 与 ${previous} 重复`,
        )
      }
      orders.set(order, source)
    }
  }

  return entries
    .filter(entry => entry.data.publication.status === 'published')
    .sort(
      (a, b) =>
        (a.data.publication.order ?? 0) - (b.data.publication.order ?? 0),
    )
}
