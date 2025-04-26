---
title: 雏鹰计划-Java编程入门
published: 2025-04-25
description: ''
image: ''
tags: ['雏鹰计划', 'java']
category: 'Guides'
draft: false 
lang: ''
---

## 基本数据类型

基本数据类型的占用空间固定，直接在变量中存储值和传递值。基本数据类型有byte, short, int, long, float, double, char, boolean。

- 基本数据类型在使用时，如果忽略取值范围，会造成代码异常
- 浮点数不能直接用`==`比较

char和String赋值时需要注意转义，尤其时八进制/十六进制表示方法。

| 转义字符 | 意义                                                      |
| -------- | --------------------------------------------------------- |
| \b       | 退格backspace                                             |
| \f       | 换页，将当前位置移到下页开头                              |
| \n       | 换行                                                      |
| \r       | 回车                                                      |
| \t       | 水平制表，跳到下一个tab位置                               |
| `\\`     | 代表一个反斜线字符                                        |
| `\'`     | 代表一个单引号字符                                        |
| `\"`     | 代表一个双引号字符                                        |
| `\0`     | 空字符null                                                |
| `\000`   | 1到3位八进制数所代表的任意字符                            |
| `\u0000` | Unicode转义字符，\u + 4个十六进制数字，`\u0000`表示空字符 |

基本数据类型存在以下类型转换：

- 自动类型转换
- 强制类型转换
- 类型提升

java所有的数值类型之间可以相互转换。如果系统可以把一种类型的值赋给另一种类型，称为自动类型转换。允许自动类型转换的标准是表数范围小的类型赋值给表数范围大的类型。

- 从整数型向浮点型转换时，仍可能有精度损失。
- 如果转换和计算同时进行，要小心数据的溢出。

强制类型转换可用于所有基础数值类型之间的转换，很多场合特指表数范围大的类型给表数范围小的类型赋值。

类型提升指的是当一个算数表达式包含多个基本类型的值时，整个算术表达式的数据类型将发生自动提升。

- byte、char、short自动提升为int
- 整个表达式的数据类型自动提升至表达式中的最高数据类型

## 引用数据类型

引用数据类型类似于c的指针，存放的是对象的引用。引用变量在声明时被指定为一个特定的类型，一旦声明后，类型就不能被改变。

引用类型包括：类、接口、数组、枚举和注解。默认值为null。引用变量可以用来引用任何与之兼容的类型。

### 数组

```java
// 声明
int array[];
int[] array;
// 初始化
int[] array = new int[5];
int[] array = {0, 1, 2};
int[] array = new int[]{0, 1, 4};
// 错误的示例
int array[5];
int array[5] = {0, 1, 2, 3, 4};
// 索引遍历
for (int i=0; i<array.length; i++) {}
// for-each遍历
for (int value : array) {}
```

### 包装类

包装类就是把基本数据类型和其辅助方法封装到类中，注意基本类型不是类，无法获得类的基本特性（无法参与转型、泛型、集合、反射等过程）。用包装类就是为了弥补这个缺陷。

```java
Integer a = Integer.valueOf(5); // 装箱
int b = a.intValue(); // 拆箱
Integer a = 5; // 自动装箱
int b = a; // 自动拆箱
```

- 由于包装类的拆装箱过于无感，混用时可能造成性能问题
- 当引用数据类型有更匹配的重载方法时，不会自动拆装箱

包装类比较必须使用`equals()` ，`==`比较的是两个引用是否指向一个对象。

包装类的创建很浪费性能，因此java对简单数字(-128~127)对应的包装类进行了缓存，称为常量池。通过直接量赋值的包装类如果在此范围内，会直接使用常量池的引用，因此`==`返回true。

包装类默认值为null，自动拆箱时会报NullPointerException。

## Java基本语法

java的程序结构由不同的包组成，包由java文件组成，每个java文件有且只能有一个和文件同名的公共类/接口。

