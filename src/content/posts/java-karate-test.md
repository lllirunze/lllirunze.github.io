---
title: Java 项目 Karate 测试与 Mock 入门
published: 2026-08-23
description: '精简梳理 Karate 在 Java 项目中的位置、Feature 基础语法、Spring Boot 集成方式以及 Mock 使用边界。'
image: '../../assets/images/posts/java/java.webp'
tags: ["java", "karate", "back-end"]
category: 'Development'
draft: false
lang: ''
---

Karate 是一个运行在 Java/JVM 生态里的自动化测试框架，常用于 HTTP API 测试、接口回归测试、JSON/XML 校验，也可以用来启动 Mock Server。它最大的特点是：**接口测试用例主要写在 `.feature` 文件里，不需要像传统 BDD 框架那样为每一步额外写大量 Java glue code**。

这篇文章不展开所有细节，只整理 Java 项目里最常用的一条主线：

```text
Karate
  ↓ HTTP
Spring Boot Controller
  ↓
真实 Service
  ↓
Mock 外部依赖
```

也就是说，Karate 负责从接口外面发起请求，Mock 负责把系统外面的不稳定依赖隔离掉。

## Karate 适合解决什么问题

在一个常见的 Spring Boot 项目里，调用链大概是：

```text
Controller
  ↓
Service
  ↓
Client / SDK / DAO
  ↓
外部系统
```

如果测试时直接依赖真实外部系统，问题会很多：

- 外部系统可能不可用
- 测试数据不好构造
- 网络环境可能不稳定
- 异常场景不好模拟
- CI 环境可能无法访问外部服务

所以比较实用的接口测试方式是：

```text
Karate
  ↓
Spring Boot
  ↓
Controller
  ↓
Service
  ↓
Mock Client / SDK
```

这样既能让请求真正经过 HTTP、Controller、参数绑定、异常处理和响应序列化，又不需要依赖真实外围系统。

## Java 项目怎么接入

Maven 中一般引入 Karate JUnit 依赖即可：

```xml
<dependency>
    <groupId>io.karatelabs</groupId>
    <artifactId>karate-junit5</artifactId>
    <version>${karate.version}</version>
    <scope>test</scope>
</dependency>
```

然后写一个 JUnit Runner：

```java
import com.intuit.karate.junit5.Karate;

class DeviceKarateTest {

    @Karate.Test
    Karate testDeviceApi() {
        return Karate.run("device").relativeTo(getClass());
    }
}
```

对应的目录可以这样放：

```text
src
└── test
    ├── java
    │   └── com/example/runner/DeviceKarateTest.java
    └── resources
        ├── karate-config.js
        └── device
            └── device.feature
```

`karate-config.js` 用来放公共配置，例如接口地址：

```javascript
function fn() {
    var config = {
        baseUrl: 'http://localhost:8080'
    };

    return config;
}
```

在 Feature 文件中就可以直接使用：

```gherkin
* url baseUrl
```

## Feature 文件怎么写

Karate 的核心文件是 `.feature`。一个最简单的接口测试可以这样写：

```gherkin
Feature: Device API Test

Background:
    * url baseUrl

Scenario: 查询设备成功
    Given path '/device/10001'
    When method get
    Then status 200
    And match response.code == 0
    And match response.data.id == '10001'
```

常用语法其实不多：

- `url`：设置基础地址
- `path`：拼接请求路径
- `param` / `params`：设置 GET 参数
- `header` / `headers`：设置请求头
- `request`：设置请求体
- `method`：发送 HTTP 请求
- `status`：断言 HTTP 状态码
- `match`：断言响应内容
- `def`：定义变量
- `read`：读取 JSON、Feature 等外部文件
- `call`：复用另一个 Feature

POST 请求可以这样写：

```gherkin
Scenario: 创建设备成功
    Given path '/device'
    And request
    """
    {
        "id": "10001",
        "name": "AR1"
    }
    """
    When method post
    Then status 200
    And match response.code == 0
```

如果请求体比较大，建议放到单独的 JSON 文件里：

```text
src/test/resources/device/request/create-device.json
```

Feature 中读取：

```gherkin
* def body = read('request/create-device.json')

Given path '/device'
And request body
When method post
Then status 200
```

`match` 是 Karate 最重要的能力之一。它不仅能精确匹配，也能做模糊匹配：

```gherkin
And match response ==
"""
{
    code: '#number',
    message: '#string',
    data: '#object'
}
"""
```

常见占位符包括：

- `#string`
- `#number`
- `#boolean`
- `#object`
- `#array`
- `#null`
- `#notnull`

对于随机 ID、时间戳、UUID 这类字段，模糊匹配比写死值更稳定。

## Mock 应该怎么用

Mock 的核心目的不是“造假数据”，而是**隔离当前测试范围之外的依赖**。

例如业务代码里有一个外部客户端：

