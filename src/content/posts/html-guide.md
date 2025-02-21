---
title: HTML Introductory Basics
published: 2025-01-24
description: 'Understand HTML tags, structure and syntax, and master the creation and layout of web content.'
image: '../../assets/images/posts/html/HTML_Blog-scaled.jpeg'
tags: ["html", "front-end"]
category: 'Guides'
draft: false 
lang: ''
---

**HTML**（超文本标记语言）是网络开发的基础，它使我们能够在网站上构建内容。本文将介绍一些 HTML 的入门概念，包括结构、标记、属性等。

如果你有一定的编码基础（如学过 Python 等编程语言），一定能轻松理解。

## 必备工具

在使用 HTML 时，拥有合适的工具可以让你的开发过程更加顺利。下面是一些 HTML 开发人员必备的工具和插件（如果我们使用 VSCode）：

- HTML/CSS Support
- Live Server
- Auto Rename Tag

## HTML文档结构

HTML 文档需要遵循特定的结构。下面是一个 HTML 文档的基本示例：

```html
<!DOCTYPE html> <!-- Declaration to tell the browser this is an HTML document -->
<html lang="en"> <!-- Root element -->
    <head>
        <!-- Contains metadata, links to stylesheets, and JavaScript files -->
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My First HTML Page</title>
    </head>
    <body>
        <!-- Contains the visible content of the page -->
        <h1>Welcome to My Website</h1>
        <p>This is my first HTML page.</p>
    </body>
</html>
```

![visual representation](../../assets/images/posts/html/Snipaste_2025-01-24_22-30-28.png)

## 常用文本标记

HTML 提供了多种用于格式化和结构化文本的标记。下面是一些常见的文本相关元素：

```html
<!-- Heading -->
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>
<h3>Heading Level 3</h3>
<!-- <h4>, <h5>, <h6> work similarly for smaller headings -->

<!-- Paragraphs and Text Style -->
<p>This is a paragraph. <b>Bold text</b> and <i>italic text</i>.</p>
<p>You can also use <strong>strong emphasis</strong> and <u>underlined text</u>.</p>
```

```html
<!-- Unordered List -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<!-- Ordered List -->
<ol>
    <li>First item</li>
    <li>Second item</li>
</ol>
```

```html
<table>
    <tr> <!-- Table row -->
        <th>Header 1</th> <!-- Table header -->
        <th>Header 2</th>
    </tr>
    <tr>
        <td>Data 1</td> <!-- Table data -->
        <td>Data 2</td>
    </tr>
    <tr>
        <td>Data 3</td>
        <td>Data 4</td>
    </tr>
</table>
```

## HTML属性

HTML中的属性定义了元素的属性或行为。它们总是在开头标签中指定，由`<name="value">`组成。

- **class**： 为元素定义一个或多个类，用于CSS风格设计。
- **id**： 为元素指定一个唯一标识符。
- **style**： 元素的内联样式（不建议使用大型样式）。

```html
<tag attribute_name="attribute_value">xxx</tag>
```

## block、inline和inline-block

block元素通常用于组织和结构页面的主要内容。这些元素通常从新一行开始，占据其父元素的全部宽度。常见的块元素包括 `<div>`、`<h1>`、`<p>`、`<ul>`、`<table>` 等。

inline元素通常用于为文本添加样式或为文本的一部分应用样式。这些元素不另起一行，而是与其他内联元素一起出现。内联元素**只占用其内容所需的宽度**，不会强制换行。常见的内联元素包括 `<span>`, `<a>`, `<img>` 等。

inline-block元素结合了块级元素和内联元素的特点。它允许元素出现在同一行中，还可以设置宽度和高度属性，而内联元素不支持这些属性。

---

:::note[Reference]
- [3小时前端入门教程（HTML+CSS+JS）](https://www.bilibili.com/video/BV1BT4y1W7Aw)
:::
