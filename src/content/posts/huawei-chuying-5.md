---
title: huawei-chuying-5
published: 2025-04-28
description: ''
image: ''
tags: ['雏鹰计划', 'java']
category: 'Guides'
draft: false 
lang: ''
---

## 变量应用进阶

### 变量类型汇总

Java是一种强类型语言，通过变量的类型限制了变量可以持有值（以及表达式可以产生的值），限制在各类值上支持的操作，并确定操作的含义。Java也是一种静态语言，在编译时检测数据类型是否匹配，便于开发者及时发现编码错误。

- 基本数据类型：byte, short, int, long, float, double, char, boolean
- 引用数据类型：类、接口、数组、枚举、注解

所有变量在使用前必须声明和初始化。

```java
// 基本格式
type identifier [= value][, identifier [= value]...];
```

类变量、实例变量支持默认初始化，局部变量必须显示初始化。

- Java基本类型的长度固定，与操作系统位宽无关。
- long、float、double类型可以在数值后添加L、f、d表示数字代表的类型。
- 默认值时类变量、实例变量，以及数组元素的默认初始化的赋值，而其他变量（如临时变量）必须显示初始化。
- 由于程序中存储数值是存在边界的，如果计算过程中导致超过这个边界，则会得到期望之外的结果。

### 数据类型转换

Java中进行赋值时，要求等号左边和右边的类型要一致，如果不一致，就需要进行数值类型转换：

- 自动类型转换：容量小的类型自动转换为容量大的类型
- 强制类型转换：大转小
- 隐含强制类型转换（初始化）：在类型初始化时，int会隐含强制转换成低级别的byte和short类型
- 其他类型转换：包装类、字符串、基本类型直接的转换

无论自动和强制类型转换，都要遵循如下基本原则：

- 不能对boolean类型进行类型转换
- 不能把对象类型转换成不相关的类对象
- 大转小必须使用强制类型转换
- 类型转换过程中，可能会导致溢出和损失精度
- 浮点数到整数的转换是舍弃小数，而不是四舍五入

### 引用类型和拆装箱

基本数据类型部分场景下不能使用，为了扩展8种基本数据类型相关的常用功能，JDK为每个基本数据类型涉及了一个对应类，叫做包装类。包装类的主要用途由2种：

1. 作为基本数据类型对应的类型在，方便有关对象的操作。
2. 可以用设定每种基本数据类型的属性大小和使用方法。

装箱：基本类型->包装类，拆箱：包装类->基本类型。拆装箱影响性能，应尽量避免反复拆装箱。

## 表达式

### 基本运算符存在的风险

对于`int multi(int n1, int n2) { return n1 * n2; }`中，当n1和n2的绝对值较大，两者的乘积越界溢出时，方法就无法正确的计算结果。当无法预判乘积结果是否会溢出时，可以使用Java 8新增的`Math.multiplyExact()`方法，该方法在乘积运算不产生溢出时会返回运算结果，溢出时抛出ArithmeticException。

由于计算机中的精确缺失，浮点符不能直接使用==或!=判断是否相等，而应该基于两者之差与极小值比较大小的方式判断是否相等。

逻辑运算符存在“短路”场景，即如果基于操作符和第一个操作数和就可以得到结果，则不会再执行第二个操作数的计算。

运算符注意优先级：https://blog.csdn.net/sunshihua12829/article/details/47912123

### Lambda表达式

Lambda表达式可以替换匿名类，简化代码。Java Lambda表达式中可以使用局部变量，但是不可修改，相当于局部变量为final类型，遵循“无副作用”。

有些场景的代码执行后，结果不一定会被使用，从而造成性能浪费。Lambda表达式是延迟执行的，这正好可以作为解决方案提升性能。

如果Lambda表达式实现体只调用了一个外部已经存在的方法时，就可以使用方法引用简化调用。

| 类型         | 语法               | Lambda表达式                          |
| ------------ | ------------------ | ------------------------------------- |
| 静态方法引用 | 类名::staticMethod | `(args)->类名.staticMethod(args)`     |
| 实例方法引用 | inst::instMethod   | `(args)->inst.instMethod(args)`       |
| 对象方法引用 | 类名::instMethod   | `(inst, args)->inst.instMethod(args)` |
| 构建方法引用 | 类名::new          | `(args)->new 类名(args)`              |

## 面向对象

### 多态

