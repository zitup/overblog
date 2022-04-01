---
title: React 18 is coming!
date: '2022-03-15'
spoiler: React：我今年 18 啦！
cta: 'react'
---

React 18 大版本即将释放，来学习一下最新知识和 API。

> https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html

## API 替换

### `ReactDOM.createRoot` 代替 `ReactDOM.render`

可以使用 React 18 所有的新功能，启用了并发渲染，可选的使用并发相关的 API。

```jsx
// Before
import { render } from 'react-dom'
const container = document.getElementById('app');
render(<App tab='home' />, container)

// After
import { createRoot } from 'react-dom/client'
const container = document.getElementById('app');
const root = createRoot(container)
root.render(<App tab='home'>)
```

### `root.unmount` 替换 `unmountComponentAtNode`

```jsx
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

## SSR 更新（略）

https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-server-rendering-apis

## 自动批处理

React 18 将异步操作中的多个状态更新，也进行了批处理，只执行一次重渲染。

如果不想进行批处理，可以使用 `ReactDOM.flushSync` API。

## 新 API

### useId

用于在客户端和服务器上生成唯一 ID 的新钩子，同时避免注水不匹配。

### useSyncExternalStore

一个新的钩子，允许外部存储通过强制对存储的更新同步来支持并发读取。

> https://www.zhihu.com/question/502917860

### useInsertionEffect

一个新的钩子，允许 CSS-in-JS 库解决在渲染中注入样式的性能问题。这个钩子将在 DOM 发生改变之后运行，但在 `useLayoutEffect` 读取新布局之前。这解决了 React 17 及更低版本中已经存在的问题，但在 React 18 中更为重要，因为 React 在并发渲染期间屈服于浏览器，使其有机会重新计算布局。

### startTransition
### useDeferredValue

## 严格模式的更新

React 未来想保留状态，可以添加和移除某一部分 UI。比如，在前进后退时，快速展示之前的页面。为此，React 将使用与以前相同的组件状态卸载和重新加载树。

这个功能会让组件卸载和加载多次，这就要求组件的副作用部分在这过程中不会出现问题，因为有些副作用会假设只执行和销毁一次。

所以为了暴露可能会出现的问题，React 18 为严格模式（Strict Mode）添加了一个仅在开发模式下的检查。每当第一次加载一个组件时，这个新检查会自动卸载和重新加载组件，并在第二次加载时复用之前的状态。也就是说会模拟一下多次卸载和加载的过程，看是否有问题。

## 不再支持 IE

> 04-01 Update https://reactjs.org/blog/2022/03/29/react-v18.html

**Suspense 是什么？**

React 18 已经发布到 npm，成为了默认安装版本。

## What is Concurrent React?

并发模式的一个关键特性，就是**可中断**。React 默认不启用并发模式，只在使用了并发 API 的情况下才启用，也就是说默认情况下，React 18 和之前的版本一样，不可中断、同步更新，可以参考[这里](https://mp.weixin.qq.com/s/tC2VF_uIZf4RfBWdlpaKUA)。

https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html
