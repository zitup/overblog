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

Hook 本质就是 JavaScript 函数，在首次执行时，计算出状态值存入一个链表，在重新渲染时，根据 hook 顺序再从链表中获取状态值。

这些信息保存在 fiber 结点对象中，fiber 结点包含了当前组件的状态、更新函数数组，重新渲染时，会忽略传入 hook 的参数，只获取当前的状态值。再比如 useEffect hook，在更新时，会比对当前最新依赖值和从 fiber 对象中获取的状态值进行对比，有变化时再执行会调函数。  
React useEffect hook 会在协调过程的 commit 阶段执行。

https://segmentfault.com/a/1190000039076330

## 手写一个 hook

TODO

----

React 事件系统

React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同：

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

函数的参数 e 是一个合成事件。React 根据规范来定义这些合成事件。

## SyntheticEvent

SyntheticEvent 是浏览器的原生事件的跨浏览器包装器。函数的默认参数 e 就是 SyntheticEvent 的一个实例。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

每个 SyntheticEvent 对象都包含以下属性：

```jsx
  boolean bubbles
  boolean cancelable
  DOMEventTarget currentTarget
  boolean defaultPrevented
  number eventPhase
  boolean isTrusted
  DOMEvent nativeEvent
  void preventDefault()
  boolean isDefaultPrevented()
  void stopPropagation()
  boolean isPropagationStopped()
  DOMEventTarget target
  number timeStamp
  string type
```

其中 nativeEvent 属性可以获取浏览器的原生事件。

不同的事件还包含自有属性。具体可以查看[官网的罗列](https://reactjs.org/docs/events.html#supported-events)。

## 事件机制

React 为什么自己实现一套事件机制？

- 抹平浏览器之间的兼容性差异
- 向事件添加优先级信息，配合调度
- 优化，将事件统一绑定到根结点，减少内存开销

React 事件机制可以分为两步：注册和触发。这里做一些简单的描述，不涉及具体的代码实现。

### 事件注册

在 react 构建时，fiber 结点上的事件属性会被识别为事件进行处理。

React 会根据事件名称寻找该事件的依赖，这里的依赖是指 react 合成事件和原生事件的对应关系，比如 onMouseEnter 事件依赖了 mouseout 和 mouseover 两个原生事件，onClick 只依赖了 click 一个原生事件。React 会循环这些依赖，在 root 上绑定对应的事件。

### 事件触发

当通过交互触发事件时，会经过这三个步骤：**事件对象的合成、将事件处理函数收集到执行路径、事件执行**。

#### 合成事件对象

也就是合成 SyntheticEvent 对象，供后续事件执行使用。

#### 事件执行路径

当事件对象合成完毕，会将事件收集到事件执行路径上。什么是事件执行路径呢？

DOM 元素上的同类型事件会按照冒泡或者捕获的顺序执行，在 React 中，它模拟了一套事件捕获和冒泡的机制。

从触发事件的元素开始，依据 fiber 树的层级结构向上查找，累加上级元素中所有相同类型的事件，最终形成一个具有所有相同类型事件的数组，这个数组就是事件执行路径。

在向上查找过程中，在沿途 fiber 的属性中获取到同类型的事件处理函数，push 到执行路径中，等待下一步的批量执行。

#### 事件执行

经过上面两个步骤，得到了事件执行路径和一个共享的事件合成对象，之后进入到事件执行过程，循环事件执行路径，依次执行处理函数。

## 事件系统和优先级的联系

绑定到 root 上的事件监听函数是一个有着优先级信息的事件监听包装函数。事件优先级是根据事件的交互程度划分的，react 会根据事件名返回不同级别的事件监听包装器。

总的来说，会有三种事件监听包装器：

dispatchDiscreteEvent: 处理离散事件，click、keydown、focusin等，这些事件的触发不是连续的，优先级为0  
dispatchUserBlockingUpdate：处理用户阻塞事件，drag、scroll、mouseover等，特点是连续触发，阻塞渲染，优先级为1  
dispatchEvent：处理连续事件，canplay、error、audio标签的timeupdate和canplay，优先级最高，为2。

当触发事件时，react 会将优先级信息传递给 scheduler ，scheduler 才能获知当前任务的优先级，然后展开调度。

> 参考：https://segmentfault.com/a/1190000039108951
