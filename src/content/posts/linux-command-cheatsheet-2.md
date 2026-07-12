---
title: Linux Command Cheatsheet 2
published: 2025-10-26
description: ''
image: '../../assets/images/posts/linux/linux-profile.webp'
tags: ['linux', 'os']
category: 'Development'
draft: false
lang: ''
---

这一篇继续整理 Linux 常用命令，主要覆盖文本处理、压缩归档、磁盘查看、网络排查以及用户切换相关内容。和上一篇相比，这一篇会更偏向“日常运维”和“命令组合使用”。

## 文档操作命令

### `wc`

`wc`用于统计文件的行数、单词数、字符数或字节数，名称来源于word count。它很适合快速了解一个文件的大致规模。

```shell
wc <file>         # 显示行数、单词数、字节数
wc -l <file>      # 只统计行数
wc -w <file>      # 只统计单词数
wc -c <file>      # 只统计字节数
wc -m <file>      # 只统计字符数
```

### `split`

`split`用于把一个大文件拆分成多个小文件，常用于切分日志、导出文件或大文本。

```shell
split -l 1000 big.log chunk_      # 每1000行拆分为一个文件，前缀为 chunk_
split -b 10M backup.tar part_     # 每10MB拆分一个文件
split -d -l 5000 data.txt part_   # 使用数字后缀拆分
```

拆分后的文件名通常类似：`chunk_aa`、`chunk_ab`、`part_00`、`part_01`。

### `cut`

`cut`用于按列提取文本内容，适合处理以分隔符组织的数据，例如CSV、日志、配置文件等。

```shell
cut -d ',' -f 1 users.csv         # 提取第1列
cut -d ':' -f 1,7 /etc/passwd     # 提取第1列和第7列
cut -c 1-10 file.txt              # 提取每行的第1到10个字符
```

- `-d`：指定分隔符
- `-f`：指定字段
- `-c`：按字符位置截取

### `paste`

`paste`用于把多个文件按列横向合并。它和`cat`的区别在于，`cat`是纵向拼接，`paste`是横向拼接。

```shell
paste names.txt scores.txt                # 按列合并两个文件
paste -d ',' names.txt scores.txt         # 指定分隔符为逗号
paste -s items.txt                        # 串行输出，把多行转成一行
```

### `sort`

`sort`用于对文本内容进行排序，可以按字典序、数字大小、月份、指定列等方式排序。

```shell
sort names.txt                    # 默认按字典序升序排序
sort -r names.txt                 # 逆序排序
sort -n numbers.txt               # 按数字大小排序
sort -k 2 data.txt                # 按第2列排序
sort -t ',' -k 3 users.csv        # 指定分隔符并按第3列排序
sort -u names.txt                 # 排序并去重
```

### `uniq`

`uniq`用于去除相邻的重复行，因此它通常与`sort`搭配使用。

```shell
uniq names.txt                    # 去除相邻重复行
sort names.txt | uniq             # 先排序再去重
uniq -c names.txt                 # 统计重复次数
uniq -d names.txt                 # 只显示重复的行
uniq -u names.txt                 # 只显示未重复的行
```

{% note blue fa-circle-info %}`uniq`只能处理相邻的重复项，如果重复内容分散在文件不同位置，通常要先执行`sort`。{% endnote %}

### `diff` / `patch`

`diff`用于比较两个文件的差异，`patch`用于根据差异文件自动应用修改。它们经常一起使用，也是很多代码补丁工具的基础。

```shell
diff old.txt new.txt                      # 比较两个文件
diff -u old.txt new.txt                   # 以 unified 格式输出差异
diff -r dir1 dir2                         # 递归比较两个目录
diff -u old.txt new.txt > change.patch    # 生成补丁文件
patch old.txt < change.patch              # 把补丁应用到文件
patch -p1 < fix.patch                     # 常见于项目根目录应用补丁
```

### `sed`

`sed`是流编辑器，常用于查找、替换、删除、插入文本，非常适合批量处理文本文件。

```shell
sed 's/foo/bar/' file.txt                 # 每行只替换第一个 foo
sed 's/foo/bar/g' file.txt                # 全局替换
sed -n '1,5p' file.txt                    # 只打印第1到5行
sed '3d' file.txt                         # 删除第3行
sed -i 's/old/new/g' config.ini           # 直接修改文件内容
```

- `s/old/new/`：替换操作
- `g`：全局替换
- `-n`：关闭默认输出
- `-i`：直接修改原文件

### `du`

`du`用于查看文件或目录占用的磁盘空间，适合快速找出“谁最占地方”。

```shell
du -sh .                          # 查看当前目录总大小
du -h --max-depth=1 .             # 查看当前目录下各一级子目录大小
du -ah logs                       # 显示目录和文件的大小
du -sh *                          # 查看当前目录下每个项目的大小
```

### `df`

`df`用于查看文件系统的磁盘使用情况，例如总容量、已使用空间、可用空间和挂载点。

```shell
df -h                             # 以人类可读方式显示磁盘使用情况
df -i                             # 查看 inode 使用情况
df -h /home                       # 查看指定路径所在分区的使用情况
```

### `tar`

`tar`用于打包和解包文件，常与`gzip`或`bzip2`配合使用，适合目录备份与分发。

```shell
tar -cvf archive.tar dir/                 # 打包目录
tar -xvf archive.tar                      # 解包 tar 文件
tar -czvf archive.tar.gz dir/             # 打包并使用 gzip 压缩
tar -xzvf archive.tar.gz                  # 解压 tar.gz 文件
tar -tvf archive.tar                      # 查看归档内容
```

