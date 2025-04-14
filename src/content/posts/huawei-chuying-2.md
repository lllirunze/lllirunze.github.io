---
title: 雏鹰计划-编程工具演练
published: 2025-04-08
description: '该文章讲述公司的代码开发流程。'
image: ''
tags: ['雏鹰计划', 'git']
category: 'Guides'
draft: false 
lang: ''
---

## Git基础和实操

### 版本控制工具简介

版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统，查看历史、恢复版本，保证多人协作不出问题。

原始的版本控制是通过修改文件并保存文件副本来实现的，但命名随意，导致版本难辨新旧，无法辨别每一版的修改内容。

有一些比较远古的版本控制工具：

- diff：用来比较两个文件或者目录之间的差异`diff -u left.c right.c`
- patch：diff的反向操作，我们把上述差异结果保存到文件中，假设差异结果为diff.txt
  - `patch left.c diff.txt`：通过diff.txt，把left.c变成right.c
  - `patch -R right.c diff.txt`：通过diff.txt，把right.c变成原来left.c的内容

最早期的本地版本控制工具为RCS（Revision Control System）

集中式版本控制工具：CVS（Concurrent Versions System）和SVN（Subversion），但是存在问题：

- 提交通道狭窄：不能同时修改、缺乏代码门禁
- 数据安全性差：单点故障、黑客攻击

分布式版本控制系统：BitKeeper、Git

Git是Linus（Linux之父）的第二个伟大作品。和其他版本控制系统相比，Git的差别在于**对待数据的方法**，Git像是把数据看作是对小型文件系统的一组快照，每次提交更新时，它主要对当时的全部文件制作一个快照并保存这个快照的索引，变成一个**快照流**。如果其中一个版本受到破坏，其他任何一个版本都不会受到影响。Git的好处如下：

- 数据安全
- 提交为本地操作，编码不会被冲突打断，可以移动办公
- 数据和提交全部使用SHA1哈希，以保证完整性
- 适合分布式开发，强调个体

如何选择适合的版本控制工具：

- SVN不适合的领域：
  - 跨地域的协同开发
  - 对代码的高质量追求和代码门禁
- Git不适合的领域
  - 不适合word等二进制文档的版本控制
  - 整体的读授权，不饿能将读授权精细到目录级别

### Git的安装和配置

在Linux下安装Git：

- Ubuntu或Debian
  - `sudo aptitude install git`
  - `sudo aptitude install git-doc git-svn git-email gitk`
- RHEL、Fedora、CentOS
  - `yum install git`
  - `yum install git-svn git-email gitk`
- 从源代码开始安装

在Windows下安装Git：到git-scm网站下安装windows安装包，直接下载就行，安装过程中选择一些必要的组件（建议把git-lfs去掉），在选择是否修改环境变量时，选择“Use Git Bash Only”。安装完成后，右击屏幕并选中Git Bash就可以启动了。

另外有一个基于msysGit的图形界面工具：TortoiseGit（小乌龟），直接到官网安装就可以。

Git基本配置：

- 配置个人身份：
  - 系统配置（适用于所有用户）：`git config --system xxx`
  - 用户配置（适用于当前用户）：`git config --global xxx`
  - 仓库配置（适用于当前项目）：`git config --local xxx`
  - 配置个人身份：
    - `git config --global user.name "Zhangsan"`
    - `git config --global user.email zhangsan123@huawei.com`
- 文本换行符配置：
  - `git config --global core.autocrlf [true|input|false]`
- 文本编码配置
  - 中文编码支持：
    - `git config --global gui.encoding utf-8`
    - `git config --global i18n.commitencoding utf-8`
    - `git config --global i18n.logoutputencoding utf-8`
  - 显示路径中的中文
    - `git config --global core.quotepath false`
- 与服务器的认证配置
  - http/https协议认证：
    - 设置口令缓存：`git config --global credential.helper store`
    - 添加https证书信任：`git config http.sslverify false`
  - ssh协议认证
    - 输入`ssh-keygen -t rsa -C zhangsan123@huawei.com`生成公钥
    - 添加公钥到代码平台：进入代码平台的settings，找到SSH Keys，把公钥文件的内容复制到Public Key中保存

### Git基本命令

Git版本控制下的工程区域只有3种：

1. 版本库：工作区中有一个隐藏目录.git，这个就是版本库，存放Git用来管理该工程的所有版本数据
2. 工作区：日常工作的代码文件或者文档所在的文件夹
3. 暂存区：一般放在工程根目录.git/index文件中，也叫索引index

Git版本控制下的文件状态有3种：

1. 已提交commit
2. 已修改modify
3. 已暂存stage

Git常用命令如下：