- 包声明：每个文件至多一句，声明类所在的包
- import声明：文件中引入的所有外部类声明
- 公共类/接口：每个文件只能有一个公共类，类名必须和文件名一致。所有的内部类、成员、方法等都写在公共类内
- 程序入口：java程序的入口方法，形式必须为`public static void main (String[] args)`

```java
package com.example.myapp; // 包声明

import java.util.ArrayList; // import声明
import java.util.List;

public class MyClass{ // 公共类
  private List mList = new ArrayList();
  public static void main (String[] args) { // 程序入口
  
  }
}
```

标志符：在java语言中，用来标志类名、对象名、变量名、方法名、类型名、数组名、包名的有效字符序列，称为标志符。

- 由子母、数字、下划线、$组成，且第一个字符不能是数字
- 区分大小写

关键字：有一些专门词汇被赋予特殊含义，不能作为标志符。

运算符：

- 算术运算符
- 关系运算符
- 位运算符
- 逻辑运算符
- 赋值运算符
- 条件运算符
- instanceof 运算符

逻辑与流程控制：

- 循环结构：for、while、do...while
- 条件语句：if...else、switch(尽量不要省略break)

异常处理：

- 检查性异常：用户错误或问题引起的异常，是程序员无法预见的
- 运行时异常：可能被程序员避免的异常，在编译时可以被忽略
- 错误：错误不是异常，而是脱离程序员控制的问题。错误在代码中通常被忽略

```java
try {
  // 用于监听，将要被监听的代码放在里面，当try语句块内发生异常时，异常就被抛出
} catch (NullPointerException e) {
  // 捕获异常
} catch (Exception e) {
  
} finally {
  // finally语句块总是会被执行。它主要用于回收在try块里打开的物力资源。只有finally块，执行完成之后，才会回来执行try或者catch块中的return或者throw语句。如果finally块中使用了return或者throw，则不会跳回执行，直接停止
}

// throw用于抛出异常
// throws用在方法签名中，用于声明该方法可能抛出的异常
```

异常匹配规则：

- 如果抛出的异常对象属于catch子句中的异常类，或者属于该异常类的子类，则认为生成的异常对象与catch块捕获的异常类型相匹配。
- 每个catch子句依次检查，一旦有子句匹配，则后面的被旁路。因此编写多重catch语句时，需要先小后大，即先子类再父类。

finally规则：

- finally语句必定会执行，除非程序/线程提前退出。
- finally执行时机再try/catch代码块退出前，即所有代码块后，跳出逻辑前。
- finally执行语句不会影响原有返回值。
- finally中如果执行return或抛异常，会代替原有返回逻辑。

## Lambda表达式

```java
new Thread { // 省略了接口名、函数名，注意行末没有分号
  () -> System.out.println("Thread")
}

List<String> list = Arrays.<String>.asList("Lambda", "is", "wonderful");
Collections.sort(list, (s1, s2) -> { // s1, s2省略了参数表类型，直接写形参。多行代码用{}包围
  if (s1 == null) return -1;
  if (s2 == null) return 1;
  return s1.length() - s2.length();
})
```

- Lambda只能用在函数接口上，即只含有一个方法的接口
- Lambda依赖于参数推断

## IO编程

在java io中，流是一个核心的概念。流从概念上说是一个连续的数据流。你既可以从流中读取数据，也可以往流中写数据。流与数据源或者数据流向的媒介相关联。

- 字节流：以字节byte为单位处理数据，适合处理二进制数据 InputStream, OutputStream
- 字符流：以Unicode码元（char）为单位处理数据，适合处理文本数据 Reader, Writer

NIO（Non-blocking I/O）是一种同步非阻塞的io模型，也是io多路复用的基础，成为解决高并发与大量连接、io处理问题的有效方式。nio不同于io的一点在于nio面向缓冲区，而io面向流。

- buffer缓冲区：一块可读写数据的内存。java中包装为Buffer对象，并提供了一组操作方法。buffer的读写步骤为：
  - 1、写入数据到buffer
  - 2、flip()切换读模式
  - 3、从buffer中读取数据
  - 4、clear()/compact()方法清数据
