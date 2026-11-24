import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Loader } from 'astro/loaders'
import YAML from 'yaml'

export function recipesLoader(): Loader {
  return {
    name: 'recipes-yaml-loader',
    async load({ config, store, parseData, watcher }) {
      const base = fileURLToPath(new URL('./src/content/recipes/', config.root))
      const reload = async () => {
        const files = (await readdir(base)).filter(file =>
          /\.ya?ml$/.test(file),
        )
        store.clear()
        const ids = new Set<string>()
        for (const file of files) {
          const absolute = path.join(base, file)
          const document = YAML.parseDocument(
            await readFile(absolute, 'utf8'),
            {
              uniqueKeys: true,
            },
          )
          if (document.errors.length) {
            throw new Error(
              `${absolute}: ${document.errors.map(error => error.message).join('; ')}`,
            )
          }
          const id = file.replace(/\.ya?ml$/, '')
          if (ids.has(id)) {
            throw new Error(
              `${absolute}: id: 同一菜谱不能同时使用 .yaml 和 .yml`,
            )
          }
          ids.add(id)
          const filePath = `src/content/recipes/${file}`
          const data = await parseData({ id, data: document.toJS(), filePath })
          store.set({ id, data, filePath })
        }
      }
      await reload()
      watcher?.add(base)
      for (const event of ['add', 'change', 'unlink'] as const) {
        watcher?.on(event, async changed => {
          if (path.dirname(changed) === base && /\.ya?ml$/.test(changed)) {
            await reload()
          }
        })
      }
    },
  }
}
