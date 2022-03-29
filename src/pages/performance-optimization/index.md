---
title: 性能优化实践
date: '2022-03-21'
spoiler: performance optimization
cta: 'performance'
---

本篇文章记录一次性能优化的实践过程，包含两大部分，一部分是通过各方面的优化，提升页面在浏览器中的展示速度，一部分是通过优化 webpack 提升构建速度和减小包的大小，从而提升前者。

提升的效果通过一些关键指标来体现。

https://webpagetest.org/

## 关键指标

前端的一些关键指标包含 onload、DOMContentLoaded、First Contentful Paint、白屏首屏加载时间。

**首屏加载时间**：根据业务，我们把首屏的所有元素和所需数据加载完成，定义为首屏加载时间。  

**白屏时间**：

**DNS 解析耗时**

**TCP 连接耗时**



```yaml
Navigation Timing API

收到首字节的耗时: responseStart - fetchStart
HTML 加载完成耗时: domContentLoadedEventEnd - fetchStart
页面完全加载耗时: loadEventStart - fetchStart
DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
Time to First Byte（TTFB）: responseStart - requestStart
数据传输耗时: responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时（页面中同步加载的资源): loadEventStart - domContentLoadedEventEnd

Lighthouse Performance

首次绘制: FP（First Paint）
首次内容绘制: FCP（First Contentful Paint）
首次有效绘制: FMP（First Meaningful Paint）
最大可见元素绘制: LCP（Largest Contentful Paint）
可交互时间: TTI（Time to Interactive）
浏览器接收第一个字节的时间: TTFB（Time to First Byte）

DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
SSL 安全连接耗时: connectEnd - secureConnectionStart
网络请求耗时 (TTFB): responseStart - requestStart
数据传输耗时: responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时: loadEventStart - domContentLoadedEventEnd
First Byte 时间: responseStart - domainLookupStart
白屏时间: responseEnd - fetchStart
首次可交互时间: domInteractive - fetchStart
DOM Ready 时间: domContentLoadEventEnd - fetchStart
页面完全加载时间: loadEventStart - fetchStart
http 头部大小:  transferSize - encodedBodySize
重定向次数: performance.navigation.redirectCount
重定向耗时: redirectEnd - redirectStart
```

## 各方面优化

1. DNS

## webpack 优化

## 额外的 react 优化

https://zh-hans.reactjs.org/docs/optimizing-performance.html
