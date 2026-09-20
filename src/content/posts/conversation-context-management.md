---
title: 大语言模型的多轮对话与上下文管理
published: 2026-09-20
description: '介绍如何使用历史消息、previous_response_id 与 Conversations API 管理多轮对话，并讨论上下文裁剪、长期记忆、持久化和安全边界。'
image: '../../assets/images/posts/ai/gpt.webp'
tags: ['ai', 'openai', 'python']
category: 'Development'
draft: false
lang: 'zh-CN'
---

最简单的大语言模型 API 调用可以彼此独立：应用提交一段输入，模型返回一段结果，本次请求到此结束。但在聊天助手、客服系统和 Agent 中，用户通常会连续追问：

```text
用户：我正在开发一个 Spring Boot 项目。
AI：你现在主要在解决什么问题？
用户：项目准备接入 Redis。
AI：可以考虑使用 Spring Data Redis。
用户：那连接池怎么配置？
```

最后一句单独看并不完整。模型只有同时知道 Spring Boot、Redis 和前面的讨论，才能理解“连接池”指什么。

多轮对话的核心并不是让模型永久记住用户，而是让每次推理获得当前任务所需的历史状态。这项工作通常称为会话状态管理（Conversation State Management），进一步延伸后就是上下文工程（Context Engineering）。

## 模型为什么需要上下文

### 每次请求默认相互独立

一次新的模型请求不会天然拥有上一条独立请求的内容：

```python
from openai import OpenAI

client = OpenAI()

client.responses.create(
    model='gpt-5.6',
    input='我正在开发一个 Spring Boot 项目。',
)

response = client.responses.create(
    model='gpt-5.6',
    input='我刚才说我在开发什么项目？',
)
```

如果应用没有建立关联，第二次请求就看不到第一次请求。所谓“AI 记住了对话”，更准确地说，是应用或 API 服务为后续请求重新提供了相关上下文。

### 上下文不等于聊天记录

上下文是模型在当前一次推理中能够看到的信息集合，可能包括：

- 应用提供的 Instructions；
- 当前用户输入；
- 历史用户消息和模型回答；
- Function Call 与 Tool Output；
- RAG 检索片段和文件内容；
- 用户状态或其他业务数据。

聊天记录主要用于历史展示、搜索和审计；模型上下文只服务于当前推理。用户可以查看全部 300 轮记录，但模型回答第 301 个问题时，未必需要读取全部内容。

Role 则用于标记内容在上下文中的语义：

| Role | 含义 |
|---|---|
| `user` | 用户提交的内容 |
| `assistant` | 模型此前生成的内容 |
| `developer` / instructions | 应用提供的规则和约束 |

因此，多轮对话不是简单拼接字符串，而是在构造一组有顺序、有角色语义的上下文项。

## 三种多轮对话方案

Responses API 可以通过手动传递历史内容、`previous_response_id` 或 Conversations API 延续状态。三种方案解决的问题相似，但控制边界不同。

### 手动传递历史消息

最直观的方式是由应用自己保存消息，并在每次请求时重新提交：

```python
history = [
    {
        'role': 'user',
        'content': '我正在开发一个 Spring Boot 项目。',
    },
    {
        'role': 'assistant',
        'content': '你目前在处理什么问题？',
    },
    {
        'role': 'user',
        'content': '准备接入 Redis。',
    },
]

response = client.responses.create(
    model='gpt-5.6',
    input=history,
)

history.extend(response.output)
```

这种方式让应用完全决定哪些消息保留、删除、修改或摘要，也便于切换模型和供应商。代价是应用必须自己保存历史，并持续控制上下文长度。

需要注意，手动维护 Responses API 的历史时，应该保存 `response.output` 中的完整输出项，而不只是 `response.output_text`。推理模型或工具调用可能产生需要在下一轮继续传递的非文本项。

### 使用 previous_response_id

如果不想每次手动拼装历史，可以让当前 Response 关联上一个 Response：

```python
first = client.responses.create(
    model='gpt-5.6',
    instructions='你是一名 Java 后端技术助手，使用中文回答。',
    input='我正在开发一个 Spring Boot 项目。',
)

second = client.responses.create(
    model='gpt-5.6',
    instructions='你是一名 Java 后端技术助手，使用中文回答。',
    previous_response_id=first.id,
    input='项目准备接入 Redis。',
)

third = client.responses.create(
    model='gpt-5.6',
    instructions='你是一名 Java 后端技术助手，使用中文回答。',
    previous_response_id=second.id,
    input='那连接池怎么配置？',
)
```

应用只需保存最新的 Response ID，就能形成一条 Response Chain。它适合 Demo、短期会话以及不需要复杂上下文策略的应用。

这里有两个容易忽略的细节：

- 上一轮顶层的 `instructions` 不会自动传递到下一轮，固定规则应由应用在每次请求中提供；
- `previous_response_id` 简化了状态管理，但链中之前的输入 Token 仍然会按输入 Token 计费。