- channel通道：类似于流，但是有区别。
  - 通道是双向的，可读也可写
  - 通道可以异步地读写
  - 通道中的数据总是要先读到一个buffer，或者总是要从一个buffer中写入
- selector选择器：用于侦听多个通道是否已做好读写准备，配合nio实现单个线程管理多个通道。

io多路复用是单个线程进行多个通道的io。

阻塞io，非阻塞io和io多路复用的比较：

- 在阻塞io中，线程只能空闲等待，只有靠增加线程数提升效率。
- 非阻塞io中，虽然可以同时尝试多个通道，但轮询会消耗过多cpu或者错过io时机。
- 多路复用是触发式io，可以实现单线程管理多个通道，且不必担心错过读写时机。

## 正则表达式

正则表达式定义了字符串的模式，可以用来搜索、编辑或者处理文本。正则表达式并不仅限于某一种语言，但是在每种语言中又细微的差别。

在java中，`\\`表示插入一个正则表达式的反斜线。在java中需要2个反斜杠才能被解析为其他语言中的转义作用。

| 常用字符 | 意义                                                         |
| -------- | ------------------------------------------------------------ |
| `^`      | 匹配输入字符串开始的位置。如果设置了RegExp对象的Multiline属性，`^`还会与\n和\r之后的位置匹配。 |
| `$`      | 匹配输入字符串结尾的位置。如果设置了RegExp对象的Multiline属性，`^`还会与\n和\r之后的位置匹配。 |
| `*`      | 零次或多次匹配前面的字符或者子表达式                         |
| `+`      | 一次或多次匹配前面的字符或者子表达式                         |
| `?`      | 零次或一次匹配前面的字符或者子表达式                         |
| `[a-z]`  | 字符范围，匹配指定范围内的任何字符                           |
| `\w`     | 匹配任何字类字符，包括下划线                                 |
| `\W`     | 与任何非单词字符匹配                                         |

```java
// 正则匹配
String content = "XXXX";
String pattern = ".*Huawei.*";
boolean isMatch = Pattern.matches(pattern, content);
System.out.println(isMatch);

// 捕获组
String line = "This order was placed for xxxx";
String pattern = "(\\D*)(\\d+)(.*)";
Pattern r = Pattern.compile(pattern);
Matcher m = r.matcher(line);
if (m.find()) {
  System.out.println("Found Value: " + m.group(0));
  System.out.println("Found Value: " + m.group(1));
  System.out.println("Found Value: " + m.group(2));
  System.out.println("Found Value: " + m.group(3));
} else {
  System.out.println("No Match");
}
```

正则注入regex injection：攻击者可能会通过恶意构造的输入对初始化的正则表达式进行修改，比如导致正则表达式不符合程序规定要求；可能会影响控制流，导致信息泄露，或导致ReDos攻击。java安全规范规定，禁止直接使用不可信数据构造正则表达式。利用方式有：

- 匹配标志：不可信的输入可能覆盖匹配选项，然后有可能会被传给Pattern.compile()方法。
- 贪婪：一个非受信的输入可能试图注入一个正则表达式，通过它来改变初始的那个正则表达式，从而匹配尽可能多的字符串，从而暴露敏感信息。
- 分组：程序员会用括号包括一部分的正则表达式以完成一组动作中某些共同的部分。攻击者通过提供非受信的输入来改变这种分组。

针对正则注入的输入校验：

- 非受信的输入应该在使用前净化，从而防止发生正则表达式注入。
- 当用户必须指定正则表达式作为输入前，必须注意需要保证初始的正则表达式没有被无限制修改。
- 在用于输入字符串提供给正则解析之前，进行白名单字符处理。
- 开发人员必须仅仅提供有限的正则表达式功能给用户，从而减少被误用的可能。

## 面向对象

面向对象是在分析问题时，以问题所涉及到的事或物为中心的分析方式。

- 类class表示归纳和整理
- 对象object表示具体的事物

### 基本语法

