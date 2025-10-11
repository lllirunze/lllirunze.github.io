---
title: SpringBoot的定时任务实现方式
published: 2025-10-11
description: '在现代软件开发中，定时任务是一种常见的需求，用于执行周期性的任务或在特定的时间点执行任务。SpringBoot提供了简单的定时任务功能，使开发人员能够轻松地管理和执行这些任务。'
image: '../../assets/images/posts/spring/springboot.jpeg'
tags: ["springboot", "back-end"]
category: 'Development'
draft: false 
lang: ''
---

在现代软件开发中，定时任务是一种常见的需求，用于执行周期性的任务或在特定的时间点执行任务。这些任务可能涉及数据同步、数据备份、报表生成、缓存刷新等方面，对系统的稳定性和可靠性有着重要的影响。SpringBoot提供了强大且简单的定时任务功能，使开发人员能够轻松地管理和执行这些任务。

**SpringBoot中定时任务**的基本用法、高级特性以及最佳实践，帮助开发人员更好地理解和应用定时任务，提高系统的稳定性和可靠性。

## @Scheduled注解

`@Scheduled`注解是Spring提供的一个注解，用于标记方法作为定时任务执行。`@Scheduled`注解在源码中包含一些重要属性：

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Repeatable(Schedules.class)  
public @interface Scheduled {
    String cron() default "";
	long fixedDelay() default -1;
	long fixedRate() default -1;
	long initialDelay() default -1;
}
```

- `cron`: 标准的Unix Cron表达式，用于定义复杂的计划执行时间
- `fixedRate`: 以固定的频率执行任务，指定两次执行之间的间隔时间（单位是毫秒）
- `fixedDelay`: 在每次任务完成后等待一定的时间再进行下一次执行，指定连续执行之间的延迟时间
- `initialDelay`: 首次执行前的延迟时间

用例如下：

```java
/**
 * cron属性可以设置指定时间执行  
 */  
@Scheduled(cron = "0 45 14 ? * *")  
public void fixTimeExecution() {  
	System.out.println("指定时间 "+dateFormat.format(new Date())+"执行");  
}
```

## SchedulingConfigurer基于接口

首先在项目中导入依赖包

```js
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.0.4.RELEASE</version>
</parent>
 
<dependencies>
    <dependency><!--添加Web依赖 -->
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency><!--添加MySql依赖 -->
         <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency><!--添加Mybatis依赖 配置mybatis的一些初始化的东西-->
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>1.3.1</version>
    </dependency>
    <dependency><!-- 添加mybatis依赖 -->
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.4.5</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

开启本地数据库mysql，打开一个查询窗口，执行脚本内容，例子如下：

```sql
DROP DATABASE IF EXISTS `socks`;
CREATE DATABASE `socks`;
USE `SOCKS`;
DROP TABLE IF EXISTS `cron`;
CREATE TABLE `cron`  (
  `cron_id` varchar(30) NOT NULL PRIMARY KEY,
  `cron` varchar(30) NOT NULL  
);
INSERT INTO `cron` VALUES ('1', '0/5 * * * * ?');
```

最后在项目中的`application.yml`添加数据源

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/socks
    username: root
    password: 123456
```

在数据库里准备好数据后，开始编写一个定时任务：

```java
@Configuration      // 1.主要用于标记配置类，兼备Component的效果。
@EnableScheduling   // 2.开启定时任务
public class DynamicScheduleTask implements SchedulingConfigurer {
    @Mapper
    public interface CronMapper {
        @Select("select cron from cron limit 1")
        public String getCron();
    }
 
    @Autowired      //注入mapper
    @SuppressWarnings("all")
    CronMapper cronMapper;
 
    /**
     * 执行定时任务.
     */
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addTriggerTask(
            //1.添加任务内容(Runnable)
            () -> System.out.println("执行动态定时任务: " + LocalDateTime.now().toLocalTime()),
            //2.设置执行周期(Trigger)
            triggerContext -> {
                //2.1 从数据库获取执行周期
                String cron = cronMapper.getCron();
                //2.2 合法性校验.
                if (StringUtils.isEmpty(cron)) {
                    // Omitted Code ..
                }
                //2.3 返回执行周期(Date)
                return new CronTrigger(cron).nextExecutionTime(triggerContext);
            }
        );
    }
}
```

启动应用即可定时执行任务。这里的好处是指需要在数据库里对执行周期进行修改即可，而不需要重启应用。如果使用第一部分的注解的话，需要先停止应用，修改代码再重启应用才能调整周期。

## 多线程定时任务

可以基于注解设定多线程定时任务

```java
@Component
@EnableScheduling   // 1.开启定时任务
@EnableAsync        // 2.开启多线程
public class MultithreadScheduleTask {
    @Async
    @Scheduled(fixedDelay = 1000)  //间隔1秒
    public void first() throws InterruptedException {
        System.out.println("第一个定时任务开始 : " + LocalDateTime.now().toLocalTime() + "\r\n线程 : " + Thread.currentThread().getName());
        System.out.println();
        Thread.sleep(1000 * 10);
    }
 
    @Async
    @Scheduled(fixedDelay = 2000)
    public void second() {
        System.out.println("第二个定时任务开始 : " + LocalDateTime.now().toLocalTime() + "\r\n线程 : " + Thread.currentThread().getName());
        System.out.println();
    }
}
```

两个定时任务互不影响。

---

:::note[Reference]
- [玩转SpringBoot: SpringBoot的几种定时任务实现方式](https://www.cnblogs.com/coderacademy/p/18058208)
- [SpringBoot实现定时任务的三种方式，总有一款适合你！](https://cloud.tencent.com/developer/article/1968344)
:::