```shell
# 工程准备
git init              # 在本地目录下新建项目仓库
git [lfs] clone [URL] # 克隆远端工程到本地磁盘，如果所在的项目git服务器已经支持了git-lfs，对二进制文件进行了区别管理，那么克隆工程的时候务必使用git lfs clone，否则克隆操作无法下载到工程中的二进制文件导致工程内容不完整。

# 新增、删除、移动文件到暂存区
git add [file]                      # 把文件添加到暂存区，此时还没有提交
git rm [file]                       # 将指定文件彻底从当前分支的缓存区删除，因此它从当前分支的下一个提交快照中被删除
git mv [old_file] [folder|new_file] # 用于移动文件，也可以用于重命名文件

# 查看工作区
git diff [version1] [version2]              # 比较两个节点之间的差异
git diff [branch1]..[branch2]               # 比较两个分支之间的差异
git diff --cached                           # 比较当前索引和上次提交之间的差异
git diff [branch1]..[branch2] --name-status # 比较两个分支之间的差异，只看文件列表
git status                                  # 用于显示工作目录和暂存区的状态

# 提交更改的文件
git commit            # 将暂存区里的文件改动提交到本地的版本库
git commit -am "xxx"  # 一次性提交所有在暂存区改动的文件到版本库

# 查看日志
git log

# 推送远端仓库
git push [local_branch] [remote_branch] # 在使用git commit命令将自己的修改从暂存区提交到本地版本库后，可以使用push将本地版本库的分支推送到远程服务器上对应的分支

# 分支管理
git branch                                      # 查看本地工程的所有git分支名称
git branch -r                                   # 查看远端服务器上的分支
git branch -a                                   # 查看本地和远端的所有分支
git branch [branch]                             # 新建分支（但不会切换到新分支）
git branch -d [branch]                          # 删除分支
git branch -D [branch]                          # 强制删除分支
git branch -d -r [branch]                       # 删除远端分支
git checkout [branch]                           # 切换已有分支
git checkout -b [branch]                        # 新建分支（自动切换到新分支）
git checkout -f [branch]                        # 强制切换到已有分支
git pull origin [remote_branch]:[local_branch]  # 从远端服务器中获取某个分支的更新，再与本地指定的分支进行自动合并
git pull origin [remote_branch]                 # 如果远程指定的分支和本地指定的分支相同，直接pull更新
git fetch origin [remote_branch]:[local_branch] # 从远端服务器中获取某个分支的更新，但不会进行合并操作，确认fetch内容符合预期后，再决定是否手动合并节点
git fetch origin [remote_branch]                # 如果远程指定的分支和本地指定的分支相同，fetch更新

# 分支合并
git merge [branch]  # 从指定的分支合并到当前分支的操作
git rebase [branch] # 合并目标分支到当前分支

# 撤销操作
git reset [commit_id] # 将工作区内容回退到历史提交节点
git checkout .        # 用于回退本地所有修改但未提交的内容（有风险，谨慎使用）
git checkout -[file]  # 仅回退某个文件的未提交改动
```

## IDEA常用快捷键

| 快捷键            | 意义                               |
| ----------------- | ---------------------------------- |
| alt+insert        | 新建                               |
| alt+上下箭头      | 以函数为单位移动                   |
| ctrl+g            | 定位到行                           |
| ctrl+w            | 可以选择单词继而语句继而行继而函数 |
| ctrl+shift+w      | 取消选择光标所在词                 |
| shift+shift       | 查找任意文件                       |
| ctrl+n            | 查找java类                         |
| ctrl+f            | 查找                               |
| ctrl+r            | 替换                               |
| f4                | 进入某一方法或者到变量定义处       |
| ctrl+f12          | 查看方法和成员变量                 |
| ctrl+alt+左右箭头 | 回退/前进到上一次编辑处            |
| ctrl+d            | 复制一行                           |
| ctrl+y            | 删除一行                           |
| ctrl+ /           | 选中一段进行注释/反注释            |
| shift+f6          | 重命名                             |
| ctrl+alt+m        | 抽取函数                           |
| ctrl+alt+v        | 抽取变量                           |
| ctrl+shift+f9/f10 | 调试/运行测试用例                  |
| ctrl+f8           | 打断点/取消断点                    |
| shift+f9/f10      | 调试/运行                          |
| f7                | 进入函数                           |
| f8                | 单步                               |
| f9                | 到下一个断点或者结束               |
| alt+f8            | 查看表达式结果                     |

- [IntelliJ-IDEA-Tutorial](https://youmeek.gitbooks.io/intellij-idea-tutorial/content/introduce.html)
- [IntelliJ IDEA神器使用技巧](https://www.bilibili.com/video/BV1Ft411V7rf?vd_source=26ff51a077492205b3143e873e64057f)
