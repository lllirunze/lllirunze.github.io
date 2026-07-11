import { readFile } from 'node:fs/promises'

export type SkillTreeNode = {
  id: string
  name: string
  level: number
  icon: string
  children?: SkillTreeNode[]
}

export type PositionedSkillTreeNode = SkillTreeNode & {
  depth: number
  x: number
  y: number
  parentId?: string
}

export type SkillTreeEdge = {
  from: string
  to: string
}

export type SkillTreeLayout = {
  nodes: PositionedSkillTreeNode[]
  edges: SkillTreeEdge[]
  maxDepth: number
  ringSizes: number[]
}

const SKILL_TREE_FILE_URL = new URL('../../public/data/skill-tree.ts', import.meta.url)

const clampNodeLevel = (level: number) => Math.min(5, Math.max(1, Math.round(level)))

const normalizeNode = (node: SkillTreeNode): SkillTreeNode => ({
  ...node,
  level: clampNodeLevel(node.level),
  icon: node.icon ?? '',
  children: node.children?.map(normalizeNode) ?? [],
})

export async function loadSkillTreeData(): Promise<SkillTreeNode> {
  const source = await readFile(SKILL_TREE_FILE_URL, 'utf8')
  const rootDeclaration = 'export const skillTreeRoot'
  const declarationIndex = source.indexOf(rootDeclaration)

  if (declarationIndex === -1) {
    throw new Error('skillTreeRoot declaration was not found in public/data/skill-tree.ts')
  }

  const objectStartIndex = source.indexOf('{', declarationIndex)

  if (objectStartIndex === -1) {
    throw new Error('skillTreeRoot object literal was not found in public/data/skill-tree.ts')
  }

  const objectLiteral = source.slice(objectStartIndex).trim()

  const parsed = Function(`"use strict"; return (${objectLiteral});`)() as SkillTreeNode
  return normalizeNode(parsed)
}

const getTreeDepth = (node: SkillTreeNode): number => {
  const children = node.children ?? []
  if (children.length === 0) return 0
  return 1 + Math.max(...children.map(getTreeDepth))
}

const getRadiusByDepth = (depth: number, maxDepth: number, variant: 'preview' | 'full') => {
  if (depth === 0) return 0

  if (maxDepth === 1) {
    return variant === 'preview' ? 35 : 38
  }

  const maxRadius = variant === 'preview' ? 36 : 44
  const minRadius = variant === 'preview' ? 18 : 16
  const step = (maxRadius - minRadius) / Math.max(maxDepth - 1, 1)
  return minRadius + step * (depth - 1)
}

type LeafSpan = {
  start: number
  end: number
}

const createLeafSpans = (root: SkillTreeNode, maxDepth: number) => {
  const spans = new Map<string, LeafSpan>()
  let leafIndex = 0

  const walk = (node: SkillTreeNode, depth: number): LeafSpan => {
    const visibleChildren = depth >= maxDepth ? [] : (node.children ?? [])

    if (visibleChildren.length === 0) {
      const span = { start: leafIndex, end: leafIndex }
      spans.set(node.id, span)
      leafIndex += 1
      return span
    }

    const childSpans = visibleChildren.map((child) => walk(child, depth + 1))
    const span = {
      start: childSpans[0].start,
      end: childSpans[childSpans.length - 1].end,
    }
    spans.set(node.id, span)
    return span
  }

  walk(root, 0)

  return {
    spans,
    totalLeaves: leafIndex,
  }
}

const getAngleFromSpan = (span: LeafSpan, totalLeaves: number) => {
  const step = (Math.PI * 2) / Math.max(totalLeaves, 1)
  const centerIndex = (span.start + span.end + 1) / 2
  return -Math.PI / 2 + centerIndex * step
}

export function createSkillTreeLayout(
  root: SkillTreeNode,
  options: {
    maxDepth?: number
    variant?: 'preview' | 'full'
  } = {}
): SkillTreeLayout {
  const { maxDepth: requestedMaxDepth, variant = 'full' } = options
  const fullDepth = getTreeDepth(root)
  const maxDepth = Math.min(requestedMaxDepth ?? fullDepth, fullDepth)
  const nodes: PositionedSkillTreeNode[] = []
  const edges: SkillTreeEdge[] = []
  const { spans, totalLeaves } = createLeafSpans(root, maxDepth)

  const walk = (node: SkillTreeNode, depth: number, parentId?: string) => {
    const span = spans.get(node.id)
    if (!span) return

    const angle = depth === 0 ? -Math.PI / 2 : getAngleFromSpan(span, totalLeaves)
    const radius = getRadiusByDepth(depth, Math.max(maxDepth, 1), variant)
    const x = 50 + Math.cos(angle) * radius
    const y = 50 + Math.sin(angle) * radius

    nodes.push({
      ...node,
      depth,
      x,
      y,
      parentId,
    })

    if (parentId) {
      edges.push({
        from: parentId,
        to: node.id,
      })
    }

    if (depth >= maxDepth) return

    const children = node.children ?? []
    if (children.length === 0) return

    children.forEach((child) => {
      walk(child, depth + 1, node.id)
    })
  }

  walk(root, 0)

  return {
    nodes,
    edges,
    maxDepth,
    ringSizes: Array.from({ length: maxDepth }, (_, index) =>
      getRadiusByDepth(index + 1, Math.max(maxDepth, 1), variant) * 2
    ),
  }
}