```java
// 类的语法基本结构
/*
class 类名 {
  特征（属性）
  功能（方法）
}
*/

// 创建对象
// new 类名();

class Cooking {
  // 属性
  String name;
  String type = "红烧";
  String food;
  String relish = "大料";
  // 方法
  void execute() {
    System.out.println("准备食材:" + food);
    System.out.println("准备佐料:" + relish);
    System.out.println("开始烹饪");
    System.out.println("烹饪完成");
  }
}

public class Java_Object {
  public static void main(String[] args) {
    Cooking c = new Cooking();
    c.name = "红烧排骨";
    c.food = "排骨";
    c.execute();
  }
}
```

### 类和对象

类是一种结构体，里面包含了属性和方法，会有很多的对象。

对象是类的实例化，一般new出来的对象会赋值给变量，方便重复使用。变量的类型就是对象的类型。对象是将内存地址赋值给了变量，所以变量其实引用了内存中的对象，所以称之为引用变量，而变量的类型称之为引用数据类型。

有一种特殊的对象null。null是没有引用的对象，称为空对象。所有引用类型变量的默认取值是null。

### 静态

把和对象无关，只和类相关的称之为静态static。和类相关的属性称之为静态属性，和类相关的方法称之为静态方法。

```java
class Test {
  String name;
  static String sex;
  void test() {
    test1(); // 成员方法可以访问静态属性和静态方法，因为对象先于类存在
    System.out.println("test...");
  }
  static {
    // 对象准备创建时，也会自动调用代码块，但不是静态的
    System.out.println("静态代码块执行"); // 类的信息加载完成后，会自动调用静态代码块，可以完成静态属性的初始化功能
  }
  static void test1() {
    System.out.println("test1...");
  }
}

public class Java_Static {
  public static void main(String[] args) {
    Test t = new Test();
    t.test();
    t.test1();
    Test.test1(); // 两种都可以
  }
}
```

### 构造方法

构造方法专门用于构造对象。如果一个类中没有任何的构造方法，那么JVM会自动添加一个公共的、无参的构造方法，方便对象的调用。

- 构造方法也是方法，但是没有void关键字
- 方法名和类名相同
- 如果类中没有构造方法，那么JVM会提供默认的构造方法
- 构造方法也是方法，所以也可以传递参数，但是一般传递参数的目的是用于对象属性的赋值

```java
class User {
  String username;
  User(String name) {
    username = name;
    System.out.println("Name: " + name);
  }
}
```

### 继承

类的继承只能单继承，一个类只能有一个父类，不能存在多个父类。继承采用extends语法。

父类对象是在子类对象创建前创建完成，创建子类对象前，会调用父类的构造方法完成父类的构建。默认情况下，子类对象构建时，会默认调用父类的构造方法完成父类对象的构建，使用的时super()的方式，只不过JVM自动完成。如果父类提供构造方法，那么JVM不会提供默认的构造方法，那么子类应该显示调用super方法构建父类对象。

```java
class Parent {
  String name = "zhangsan";
	void test() { System.out.println("test..."); }
  Parent() { System.out.println("parent..."); }
}

class Child extends Parent {
  Child() {
    super();
    System.out.println("child...");
  }
}
```

### 多态

多态是一个对象在不同场景下表现出来的不同状态和形态。多态语法是对对象的使用场景进行了约束。一个对象可以使用的功能取决于引用变量的类型。

```java
class Person {
  void testPerson() { System.out.println("test person..."); }
}

class Boy extends Person {
  void testBoy() { System.out.println("test boy..."); }
}

public class Java_Polymorphism {
  public static void main(String[] args) {
    Person p = new Person();
    p.testPerson();
    Person p1 = new Boy();
    // p1.testBoy(); 无法运行
  }
}
```

### 重载与重写

一个类中，不能重复声明相同的方法，也不能声明相同的属性。这里相同的方法指的是方法名，参数列表相同，和返回值类型无关。

如果方法名相同，但是参数列表（个数，顺序，类型）不同，会认为是不同的方法，只不过名称一样，这个操作在Java称之为方法的重载。

```java
class User {
  User() {}
  User(String name) { System.out.println("name: " + name); }
  
  void login(String account, String pwd) { System.out.println("登录"); }
  void login(int tel) { System.out.println("手机验证码登录"); }
}
```

