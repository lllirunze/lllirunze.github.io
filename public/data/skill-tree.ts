export type SkillTreeNode = {
  id: string
  name: string
  level: number
  icon: string
  children?: SkillTreeNode[]
}

export const skillTreeRoot: SkillTreeNode = {
  id: 'runze-skill-tree',
  name: 'Runze Skill Tree',
  level: 5,
  icon: '',
  children: [
    {
      id: 'engineering',
      name: 'Engineering',
      level: 5,
      icon: '',
      children: [
        {
          id: 'java-backend',
          name: 'Java Backend',
          level: 5,
          icon: '',
          children: [
            { id: 'java', name: 'Java', level: 5, icon: '' },
            { id: 'spring-boot', name: 'Spring Boot', level: 5, icon: '' },
            { id: 'maven', name: 'Maven', level: 4, icon: '' },
            { id: 'restful-api', name: 'RESTful API', level: 4, icon: '' },
            { id: 'concurrent-design', name: 'Concurrent Design', level: 3, icon: '' },
            { id: 'troubleshooting', name: 'Troubleshooting', level: 5, icon: '' },
          ],
        },
        {
          id: 'android-development',
          name: 'Android Development',
          level: 4,
          icon: '',
          children: [
            { id: 'android-sdk', name: 'Android SDK', level: 4, icon: '' },
            { id: 'java-for-android', name: 'Java for Android', level: 4, icon: '' },
            { id: 'kotlin', name: 'Kotlin', level: 3, icon: '' },
            { id: 'mvvm', name: 'MVVM', level: 3, icon: '' },
            { id: 'ui-development', name: 'UI Development', level: 4, icon: '' },
            { id: 'ble-communication', name: 'BLE Communication', level: 5, icon: '' },
          ],
        },
        {
          id: 'python-utilities',
          name: 'Python Utilities',
          level: 2,
          icon: '',
          children: [
            { id: 'python-basics', name: 'Python Basics', level: 2, icon: '' },
            { id: 'file-processing', name: 'File Processing', level: 3, icon: '' },
            { id: 'data-conversion', name: 'Data Conversion', level: 3, icon: '' },
            { id: 'desktop-utilities', name: 'Desktop Utilities', level: 2, icon: '' },
          ],
        },
        {
          id: 'data-and-integration',
          name: 'Data & Integration',
          level: 3,
          icon: '',
          children: [
            { id: 'mysql', name: 'MySQL', level: 3, icon: '' },
            { id: 'redis', name: 'Redis', level: 3, icon: '' },
            { id: 'kafka', name: 'Kafka', level: 3, icon: '' },
            { id: 'http-integration', name: 'HTTP Integration', level: 4, icon: '' },
            { id: 'authentication', name: 'Authentication', level: 3, icon: '' },
          ],
        },
      ],
    },
    {
      id: 'product',
      name: 'Product',
      level: 4,
      icon: '',
      children: [
        {
          id: 'cloud-delivery',
          name: 'Cloud Delivery',
          level: 3,
          icon: '',
          children: [
            { id: 'docker', name: 'Docker', level: 3, icon: '' },
            { id: 'application-deploy', name: 'Application Deploy', level: 3, icon: '' },
            { id: 'api-gateway', name: 'API Gateway', level: 2, icon: '' },
            { id: 'app-configuration', name: 'App Configuration', level: 3, icon: '' },
            { id: 'obs-storage', name: 'OBS Storage', level: 3, icon: '' },
            { id: 'jalor-platform', name: 'Jalor Platform', level: 2, icon: '' },
          ],
        },
        {
          id: 'product-delivery',
          name: 'Product Delivery',
          level: 4,
          icon: '',
          children: [
            { id: 'requirement-analysis', name: 'Requirement Analysis', level: 3, icon: '' },
            { id: 'feature-design', name: 'Feature Design', level: 3, icon: '' },
            { id: 'end-to-end-delivery', name: 'End-to-End Delivery', level: 4, icon: '' },
            { id: 'release-verification', name: 'Release Verification', level: 3, icon: '' },
            { id: 'issue-resolution', name: 'Issue Resolution', level: 4, icon: '' },
            { id: 'reliability-design', name: 'Reliability Design', level: 3, icon: '' },
          ],
        },
        {
          id: 'device-product',
          name: 'Device Product',
          level: 4,
          icon: '',
          children: [
            { id: 'ble-integration', name: 'BLE Integration', level: 5, icon: '' },
            { id: 'iot-connectivity', name: 'IoT Connectivity', level: 3, icon: '' },
            { id: 'device-provisioning', name: 'Device Provisioning', level: 4, icon: '' },
            { id: 'firmware-upgrade', name: 'Firmware Upgrade', level: 4, icon: '' },
            { id: 'edge-cloud-link', name: 'Edge-Cloud Link', level: 3, icon: '' },
          ],
        },
        {
          id: 'ai-product',
          name: 'AI Product',
          level: 3,
          icon: '',
          children: [
            { id: 'ai-assisted-coding', name: 'AI-Assisted Coding', level: 4, icon: '' },
            { id: 'prompt-engineering', name: 'Prompt Engineering', level: 3, icon: '' },
            { id: 'tool-calling', name: 'Tool Calling', level: 3, icon: '' },
            { id: 'agent-workflow', name: 'Agent Workflow', level: 2, icon: '' },
            { id: 'mcp', name: 'MCP', level: 2, icon: '' },
            { id: 'codex', name: 'Codex', level: 3, icon: '' },
          ],
        },
      ],
    },
    {
      id: 'research',
      name: 'Research',
      level: 2,
      icon: '',
      children: [
        {
          id: 'artificial-intelligence',
          name: 'Artificial Intelligence',
          level: 2,
          icon: '',
          children: [
            { id: 'machine-learning', name: 'Machine Learning', level: 2, icon: '' },
            { id: 'deep-learning', name: 'Deep Learning', level: 2, icon: '' },
            { id: 'classification', name: 'Classification', level: 2, icon: '' },
            { id: 'regression', name: 'Regression', level: 3, icon: '' },
            { id: 'model-evaluation', name: 'Model Evaluation', level: 2, icon: '' },
          ],
        },
      ],
    },
  ],
}
