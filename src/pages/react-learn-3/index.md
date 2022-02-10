---
title: React Hooks and Events
date: '2022-02-09'
spoiler: React Hooks and Events
cta: 'react'
---

React hooks 是 react v16.8 新增的 API，让我们可以在函数式组件中使用状态和其它 react 的功能，大大增强了函数组件的能力。

## 为什么有 Hooks？

从个人编码感受上来说，hooks API 要比 class API 轻松很多，没有那么多复杂的类的概念，“心智负担”很低，整个的数据流是很清晰的。具体来说，有以下几个方面：

1. ### 原生的共享状态逻辑能力

我们日常要复用一段逻辑往往是抽离出一个函数，但是之前的 react 函数内部不支持 state。在 class 组件中复用状态逻辑代码很复杂，需要使用比如 `render props`、高阶组件的方式，但是这样的方式除了本身需要开发者掌握外，还让代码更复杂。

Hooks 增强了 react 中的函数，使得提取状态逻辑非常简单。

2. ### 简单直接的 API

Class 组件的 API 没有统一的用途，随着业务的复杂，一个 API 内往往充斥着各种各样的逻辑，很容易出 bug，调试起来也没有头绪，全靠开发者自己的代码是否组织的好。逻辑也不能拆分，没有更好的地方存放。

Hooks 丢掉了生命周期的概念，使用几个函数管理组件创建和更新的数据流，清晰明了。

3. ### 难以理解的 class

Class 本身有学习成本，函数式组件用起来更简单。

## Hooks 规则

Hook 本质就是 JavaScript 函数，但是在使用它时需要遵循两条规则。

1. ### 只在最顶层使用 Hook

不要在循环，条件或嵌套函数中调用 Hook，这是为了确保 Hook 在每一次渲染中都按照同样的顺序被调用。

React 使用数组保存 hooks 的状态和 set 函数，数组的下标和 hooks 的顺序对应，也就是说 React 依赖 hook 的调用顺序，确保在每次渲染中，将数组中的 state 和 hook 正确的关联。

2. ### 只在 React 函数中调用 Hook

不要在普通的 JavaScript 函数中调用 Hook。

## Hooks 原理

数组保存每个 hook 的状态，重新渲染时，根据 hook 顺序从数组中获取状态值。

和 fiber node 的关系：

Fiber 结点包含了当前组件的状态、更新函数数组，重新渲染时，会依次执行这些更新函数，获取到最新的状态值。  
React useEffect hook 会在协调过程的 commit 阶段执行。

## 手写一个 hook

TODO

----





React 有自己设计的一套事件处理机制。
