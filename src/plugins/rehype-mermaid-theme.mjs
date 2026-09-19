/**
 * Astro highlights fenced code before user rehype plugins run. Shiki moves the
 * language marker from `code.language-mermaid` to `pre[data-language=mermaid]`,
 * while rehype-mermaid expects a `mermaid` class on the pre element.
 */
export function rehypeMermaidShikiCompat() {
  return tree => {
    visitMermaidCode(tree)
  }
}

function visitMermaidCode(node) {
  if (!node?.children) return

  for (const child of node.children) {
    if (
      child.type === 'element' &&
      child.tagName === 'pre' &&
      child.properties?.dataLanguage === 'mermaid'
    ) {
      const className = child.properties.className ?? []
      child.properties.className = [...className, 'mermaid']
    }

    visitMermaidCode(child)
  }
}

/**
 * Convert the responsive <picture> emitted by rehype-mermaid into two
 * theme-aware SVG images. The blog uses an html.dark class instead of the
 * operating system's prefers-color-scheme value, so CSS needs direct control
 * over which image is visible.
 */
export function rehypeMermaidTheme() {
  return tree => {
    visit(tree)
  }
}

function visit(node) {
  if (!node?.children) return

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]

    if (child.type === 'element' && child.tagName === 'picture') {
      const source = child.children.find(item => item.tagName === 'source')
      const image = child.children.find(item => item.tagName === 'img')
      const sourceId = String(source?.properties?.id ?? '')

      if (sourceId.startsWith('mermaid-dark') && image) {
        const darkSource =
          source.properties.srcSet ?? source.properties.srcset ?? ''

        node.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['mermaid-diagram', 'not-prose'],
          },
          children: [
            {
              ...image,
              properties: {
                ...image.properties,
                className: ['mermaid-diagram-light'],
                decoding: 'async',
                loading: 'lazy',
              },
            },
            {
              type: 'element',
              tagName: 'img',
              properties: {
                alt: image.properties.alt ?? '',
                className: ['mermaid-diagram-dark'],
                decoding: 'async',
                height: source.properties.height,
                loading: 'lazy',
                src: darkSource,
                width: source.properties.width,
              },
              children: [],
            },
          ],
        }
        continue
      }
    }

    visit(child)
  }
}