对于多态，有几个注意事项：

- 如果子类重写了父类的方法，则执行子类的方法，否则执行父类的方法。
- 执行方法的优先级为（从高到低）：
  1. `this.method(Obj)`（前提是父类有相同的定义）
  2. `super.method(Obj)`
  3. `this.method((super)Obj)`（前提是父类有相同的定义）
  4. `super.method((super)Obj)`

### 类加载顺序

Java的类加载机制中最重要的就是程序初始化过程，其中包含了静态资源、非静态资源、父类子类、构造方法，它们存在执行顺序：最先执行带有static关键字的属性/代码块，其次是非static关键字的属性/代码块、构造方法；同时，先父类再子类；同级别的按照代码顺序（自上而下）。具体地：

1. 父类的静态属性值、代码块
2. 子类的静态属性值、代码块
3. 父类的属性值、代码块
4. 父类的构造方法
5. 子类的属性值、代码块
6. 子类的构造方法

### 权限修饰符

Java中可以使用权限修饰符控制类、类成员变量、类成员方法的访问权限：

| 修饰符    | 类内部 | 同一个包 | 不同包的子类 | 同一个工程 |
| --------- | ------ | -------- | ------------ | ---------- |
| private   | yes    |          |              |            |
| (default) | yes    | yes      |              |            |
| protected | yes    | yes      | yes          |            |
| public    | yes    | yes      | yes          | yes        |

对于class的权限修饰只能用public和缺省default，其中，default类只可以被同一个包内部的类访问。

### 密封类

密封类sealed class，可以设置子类名称，密封类的子类只能是final class，sealed class或non-sealed class。非permits列表中的类不能被继承。

```java
interface I {}

sealed class C implements I permits D, E, F {}

non-sealed class D extends C {}
final class E extends C {}
sealed class F extends C {}
```

### 注解

Java注解提供了一种安全的类似注释的机制，用来将任何的信息或元数据与程序元素进行关联。注解可以应用在：

- 生成文档
- 在编译时进行格式检查
- 跟踪代码依赖性，实现替代配置文件功能
- 在反射的class、method、field等函数中，有许多与Annotation相关的接口，可以在反射中解析并使用Annotation。

## 异常

不合理使用异常会引导大量安全问题。

1. 如果抛出的异常对象属于catch子句中的异常类，或者属于该异常类的子类，则认为生成的异常对象与catch块捕获的异常类型相匹配。
2. 每个catch子句依次检查，一旦有子句匹配，则后面的被忽略。
3. finally子句必定会在其他代码结束之后执行，除非程序/线程提前退出。
4. finally执行时机在try/catch代码块退出前，即所有代码块后，跳出逻辑前。
5. finally执行语句不会影响原有返回值，除非finally中直接return。
6. 支持自定义异常。

throw与throws的区别：

- throw用于语句中抛出异常
- throws用于方法签名中声明可能抛出的异常

JDK-8支持try-with-resources方式，资源相关代码直接写在try后的括号内，异常时自动关闭相关资源，极大简化代码写法。

```java
try (read; br) {
  
} catch (Exception e) {
  
}
```

采用try-with-resources写法，当try中的代码执行结束之后就会调用try括号中的对象的close()方法来关闭资源，如果我们对try-with-resources语法代码进行反编译，可以看到里面依然是try-catch-finally写法。try-with-resources方式处理的资源类应实现了AutoCloseable接口的close()方法。

JDK-9引入了更加易读的try-with-resource写法，避免try后括号内代码过多，不易读。

在传递异常的时候，未对其中的敏感信息进行过滤，会导致信息泄露。

## 代码组织管理

### 包管理Package

Java提供了包机制，用于区别类名的命名空间，从而更加清晰分层地组织所有类/源码文件。包的作用：

- 把职责相关的类或接口组织在同一个包中，方便类的查找和使用。
- 包采用了树形目录的存储方式，可以避免类的名字冲突。
- 包限定了访问权限，拥有包访问权限的类才能访问某个包中的类。

一般通过import引入包名后，代码中可以直接使用类名，特殊地，如果同一个文件中要使用名字冲突地类时，需要通过显示添加包名的方式指定。

### 模块化Module

模块化系统的主要目的如下：

- 更可靠的配置，通过指定明确的类依赖关系代替以前那种易错的类路径class-path加载机制。
- 强大的封装，允许一个组件声明它的public类型中，哪些可以被其他组件访问，哪些不可以。

