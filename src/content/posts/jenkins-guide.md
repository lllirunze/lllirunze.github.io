---
title: Jenkins 入门：从构建任务到 CI/CD 流水线
published: 2026-08-29
description: '精简梳理 Jenkins 的核心概念、Pipeline 写法、凭据管理、Webhook 触发以及 Java 项目中的 CI/CD 实践。'
image: '../../assets/images/posts/java/jenkins.webp'
tags: ["jenkins", "devops"]
category: 'Development'
draft: false
lang: ''
---

Jenkins 是一个常见的自动化构建与持续集成工具。它通常用于自动完成代码拉取、编译、测试、打包、镜像构建和部署等流程。

如果没有 Jenkins，一个项目发布可能需要人工重复执行：

```text
登录服务器
  ↓
拉取最新代码
  ↓
执行编译和测试
  ↓
打包部署产物
  ↓
停止旧服务
  ↓
启动新服务
```

这些步骤不难，但重复、繁琐，并且容易因为人工操作产生问题。Jenkins 的价值，就是把这类流程变成一条稳定、可重复、可追踪的自动化流水线。

## CI/CD 与 Jenkins 的位置

学习 Jenkins 之前，先理解 CI/CD：

```text
CI = Continuous Integration
持续集成

CD = Continuous Delivery / Continuous Deployment
持续交付 / 持续部署
```

CI 关注的是：代码提交后，能不能尽快完成集成、构建和测试。

CD 关注的是：代码通过验证后，能不能稳定地交付或部署到目标环境。

一个典型流程可以理解成：

```text
Developer
    │
    │ git push
    ▼
GitHub / GitLab / Gitee
    │
    │ Webhook
    ▼
Jenkins
    │
    ├── Checkout
    ├── Build
    ├── Test
    ├── Package
    ├── Docker Build
    └── Deploy
    │
    ▼
Test / Production
```

所以 Jenkins 不只是一个“点击构建”的工具，它更像是一个流程编排平台：把 Git、Maven、JUnit、Docker、Shell、服务器部署等动作串起来。

## Jenkins 的几个核心概念

Jenkins 里最常见的几个概念是：

| 概念 | 说明 |
| --- | --- |
| Job | Jenkins 中的一项自动化任务 |
| Build | Job 每执行一次产生的一次构建记录 |
| Workspace | Jenkins 拉取代码、执行命令的工作目录 |
| Plugin | 插件，提供 Git、Pipeline、Docker、凭据等能力 |
| Node / Agent | 真正执行构建任务的节点 |
| Pipeline | 用代码描述 CI/CD 流程，通常写在 `Jenkinsfile` 中 |

例如一个 Java 项目的 Workspace 可能是：

```text
/var/lib/jenkins/workspace/demo-backend/
```

里面通常会有：

```text
demo-backend
├── Jenkinsfile
├── Dockerfile
├── pom.xml
├── deploy.sh
└── src
```

Jenkins 在这个目录中执行：

```bash
mvn clean package
```

但需要注意：**Jenkins 本身不会编译 Java，真正编译 Java 的是 Maven 或 Gradle。**  
Jenkins 做的是调度这些工具，并记录每一步的执行结果。

## 安装与第一个任务

Jenkins 有多种安装方式，例如 Linux 软件包、Docker、War 包或 Kubernetes。个人学习时，用 Docker 启动会比较方便：

```bash
docker run \
  -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

启动后访问：

```text
http://服务器IP:8080
```

第一次进入 Jenkins 时，需要获取初始管理员密码：

```bash
docker exec jenkins \
cat /var/jenkins_home/secrets/initialAdminPassword
```

进入页面后，可以创建一个最简单的 Freestyle Job：

```text
新建任务
  ↓
Freestyle project
  ↓
配置 Git 仓库
  ↓
添加 Execute shell
  ↓
mvn clean package
```

这个任务的本质就是：

```text
Jenkins
  ↓
Git Clone
  ↓
Maven Build
  ↓
生成 Jar
```

不过当流程变复杂后，页面配置会越来越难维护，所以真实项目更推荐使用 Pipeline。

## Jenkinsfile 与 Pipeline

Pipeline 是 Jenkins 中更推荐的使用方式。它把构建流程写成代码，通常保存在项目根目录的 `Jenkinsfile` 中。

最小的 Jenkinsfile 可以这样写：

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo '开始构建'
            }
        }
    }
}
```

它的结构可以理解为：

```text
Pipeline
  ↓
Stages
  ↓
Stage
  ↓
Steps
```

一个更接近 Java 项目的 Pipeline 示例：

