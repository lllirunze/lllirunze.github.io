---
title: Git Guides
published: 2025-01-31
description: 'From beginners to advanced, learn how to effectively manage code versions, collaborate on development.'
image: '../../assets/images/posts/git/git-github.png'
tags: ["git"]
category: 'Guides'
draft: false 
lang: ''
---

**Git**是一个分布式版本控制系统，它能够帮助我们管理代码历史记录，并且支持多人协作开发。在软件开发中，使用Git来管理版本和协作开发已经成为了标准实践。本文列举了一些常用的Git操作。

## 安装Git

- Windows：[link](https://git-scm.com/downloads)
- Ubuntu Linux：`sudo apt-get install git`
- CentOS Linux：`sudo yum install git`
- MacOS：`brew install git`

## 配置Git

```shell
git config --global user.name "xxx"           # 配置用户名
git config --global user.email "xxx@xxx.xxx"  # 配置邮箱
git config --global color.ui true             # 配置颜色
git config --global core.editor vim           # 配置git使用的编辑器，以vim为例
```

## Git常用操作

### 创建Git仓库

```shell
git init
```

### 克隆现有仓库

```shell
git clone git@github.com:lllirunze/lllirunze.git
```

### 查看仓库状态

```shell
git status
```

### 添加文件到暂存区

```shell
git add <file>  # (1)添加指定文件
git add .       # (2)添加所有文件
```

### 提交更改

```shell
git commit          # (1)打开指定编辑器，编写提交内容
git commit -m "xxx" # (2)直接将xxx的提交内容添加到暂存区
```

### 查看提交历史

```shell
git log
```

### 版本回退

我们通过`git log`找到要回退的版本后，根据对应的`commit id`，执行如下操作（版本号不用写全，写前几位就行了）。

```shell
git reset <commit id>
```

## Git分支管理

### 查看目前所在分支

```shell
git branch
```

### 创建新分支

```shell
git branch <new branch>
```

### 切换分支

```shell
git checkout <branch>         # (1) 切换到已有分支
git checkout -b <new-branch>  # (2) 创建新分支并切换至此
```

### 合并分支

在一个分支上完成工作后，我们先切换回主分支上再进行`merge`操作。

```shell
git checkout <main-branch>
git merge <other-branch>
```

### 删除分支

```shell
git branch -d <branch>
```

## 远程仓库操作

在添加远程仓库之前（以GitHub为例），我们需要为本机创建SSH key，并将其粘贴到GitHub账户中。

```shell
ssh-keygen -t rsa -C "xxx@xxx.xxx"
```

一路回车获取默认值就行。后续我们可以在用户主目录中找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件。我们将`id_rsa.pub`中的内容复制到GitHub的SSH密钥配置界面中即可。

:::tip
GitHub主页->点击右上角头像->Settings->SSH and GPG keys->New SSH key
:::

### 为本地添加远程仓库

```shell
git remote add origin git@github.com:lllirunze/lllirunze.git
```

### 查看当前配置的远程仓库

```shell
git remote -v
```

### 推送到远程仓库

```shell
git push <remote branch> <local branch>
```

一般来说，`origin`为远程仓库的默认名称，`<local branch>`是我们推送的分支名。

### 拉取远程仓库的最新内容

```shell
git pull origin <local branch>
```

### 删除远程仓库的链接

```shell
git remote remove origin
```

---

:::note[Reference]
- [Git教程-廖雪峰的官方网站](https://liaoxuefeng.com/books/git/)
- [GitHub Training Kit](https://github.github.com/training-kit/)
:::