父类对象的方法主要体现通用性，无法在特殊的场合下使用。如果子类对象需要在特殊的场合下使用，那么就需要重写方法的逻辑，这个操作在Java中称之为方法的重写。这里的重写，并不意味着父类的方法被覆盖掉，只是在当前的场合不使用，如果使用的话可以使用super关键字访问。

方法的重写要求子类的方法和父类的方法名相同，返回值类型相同，参数列表相同

```java
class Parent {
  String name = "zhangsan";
  void test() { System.out.println("parent test..."); }
}

class Child {
  String name = "lisi";
  void test() {
    super.test();
    System.out.println("child test...");
  }
}
```

### 访问权限

Java中的访问权限主要分为四种：

1. private：同一个类中可以使用
2. default：默认权限，当不设定任何权限时，JVM会默认提供权限，包（路径）权限
3. protected：受保护的权限，子类可以访问
4. public：任意使用

### 内部类

所谓的外部类就是在源码中直接声明的类，而内部类则是类中声明的类。

Java不允许外部类使用private，protected修饰，内部类就当成外部类的属性使用即可。因为内部类可以看作外部类的睡醒，所以需要构建外部类对象才可以使用。

```java
public class Java_InnerClass {
  public static void main(String[] args) {
    OuterClass outer = new OuterClass();
    OuterClass.InnerClass inner = outer.new InnerClass();
  }
}

class OuterClass {
  public class InnerClass {
    
  }
}
```

### final

Java中提供了一种语法，可以在数据初始化后不被修改，使用关键字final。

- final可以修饰变量，变量的值一旦初始化无法被修改。一般将final修饰的变量称之为常量，或者叫不可变变量。
- final可以修饰属性，那么JVM无法自动进行初始化，需要自己进行初始化，属性值不能发生变化。
- final可以修饰方法，这个方法不能被子类重写。
- final可以修饰类，这个类就没有子类。
- final不可以修饰构造方法。
- final可以修饰方法的参数，一旦修饰，参数就无法修改。

```java
final String name = "zhangsan";

class User {
  public final String name;
  public User(String name) {
    this.name = name;
  }
  public final void test() {}
}

final class FinalClass {
  public FinalClass() {}
}
```

### 抽象

抽象方法是只有声明，但是没有实现的方法。抽象类是不完整的类，因为类不完整，所以无法构建对象。

如果一个类中含有抽象方法，那么这个类就是抽象类；如果一个类是抽象类，它的方法不一定是抽象方法。

抽象类无法直接构建对象，但是可以通过子类间接构建对象。如果抽象类中含有抽象方法，需要重写抽象方法，将方法补充完整。

abstract关键字不能和final同时使用。

```java
abstract class Parent {
  public abstract void eat();
  public void test() {}
}

class Child extends Parent {
  public void eat() {
    System.out.println("eat...");
  }
}
```

### 接口

接口可以简单理解为规则，是抽象的。规则的属性必须为固定值，而且不能修改，属性和行为的访问权限必须为公共的。

- 属性应该是静态的。
- 行为应该是抽象的。

接口和类是两个层面的东西，接口可以继承其他接口，类的对象需要遵循接口，在Java中这个遵循，称之为实现，类需要实现接口，而且可以实现多个接口。

```java
interface USBInterface {}
interface USBSupply extends USBInterface {
  public void powerSupply();
}
interface USBReceive extends USBInterface {
  public void powerReceive();
}

class Computer implements USBSupply {
  public USBReceive usb1;
  public USBReceive usb2;
  public void powerSupply() {
    System.out.println("电脑提供能源...");
    usb1.powerReceive();
    usb2.powerReceive();
  }
}

class Light implements USBReceive {
  public void powerReceive() {
    System.out.println("电灯接收能源...");
  }
}

public class Java_Interface {
  public static void main(String[] args) {
    Computer c = new Computer();
    Light l1 = new Light();
    c.usb1 = l1;
    Light l2 = new Light();
    c.usb2 = l2;
    c.powerSupply();
  }
}
```
