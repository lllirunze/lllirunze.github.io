---
title: Android Notification Permission
published: 2026-07-15
description: '系统梳理 Android 通知权限的版本差异、申请方式、兼容思路与常见踩坑。'
image: '../../assets/images/posts/android/android-1.webp'
tags: ["android", "permission", "front-end", "kotlin"]
category: 'Development'
draft: false
lang: ''
---

Android 的通知能力看起来只是“发一条通知”这么简单，但从 Android 13 开始，这件事正式和运行时权限绑定在了一起。也就是说，代码写对了，不代表通知一定能弹出来；如果权限、通知渠道、系统开关、目标 SDK 这些条件没有处理完整，最终效果很可能就是“看起来什么都没发生”。

这篇文章主要整理 3 件事：

- Android 通知权限到底从哪个版本开始变复杂
- 不同系统版本应该怎么兼容
- 代码里到底要检查哪些前置条件

## 先说结论

如果只想先记住最核心的规则，可以先看这一段：

- Android 13（API 33）及以上，普通通知需要动态申请 `POST_NOTIFICATIONS`
- Android 12L（API 32）及以下，没有这个运行时权限，但用户仍然可以手动关闭应用通知
- 就算权限已授权，如果通知渠道的重要性、系统通知总开关或业务时机不对，通知依然可能不展示
- 前台服务通知也受通知权限和系统策略影响，不能默认一定能展示

所以在业务代码里，真正稳妥的思路不是“直接 `notify()`”，而是：

```text
判断 Android 版本
-> 检查通知总开关
-> Android 13+ 检查 POST_NOTIFICATIONS
-> 创建通知渠道
-> 再发送通知
```

## 为什么 Android 13 之后要申请通知权限

在 Android 13 之前，应用安装后通常就可以直接发通知，用户如果不想收到，再去系统设置里手动关闭。

从 Android 13 开始，系统把通知纳入了运行时权限模型，核心目的是让用户在更早阶段明确决定：

- 这个应用能不能给我发通知
- 我是否愿意在第一次使用相关功能时就授权

从产品视角看，这个变化意味着通知权限不能再被当成“默认可用”的能力，而要被当成一个需要引导、解释和兜底处理的用户授权流程。

## 不同 Android 版本的行为差异

### Android 13 及以上

如果你的 `targetSdkVersion >= 33`，那么发送普通通知前应该主动申请：

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

这只是声明，还不够。你还需要在运行时动态请求。

### Android 12L 及以下

这部分系统没有 `POST_NOTIFICATIONS` 这个运行时权限，但不代表通知一定可用，因为用户仍然可能：

- 关闭整个应用的通知
- 关闭某个通知渠道
- 把通知渠道的重要性调得很低

所以老版本的重点不是“申请权限”，而是“检查用户是否已经把通知关掉了”。

## Manifest 声明

最基础的配置就是在 `AndroidManifest.xml` 里加上通知权限：

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

如果你的业务里还会启动前台服务，那么通常还会配合前台服务权限和服务声明一起写，例如：

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

<application ...>
    <service
        android:name=".service.SyncService"
        android:exported="false"
        android:foregroundServiceType="dataSync" />
</application>
```

这里要注意一个容易混淆的点：

- `POST_NOTIFICATIONS` 解决的是“能不能发通知”
- `FOREGROUND_SERVICE` 解决的是“能不能以前台服务方式运行”

这两个能力有关联，但不是一回事。

## 动态申请通知权限

在 Activity 或 Fragment 里，推荐直接用 `ActivityResultContracts.RequestPermission()`。

```kotlin
private val notificationPermissionLauncher =
    registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            showMessageNotification()
        } else {
            showNotificationPermissionGuide()
        }
    }

private fun requestNotificationPermissionIfNeeded() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
        showMessageNotification()
        return
    }

    if (ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
    ) {
        showMessageNotification()
        return
    }

    notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
}
```

这个流程适合“用户点击某个明确操作后，再顺势申请权限”的场景，比如：

- 用户开启消息提醒
- 用户订阅任务更新
- 用户打开签到提醒

比起应用一启动就弹权限，这种方式通常更容易让用户理解你为什么需要通知权限。

## 发送通知前的统一检查

很多线上问题并不是权限没申请，而是开发只检查了权限，没有检查通知总开关。

可以把这部分逻辑收口成一个方法：

```kotlin
fun Context.canPostNotification(): Boolean {
    val notificationManager = NotificationManagerCompat.from(this)

    if (!notificationManager.areNotificationsEnabled()) {
        return false
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS
        ) == PackageManager.PERMISSION_GRANTED
    }

    return true
}
```

调用时会简单很多：

```kotlin
if (context.canPostNotification()) {
    showMessageNotification()
} else {
    showNotificationPermissionGuide()
}
```

这个判断的价值在于：**它同时兼容了系统版本和用户手动关闭通知的情况。**

## 不要忘了通知渠道

Android 8.0（API 26）开始，通知渠道就是必选项。没有渠道，或者渠道配置不对，通知同样可能不显示。

```kotlin
private const val MESSAGE_CHANNEL_ID = "message_channel"