Response 还可以产生分支。例如从同一个 Response 分别生成两个后续回答，可用于“重新生成”或对比不同提示词。数据结构因此更接近树，而不一定永远是一条直线。

### 使用 Conversations API

需要跨设备、任务或较长时间维持会话时，可以创建持久化的 Conversation：

```python
conversation = client.conversations.create()

client.responses.create(
    model='gpt-5.6',
    conversation=conversation.id,
    input='我正在开发一个 Spring Boot 项目。',
)

response = client.responses.create(
    model='gpt-5.6',
    conversation=conversation.id,
    input='项目准备接入 Redis，连接池应该怎么配置？',
)

print(response.output_text)
```

Conversation 是一个长期存在的会话容器，可以保存消息、工具调用、工具输出等 Item。应用不需要自己维护 Response 链，但仍应在本地数据库保存会话归属、展示记录和业务状态。

三种方案可以这样选择：

| 方案 | 优点 | 更适合 |
|---|---|---|
| 手动传递历史 | 上下文控制能力最高 | RAG、Agent、跨模型系统 |
| `previous_response_id` | 接入简单，代码较少 | Demo 和简单 Response 链 |
| Conversations API | 持久化会话容器 | 长期助手、跨设备会话 |

`previous_response_id` 与 `conversation` 不能在同一个请求中同时使用。项目应根据自己的状态模型选择一种延续方式，而不是将两者混合。

## 长对话如何控制上下文

### 为什么不能无限增长

对话历史、Instructions、工具结果、检索内容以及模型输出都会占用上下文窗口。持续加入全部历史会带来四类问题：

- 输入 Token 和调用成本不断增长；
- 响应延迟增加；
- 无关历史干扰当前任务；
- 最终超过模型的上下文窗口。

所以多轮对话管理的重点不是“保存所有内容”，而是“选出当前推理真正需要的内容”。

### 滑动窗口与历史摘要

最简单的策略是只保留最近若干条消息：

```python
MAX_MESSAGES = 20
recent_messages = history[-MAX_MESSAGES:]
```

滑动窗口适合短期上下文最重要的客服问答、代码讨论和临时咨询。但它可能删除较早出现的关键事实，例如项目使用的数据库类型。

更常见的做法是组合摘要和近期消息：

```text
历史摘要
+ 最近若干轮原始消息
+ 当前用户输入
```

例如把多轮对话压缩为：

```text
用户项目采用 Spring Boot 3、PostgreSQL 和 Redis，
部署在 Kubernetes，目前关注接口性能优化。
```

摘要可以降低上下文占用，但摘要本身也可能遗漏“不允许在生产环境执行 FLUSHALL”之类的重要约束。因此，长期稳定且影响业务决策的信息不应只保存在自然语言摘要里。

### 结构化长期记忆

关键状态更适合以结构化数据保存：

```python
conversation_state = {
    'language': 'zh-CN',
    'project': {
        'framework': 'Spring Boot 3',
        'database': 'PostgreSQL',
        'cache': 'Redis',
        'deployment': 'Kubernetes',
    },
    'constraints': [
        '生产环境禁止执行 Redis FLUSHALL',
    ],
}
```

应用在需要时将这些状态重新注入上下文，不必依赖数百轮原始消息。成熟系统通常会区分：

| 类型 | 主要作用 | 示例 |
|---|---|---|
| 短期上下文 | 保持当前对话连贯 | 最近 10 轮消息 |
| 长期记忆 | 保存稳定的用户或任务状态 | 语言偏好、项目技术栈 |
| 外部知识 | 提供可检索的事实资料 | 产品文档、企业知识库 |

RAG、长期记忆和聊天历史并不是同一种数据，但最终都要回答同一个问题：这一轮模型应该看到什么？

### 工具输出也要精简

Function Calling 会把工具调用和结果加入会话状态。后续用户问“那物流到哪里了”时，模型需要知道前面查询的是哪个订单。

但工具不应把完整数据库对象、内部日志和无关字段全部返回给模型：

```json
{
  "order_id": "10001",
  "status": "SHIPPED",
  "latest_location": "上海转运中心"
}
```

最小化 Tool Output 既能降低 Token 消耗，也能缩小敏感数据泄露和 Prompt Injection 的攻击面。

## 会话状态如何落地

### 用户与会话必须隔离

一个用户可以同时讨论 Java、数据库和旅行计划，因此不能只按照 `user_id` 保存一个最新 Response。更合理的关系是一个用户拥有多个 Conversation，每个 Conversation 独立维护状态。

可以至少设计两张表：

| `ai_conversation` 字段 | 含义 |
|---|---|
| `id` | 本地会话 ID |
| `user_id` | 所属用户 |
| `title` | 会话标题 |
| `provider` / `model` | 模型信息 |
| `last_response_id` | 最新 Response ID |
| `provider_conversation_id` | 外部 Conversation ID |
| `created_at` / `updated_at` | 生命周期信息 |

