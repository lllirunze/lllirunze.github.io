---
title: NJU ICS PA0
published: 2025-01-27
description: '南京大学计算机科学与技术系计算机系统基础课程实验-PA0'
image: '../../assets/images/posts/nju-ics/Snipaste_2025-02-05_19-36-48.png'
tags: ['nju-ics']
category: 'Project'
draft: false 
lang: ''
---

## 前言

我在2020年秋季其实已经写过一个[天津大学的NEMU实验](https://github.com/superpung/TJU-CourseSharing/tree/main/2440072_%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%E7%BB%BC%E5%90%88%E5%AE%9E%E8%B7%B5)，这是一个根据南京大学ICS-PA改编的计算机系统综合实践课程，我们写的是x86版本。但是，因为一些众所周知的原因（Ctrl-C + Ctrl-V），我其实并没有完全理解这个实验的内容（都是抄同学的），而且实验也只是进行到PA3课程就结束了。

因此我打算重新做一遍完整的NJU-ICS-PA，算是重温一下这个南上加南的实验。实验代码已放到[这里](https://github.com/lllirunze/nju-ics-pa)。

::github{repo="lllirunze/nju-ics-pa"}

### 虚拟机安装Ubuntu Linux

1. [VMware Workstation](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion)
2. [Ubuntu](https://ubuntu.com/download/desktop)
3. [vmware安装ubuntu教程](https://blog.csdn.net/weixin_41805734/article/details/120698714)：还有很多教程，仅供参考

ps：vmware的安装网址好像和往年有所不同，大家请自行查找即可

### 在github上添加ssh key

```shell
ssh-keygen -t rsa -C "lirunze.me@gmail.com"
```

输出结果之后复制`~/.ssh/id_rsa.pub`里的内容之后粘贴到Github就行了。

### `make menuconfig`为什么会报错

缺少了`bison`和`flex`库，在终端输入

```shell
sudo apt-get install bison
sudo apt-get install flex
```

---

:::note[Reference]
- [南京大学 计算机科学与技术系 计算机系统基础 课程实验 2024](https://nju-projectn.github.io/ics-pa-gitbook/ics2024/)
:::
