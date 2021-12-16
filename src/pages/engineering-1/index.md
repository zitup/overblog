---
title: ESLint
date: '2021-12-13'
spoiler: 前端工程化之 ESLint
cta: 'JS'
---

>前言
>
>现在的前端早已不是以前的 JS + CSS 一把梭的时代，它包含了广泛的内容，前端工程化是其中绕不开的基础建设。而在不同的开发阶段，工程化又包含不同的内容。
>
>开发阶段：eslint、babel  
>构建阶段：webpack  
>测试阶段：..  
>部署阶段：CI/CD  
>监控阶段：..  
>
>每一项技术包含的内容非常多，但是作为一个前端人是怎么也绕不开的，只能用力学习了。
>
>本系列聚焦于开发阶段和构建阶段，以实际的业务项目为本，力求逐篇掌握 eslint、babel、webpack 的原理和使用。系列结束时，希望可以完全掌握业务项目，并进行升级优化。
>
>本篇为 eslint。


## 介绍

ESLint 是识别和报告 JS 中特定模式的库，在开发中避免 bug。

它有以下几个特点：

  - 使用 Espree 解析 JS
  - 使用 AST(Abstract Syntax Tree) 评估代码中的模式
  - 可插拔，每条规则都是一个插件

## 配置

ESLint 由配置驱动，在配置中定义需要的规则。

有两种方式配置 ESLint：

  1. JS 注释
  2. 配置文件

配置文件是主要的方式，它包含很多选项，让我们可以细粒度的控制 ESLint 如何对待代码。

### Configuration Files

  ESLint 支持多个文件后缀：`js,cjs,yaml/yml,json`，和 `package.json` 中的 `eslintConfig` 字段。

  多个配置文件存在时，优先级如下：

  1. `.eslintrc.js`
  2. `.eslintrc.cjs`
  3. `.eslintrc.yaml`
  4. `.eslintrc.yml`
  5. `.eslintrc.json`
  6. `package.json`


### Language Options


### Rules

### Plugins

### Ignoring Code