```java
@Service
public class DeviceService {

    private final DMClient dmClient;

    public DeviceService(DMClient dmClient) {
        this.dmClient = dmClient;
    }

    public Device queryDevice(String id) {
        return dmClient.queryDevice(id);
    }
}
```

测试接口时，我们通常不希望真的访问设备管理平台，而是把 `DMClient` 替换成 Mock：

```java
@SpringBootTest(
    classes = Application.class,
    webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT
)
@ActiveProfiles("test")
class DeviceApiTest {

    @MockitoBean
    private DMClient dmClient;

    @BeforeEach
    void setUp() {
        Device device = new Device("10001", "AR1");
        Mockito.when(dmClient.queryDevice("10001")).thenReturn(device);
    }
}
```

这里 `@MockitoBean` 的作用是：在 Spring 测试上下文中用 Mockito Mock 替换对应的 Bean。  
如果是 Spring Boot 3.4 之前的老项目，你可能会看到 `@MockBean`，它的作用类似，但新版本已经推荐迁移到 Spring Framework 提供的 `@MockitoBean`。

常见 Mockito 写法如下：

```java
// 固定返回
when(dmClient.queryDevice("10001")).thenReturn(device);

// 任意字符串参数
when(dmClient.queryDevice(anyString())).thenReturn(device);

// 模拟异常
when(dmClient.queryDevice("10001"))
        .thenThrow(new RuntimeException("query failed"));

// 验证调用
verify(dmClient, times(1)).queryDevice("10001");
```

需要注意的是，Mockito Mock 和 Karate Mock Server 不是同一件事：

- Mockito / `@MockitoBean`：Mock Java Bean，例如 `DMClient`
- Karate Mock Server：Mock 一个 HTTP Server，例如外部 REST API

如果依赖是 Spring Bean，优先考虑 `@MockitoBean`。  
如果真实代码通过 HTTP 调外部服务，可以考虑用 Karate Mock Server 起一个假的 HTTP 服务。

## 推荐实践

写 Karate 用例时，不建议从“代码里有几个 if”出发，而是从接口行为出发：

```text
Given 前置条件
When 用户发起请求
Then 接口应该返回什么
```

比如一个 `POST /device/reset` 接口，建议至少覆盖：

- 正常参数返回成功
- 必填参数为空
- 参数格式错误
- 设备不存在
- 下游 Client 抛异常
- 无权限或 token 失效

Feature 组织上，推荐一个场景一个 `Scenario`：

```gherkin
Feature: Reset Device API

Background:
    * url baseUrl
    * header Authorization = 'Bearer test-token'

Scenario: 正常恢复出厂
    ...

Scenario: deviceId 为空
    ...

Scenario: 设备不存在
    ...

Scenario: 下游服务异常
    ...
```

如果只是参数不同，可以使用 `Scenario Outline`：

```gherkin
Scenario Outline: 非法参数测试
    Given path '/device'
    And request { id: '<id>' }
    When method post
    Then status <status>

Examples:
    | id   | status |
    |      | 400    |
    | abc  | 400    |
    | 1001 | 200    |
```

最后再记住几个容易踩坑的点：

- 不要 Mock 你真正想测试的对象，比如测试 `DeviceService` 时不要把 `DeviceService` 自己 Mock 掉
- Mock 参数要匹配真实调用，复杂对象可以用 `any()` 或 `ArgumentCaptor`
- 多个 Bean 实现时要注意 `@Qualifier`
- 测试之间不要互相污染，必要时重置 Mock
- 大 JSON 放文件里，用 `read()` 读取，Feature 里只保留测试行为

## 总结

Karate 在 Java 项目里的定位可以概括成一句话：

> Karate 负责从接口外面测试系统，Mock 负责把系统外面的依赖隔离掉。

一套比较实用的测试分层是：

```text
Unit Test
  JUnit + Mockito
  测单个类或单个方法

API Integration Test
  Karate + SpringBootTest + Mockito
  通过 HTTP 测 Controller 到 Service 的真实链路

E2E Test
  Karate + 真实环境
  验证完整系统协作
```

对于大多数 Spring Boot 微服务，最常用、性价比最高的就是中间这一层：

```text
Karate
  ↓ HTTP
Controller
  ↓
Service
  ↓
Mock 外部 SDK / RPC / Client
```

这样既能覆盖真实接口行为，又能避免被外部系统状态拖住。

---

:::note[Reference]
- [Karate GitHub Repository](https://github.com/karatelabs/karate)
- [Spring Boot MockBean API](https://docs.spring.io/spring-boot/3.5/api/java/org/springframework/boot/test/mock/mockito/MockBean.html)
- [Spring Framework MockitoBean API](https://docs.spring.io/spring-framework/docs/6.2.x/javadoc-api/org/springframework/test/context/bean/override/mockito/MockitoBean.html)
:::
