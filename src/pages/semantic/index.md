---
title: Semantic
date: '2020-09-09'
spoiler: 前端中的语义化
cta: 'semantic'
---

* **JS 中的语义化**

主要是函数、变量等命名的方式，通过命名就可以看出作用，不用去了解内部实现或者具体使用，比如`React`的 API：`getDerivedStateFromProps`、`componentDidMount`，命名都很语义化

* **CSS 中的语义化**

主要是使用固定的属性去选元素，比如 `.fruits__item` 优于 `div > ul > li`，前者很快就可以定位到对应的元素

* **HTML 中的语义化**

主要是标签有特定的含义，主要体现在：

  1. **本身命名的语义化**：比如 `header aside footer article main footer`，从名字就可以看出它的作用，相比页面充斥着很多的`div`，代码更清晰，查找起来也更快
  2. **SEO 友好**：比如 `h1` 标签，搜索引擎会把它的内容当作一个重要的关键词，从而影响搜索排序
  3. **可访问性强**：屏幕阅读器喜欢语义明确的标签，让界面有更好对体验，无障碍性也会比较好