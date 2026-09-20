import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchGitHubTrending } from '../api/github-trending.ts'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = resolve(projectRoot, 'public/data/github-trending.json')

try {
  const { repositories, source } = await fetchGitHubTrending()
  const payload = {
    repositories,
    generatedAt: new Date().toISOString(),
    source,
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.log(
    `Updated GitHub Trending snapshot (${repositories.length} items).`,
  )
} catch (error) {
  try {
    const previousSnapshot = JSON.parse(await readFile(outputPath, 'utf8'))
    if (!previousSnapshot.repositories?.length)
      throw new Error('Snapshot is empty')
    console.warn('Trending fetch failed; keeping the previous snapshot.')
  } catch {
    throw error
  }
}
