---
title: Android Permission
published: 2026-02-06
description: '不要对系统行为做任何假设。'
image: '../../assets/images/posts/android/android-1.png'
tags: ["android", "front-end"]
category: 'Development'
draft: false 
lang: ''
---

最近在忙着进行新产品功能的冲刺，傻逼测试为了讨好领导，打着为使用者体验好的旗号一直提出一些正常人类根本不会执行出来的问题来给我们这帮开发提单子。其中有一个最傻逼的单子，它的内容是这样的：

> 当 APP 在运行过程中，临时进入后台修改应用权限，例如关闭位置权限，会导致软件重启。

测试执拗的认为这是一个崩溃问题。这个傻逼单子让我们一堆开发围着这个问题看了一整天，最后一个大佬从**安卓开发者文档**才得出结论：

> 为了让系统取消应用对权限的访问权限，必须终止与应用关联的所有进程。当您调用该 API 时，系统会确定何时可以安全终止这些进程。通常，系统会等待应用有较长时间在后台运行，而不是在前台运行时。

也就是说，任何一个安卓APP在后台修改应用权限都会导致应用重启，tb，zfb，dy等应用都是如此，这才让我们解决这个问题。（虽然这本来就不是问题）

希望测试体谅一下开发，保持最起码的专业能力，不要提出傻逼问题。

---

:::note[Reference]
- [请求运行时权限](https://developer.android.com/training/permissions/requesting?hl=zh-cn)
:::