```groovy
pipeline {
    agent any

    environment {
        APP_NAME = 'demo'
        IMAGE_NAME = 'demo'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh 'mvn clean test'
            }
        }

        stage('Package') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                      -t demo:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }

    post {
        success {
            echo 'Pipeline 执行成功'
        }

        failure {
            echo 'Pipeline 执行失败'
        }
    }
}
```

其中：

- `agent any` 表示使用任意可用节点执行流水线。
- `stage` 表示流水线中的一个阶段，例如测试、打包、部署。
- `steps` 表示这个阶段中真正执行的命令。
- `environment` 用来定义环境变量。
- `post` 用来处理构建结束后的动作，例如成功通知、失败通知或清理资源。

## 参数、凭据与自动触发

实际项目经常需要区分不同部署环境，例如 `dev`、`test`、`prod`。可以通过 `parameters` 做参数化构建：

```groovy
pipeline {
    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['dev', 'test', 'prod'],
            description: '请选择部署环境'
        )
    }

    stages {
        stage('Deploy') {
            steps {
                echo "当前部署环境：${params.ENV}"
                sh "./deploy.sh ${params.ENV}"
            }
        }
    }
}
```

如果涉及账号、Token、SSH Key、Docker Registry 密码，不要直接写在 `Jenkinsfile` 里：

```groovy
PASSWORD = '123456'
```

更推荐使用 Jenkins 的 Credentials 统一管理，然后在 Pipeline 中引用：

```groovy
withCredentials([
    usernamePassword(
        credentialsId: 'docker-registry-password',
        usernameVariable: 'USERNAME',
        passwordVariable: 'PASSWORD'
    )
]) {
    sh '''
        docker login \
          -u $USERNAME \
          -p $PASSWORD
    '''
}
```

如果希望代码提交后自动构建，可以使用 Webhook：

```text
Developer
  ↓ git push
GitLab / GitHub
  ↓ Webhook
Jenkins
  ↓
Pipeline
```

这样每次代码 Push 后，Git 平台会主动通知 Jenkins，Jenkins 再自动启动构建流程。

## Docker 部署示例

现在很多 Java 项目会先构建 Jar，再构建 Docker 镜像。

一个简单的 `Dockerfile`：

```dockerfile
FROM eclipse-temurin:17-jre

COPY target/demo.jar /app/demo.jar

ENTRYPOINT ["java", "-jar", "/app/demo.jar"]
```

Jenkinsfile 中可以增加镜像构建阶段：

```groovy
stage('Docker Build') {
    steps {
        sh '''
            docker build \
              -t registry.example.com/demo:${BUILD_NUMBER} .
        '''
    }
}
```

再增加镜像推送阶段：

```groovy
stage('Docker Push') {
    steps {
        sh '''
            docker push \
              registry.example.com/demo:${BUILD_NUMBER}
        '''
    }
}
```

部署时可以让服务器拉取指定镜像并重启容器：

```bash
docker stop demo || true
docker rm demo || true

docker run \
  -d \
  --name demo \
  -p 8080:8080 \
  registry.example.com/demo:${BUILD_NUMBER}
```

这样从代码提交到服务部署，就形成了一条比较完整的 CI/CD 链路。

## 常见问题与实践建议

Jenkins 构建失败时，第一反应不应该是“Jenkins 坏了”，而是先看 Console Output，确认具体失败在哪个 Stage、哪条命令。

常见问题一般来自这些地方：

- `java: command not found`：Jenkins 进程没有正确配置 Java 或 `JAVA_HOME`。
- `mvn: command not found`：Jenkins 用户找不到 Maven。
- `Permission denied`：脚本没有执行权限，或 Jenkins 用户没有目录权限。
- Docker 权限错误：Jenkins 用户无法访问 Docker daemon。
- Git Clone 失败：仓库地址、Token、SSH Key 或网络配置有问题。
- Workspace 文件残留：上一次构建产物影响本次构建，可以使用 `mvn clean` 或 `cleanWs()` 清理。

实践中建议遵循几个原则：

- 不要把密码、Token、私钥直接写进 `Jenkinsfile`。
- Jenkinsfile 尽量放进代码仓库，方便 Code Review、版本管理和回滚。
- Pipeline 按阶段拆分，例如 `Checkout`、`Test`、`Package`、`Docker Build`、`Deploy`。
- 测试环境和生产环境分开，生产部署最好增加人工确认。
- 大型项目尽量让 Controller 负责调度，让不同 Agent 执行具体构建任务。

总结一下，Jenkins 的核心不是某个按钮或某个插件，而是这条思路：

```text
把原本需要人工执行的发布流程
  ↓
转换成
  ↓
稳定、可重复、可追踪的自动化 Pipeline
```

理解了这一点，Jenkins 就不再只是“构建按钮”，而是软件工程自动化体系中的一块基础设施。
