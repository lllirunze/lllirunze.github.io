---
title: MacBook UTM Ubuntu 内外网访问配置
published: 2026-08-16
description: '一篇精简版指导文档：在 MacBook 上通过 UTM 运行 Ubuntu 时，如何同时访问普通网络和需要代理的网站。'
image: '../../assets/images/posts/linux/linux-profile.webp'
tags: ["ubuntu", "linux", "network"]
category: 'Development'
draft: false
lang: ''
---

在 MacBook 上用 UTM 安装 Ubuntu 之后，虚拟机通常可以直接上网，但只能走 MacBook 的普通网络出口。  
如果你还希望 Ubuntu 访问 Google、ChatGPT、OpenAI 这类需要代理的网站，就需要把 MacBook 上的代理能力显式共享给虚拟机。

这篇文章只保留最核心的配置步骤。

## 网络结构

推荐先确认 UTM 的网络模式是：

```text
Shared Network
```

这时整体网络关系可以理解成：

```text
Ubuntu
  ↓
UTM Shared Network
  ↓
MacBook
  ↓
Internet
```

如果 MacBook 上还运行了 Clash，并开启了 HTTP 代理，例如：

```text
127.0.0.1:7890
```

那么 Ubuntu 想走代理时，不能使用 `127.0.0.1`，因为这代表的是 Ubuntu 自己，而不是 MacBook。  
Ubuntu 应该访问的是 MacBook 在 UTM 虚拟网络中的地址，常见情况下就是：

```text
192.168.64.1:7890
```

## 基础联网检查

先在 Ubuntu 里确认基础网络是否正常：

```bash
ip addr
ip route
ping -c 4 8.8.8.8
ping -c 4 baidu.com
```

如果你能看到类似下面的默认路由：

```text
default via 192.168.64.1 dev enp0s1
```

并且 `ping 8.8.8.8`、`ping baidu.com` 成功，就说明：

- UTM 共享网络工作正常
- Ubuntu 已经能通过 MacBook 访问普通互联网

这一步通过后，再处理代理访问。

## 让 Ubuntu 走 MacBook 代理

先在 MacBook 的 Clash 中开启：

```text
Allow LAN
```

也就是“允许局域网连接”。否则 Ubuntu 无法访问 MacBook 上的代理端口。

然后在 Ubuntu 中直接测试：

```bash
curl -x http://192.168.64.1:7890 https://www.google.com
```

如果返回了网页内容，或者看到 `200`、`301`、`302` 之类的响应，就说明代理链路已经打通：

```text
Ubuntu
  ↓
192.168.64.1:7890
  ↓
MacBook Clash
  ↓
Google / ChatGPT / OpenAI
```

如果你不想每次都手写 `-x`，可以临时给终端加上代理环境变量：

```bash
export HTTP_PROXY=http://192.168.64.1:7890
export HTTPS_PROXY=http://192.168.64.1:7890
export http_proxy=http://192.168.64.1:7890
export https_proxy=http://192.168.64.1:7890
```

这时就可以直接测试：

```bash
curl -I https://www.google.com
curl -I https://chatgpt.com
```

查看当前代理配置：

```bash
env | grep -i proxy
```

如果希望每次打开终端都自动生效，可以把上面的 `export` 写进：

```bash
~/.bashrc
```

写完后执行：

```bash
source ~/.bashrc
```

如果后面想临时关闭代理：

```bash
unset HTTP_PROXY
unset HTTPS_PROXY
unset http_proxy
unset https_proxy
```

## 浏览器与常见问题

终端代理只影响 `curl`、`git`、`npm` 这类终端程序，不一定影响 Firefox 之类的桌面应用。  
如果 Ubuntu 里的 Firefox 也要走代理，可以到：

```text
Firefox
→ Settings
→ Network Settings
→ Manual proxy configuration
```

填写：

```text
HTTP Proxy: 192.168.64.1
Port: 7890
```

HTTPS 同样填写 `192.168.64.1:7890` 即可。

另外有两个常见误区：

1. `ping google.com` 失败，不代表代理失败。  
   `ping` 走的是 ICMP，不会使用 HTTP 代理；真正应该用来验证的是：

```bash
curl -I https://www.google.com
```

2. Ubuntu 不会自动继承 MacBook 上的代理设置。  
   MacBook 能访问 Google，不等于 Ubuntu 也能；虚拟机要单独配置到 MacBook 的代理端口。

## 总结

整件事其实可以概括成两步：

- 先用 UTM 的 `Shared Network` 让 Ubuntu 具备普通上网能力
- 再让 Ubuntu 通过 `192.168.64.1:7890` 使用 MacBook 上的 Clash 代理

这样就能实现：

```text
普通网站 -> 直接访问
Google / ChatGPT / OpenAI -> 通过 MacBook 代理访问
```