## 反射（动态代理）

反射reflection是指在程序的运行状态中，动态获取类信息以及动态调用对象的功能。反射就像给开发者提供了一面镜子，可以反向看到某个类中的结构信息，进而调用执行。反射常用于创建动态代理或开发通用框架，提供系统的通用性、灵活性，如Spring的IOC。

```java
public class ReflectionDemo {
  // 用反射来创建类对象
  public void create_class_object() throws xxxException {
    Class<Person> personClass = Person.class;
    Person person = personClass.getConstructor().newInstance();
    System.out.println(person.sayHi());
    
    // 其他得到personClass的方法
		Class<Person> personClass = Class.forName("com.huawei.core.reflection.bean.Person");
    Class<? extends Person> personClass = person.getClass();
    Class<?> personClass = this.getClass().getClassLoader().loadClass("com.huawei.core.reflection.bean.Person");
  }
  
  // 用反射来获取类的构造方法
  public void get_class_constructor() throws xxxException {
    Class<Person> personClass = Person.class;
    Constructor<Person> constructor = personClass.getConstructor(String.class, xxx); // 取决于构造方法的参数有什么，另外，如果构造方法不是public的话会报错
    System.out.println("constructor.getName() = " + constructor.getName());
    
    Person person = constructor.newInstance("Tony", xxx);
    System.out.println(person.sayHi());
    
    // 其他获取类构造方法的方式
    Constructor<Person> constructor = personClass.getDeclaredConstructor(String.class, LocalDate.class); 
    constructor.setAccessible(true); // getDeclaredConstructor方法可以无视类构造方法的修饰符，例如private
  }
  
  // 用反射来获取类的成员方法
  public void get_class_methods() throws xxxException {
    Class<Person> personClass = Person.class;
    Method sayHi = personClass.getMethod("sayHi(成员方法名称)");
    System.out.println("sayHi.getName() = " + sayHi.getName());
    
    Method study = personClass.getDeclaredMethod("study", String.class); // 成员方法如果是private之类的话要用getDeclaredMethod方法
    System.out.println("Arrays.toString(study.getParameterTypes()) = " + Arrays.toString(study.getParameterTypes()));
  }
  
  // 获取成员变量或者其他信息可以用getField等方法，略
  
  // 调用成员方法
  public void invoke_class_methods() throws xxxException {
    Class<Person> personClass = Person.class;
    Method sayHi = personClass.getMethod("sayHi(成员方法名称)");
    System.out.println(sayHi.invoke(new Person()));
    
    Method study = personClass.getDeclaredMethod("study", String.class); // 成员方法如果是private之类的话要用getDeclaredMethod方法
    study.setAccessible(true);
    System.out.println(study.invode(new Person(), "code"));
  }
}
```

### 动态代理

代理模式是指通过代理对象代替目标对象完成相应操作，并能够在操作执行的前后进行增强处理。

代理类常用于实现日志、鉴权等通用功能。

代理模式分为：

- 静态代理：代理类和委托类的关系在运行前就确定。但是当真实类的方法越来越多的时候，代理类对应的方法也要增加，代码量的改动大。
- 动态代理：
  - JDK代理：涉及java.lang.reflect包中的InvocationHandler接口和Proxy类
  - cglib代理

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class JDKProxy extends InvocationHandler {
  
  private Animal target;
  
  public JDKProxy(Animal target) { this.target = target; }
  
  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throw Throwable {
    System.out.println("do something before " + method.getName());
    method.invoke(target, args);
    System.out.println("do something after " + method.getName());
    return null;
  }
  
  public Object getProxyInstance() {
    return Proxy.newProxyInstance(this.getClass.getClassLoader(), target.getClass().getInterfaces(), this);
  }
  
  public static void main(String[] args) {
    Person person = new Person();
    Animal proxyInstance = (Animal)new JDKProxy(person).getProxyInstance();
    proxyInstance.move();
    proxyInstance.rest();
  }
}
```

## 多线程

线程thread是os能够进行运算调度的最小单位，使用多线程可以实现系统并发操作，提高资源利用率。使用多线程编码的好处：

- 提高cpu资源利用率：进行具有阻塞性质的操作，阻塞期间cpu不能进行工作，使用多线程可以增加程序的吞吐量。
- 保证公平特性：多个用户或程序对系统资源具有平等优先级，使用时间片的方式可以更好的共享cpu资源。
- 功能模块化：创建多个线程，让其并行的执行某个单独的任务，职责单一。

普通的多线程方式包括继承Thread和实现Runnable接口两种方式。

- 继承Thread：由于Java不能允许多继承，一个类如果需要继承其他类就不能再定义为线程类了。
- 实现Runnable接口：由于接口可以多实现，一个类可以继承其他类的同时实现Runnable接口称为线程类。

```java
public class ThreadDemo {
  public static void main(String[] args) {
    MyThread t1 = new MyThread();
    MyThread t2 = new MyThread();
    t1.start();
    t2.start();
    
    Thread t3 = new Thread(new MyRunnable());
    Thread t4 = new Thread(new MyRunnable());
    t3.start();
    t4.start();
  }
}

