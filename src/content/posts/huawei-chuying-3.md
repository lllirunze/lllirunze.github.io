---
title: 雏鹰计划-编程后台操作
published: 2025-04-14
description: '作为系统管理员，我们需要监控哪些项目？'
image: ''
tags: ['雏鹰计划', 'sql', 'linux']
category: 'Guides'
draft: false 
lang: ''
---

## 数据库

数据库database(DB)：以一定方式储存在一起，能为多个用户共享、具有尽可能小的冗余度、与应用数据彼此独立的数据集合，它具有完整性、共享性

数据库管理系统database management system(DBMS)：一种操纵和管理数据库的大型文件，用于建立、使用和维护数据库。它对db进行统一的管理和控制，以保证db的安全性、完整性、共享性等。

### 数据存储管理的发展阶段

- 人工管理：数据保存在磁带上，只能顺序读写、不能共享、数据冗余、一致性差
- 文件系统：数据以文件形式存储在磁盘上，应用程序和数据访问相对独立，无集中管理，数据冗余
- 数据库：结构化数据模型，数据和程序彼此独立，冗余度低，数据控制功能
- 大数据：数据量大，分布式计算，Hadoop，NoSQL

### 关系型数据库

关系型db是建立在关系模型基础上的db，借助于集合代数等数学概念和方法来处理db中的数据。

各种实体和实体之间的联系用关系模型表示。

标准数据查询语言SQL是一种基于关系数据库的语言，这种语言执行对关系数据库中的数据的检索和操作。

## SQL

结构化查询语言Structured Query Language(SQL)一些基本概念：

- 投影：选出列
- 选择：选出行
- 连接：从一张或多张表中选择出合适的行再进行查询

学习路线：

