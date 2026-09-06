let initialized = false
let renderVersion = 0
let mermaidModule: Promise<typeof import('mermaid')> | undefined

function getTheme(): 'dark' | 'default' {
  return document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'default'
}

function prepareDiagramNodes(): HTMLElement[] {
  const codeBlocks = document.querySelectorAll<HTMLElement>(
    'pre[data-language="mermaid"] > code',
  )

  for (const code of codeBlocks) {
    const pre = code.parentElement
    if (!pre) continue

    const container = document.createElement('div')
    container.className = 'mermaid mermaid-diagram not-prose'
    container.dataset.mermaidSource = code.textContent ?? ''
    container.textContent = container.dataset.mermaidSource

    const wrapper = pre.parentElement
    const target = wrapper?.classList.contains('code-block') ? wrapper : pre
    target.replaceWith(container)
  }

  const diagrams = Array.from(
    document.querySelectorAll<HTMLElement>('.mermaid-diagram'),
  )

  for (const diagram of diagrams) {
    diagram.removeAttribute('data-processed')
    diagram.textContent = diagram.dataset.mermaidSource ?? ''
  }

  return diagrams
}

export async function renderMermaid(): Promise<void> {
  const version = ++renderVersion
  const nodes = prepareDiagramNodes()
  if (nodes.length === 0) return

  mermaidModule ??= import('mermaid')
  const { default: mermaid } = await mermaidModule

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: getTheme(),
  })

  try {
    await mermaid.run({ nodes, suppressErrors: true })
  } catch (error) {
    if (version === renderVersion) {
      console.error('Failed to render Mermaid diagrams:', error)
    }
  }
}

export function setupMermaid(): void {
  if (initialized) return
  initialized = true

  const renderCurrentPage = () => {
    void renderMermaid().catch(error => {
      console.error('Failed to initialize Mermaid diagrams:', error)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCurrentPage, {
      once: true,
    })
  } else {
    renderCurrentPage()
  }

  const setupSwup = () => {
    window.swup?.hooks?.on('content:replace', renderCurrentPage)
  }

  if (window.swup?.hooks) {
    setupSwup()
  } else {
    document.addEventListener('swup:enable', setupSwup, { once: true })
  }

  let previousTheme = getTheme()
  let themeRenderTimer: ReturnType<typeof setTimeout> | undefined

  const themeObserver = new MutationObserver(() => {
    const currentTheme = getTheme()
    if (currentTheme === previousTheme) return
    previousTheme = currentTheme

    clearTimeout(themeRenderTimer)
    themeRenderTimer = setTimeout(() => {
      renderCurrentPage()
    }, 100)
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
}