// 继承Thread
class MyThread extends Thread {
  @Override
  public void run() {
    for (int i=0; i<10; i++) {
      System.out.println(MyThread.currentThread().getName() + ": " + i);
    }
  }
}

// 实现Runnable
class MyRunnable implements Runnable {
  @Override
  public void run() {
    for (int i=0; i<10; i++) {
      System.out.println(MyThread.currentThread().getName() + ": " + i);
    }
  }
}
```

### 线程池

公司Java编程规范中指出，建议“避免不加控制地创建新线程，应该使用线程池来管控资源”。

线程池有如下优点：

- 降低资源消耗：通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- 提高响应速度：当任务到达时，任务可以不需要等到线程创建就能立即执行。
- 提高线程的可管理性：线程是稀缺资源，如果无限制地创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一分配、调优和监控。

ThreadPoolExecutor是线程池最基础的功能实现类，构造方法参数如下：

| 参数                | 意义                                                         |
| ------------------- | ------------------------------------------------------------ |
| corePoolSize        | 核心线程池数量，一个任务到来时，如果当前没有空闲线程且线程数量小于corePoolSize，则创建一个新的线程执行这个任务。 |
| maximumPoolSize     | 如果阻塞队列已满，无法继续将任务放入。如果当前线程数量小于maximumPoolSize则创建一个新的线程执行当前任务。 |
| keepAliveTime, unit | 线程空闲时间，如果当前线程数量已经大于corePoolSize或者调用了allowsCoreThreadTimeOut将线程超时关闭设置为true，则空闲这段时间后会关闭线程。 |
| workQueue           | 负责任务缓冲的阻塞队列，如果当前没有空闲线程且线程数量已经等于corePoolSize，则尝试将任务放入这个阻塞队列，如果成功则等待有空闲线程取出执行。 |
| handler             | 如果当前阻塞队列满，且当前线程数量已经到达maximumPoolSize，则调用handler的rejectedExecution方法处理这个任务。 |

线程池创建线程的流程如下：

1. 线程数如果小于corePoolSize，创建线程执行任务，否则进入2
2. workQueue阻塞队列如果还没满，则将任务插入阻塞队列；如果满了进入3
3. 活动线程如果小于maximumPoolSize，创建线程执行任务，否则进入4
4. 使用拒绝策略handler

如何合理使用线程池：

- cpu密集型任务应配置尽可能小的线程，如配置Ncpu+1个线程的线程池。
- io密集型任务的线程数量计算公式为`Nthreads = Ncpu*Ucpu*(1+W/C)`，从而充分利用cpu资源。
- 优先级不同的任务可以使用优先级队列PriorityBlockingQueue来处理，它可以让优先级高的任务先执行。
- 执行时间不同的任务可以交给不同规模的线程池来处理，或者可以使用优先级队列，让执行时间短的任务先执行。

## IO编程

java.io包中提供了各种流stream的相关API，可以通过标准接口和外部设备（文件、网络等）交互，输入/输出不同类型的数据。

按流的传输格式分为两种：

- 字节流：以字节byte为单位处理数据，适用于处理二进制数据（图片、视频）
- 字符流：以Unicode码元char为单位处理数据，适合处理文本数据（txt等）

### NIO

Non-blocking IO（NIO）是一种非阻塞io，也称为New IO。nio主要的api包括通道channel、缓冲区buffer和选择器selector。

- 通道channel
  - channel可以读取和写入通道，流是单向的（读或写）
  - channel可以异步读写，流是同步的（读或写）
  - channel总是从buffer读取或向buffer写入，流可以直接读写
- 缓冲区buffer
  - buffer是一个内存块，与channel交互时使用，可以向其中写入数据并再次读取这些数据。
  - buffer读写数据通常遵循以下步骤：1. 将数据写入buffer；2. 调用buffer.flip()切换读写模式；3. 从buffer中读取数据；4. 调用buffer.clear()重置buffer。
- 选择器selector：selector可以检测多个Java channel实例，并确定哪些通道已准备好进行读取或写入。这样单个线程就可以管理多个通道，从而可以管理多个io连接，这种方式避免创建过多线程，减少资源占用。

### Netty

Netty是一个基于Java NIO的网络编程框架，提供了一套高效的、事件驱动的异步网络通信机制。Netty底层使用了Java的NIO基础，并在其基础上进行了性能的优化。

## 正则表达式

### 实例1：入参格式校验

需求：校验入参是否为公司账号

- Pattern：用于定义匹配模式
- Matcher：用于指定具体进行匹配方式
- matcher.matches()：整体匹配

```java
public void match_entire() {
  String input = "l50039872";
  String regex = "[a-z]\\d{8}";
  boolean isMatch = Pattern.matches(regex, input);
  System.out.println("match entire: " isMatch);
}
```

### 实例2：字符串匹配搜索

需求：寻找报文中所有的公司账号

- matcher.find()：是否找到匹配的子字符串
- matcher.group(0)：匹配的当前字符串

```java
public void match_all() {
  String input = "Java Engineer: l50039872, d23454582";
  String regex = "[a-z]\\d{8}";
  Pattern p = Pattern.compile(regex);
  Matcher m = p.matcher(input);
  int i = 0;
  while (matcher.find()) {
    System.out.println(++i + " Found: " + m.group(0));
  }
}
```

### 实例3：字符串匹配搜索并分组解析

需求：寻找报文中的所有公司账号，并分别展示字母和数字

- matcher.group(i)：匹配到的子字符串的第i个部分

```java
public void group_match() {
  String input = "Java Engineer: l50039872, d23454582";
  String regex = "([a-z])(\\d{8})";
  Pattern p = Pattern.compile(regex);
  Matcher m = p.matcher(input);
  int i = 0;
  while (matcher.find()) {
    i++;
    System.out.println(i + " Found: " + m.group(0));
    System.out.println(i + " Found 1: " + m.group(1));
    System.out.println(i + " Found 2: " + m.group(2));
  }
}
```

### 实例4：报文中的敏感字段过滤

需求1：将json报文中的敏感字段替换成`***`，如果key中含"password"，则认为对应的value为敏感字段。

- input.replaceAll(regex, "$1***$3")：第一个入参只要被替换字符的模式，第二个时替换换后的内容。这里用到了外部反向引用分组。

```java
public void replace_pwd() {
  String input = "xxxxxx";
  String regex = "(\".*password.*\": \")(\\w*)(\")";
  String output = input.replaceAll(regex, "$1***$3");
  System.out.println("output = " + output);
}
```

需求2：如果input包含多个password，会导致贪婪。

- 非贪婪模式：可以通过在量词后面添加一个问号来实现。如果要匹配尽可能少的字符，可以使用"*?"或"+?"或"??"等非贪婪量词。

```java
public void replace_pwd_all() {
  String input = "xxxxxx";
  String regex = "(\".*?password.*?\": \")(\\w*)(\")";
  String output = input.replaceAll(regex, "$1***$3");
  System.out.println("output = " + output);
}
```

## 数据库应用编程

### JDBC编程

JDBC（Java DataBase Connectivity）是Java连接数据库操作的原生接口。JDBC也是软件开发人员入门数据库开发的必学和基础只是，便于我们了解数据库操作的基本机制和用法。

```java
public static void main(String[] args) throws Exception {
  Connection c = null;
  Statement s = null;
  ResultSet resSet = null;
  try {
    // 加载MySQL驱动程序
    // 反射方式加载jar包中的com.jdbc.Driver类
    // 执行静态代码块中的DriverManager.registerDriver(new Driver())进行注册
    Class.forName("com.mysql.cj.jdbc.Driver");
    // 建立数据库连接
    // Connection为数据库连接对象，url指定连接的路径，格式为"jdbc:mysql://ip地址:端口号/数据库名称"
    c = DriverManager.getConnection(url, user, pwd);
    s = c.createStatement();
    // 执行sql查询
    String sql = "SELECT * FROM TABLE LIMIT 10";
    resSet = s.executeQuery(sql);
    while (resSet.next()) {
      System.out.println(resSet.getString(xxxColumnLabel));
    }
  } catch (xxxException e) {
    ...
  } finally {
    ...
  }
}
```

注意：禁止直接使用外部数据来拼接sql语句，避免sql注入。

JDBC有几个关键接口：

- Driver：每个驱动类都必须实现的接口，java sql框架允许使用多个数据库驱动程序。每个驱动程序都应该提供一个实现Driver接口的类。
- DriverManager：用于注册Driver，并创建数据库连接。DriverManager将尝试加载它能找到的尽可能多的驱动程序，然后对应任何给定的连接请求，它将依次要求每个驱动程序尝试连接到目标url。
- Connection：与特定数据库进行连接（会话），在连接的上下文中可以执行sql语句并返回结果。
- Statement：用于向数据库发送sql语句
- ResultSet：用于代表sql语句的执行结果。ResultSet对象维护了一个指向表格数据行的游标，类似迭代器。调用ResultSet.next()等方法可以使游标指向具体的数据行，进行调用方法获取该行的数据。

### MyBatis编程

ORM（Object Relational Mapping）是一种思想，是插入在应用程序和jdbc之间的一个中间层，便捷的将应用中的对象与数据库的字段进行映射，简化java数据库应用开发。

JPA（Java Persistence API）是Java持久化规范，是ORM框架的标准。

Mybatis是一个业界流行的持久化框架，但不严格依照JPA规范，底层封装了JDBC，开发更简洁、灵活。

基于MyBatis的Java应用开发内容包括：

- 数据库安装创建
- 数据库配置
- DAO层Mapper接口开发
- Mapper.xml映射文件开发
- 业务代码调用Mapper接口

基于SpringBoot框架的数据库应用开发中，需要在application.yml配置文件中添加如下数据库配置：

```yaml
spring:
	datasource:
		name: root
		url: jdbc:xxx(url)
		username: root
		password: xxx
		type: # 数据库连接池
		driver-class-name: com.mysql.cj.jdbc.Driver # 数据库驱动的类名，同jdbc的url
		
