export type SkillTreeNode = {
  id: string
  name: string
  level: number
  icon: string
  children?: SkillTreeNode[]
}

export const skillTreeRoot: SkillTreeNode = {
  id: 'skill-tree',
  name: 'Skill Tree',
  level: 5,
  icon: 'wangdong.avif',
  children: [
    {
      id: 'engineering',
      name: 'Engineering',
      level: 5,
      icon: 'engineering.avif',
      children: [
        {
          id: 'backend',
          name: 'Backend',
          level: 5,
          icon: 'engineering.avif',
          children: [
            {
              id: 'java',
              name: 'Java',
              level: 5,
              icon: 'java.avif',
              children: [
                { id: 'spring-boot', name: 'Spring Boot', level: 5, icon: 'spring.avif' },
                { id: 'maven', name: 'Maven', level: 4, icon: 'maven.avif' },
                { id: 'restful-api', name: 'RESTful API', level: 4, icon: 'api.avif' },
                { id: 'troubleshooting', name: 'Troubleshooting', level: 5, icon: 'troubleshoot.avif' },
              ],
            },
            {
              id: 'python',
              name: 'Python',
              level: 2,
              icon: 'python.avif',
              children: [
                { id: 'data-conversion', name: 'Data Conversion', level: 1, icon: 'data.avif' },
                { id: 'desktop-utilities', name: 'Desktop Utilities', level: 1, icon: 'desktop.avif' },
              ],
            },
          ],
        },
        {
          id: 'frontend',
          name: 'Frontend',
          level: 3,
          icon: 'ui.avif',
          children: [
            {
              id: 'android-development',
              name: 'Android Development',
              level: 3,
              icon: 'android.avif',
              children: [
                { id: 'kotlin', name: 'Kotlin', level: 2, icon: 'kotlin.avif' },
                { id: 'mvvm', name: 'MVVM', level: 2, icon: 'mvvm.avif' },
                { id: 'ui-development', name: 'UI Development', level: 4, icon: 'ui.avif' },
                { id: 'ble-communication', name: 'BLE Communication', level: 3, icon: 'bluetooth.avif' },
              ],
            },
          ],
        },
        {
          id: 'data-and-integration',
          name: 'Data & Integration',
          level: 2,
          icon: 'data.avif',
          children: [
            {
              id: 'database',
              name: 'Database',
              level: 2,
              icon: 'data.avif',
              children: [
                { id: 'mysql', name: 'MySQL', level: 2, icon: 'mysql.avif' },
                { id: 'redis', name: 'Redis', level: 2, icon: 'redis.avif' },
              ],
            },
            {
              id: 'mq',
              name: 'MQ',
              level: 2,
              icon: 'kafka.avif',
              children: [
                { id: 'kafka', name: 'Kafka', level: 2, icon: 'kafka.avif' },
              ],
            },
            { id: 'authentication', name: 'Authentication', level: 2, icon: 'auth.avif' },
          ],
        },
      ],
    },
    {
      id: 'product',
      name: 'Product',
      level: 4,
      icon: 'product.avif',
      children: [
        {
          id: 'cloud-devops',
          name: 'Cloud & DevOps',
          level: 2,
          icon: 'cloud.avif',
          children: [
            {
              id: 'devops',
              name: 'DevOps',
              level: 2,
              icon: 'deploy.avif',
              children: [
                { id: 'docker', name: 'Docker', level: 2, icon: 'docker.avif' },
                { id: 'application-deploy', name: 'Application Deploy', level: 2, icon: 'deploy.avif' },
                { id: 'jalor-platform', name: 'Jalor Platform', level: 1, icon: 'jalor.avif' },
              ],
            },
            {
              id: 'cloud',
              name: 'Cloud',
              level: 2,
              icon: 'cloud.avif',
              children: [
                { id: 'api-gateway', name: 'API Gateway', level: 2, icon: 'gateway.avif' },
                { id: 'app-configuration', name: 'App Configuration', level: 1, icon: 'config.avif' },
                { id: 'obs-storage', name: 'OBS Storage', level: 2, icon: 'obs.avif' },
              ],
            },
          ],
        },
        {
          id: 'product-delivery',
          name: 'Product Delivery',
          level: 4,
          icon: 'delivery.avif',
          children: [
            { id: 'requirement-analysis', name: 'Requirement Analysis', level: 2, icon: 'requirement.avif' },
            { id: 'feature-design', name: 'Feature Design', level: 2, icon: 'feature.avif' },
            { id: 'issue-resolution', name: 'Issue Resolution', level: 4, icon: 'objective.avif' },
          ],
        },
        {
          id: 'ai-product',
          name: 'AI Product',
          level: 4,
          icon: 'ai.avif',
          children: [
            {
              id: 'vibe-coding',
              name: 'Vibe Coding',
              level: 4,
              icon: 'chatgpt.avif',
              children: [
                { id: 'codex', name: 'Codex', level: 4, icon: 'chatgpt.avif' },
              ],
            },
            {
              id: 'agent-systems',
              name: 'Agent Systems',
              level: 2,
              icon: 'agent.avif',
              children: [
                { id: 'prompt-engineering', name: 'Prompt Engineering', level: 2, icon: 'prompt.avif' },
                { id: 'tool-calling', name: 'Tool Calling', level: 1, icon: 'tools.avif' },
                { id: 'agent-workflow', name: 'Agent Workflow', level: 2, icon: 'agent.avif' },
                { id: 'mcp', name: 'MCP', level: 1, icon: 'mcp.avif' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'research',
      name: 'Research',
      level: 2,
      icon: 'research.avif',
      children: [
        {
          id: 'artificial-intelligence',
          name: 'Artificial Intelligence',
          level: 2,
          icon: 'ai.avif',
          children: [
            { id: 'machine-learning', name: 'Machine Learning', level: 2, icon: 'machinelearning.avif' },
            { id: 'deep-learning', name: 'Deep Learning', level: 2, icon: 'deeplearning.avif' },
          ],
        },
      ],
    },
    {
      id: 'adventure',
      name: 'Adventure',
      level: 4,
      icon: 'adventure.avif',
      children: [
        {
          id: 'sports',
          name: 'Sports',
          level: 4,
          icon: 'sport.avif',
          children: [
            {
              id: 'court-sports',
              name: 'Court Sports',
              level: 4,
              icon: 'basketball.avif',
              children: [
                { id: 'badminton', name: 'Badminton', level: 5, icon: 'badminton.avif' },
                { id: 'basketball', name: 'Basketball', level: 3, icon: 'basketball.avif' },
              ],
            },
            { id: 'billiards', name: 'Billiards', level: 3, icon: 'ball.avif' },
            { id: 'running', name: 'Running', level: 1, icon: 'running.avif' },
          ],
        },
        {
          id: 'travel',
          name: 'Travel',
          level: 2,
          icon: 'travel.avif',
          children: [
            { id: 'photography', name: 'Photography', level: 1, icon: 'photography.avif' },
            { id: 'cooking', name: 'Cooking', level: 3, icon: 'cooking.avif' },
          ],
        },
        {
          id: 'games',
          name: 'Games',
          level: 4,
          icon: 'game.avif',
          children: [
            { id: 'card-games', name: 'Card Games', level: 4, icon: 'card-games.avif' },
            { id: 'minecraft', name: 'Minecraft', level: 5, icon: 'minecraft.avif' },
            { id: 'overwatch', name: 'Overwatch', level: 2, icon: 'overwatch.avif' },
            { id: 'league-of-legends', name: 'League of Legends', level: 1, icon: 'league-of-legends.avif' },
          ],
        },
      ],
    },
  ],
}
