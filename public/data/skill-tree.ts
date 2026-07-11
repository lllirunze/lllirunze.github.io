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
          id: 'java-backend',
          name: 'Java Backend',
          level: 5,
          icon: 'java.avif',
          children: [
            { id: 'java', name: 'Java', level: 5, icon: 'java.avif' },
            { id: 'spring-boot', name: 'Spring Boot', level: 5, icon: 'spring.avif' },
            { id: 'maven', name: 'Maven', level: 4, icon: 'maven.avif' },
            { id: 'restful-api', name: 'RESTful API', level: 4, icon: 'api.avif' },
            { id: 'troubleshooting', name: 'Troubleshooting', level: 5, icon: 'troubleshoot.avif' },
          ],
        },
        {
          id: 'android-development',
          name: 'Android Development',
          level: 4,
          icon: 'android.avif',
          children: [
            { id: 'android-sdk', name: 'Android SDK', level: 4, icon: 'android.avif' },
            { id: 'kotlin', name: 'Kotlin', level: 3, icon: 'kotlin.avif' },
            { id: 'mvvm', name: 'MVVM', level: 3, icon: 'mvvm.avif' },
            { id: 'ui-development', name: 'UI Development', level: 4, icon: 'ui.avif' },
            { id: 'ble-communication', name: 'BLE Communication', level: 5, icon: 'bluetooth.avif' },
          ],
        },
        {
          id: 'python-utilities',
          name: 'Python Utilities',
          level: 2,
          icon: 'python.avif',
          children: [
            { id: 'python-basics', name: 'Python Basics', level: 2, icon: 'python.avif' },
            { id: 'data-conversion', name: 'Data Conversion', level: 3, icon: 'data.avif' },
            { id: 'desktop-utilities', name: 'Desktop Utilities', level: 2, icon: 'desktop.avif' },
          ],
        },
        {
          id: 'data-and-integration',
          name: 'Data & Integration',
          level: 3,
          icon: 'data.avif',
          children: [
            { id: 'mysql', name: 'MySQL', level: 3, icon: 'mysql.avif' },
            { id: 'redis', name: 'Redis', level: 3, icon: 'redis.avif' },
            { id: 'kafka', name: 'Kafka', level: 3, icon: 'kafka.avif' },
            { id: 'http-integration', name: 'HTTP Integration', level: 4, icon: 'http.avif' },
            { id: 'authentication', name: 'Authentication', level: 3, icon: 'auth.avif' },
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
          level: 3,
          icon: 'cloud.avif',
          children: [
            { id: 'docker', name: 'Docker', level: 3, icon: 'docker.avif' },
            { id: 'application-deploy', name: 'Application Deploy', level: 3, icon: 'deploy.avif' },
            { id: 'api-gateway', name: 'API Gateway', level: 2, icon: 'gateway.avif' },
            { id: 'app-configuration', name: 'App Configuration', level: 3, icon: 'config.avif' },
            { id: 'obs-storage', name: 'OBS Storage', level: 3, icon: 'obs.avif' },
            { id: 'jalor-platform', name: 'Jalor Platform', level: 2, icon: 'jalor.avif' },
          ],
        },
        {
          id: 'product-delivery',
          name: 'Product Delivery',
          level: 4,
          icon: 'delivery.avif',
          children: [
            { id: 'requirement-analysis', name: 'Requirement Analysis', level: 3, icon: 'requirement.avif' },
            { id: 'feature-design', name: 'Feature Design', level: 3, icon: 'feature.avif' },
            { id: 'end-to-end-delivery', name: 'End-to-End Delivery', level: 4, icon: 'delivery.avif' },
            { id: 'release-verification', name: 'Release Verification', level: 3, icon: 'release.avif' },
            { id: 'issue-resolution', name: 'Issue Resolution', level: 4, icon: 'objective.avif' },
          ],
        },
        {
          id: 'ai-product',
          name: 'AI Product',
          level: 3,
          icon: 'ai.avif',
          children: [
            { id: 'ai-assisted-coding', name: 'AI-Assisted Coding', level: 4, icon: 'ai.avif' },
            { id: 'prompt-engineering', name: 'Prompt Engineering', level: 3, icon: 'prompt.avif' },
            { id: 'tool-calling', name: 'Tool Calling', level: 3, icon: 'tools.avif' },
            { id: 'agent-workflow', name: 'Agent Workflow', level: 2, icon: 'agent.avif' },
            { id: 'mcp', name: 'MCP', level: 2, icon: 'mcp.avif' },
            { id: 'codex', name: 'Codex', level: 3, icon: 'chatgpt.avif' },
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
            { id: 'classification', name: 'Classification', level: 2, icon: 'classification.avif' },
            { id: 'regression', name: 'Regression', level: 3, icon: 'regression.avif' },
            { id: 'model-evaluation', name: 'Model Evaluation', level: 2, icon: 'norm.avif' },
          ],
        },
      ],
    },
  ],
}