| `ai_message` 字段 | 含义 |
|---|---|
| `id` | 消息 ID |
| `conversation_id` | 所属会话 |
| `role` | `user` / `assistant` |
| `content` | 展示内容 |
| `response_id` | 对应的模型 Response |
| `created_at` | 创建时间 |

如果系统包含 Function Calling，还可以单独保存工具名称、参数、结果、Call ID 和执行状态，以便审计与故障恢复。

### 不要只存在进程内存

下面这样的字典可以用于本地 Demo：

```python
self.sessions[conversation_id] = response.id
```

但它不能直接用于生产环境。服务重启会丢失数据，多实例部署时不同实例也无法共享状态。常见的职责分配包括：

| 数据 | 常见存储位置 |
|---|---|
| 产品聊天记录 | MySQL / PostgreSQL |
| 短期会话状态 | Redis |
| 用户长期状态 | 业务数据库 |
| 模型会话状态 | Conversations API |
| 可检索记忆 | 向量数据库 |

前端可以携带本地 `conversation_id`，但服务端必须检查该会话是否属于当前登录用户。否则攻击者可能通过猜测 ID 访问其他用户的会话，形成典型的 IDOR 越权问题。

### 一个基础聊天服务

下面的代码展示了本地会话 ID 与 `previous_response_id` 的基本组合：

```python
from openai import OpenAI


class ChatService:
    def __init__(self):
        self.client = OpenAI()
        self.sessions: dict[str, str] = {}
        self.instructions = (
            '你是一名软件工程技术助手。'
            '使用中文回答，不确定的信息需要明确说明。'
        )

    def chat(self, conversation_id: str, message: str) -> str:
        request = {
            'model': 'gpt-5.6',
            'instructions': self.instructions,
            'input': message,
        }

        previous_response_id = self.sessions.get(conversation_id)
        if previous_response_id:
            request['previous_response_id'] = previous_response_id

        response = self.client.responses.create(**request)
        self.sessions[conversation_id] = response.id
        return response.output_text
```

真实项目还需要把 `sessions` 替换为共享存储，并补充用户鉴权、并发更新、失败重试、幂等和审计。如果同一个会话允许并发发消息，还要避免两个请求同时基于同一个旧 Response 产生意外分支。

## 数据生命周期与安全边界

### 明确谁负责保存什么

Response 对象默认保存 30 天，可以通过 `store=False` 禁用这种默认存储。Conversation 对象及其中的 Item 不受该 30 天 TTL 限制，因此选择 Conversations API 时应同时设计删除、归档和用户数据生命周期策略。

流式输出不会改变上述关系。Streaming 解决的是结果如何传输，会话状态解决的是下一轮模型能看到什么。流式响应结束后，应用仍需保存 Response ID、聊天记录或 Conversation 状态。

### 只提供完成任务所需的数据

不要因为模型需要上下文，就把用户的全部资料放进 Prompt。过多信息会增加 Token、隐私风险和噪声，还会扩大 Prompt Injection 的影响范围。

尤其不应把以下数据未经处理地写入长期上下文：

- 密码、API Key 和 Access Token；
- 身份证号、银行卡等敏感身份信息；
- 与当前任务无关的订单、地址或聊天记录；
- 不应被模型或最终用户看到的内部字段。

应用的 Instructions 也不能直接由用户控制：

```python
# 错误：用户内容获得了应用规则的权限
instructions = user_input
```

开发者指令属于可信的应用策略；用户输入、网页、检索文档和 Tool Output 通常都应视为不可信数据。进入上下文不代表它们拥有修改系统规则的权限。

## Context Engineering

Prompt Engineering 主要关注“指令应该怎么写”，Context Engineering 更关注“模型这一轮应该看到什么”。一个较完整的上下文可以由以下部分组成：

```text
固定应用规则
+ 结构化用户或任务状态
+ 历史摘要
+ 最近消息
+ 相关长期记忆
+ RAG 检索结果
+ 必要的工具结果
+ 当前输入
```

这不是要求每次都提供所有部分，而是要求应用根据当前任务主动选择。上下文不是越多越好，正确、相关、可信且足够完成任务才是目标。

## 总结

多轮对话的本质，是在每次推理时为模型提供必要的历史状态，而不是让模型无限保存所有内容。

手动传递历史拥有最高控制力；`previous_response_id` 适合快速建立 Response Chain；Conversations API 适合长期存在的会话。无论选择哪一种，生产系统仍需处理会话隔离、上下文窗口、摘要与裁剪、持久化、权限控制和数据生命周期。

随着历史不断增长，Token 数量、上下文窗口和调用成本会成为下一个关键问题。理解这些限制，才能进一步设计可控的长对话系统。

## 参考资料

- [OpenAI Conversation state 官方文档](https://developers.openai.com/api/docs/guides/conversation-state)。
