import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

const repoRoot = process.cwd()
const assetsRoot = path.join(repoRoot, "src/assets")
const srcRoot = path.join(repoRoot, "src")

const imageExtensions = new Set([".png", ".jpg", ".jpeg"])
const textExtensions = new Set([
  ".astro",
  ".cjs",
  ".css",
  ".js",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".svelte",
  ".styl",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if ([".git", "dist", "node_modules"].includes(entry.name)) {
        return []
      }
      return walk(fullPath)
    }
    return [fullPath]
  }))
  return files.flat()
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/")
}

async function convertImages() {
  const files = await walk(assetsRoot)
  const imageFiles = files.filter((file) =>
    imageExtensions.has(path.extname(file).toLowerCase()),
  )

  const replacements = []

  for (const inputFile of imageFiles) {
    const outputFile = inputFile.replace(/\.(png|jpg|jpeg)$/i, ".webp")
    await fs.rm(outputFile, { force: true })
    await sharp(inputFile).webp({ quality: 85 }).toFile(outputFile)

    const oldFromSrc = toPosix(path.relative(srcRoot, inputFile))
    const newFromSrc = toPosix(path.relative(srcRoot, outputFile))
    replacements.push([
      oldFromSrc,
      newFromSrc,
    ])
    replacements.push([
      `src/${oldFromSrc}`,
      `src/${newFromSrc}`,
    ])
  }

  return { imageFiles, replacements }
}

async function updateReferences(replacements) {
  const files = await walk(repoRoot)
  const textFiles = files.filter((file) =>
    textExtensions.has(path.extname(file).toLowerCase()),
  )

  for (const file of textFiles) {
    const original = await fs.readFile(file, "utf8")
    let next = original
    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
    }
    if (next !== original) {
      await fs.writeFile(file, next)
    }
  }
}

async function removeOriginals(files) {
  for (const file of files) {
    await fs.rm(file, { force: true })
  }
}

const { imageFiles, replacements } = await convertImages()
await updateReferences(replacements)
await removeOriginals(imageFiles)

console.log(`Converted ${imageFiles.length} assets to .webp and updated references.`)