fun Context.createMessageChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val channel = NotificationChannel(
        MESSAGE_CHANNEL_ID,
        "消息通知",
        NotificationManager.IMPORTANCE_DEFAULT
    ).apply {
        description = "用于展示聊天消息和互动提醒"
    }

    val manager = getSystemService(NotificationManager::class.java)
    manager.createNotificationChannel(channel)
}
```

发送通知时：

```kotlin
fun Context.showMessageNotification() {
    createMessageChannel()

    val notification = NotificationCompat.Builder(this, MESSAGE_CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_notification)
        .setContentTitle("新消息")
        .setContentText("你收到了 1 条新的聊天消息")
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setAutoCancel(true)
        .build()

    NotificationManagerCompat.from(this).notify(1001, notification)
}
```

这里还有一个常见误区：

- `NotificationCompat.PRIORITY_DEFAULT` 主要影响低版本行为
- Android 8.0+ 真正更关键的是 `NotificationChannel` 的 `importance`

也就是说，如果你的渠道重要性建得太低，后面改 Builder 的 priority 往往救不回来。

## 一个更完整的调用示例

下面给一个比较贴近实际业务的入口方法：

```kotlin
fun Activity.trySendMessageNotification() {
    if (!NotificationManagerCompat.from(this).areNotificationsEnabled()) {
        showNotificationSettingsPage()
        return
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
        ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS
        ) != PackageManager.PERMISSION_GRANTED
    ) {
        notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        return
    }

    showMessageNotification()
}
```

这段逻辑的顺序有两个好处：

- 先处理“系统通知总开关被关掉”的情况
- 再处理 Android 13+ 的运行时权限

这样用户看到的提示会更准确，不容易出现“明明不是权限问题，却一直提示去授权”的错位引导。

## 用户拒绝后怎么处理

通知权限和相机、定位这类强功能权限不太一样。很多业务里，用户拒绝通知权限后，应用仍然可以继续正常使用，只是少了一种触达方式。

所以比较推荐的策略是：

- 首次申请前先解释用途
- 被拒绝后不要无限弹窗
- 在关键功能页保留“开启通知提醒”的二次入口
- 如果用户已经永久拒绝，就引导去系统设置页手动开启

跳转通知设置页可以这样写：

```kotlin
fun Activity.showNotificationSettingsPage() {
    val intent = Intent().apply {
        action = Settings.ACTION_APP_NOTIFICATION_SETTINGS
        putExtra(Settings.EXTRA_APP_PACKAGE, packageName)
    }
    startActivity(intent)
}
```

这类引导比“权限失败后什么都不做”更完整，也更符合真实产品场景。

## 常见踩坑

### 1. 只声明了权限，没有动态申请

`AndroidManifest.xml` 里的声明只是告诉系统“我可能会用”，不等于用户已经同意。

### 2. 权限通过了，但通知还是不显示

优先检查这些点：

- 应用通知总开关是否被关闭
- 通知渠道是否已创建
- 渠道重要性是否过低
- 小图标是否有效
- 通知触发时机是否被业务代码提前 return

### 3. 把通知权限申请放在应用冷启动第一页

这通常会降低授权率。用户还不知道你的通知有什么价值，就先被系统弹窗打断，效果一般不会太好。

### 4. 以为低版本不需要处理

低版本确实不需要申请 `POST_NOTIFICATIONS`，但依然要考虑通知总开关、渠道配置和系统设置差异。

### 5. 修改渠道配置后，以为重新发通知就会生效

通知渠道一旦创建，很多关键属性就不能随意更新。实际开发里，如果你改了渠道名称、描述或重要性，常常需要：

- 升级渠道 ID
- 或者卸载重装应用后重新验证

## 实战建议

如果你在项目里要把通知权限处理得更稳，我建议至少做到下面几点：

- 把“权限检查 + 总开关检查 + 跳设置页”封装成统一工具方法
- 把权限申请放到有明确业务语境的时机
- 把通知渠道创建放到应用初始化或首次通知前
- 埋点记录授权率、拒绝率和设置页跳转率

这样后续无论是排查“为什么没通知”，还是优化通知触达，都更容易有抓手。

## 总结

Android 通知权限真正麻烦的地方，不在于代码量，而在于它横跨了：

- 系统版本差异
- 运行时权限
- 通知渠道
- 用户设置状态

如果把这些环节拆开处理，代码很容易零散；如果按“能不能发通知”这个目标统一收口，整体就会清晰很多。

对于 Android 13+，记住一句话就够了：**`POST_NOTIFICATIONS` 必须按运行时权限处理**。  
对于所有版本，也再补一句：**不要默认通知一定能发出来，发送前先检查。**
