export const SKILL_LEVELS = [1, 2, 3, 4, 5] as const

export type SkillLevel = (typeof SKILL_LEVELS)[number]

export type SkillLevelMeta = {
  level: SkillLevel
  key: 'common' | 'advanced' | 'rare' | 'epic' | 'legendary'
  label: string
  color: string
}

export const SKILL_LEVEL_META: Record<SkillLevel, SkillLevelMeta> = {
  1: {
    level: 1,
    key: 'common',
    label: 'Normal',
    color: '#94A3B8',
  },
  2: {
    level: 2,
    key: 'advanced',
    label: 'Excellent',
    color: '#22C55E',
  },
  3: {
    level: 3,
    key: 'rare',
    label: 'Rare',
    color: '#3B82F6',
  },
  4: {
    level: 4,
    key: 'epic',
    label: 'Epic',
    color: '#A855F7',
  },
  5: {
    level: 5,
    key: 'legendary',
    label: 'Legendary',
    color: '#F59E0B',
  },
}

export const SKILL_LEVEL_COLOR_MAP: Record<SkillLevel, string> = Object.fromEntries(
  SKILL_LEVELS.map((level) => [level, SKILL_LEVEL_META[level].color])
) as Record<SkillLevel, string>
