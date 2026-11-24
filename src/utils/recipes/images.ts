const images = import.meta.glob<ImageMetadata>(
  '../../assets/images/recipes/**/*.{webp,avif,jpg,jpeg,png}',
  { eager: true, import: 'default' },
)

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const filePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:webp|avif|jpe?g|png)$/i

export function resolveRecipeImage(
  slug: string,
  file: string,
  source = `src/content/recipes/${slug}.yaml`,
  field = 'presentation.cover.file',
): ImageMetadata {
  if (!slugPattern.test(slug) || !filePattern.test(file)) {
    throw new Error(`${source}: ${field}: 非法图片路径 ${file}`)
  }
  const key = `../../assets/images/recipes/${slug}/${file}`
  const image = images[key]
  if (!image) {
    throw new Error(
      `${source}: ${field}: 找不到 src/assets/images/recipes/${slug}/${file}`,
    )
  }
  return image
}