- [Mysql下载安装和配置方法](https://www.bilibili.com/video/BV1EJ411p7Ty)
- [SQL 教程 | 菜鸟教程](https://www.runoob.com/sql/sql-tutorial.html)

### select查询语句基础

```sql
select * | {[distinct] column | expression[alias],...} from table; # select基本语句
select column as another_name from table; # 重命名列标题
select col1, col2, col1||col2 as "Employees" from table; # 级联操作是将列或者字符串和其他列串联，用||表示
select distinct column from table; # 消除重复行
```

NULL值是不可用且未分配，未知并且不适用的值。

### 查询数据的限制与排序

```sql
select * | {[distinct] column | expression[alias],...}
from table
[where conditions] # 限制选择的行
[order by col1 [asc|desc], col2 [asc|desc], ...] # 按照某列排序，从左到右按序排序，默认升序
```

运算符：

| 操作符              | 描述                                              |
| ------------------- | ------------------------------------------------- |
| =                   | 等于                                              |
| >                   | 大于                                              |
| >=                  | 大于等于                                          |
| <                   | 小于                                              |
| <=                  | 小于等于                                          |
| <>                  | 不等于                                            |
| between ... and ... | 在...和...之间（闭区间）                          |
| in (set)            | 匹配任意一个值                                    |
| like                | 模糊匹配（'%'通配0个或多个字符，'_'通配一个字符） |
| is NULL             | 是一个NULL值                                      |
| and                 | 与                                                |
| or                  | 或                                                |
| not                 | 非                                                |

### 单行函数

| 函数                 | 描述                                |
| -------------------- | ----------------------------------- |
| lower('xxx')         | 转小写                              |
| upper('xxx')         | 转大写                              |
| initcap('xxx')       | 单词首字母转大写                    |
| concat('xxx', 'xxx') | 字符连接                            |
| substr('xxx', 1, 2)  | 取子串（从第一个字符选取，选取2位） |
| length('xxx')        | 取字符串长度                        |
| instr('xxx', 'str')  | 返回子字符串在字符串中的位置        |
| round(num, 2)        | 小数点后2位四舍五入                 |
| trunc(num, 2)        | 把小数点后两位保留，剩下截掉        |
| sysdate              | 反馈系统当前日期                    |
| to_number()          | 字符转数字                          |
| to_char()            | 数字/日期转字符                     |
| to_date()            | 字符转日期                          |

### 分组函数

| 函数     | 描述                           |
| -------- | ------------------------------ |
| avg(num) | 返回数字表达式中所有值的平均值 |
| sum(num) | 返回数字表达式或列总和         |
| count(*) | 返回表达式中值的个数           |
| max(num) | 返回表达式中值的最大值         |
| min(num) | 返回表达式中值的最小值         |

```sql
select col1, avg(col2)
from table
group by col1; # 按照col1分组，在每组中计算平均值

select col1, max(col2)
from table
group by col1
having max(col2) > 10000; # 根据分组后的查询结果进行筛选显示，having只能写在group by后面
```

### 多表查询

- 自连接：一个表自己与自己建立连接
- 等值连接：查询两个表，用where进行col的等值匹配
- 左外连接：优先连接左表，左表如果无法连接到，则保留为空
- 右外连接：优先连接右表，右表如果无法连接到，则保留为空
- 全连接：显示所有记录，如果两边无法连接到，都保留为空

```sql
# 等值连接
select emp.ename, emp.job, dept.deptno, dept.dname
from emp, dept
where emp.deptno=dept.deptno;

# 左外连接（优先连emp表）
select emp.ename, emp.job, dept.deptno, dept.dname
from emp, dept
where emp.deptno=dept.deptno(+);

# 全连接
select emp.ename, emp.job, dept.deptno, dept.dname
from emp full join dept
on emp.deptno=dept.deptno;
```

### 子查询（嵌套式查询）

| 操作符 | 描述                         |
| ------ | ---------------------------- |
| in     | 等于列表中的任何一个         |
| any    | 和子查询返回的任意一个值比较 |
| all    | 和子查询返回的所有值比较     |

```sql
select select_list
from table
where expr operator # 主查询
	(select select_list
  from table
  where condition); # 子查询
```

注意一下几点：

- 在查询时基于未知时应考虑使用子查询
- 子查询必须包含在括号内
- 将子查询放在比较运算符的右侧，增强可读性
- 对单行子查询使用单行运算符
- 对多行子查询使用多行运算符

### 表结构操作语句

表时数据库存储结构的逻辑概念，表分为行和列。

```sql
create table [USER.] table_name (
  {col1 datatype [column_constraint][table_constraint]}
  {col2 datatype [column_constraint][table_constraint]}
  {...}
); # 创建表格（列名称，列数据类型，列约束，表约束）
drop table table_name cascade constraints; # 删除内容和定义，释放空间
describe table_name # 查看表结构

alter table table_name add column_name datatype; # 增加列
alter table table_name drop column column_name;  # 删除列
alter table table_name rename to new_table_name; # 修改表名
alter table table_name rename column col_name to new_col_name; # 修改列名
```

| 数据类型     | 描述                             |
| ------------ | -------------------------------- |
| varchar2(L)  | 可变长度字符串                   |
| date         | 日期数据类型（日-月-年）         |
| number(p, s) | 数字类型（p为整数位，s为小数位） |
| boolean      | 布尔类型，只有true，false和null  |

| 列级约束    | 描述     |
| ----------- | -------- |
| not null    | 非空     |
| unique      | 唯一     |
| primary key | 主键     |
| foreign key | 外键     |
| check       | 条件检查 |

| 表级约束    | 描述     |
| ----------- | -------- |
| unique      | 唯一     |
| primary key | 主键     |
| foreign key | 外键     |
| check       | 条件检查 |

### 数据操作语句

数据操作语言DML是SQL语言的核心部分，当你做下列操作时DML语句会被执行：

```sql
insert into table[(column [, column, ...])]
values (value (, value, ...)); # 增加新行到表中

update table
set column=value [, column=value, ...]
[where condition]; # 修改表中的行

delete [from] table
[where condition]; # 删除表中的行
```

注意：

- insert：
  - 该语句一次只能插入一行到表中
  - 插入新的一行，每列都包含值
  - 按照表中列的默认顺序列除数值
  - 在insert子句中列出列是可选的
  - 将日期和字符数值放入单引号中
- update，delete：
  - 使用where会指定要修改的行
  - 不使用where会修改所有的行

### 事务操作语句

事务可以看作是由对db的若干操作组成的一个单元，要么全完成，要么全取消，保证数据满足一致性的要求。

事务开始于第一个dml的sql语句执行时，结束与下列事件之一：

- 发出commit或者rollback语句
- 一个数据定义语言ddl或数据控制语言dcl语句执行（隐式提交）
- 用户退出iSQL*Plus（默认提交）
- 系统崩溃（隐式提交）

| 事务命令                 | 描述                                           |
| ------------------------ | ---------------------------------------------- |
| commit                   | 提交事务                                       |
| roll back                | 回滚事务                                       |
| savepoint                | 事务的标记点，可以使一个事务再回滚到不同的阶段 |
| roll back to <savepoint> | 与savepoint对应，回滚到标记点                  |

commit命令执行之前，dcl首先影响db缓冲区，因此，数据以前的状态可以被恢复；当前用户可以查询表观察到dcl的结果；其他用户不能观察到当前所作的dcl的结果；其他用户不能改变受影响的行中的数据。

commit执行之后，数据在db中被永久的改变，数据以前的状态永久丢失；所有用户都可以观察到事务的结果；受影响的行的锁定被释放，其他用户可以操纵那行；所有保存点被擦除。

什么时候发起rollback命令：

- 用户直接发出撤销命令
- 某些时机程序代码段中出现异常和错误

使用save point命令在事务中建立标记点，并允许用户只回滚标记点之后的动作。

### SQL语句的简单优化

- 避免使用'*'，在解析过程中，会将星号一次性转换成所有的列名，并通过查询数据字典完成，意味着耗费更多的事件
- 尽量使用表的别名
- 注意where子句中的连接顺序，将能够缩小范围的condition放到后面
- 使用'>='替代'>'
- 用truncate代替delete，delete如果没有commit操作，回滚段中会存放删除操作恢复的消息，而truncate会让回滚段不再存放任何可被恢复的信息，因此很少的资源被调用，执行事件会很短
- 尽量多的使用commit
- 避免在索引列上使用函数

## Linux

安装linux：[2019最新,Linux详细安装教程](https://www.bilibili.com/video/BV1HE411r7Ln)

操作系统os是管理和控制计算机硬件资源的计算机程序，核心功能有：

- syscall接口
- 程序管理
- 内存管理
- 文件系统管理
- 驱动管理

Linux是类Unix操作系统，可以管理计算机所有硬件资源，进行cpu调度，分配工作桌面，linux结构分为4个，从外到内分别为应用程序，shell程序（Bash），内核kernel和硬件。

Linux特点如下：

- 多任务，多用户
- 功能强大的开发者交互界面
- 安全保护机制，稳定性好
- 用户界面，强大的网络支持
- 移植性好

常用的远程接入工具：xshell，xftp

### Linux用户管理

Linux系统是用id来区分用户的，分为User ID和Group ID，用户名或者组名用于方便人们的记忆。

- 用户id保存路径：/etc/passwd
- 组id保存路径：/etc/group

/etc/passwd文件中记录了单个用户的登录信息，每一行代表一个用户，用':'分割成7个字段：

| 字段 | 意义                                                         |
| ---- | ------------------------------------------------------------ |
| 1    | 用户登录名                                                   |
| 2    | 用户口令，加密的，/etc/shadow有真正的口令文件                |
| 3    | 指定用户的UID，用户登录进系统后，系统通过该值识别用户        |
| 4    | 组识别号GID，对应/etc/group文件中的一条记录                  |
| 5    | 描述信息，用来保存用户的真实姓名和个人细节                   |
| 6    | 指定用户的主目录的绝对路径                                   |
| 7    | 用户登录系统时运行的shell程序名称，通常是一个shell程序的全路径名 |

群组管理方法如下：

```shell
groupadd [-option] [group_name] # 新建群组
groupmod [-g n] [group_name]    # 修改群组
groupdel [group_name]           # 删除群组
```

用户管理方法如下：

```shell
useradd [-option] [user_name] # 新增用户
passwd [user_name] # 设置用户密码
usermod [-option] [user_name] # 修改用户属性
userdel [-option] [user_name] # 删除用户
who    # 查询当前登录系统的所有用户
id     # 查询当前用户的GID和UID
finger # 查询用户的属性信息
su [-] [user_name] # 切换用户
```

### 文件和目录管理

绝对路径是由根目录(/)开始写起的文件名或者目录名称，相对路径是相对于当前路径的文件名或者目录名称的写法。

- . 代表当前目录
- .. 代表上一级目录

```shell
pwd    # 显示当前工作目录
cd dir # 更改工作目录
ls [-option] [dir|file] # 查看文件或者目录
chown [-R] 文件主 文件    # 修改属主
chgrp [-R] 属有群组 文件  # 修改所属群组
chmod [-options] mode files 或者 chmod [ugoa] {+|-|=} [rwx] files # 修改权限

touch file # 新建文件
mkdir [-m 模式/权限] [-p] dir # 新增目录
cp [option] origin_file/dir target_file/dir  # 复制文件或目录
scp [option] origin_file/dir target_file/dir # 复制文件或目录，用于网络胡同的远程主机复制文件或目录，要求对其父目录具有写权限
mv [-fiu] origin_file/dir target_dir # 移动文件或目录
rmdir [-p] dir     # 删除目录
rm [-fir] file/dir # 删除文件或目录
find path [-option] [查找条件] # 查找文件或目录路径
cat file  # 直接查阅文件内容，不能翻页
more file # 翻页查看文件内容
less file # 翻页阅读
head file # 查看文件前几行内容，默认10行
tail file # 查看文件后几行内容，默认10行
grep [-cin] '目标字符串' file # 查找文件内容

command1 | command2 # 管道，将一个命令的输出连接到另一个命令的输入
command > file  # 输出重定向 (覆盖导入)
command >> file # 输出重定向 (从文件末尾导入) 
command < file  # 输入重定向
```

文件和目录的权限意义：

- read(r)：可读取此文件/目录的实际内容
- write(w)：可以编辑文件/目录（不包含删除该文件）
- execute(x)：该文件具有被系统执行的权限/具有进入该目录的权限

文件属性和权限说明（从左到右）：

- 前十位：文件类型(1)+owner权限(3)+group权限(3)+other权限(3)
- 数字：连接数
- 用户名
- 用户组
- 文件大小
- 最近修改日期
- 文件名

### vim编辑器

vim是类Unix系统内置文本编辑器，其他文本编辑器不一定存在。vim具有三种模式：

- 一般模式：用esc进入
- 编辑模式：从一般模式用i, o, a 或 R进入
- 指令模式：从一般模式用:, / 或 ?进入

| 按键说明              | 意义                                                         |
| --------------------- | ------------------------------------------------------------ |
| 上下左右              | 移动光标                                                     |
| 0或home键             | 移动光标到行首字符处                                         |
| $或end键              | 移动光标到行尾字符处                                         |
| gg                    | 移动光标到第一行                                             |
| G                     | 移动光标到最后一行                                           |
| nG                    | n为数字，移动光标到第n行                                     |
| : set nu              | 显示行号                                                     |
| /word                 | 向光标之下搜索名字为word的字符串                             |
| ?word                 | 向光标之上搜索名字为word的字符串                             |
| n                     | 重复前一个搜寻动作                                           |
| N                     | 重复前一个搜寻动作，但方向相反                               |
| :n1,n2s/word1/word2/g | 在n1行和n2行之间搜索word1字符串，并且将该字符串替代为word2   |
| :1,$s/word1/word2/g   | 全文搜索word1字符串，并且将该字符串替代为word2               |
| :1,$s/word1/word2/gc  | 全文搜索word1字符串，并且将该字符串替代为word2，并在替换之前要求用户确认 |
| x                     | delete键                                                     |
| X                     | backspace键                                                  |
| nx                    | delete n次                                                   |
| dd                    | 删除光标所在一整行                                           |
| ndd                   | 删除光标所在行向下n行                                        |
| yy                    | 复制光标所在行                                               |
| nyy                   | 复制光标所在行向下n行                                        |
| p                     | 将已经复制的数据，从光标下一行开始粘贴                       |
| u                     | 复原上一个动作                                               |
| .                     | 重复上一个动作                                               |
| i                     | 进入insert模式，从目前光标所在处插入                         |
| a                     | 进入insert模式，从目前光标所在处的下一个字符插入             |
| o                     | 进入insert模式，从目前光标所在处的下一行插入新的一行         |
| r                     | 进入replace模式，取代光标所在字符一次                        |
| R                     | 进入replace模式，一直取代直到esc为止                         |
| esc                   | 退出编辑模式到一般模式                                       |
| :w                    | 将编辑的数据写入磁盘中                                       |
| :wq                   | 保存并退出                                                   |
| :q!                   | 不保存，强制退出                                             |
| ZZ                    | 若文件没有被修改，则不存储退出。若文件被修改，则存储后退出   |
| :w filename           | 另存为                                                       |
| :r filename           | 将文件名为filename的文件内容读取到光标的后面                 |

### Linux文件系统管理

文件系统是os用于明确存储和组织计算机数据的方法，即对一个存储设备上的数据和元数据进行组织的机制。它使得对数据的访问和查找变得容易。

文件系统分类：

- 是否有日志？
  - 传统型文件系统
  - 日志型文件系统
- 如何查找数据？
  - 索引式文件系统：将文件属性数据和实际内容分别存放在不同你的区块，通过属性数据，可以快速找到实际数据所在。
  - 非索引式文件系统：只有block存在，读取数据时，需要一个block一个block读取，效率较低。

目录树是如何读取的？从文件系统的顶层进行读取，获取inode号码并验证inode权限，然后根据该inode读取block内的文件名数据，再一层层往下读取到正确的档案内容。

Linux磁盘是存在分区的。安装系统时首先会接触到分区。硬盘分区实质上是对硬盘的一种格式化，将硬盘逻辑的分成不同的槽/块。让数据能够分类存放在硬盘的不同区域中，以便更好地管理数据。硬盘分区按照功能的不同，分为以下几类：

- 主分区3个
- 扩展分区1个
- 逻辑分区n个

```shell
fdisk -l    # 查看磁盘分区
fdisk 设备名 # 创建分区
mkfs [-t 类型] [-b block大小] 设备名称 # 创建文件系统
mount 设备名 挂载点   # 手动挂载文件系统
umount 设备名或挂载点 # 手动卸载文件系统
```

/etc/fstab配置了开机自动挂载的文件系统，系统挂载有以下限制：

- /目录必须挂载，并且一定要先于其他挂载点被挂载起来
- 挂载点必须是已经存在的目录，可以任意指定
- 所有文件系统只能在同一时间挂载一次

/etc/fstab每行有6个字段：

| 字段序号 | 意义             |
| -------- | ---------------- |
| 1        | 文件系统         |
| 2        | 挂载点           |
| 3        | 文件系统类型     |
| 4        | 文件系统参数     |
| 5        | 是否采用dump备份 |
| 6        | 开机是否自检     |

```shell
df [-h|-i]    # 查看分区使用情况
du [-a|-s|-h] # 查询文件或目录的磁盘使用空间
lsof          # 查看打开的文件
```

### 网络管理

linux网络术语：

- 设备：主机内的网卡
- 链路：设备到网络的连接
- 接口：为使用设备，驱动程序在设备上创建了接口
- 子网掩码：将ip地址划分成网络地址和主机地址两部分的掩码
- 广播地址：到达本网段上所有主机的地址

ip的分类：

- a类网络：0.xxx.xxx.xxx - 127.xxx.xxx.xxx
- b类网络：128.xxx.xxx.xxx - 191.xxx.xxx.xxx
- c类网络：192.xxx.xxx.xxx - 223.xxx.xxx.xxx
- d类网络：224.xxx.xxx.xxx - 239.xxx.xxx.xxx
- e类网络：240.xxx.xxx.xxx - 255.xxx.xxx.xxx

```shell
ifconfig 接口 [-option] # 查看或设置网络接口的参数，如ip，掩码等
ifconfig 接口 up # 读取配置文件的方式启动网络接口
route # 查看路由表
route add [-net|-host] [netmask Nm] [gw Gw] [dev] # 新增到网段或者主机的路由
route add default gw # 暂时更改默认路由
route del [-net|-host] [netmask Nm] [gw Gw] [[dev] lf] # 删除到网段或者主机的路由

ping [-option] address # 检查网络是否通畅或者网络连接速度
traceroute [-option] <ipaddr or domain name> # 探测数据包从源到目的经过的路由器的ip
```

### Linux进程管理和服务管理

程序是文件中保存的一系列可执行命令。

进程是加载到内存中的程序，有cpu运行。用户进程是用户通过终端加载的进程。守护进程是与终端无关的系统进程，可基于时间或事件启动。

```shell
ps aux  # 查看所有进程信息
top     # 连续观察进程动态，默认3秒更新一次
pstree  # 用ascii字符显示树状结构，表达程序间的相互关系
kill    # 结束进程
killall # 结束同一进程组内的所有进程
```

任务的概念与相关术语：

- 任务：登录系统取得shell之后，在单一终端接口下启动的进程。在任务管理的行为当中，每个任务都是目前的shell的子进程，无法在一个shell下面取管理另外一个shell下面的任务。
- 前台：在终端接口上，可以出现提示符让用户操作的环境。
- 后台：不显示在终端接口的环境。

任务管理可以多项任务并行，使用`&`号执行。使用ctrl+z将正在运行的任务放入后台暂停。

```shell
jobs       # 查看当前shell的后台的任务
fg %job ID # 将任务放入前台执行
bg %job ID # 将任务放入后台执行
crontab [-u user] [-e|-l|-r] # 周期计划任务
at # 安排一个任务在未来执行
```

system daemon (systemd) 是linux下的一种init软件。作为init软件，systemd程序的任务有如下工作：

- 初始化文件系统，设置环境变量
- 挂载硬盘，/proc, /tmp, swap等
- 根据设置的运行级别，启动相应的守护进程
- 并在系统运行期间，监听整个文件系统

```shell
systemctl start|stop|status [service] # 通过systemctl管理服务
journalctl -u A.service # 查看A服务的日志
journalctl --system --since=today # 查看当天系统服务以及内核的日志
```

### Linux监控系统

作为系统管理员，我们需要监控哪些项目？

- 系统是否正常启动？
- 系统负载如何？
- 系统是否有非法用户登录？

```shell
hwinfo --cpu  # 显示cpu信息
hwinfo --disk # 查看磁盘信息
iostat        # 输出cpu和磁盘io相关的统计信息
lspci         # 列出所有PCI设备
```

监控系统和进程的命令：

- ps：用来显示当前进程状态，查看的是静态信息
- top：即时显示进程的动态
- uptime：查看系统已经开机的时间以及系统平均负载
- uname：查看系统版本相关信息，如内核号
- netstat：显示与ip，tcp，udp协议相关的统计数据，用于检验本机各端口的网络连接情况

```shell
who [option]            # 查看登录系统的用户
w [option] [user]       # 查看当前登录系统的用户以及用户当前的工作
finger [option] [user]  # 查看用户详细信息
last [option]           # 查看曾经登陆过系统的用户
lastlog [option] [user] # 查看用户最近一次登录的信息
```