mybatis:
	mapper-locations: classpath:com.xxx/*.xml # 配置mapper.xml路径
	type-aliases-package: com.xxx # 实体类存放位置
```

DAO层Mapper接口可以基于`@Mapper`注解实现，是java业务代码进行数据库操作的纽带。

```java
@Mapper
public interface UserMapper {
  List<User> queryUserInfo(@Param("name") final String name);
}
```

Mapper.xml映射文件开发。

- `mapper namespace="com.xxx.dao.UserMapper"`要与Mapper接口类名保持一致。
- `select id="queryUserInfo"`要与Mapper接口的方法名保持一致。
- `#{name}` 标识接口中的参数，名称要一一对应。使用"#"方式避免sql注入。
- 通过定义resultMap标识复杂对象类型与数据库字段的对应关系。

```xml
<mapper namespace="com.xxx.dao.UserMapper">
  <resultMap type="com.xxx.model.User" id="userMap">
    <result property="name" column="name"/>
    <result property="description" column="description"/>
  </resultMap>
  <select id="queryUserInfo" resultMap="userMap">
    select * from TBL_USER_INFO user where NAME = #{name}
  </select>
</mapper>
```

业务代码中合适位置调用Mapper接口即可。

```java
@RestController
public class UserService {
  @Autowired
  private UserMapper userMapper;
  
  @RequestMapping("/queryUserInfo")
  public List<User> queryUserInfo(@RequestParam("name") String name) {
    List<User> userList = userMapper.queryUserInfo(name);
    return userList;
  }
}
```

## 网络编程

在JDK的java.net包中，提供Socket等api，封装了网络通信的底层细节，支持tcp和udp协议的网络通信。

套接字socket是对网络中不同主机上的应用进程之间进行双向通信的端点的抽象，是一种实时、双向的通信方式，客户端和服务器之间建立持久连接，双方可以随时发送和接收数据。

- 即时通讯：通过socket，可以在多个用户之间实现实时的文字、音频或视频通信。
- 文件传输：可以使用socket在不同计算机之间传输文件（视频、图片），断点续传。
- 远程控制：可通过socket在远程计算机上执行指令或操作。

网络编程socket有一些关键的api：

- `public ServerSocket(int port)`创建一个ServerSocket对象，绑定到指定的端口。
- `public Socket accept()`侦听此套接字建立的连接并接受它。该方法会阻塞，直到建立连接。
- `public Socket(String host, int port)`创建流套接字并将其连接到指定主机上的指定ip和端口号。连接后服务端的accept()方法返回服务端的socket。
- `public InputStream getInputStream()`返回此套接字的输入流，用于读取/接收数据。
- `public OutputStream getOutputStream()`返回此套接字的输出流，用于写入/发送数据。

实际业务场景中经常使用REST和WebSocket进行网络编程。

REST是一种常见的网络通信方式，是一套架构原则，使用http协议进行网络通信。REST遵循单向的请求-响应的通信模式，但服务器无法在需要时主动向客户端推送数据。REST非常适合哪些采用单向的请求-响应模式的场景，比如查看新闻网页、提交评论等，但不适合需要双方实时通信的应用，比如视频聊天、在线游戏等。

WebSocket是一种基于tcp协议的应用层协议，通过http/https协议建立起一个双向通信的通道，可以在客户端和服务器之间实现实时的数据传输。WebSocket可以看作是Socket的一种高级应用，它在socket的基础上实现了更高层次的协议和更便捷的编程接口，使得开发者可以更方便地实现实时通信。

## 安全类库

运行未知地java程序时，可能触发代码中的不安全或敏感操作（删除系统文件、重启系统等）。为防止直接运行相关代码对系统产生负面影响，需要对相关操作权限进行控制。

JDK中内置了SecurityManager安全管理器，允许程序在执行可能不安全或敏感的操作之前确定该操作是什么，以及是否在允许执行该操作的安全上下文中尝试该操作。

## 类加载器

### 类生命周期

类的生命周期中，有7个阶段：

1. 加载：读取java类字节码并转化为方法区进行时的数据结构，创建一个代表该类的class对象。
2. 验证：验证字节码信息是否符合jvm规范，防止恶意代码攻击jvm。
3. 准备：为类的静态变量分配内存，并为静态变量赋初始值。不包含被final修饰的static变量，因为在编译时已经分配。
4. 解析：将常量池中的符号引用转换为直接引用。如果符号引用指向一个未被加载的类，或者未被加载类的字段或方法，那么解析将触发这个类的加载。
5. 初始化：执行静态初始化块和类变量赋值。执行类的构造函数，会触发即时解析依赖的类。先初始化父类，后初始化子类。
6. 使用
7. 卸载

### 类加载器机制

java中有3个内置类加载器，分别复杂加载不同的类：

1. 启动类加载器（Bootstrap ClassLoader）
2. 扩展类加载器（Extension ClassLoader）
3. 应用程序类加载器（Application ClassLoader）

双亲委派机制是指当一个类加载器收到类加载请求时，它会先将该请求委派给它的父类加载器取尝试加载。只有当父类加载器无法加载该类时，子类加载器才会尝试加载。

双亲委派机制的优点有：

- 避免重复加载：通过委派给父类加载器，可以避免同一个类被多次加载，提高了加载效率。
- 安全性：通过双亲委派机制，核心类库由根加载器加载，可以确保核心类库的安全性，防止恶意代码替换核心类。
- 扩展性：开发人员可以自定义类加载器，实现特定的加载策略，从而扩展java的类加载机制。

## 运行时数据区

运行时数据区分为如下几个部分：

- 程序计数器
- 虚拟机栈
- 本地方法栈
- Java堆
- 方法区
- 运行时常量池
- 直接内存

### JVM内存配置参数

业务中需基于各内存分区的作用、业务场景需求合理配置参数。常用的jvm内存配置如下：

| 启动参数              | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| `Xmx`                 | jvm可申请的最大堆内存，创建对象过多且无法自动回收易导致堆溢出。 |
| `Xms`                 | jvm启动时申请的堆内存。                                      |
| `Xss`                 | 线程栈大小，默认1024kb，程序递归深度太深容易导致线程栈溢出。 |
| `MaxMetaspaceSize`    | 最大元空间，用于限制本地内存分配给类元数据的大小。           |
| `MaxDirectMemorySize` | 直接内存大小，使用ByteBuffer.allocateDirect()等方式申请直接内存过多或清理不及时就溢出。当Direct ByteBuffer分配的堆外内存到达指定大小后，会触发full gc。 |

## 垃圾回收机制GC

程序计数器、虚拟机栈、本地方法栈3个区域随线程而生，随线程而无，比较确定。但java堆和方法区则有着很显著的不确定性，所以垃圾回收器所关注的堆和方法区的内存回收问题。

### 垃圾识别算法

#### 引用计数算法

在对象中添加一个引用计数器，每当有一个地方引用它时，计数器值+1，当引用失效时，计数器-1。任何时刻计数器=0的对象就是不能再被使用的。

但是引用计数算法存在问题：对象之间循环引用等例外情况需要考虑，必须配合大量额外处理才能保证正确地工作。

#### 可达性分析法

从gc roots开始，根据引用关系向下搜索，如果某个对象到gc roots间没有任何引用链相连，则证明此对象是不可能再被使用的。可以被认为是gc roots的对象有：

- 在虚拟机栈（栈帧中的本地变量表）中引用的对象
- 在方法区中类静态属性引用的对象
- 在方法区中常量引用的对象
- 在本地方法栈中JNI引用的对象
- java虚拟机内部的引用

#### 引用关系类型

强引用是指代码中普遍存在的类似`Object obj = new Object()`之类的应用，只要强引用还存在，垃圾收集器永远不会回收被引用的对象。

软引用`SortReference`描述的是那些还有用但并非必须的对象。在系统将要发生内存溢出异常之前，将会把这些对象列进回收范围进行二次回收。如果这次回收还没有足够的内存，才会抛出内存溢出异常。

弱引用`WeakReference`描述的是非必须对象。被弱引用关联的对象只能生存到下一次垃圾回收之前，垃圾收集器工作之后，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。

虚引用`PhantomReference`存在的唯一目的就是在这个对象被收集器回收时收到一个系统通知，被虚引用关联的对象，和其生存时间完全没关系。

### 垃圾回收算法

#### 标记-清除算法

分为标记和清楚两个阶段，首先标记出所有需要回收的对象，标记完成后统一回收所有被标记的对象。

但是从效率的角度讲，标记和清除的效率都不高。从空间的角度讲，标记清除后会产生大量不连续的内存碎片。

#### 标记-复制算法

将可用内存按照容量划分为大小相等的两块，每次只使用其中的一块。当这一块的内存用完后，就将还存活着的对象复制到另外一块上面，然后再把已经使用过的内存空间一次清理掉。

不过内存缩小为原来的一半，代价太高。在对象存活率较高时就要进行较多的复制操作，效率将会降低。

#### 标记-整理算法

标记过程与标记-此乃给出算法一样，但后续步骤为让所有存货的对象都向内存空间一端移动，然后直接清理掉边界以外的内存。

#### 分代收集

垃圾收集方式：

- 部分收集Partial GC：目标不是完整收集整个java堆的垃圾收集
  - 新生代收集Minor GC
  - 老年代收集Major GC
  - 混合收集Mixed GC
- 整堆收集Full GC：收集整个java堆和方法区的垃圾收集

### 垃圾收集器

| 收集器            | 串行or并行or并发 | 分代   | 算法           | 目标         | 适用场景                                  |
| ----------------- | ---------------- | ------ | -------------- | ------------ | ----------------------------------------- |
| Serial            | 串行             | 新生代 | 复制           | 响应速度优先 | 单cpu环境下的client模式                   |
| Serial Old        | 串行             | 老年代 | 标记-整理      | 响应速度优先 | 单cpu环境下的client模式，cms的后备方案    |
| ParNew            | 并行             | 新生代 | 复制           | 响应速度优先 | 多cpu环境时在server模式下与cms配合        |
| parallel scavenge | 并行             | 新生代 | 复制           | 吞吐量优先   | 在后台运算而不需要太多交互的任务          |
| parallel old      | 并行             | 老年代 | 标记-整理      | 吞吐量优先   | 在后台运算而不需要太多交互的任务          |
| cms               | 并发             | 老年代 | 标记-清除      | 响应速度优先 | 集中在互联网站或b/s系统服务端上的java应用 |
| g1                | 并发             | both   | 标记-整理+复制 | 响应速度优先 | 面向服务端应用，将来替换cms               |
