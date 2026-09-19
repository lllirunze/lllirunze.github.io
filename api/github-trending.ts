type TrendingRepository = {
  owner: string
  name: string
  description?: string
  language?: string
  stars: number
  forks: number
  url: string
}

type ServerResponse = {
  status: (code: number) => ServerResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

const decodeHtml = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const textContent = (html: string) =>
  decodeHtml(
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )

const parseTrending = (html: string): TrendingRepository[] => {
  const articles = [
    ...html.matchAll(/<article class="Box-row">([\s\S]*?)<\/article>/g),
  ]

  return articles.slice(0, 5).flatMap(([, article]) => {
    const repository = article.match(
      /<h2[^>]*>[\s\S]*?<a[^>]+href="\/([^/"?]+)\/([^/"?]+)"/,
    )

    if (!repository) return []

    const [, owner, name] = repository
    const description = article.match(
      /<p class="[^"]*color-fg-muted[^"]*">([\s\S]*?)<\/p>/,
    )
    const language = article.match(
      /<span itemprop="programmingLanguage">([\s\S]*?)<\/span>/,
    )
    const stars = article.match(
      /href="\/[^"]+\/stargazers"[^>]*>([\s\S]*?)<\/a>/,
    )
    const forks = article.match(/href="\/[^"]+\/forks"[^>]*>([\s\S]*?)<\/a>/)

    return [
      {
        owner: textContent(owner),
        name: textContent(name),
        ...(description && { description: textContent(description[1]) }),
        ...(language && { language: textContent(language[1]) }),
        stars: Number(textContent(stars?.[1] ?? '0').replace(/,/g, '')) || 0,
        forks: Number(textContent(forks?.[1] ?? '0').replace(/,/g, '')) || 0,
        url: `https://github.com/${owner}/${name}`,
      },
    ]
  })
}

const fetchTrendingMirror = async (): Promise<TrendingRepository[]> => {
  const response = await fetch(
    'https://githubtrending.lessx.xyz/trending?since=daily',
    { cache: 'no-store' },
  )
  if (!response.ok) throw new Error('Trending mirror request failed')

  const repositories = (await response.json()) as Array<{
    name?: string
    description?: string
    language?: string
    stars?: string
    forks?: string
  }>

  return repositories.slice(0, 5).flatMap(repository => {
    const [owner, name, ...rest] = repository.name?.split('/') ?? []
    if (!owner || !name || rest.length > 0) return []

    return [
      {
        owner,
        name,
        ...(repository.description?.trim() && {
          description: repository.description.trim(),
        }),
        ...(repository.language && { language: repository.language }),
        stars: Number(repository.stars?.replace(/,/g, '')) || 0,
        forks: Number(repository.forks?.replace(/,/g, '')) || 0,
        url: `https://github.com/${owner}/${name}`,
      },
    ]
  })
}

export default async function handler(
  request: { method?: string },
  response: ServerResponse,
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    let repositories: TrendingRepository[] = []
    let source = 'github'

    try {
      const githubResponse = await fetch(
        'https://github.com/trending?since=daily',
        {
          headers: {
            Accept: 'text/html',
            'User-Agent': 'fuwari-blog-trending-card',
          },
          signal: AbortSignal.timeout(5_000),
        },
      )

      if (!githubResponse.ok) throw new Error('GitHub request failed')
      repositories = parseTrending(await githubResponse.text())
    } catch {
      source = 'github-trending-mirror'
      repositories = await fetchTrendingMirror()
    }

    if (repositories.length === 0) throw new Error('No repositories found')

    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.setHeader('X-Trending-Source', source)
    return response.status(200).json({ repositories })
  } catch {
    return response
      .status(502)
      .json({ error: 'GitHub Trending is unavailable' })
  }
}