常见参数：

- `-c`：创建归档
- `-x`：解压归档
- `-v`：显示详细过程
- `-f`：指定文件名
- `-z`：使用 gzip 压缩

### `zip` / `unzip`

`zip`和`unzip`用于创建和解压`.zip`压缩文件，在跨平台传输文件时非常常见。

```shell
zip archive.zip file.txt                  # 压缩单个文件
zip -r project.zip project/               # 递归压缩目录
unzip archive.zip                         # 解压到当前目录
unzip archive.zip -d output_dir           # 解压到指定目录
unzip -l archive.zip                      # 查看压缩包内容
```

## 网络操作命令

### `route`

`route`用于查看或修改系统的路由表。虽然现代系统中更常用`ip route`，但很多场景下仍然会见到`route`命令。

```shell
route -n                                 # 以数字形式显示路由表
route add default gw 192.168.1.1         # 添加默认网关
route del default                        # 删除默认路由
```

### `ping`

`ping`用于测试与目标主机之间的网络连通性，它通过发送ICMP回显请求来判断目标是否可达。

```shell
ping 8.8.8.8                             # 持续检测网络连通性
ping -c 4 example.com                    # 只发送4次请求
ping -i 2 example.com                    # 每2秒发送一次
ping -W 2 192.168.1.1                    # 设置超时时间
```

### `ifconfig`

`ifconfig`用于查看或配置网络接口信息，比如IP地址、子网掩码、MAC地址等。现代发行版更多使用`ip addr`替代它。

```shell
ifconfig                                 # 查看所有启用的网卡信息
ifconfig -a                              # 查看所有网卡，包括未启用的
ifconfig eth0                            # 查看指定网卡信息
sudo ifconfig eth0 down                  # 禁用网卡
sudo ifconfig eth0 up                    # 启用网卡
```

### `netstat`

`netstat`用于查看网络连接、监听端口、路由信息和网络统计数据。虽然很多系统推荐改用`ss`，但`netstat`仍然很常见。

```shell
netstat -tuln                            # 查看正在监听的 TCP/UDP 端口
netstat -an                              # 显示所有连接
netstat -rn                              # 查看路由表
netstat -p                               # 显示连接对应的进程
```

- `-t`：TCP
- `-u`：UDP
- `-l`：监听状态
- `-n`：使用数字格式显示地址和端口

### `telnet`

`telnet`原本是远程登录协议，现在更多被用于测试某个主机的某个端口是否可以建立连接。

```shell
telnet 127.0.0.1 80                      # 测试本机80端口是否可连接
telnet mail.example.com 25               # 测试邮件服务端口
```

{% note red fa-triangle-exclamation %}`telnet`传输内容默认不加密，不适合在生产环境中进行敏感登录操作。{% endnote %}

### `ssh`

`ssh`用于安全地远程登录服务器，也可以执行远程命令、进行端口转发和隧道代理，是 Linux 运维中最核心的远程连接工具之一。

```shell
ssh user@192.168.1.10                    # 远程登录服务器
ssh -p 2222 user@host                    # 指定端口连接
ssh user@host "ls -lah"                  # 执行远程命令
ssh -i ~/.ssh/id_rsa user@host           # 指定私钥文件
scp file.txt user@host:/tmp/             # 复制文件到远程主机
```

### `ftp`

`ftp`用于连接FTP服务器并进行文件上传、下载和目录浏览。它现在已经不像以前那样常用，但在老系统中仍然可能遇到。

```shell
ftp ftp.example.com                      # 连接 FTP 服务器
```

连接后常见命令：

- `ls`：查看远程目录
- `get file.txt`：下载文件
- `put file.txt`：上传文件
- `bye`：退出连接

### `tcpdump`

`tcpdump`用于抓取和分析网络数据包，是排查网络问题时非常强大的工具。

```shell
sudo tcpdump -i any                      # 抓取所有网卡的数据包
sudo tcpdump -i eth0 port 80             # 抓取指定网卡80端口流量
sudo tcpdump host 192.168.1.10           # 抓取与指定主机相关的数据包
sudo tcpdump -nn -c 20                   # 抓20个包并禁止名称解析
```

如果你只想先快速判断是否有流量经过，`tcpdump -i any`通常就足够有帮助。

## 用户相关命令

### `su`

`su`表示switch user，用于切换到另一个用户，默认切换到`root`用户。

```shell
su                                      # 切换到 root
su -                                    # 切换到 root 并加载其环境变量
su - nginx                              # 切换到 nginx 用户并加载环境
su user                                 # 切换到指定用户
```

`su -`与`su`的区别在于，前者会模拟一次完整登录，会读取目标用户的环境配置。

### `sudo`

`sudo`用于以其他用户（通常是`root`）的身份执行命令。相比直接使用`su`，`sudo`更安全，也更适合细粒度授权。

```shell
sudo apt update                         # 以管理员身份执行命令
sudo -u postgres psql                   # 以 postgres 用户身份执行命令
sudo -l                                 # 查看当前用户可执行的 sudo 权限
sudo !!                                 # 以上一条命令重新执行，并加上 sudo
```

在生产环境中，优先使用`sudo`而不是长期保持 root 身份，是一个更安全的习惯。

---

:::note[Reference]
- [Top 50+ Linux Commands You MUST Know](https://www.digitalocean.com/community/tutorials/linux-commands)
- [Linux man pages online](https://man7.org/linux/man-pages/)
:::
