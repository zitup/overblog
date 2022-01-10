---
title: 浏览器如何渲染页面
date: '2022-01-07'
spoiler: 浏览器如何渲染页面
cta: 'JS'
---

当浏览器接收到第一个数据块，它就开始解析这些数据。解析（Parsing）是浏览器把接收到的数据转换成 DOM 树和 CSSDOM 的过程。然后进入渲染流程。

浏览器将内容渲染到页面一般有5个步骤：

1. PARSE：解析 HTML，构建 DOM 树
2. STYLE：为每个节点计算最终的有效样式
3. LAYOUT：计算每个节点的位置和大小
4. PAINT：绘制不同的盒子，为了避免不必要的重绘，将会分成多个层进行处理
5. COMPOSITE & RENDER：将上述不同的层合成一张位图，发送给 GPU，渲染到屏幕上

## 浏览器渲染详细流程

Chromium 渲染流程的主要步骤如下图所示：

![](./render.png)

### Parse 解析 HTML -> DOM 树

  > 参考：https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model

  - Conversion（转换）：浏览器从磁盘或网络读取 HTML 的原始字节，并根据文件的指定编码将它们转换成字符
  - Tokenization（分词）：浏览器根据 HTML5 规范将字符串转换成元素标记
  - Lexing（语法分析）：将元素标记转换为相应的元素对象，对象包含元素的名称、属性、文本等信息
  - DOM construction（DOM 构造）：元素标记的包含关系，对象也有相应的父子兄弟关系，通过这些关系构造出 DOM 树

  构建 DOM 的流程如下：

  ![](./dom-tree.png)

  次级资源加载

  当解析器遇到非阻塞资源，比如一个图片、css 文件，浏览器会向这些资源发送请求，然后继续解析。但是如果这些资源是阻塞的，比如没有 `async`/`defer` 属性的，在 body 标签之前的 script，会打断解析 HTML，转而开始加载、解析和执行 JS。

  Preload scanner




### Style 样式计算

### Layout

### Paint

### Compositing
