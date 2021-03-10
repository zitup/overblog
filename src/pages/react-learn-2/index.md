---
title: React Fiber 架构
date: '2021-03-03'
spoiler: 老文章读来也有收获。
cta: 'react'
---

# React Fiber Architecture

先来了解几个前置概念

## What is reconciliation?（什么是协调）

React 用来比较两个元素树，决定哪部分需要改变的算法。

React 在更新时，有些元素的属性和状态是没有改变的，全部更新一遍会造成浪费，导致处理速度变慢，使用更多的资源等，这就需要一些优化手段，而这些优化就是 reconciliation 的一部分。

我们通常所说的虚拟"DOM"（"virtual DOM"），它背后的算法就是 reconciliation。

虽然Fiber 是对 reconciler 的重写，但是针对协调器的两个假设还是奏效的：
   * 两个不一样类型的元素会产生不同的树，react 会直接替换
   * 列表使用 key 进行区分

## Reconciliation versus rendering（协调 VS 渲染）

DOM 只是 React 可以渲染的环境之一，除此之外还可以向移动端渲染，所以虚拟"DOM"的叫法其实有点错误，它只是在存在于内存中的一个元素树而已。

React 的协调和渲染是分离的，所以可以支持多端渲染，

Fiber 重写了 reconciler，对应的渲染部分也需要做修改适配新架构。

## Scheduling（调度）

调度是个新概念，决定何时应执行工作（work）的过程

React 的一个设计原则是，使用拉取（pull）的方式处理数据和 UI 的关系，这样就可以在必要的时候才执行工作，未执行的可以被挂起等待拉取。有些库则使用推送（push）的方式，没办法调度。

在一个界面上，不是每一次更新都必须马上被应用，这么做有时候还会引起掉帧。就得给不同类型的更新排优先级了，比如动画更新的优先级就高一点。那么谁来做决定优先级这个工作呢，基于拉取（pull）的 react 是自己做，基于推送（push）的库只能靠开发者来做。

为了利用调度彻底修改 react 的核心算法，是 fiber 背后的驱动力。

所以...

## What is a fiber?（什么是一个 fiber ？）

准确的说，react 为了利用调度想达到的目标有以下 4 个：

   * 停止某个工作，稍后可以回来继续执行
   * 为不同类型的工作赋予优先级
   * 重用之前完成的工作
   * 不再需要的时候舍弃工作

为了达到目标，首先需要将工作拆解成多个单元。某种意义上来说，这就是一个 fiber，一个 fiber 代表一个工作单位。

先来回忆下一个概念，`v = f(d)`，表示 react 组件就是数据到 UI 的转换。因此，渲染 react app 类似于函数，其内部调用了其它函数，内部的函数又调用了别的函数，以此继续下去。

这就形成了一个调用栈，当一个新函数执行时，栈顶都会增加一个栈帧（stack frame），这个栈帧代表了这个函数执行的工作。

当处理 UI 时，一下子执行太多的工作，可能会引起掉帧。而且有些工作可能还是没必要的。这是 UI 组件和一般函数不同的地方，它更复杂，有更多的关注点。

新版本的浏览器提供了两个帮助解决此类问题的 API ：`requestIdleCallback` 和 `requestAnimationFrame`，但是不够灵活。

所以有了 React Fiber，为了自定义调用栈的行为，专门优化 UI 渲染，随时打断调用栈，手动管理栈帧，这就很灵活了，可以做的事情很多。

Fiber 可以看作是专门为了 react 组件进行的、对栈的重新实现。可以认为一个单独的 fiber 就是一个虚拟的栈帧。

重新实现栈可以让栈帧保存在内存中，随时调用，想怎么用就怎么用，对达到调度的目标至关重要。

### Structure of a fiber（fiber 的架构）

具体来说，一个 fiber 就是一个包含组件信息和它的输入输出的 JS 对象。

一个 fiber 对应一个栈帧，也对应一个组件的一个实例。

#### type and key

和 react element 的 type、key 一样

### child and sibling

这两个字段指向其它的 fiber。child 就是 render 方法返回的值。


当返回多个 child 时，比如

```jsx
function Parent() {
  return [<Child1 />, <Child2 />]
}
```

Parent 的 child 是 Child1, Child1 的 sibling fiber 是 child2.

可以将 child fiber 类比尾调用函数（tail-called function）

### return

return fiber 表示处理完当前 fiber 之后，应该返回的 fiber。也可以认为是 parent fiber。对比栈帧理解，处理完顶部的，返回下一个。


### pendingProps and memoizedProps

props 是一个函数的参数。一个 fiber 开始执行时设置的 props 称作 `pendingProps`, 执行完之后设置的称作 `memoizedProps`。

当传入一个 fiber 的 `pendingProps` 等于 `pendingProps` 时，表明这个 fiber 上一次的输出可以被复用，避免不必要的工作。

### pendingWorkPriority

一个数字，标示一个 fiber 代表的工作的优先级。除了 0 之外，越大的数字表示越低的优先级。`scheduler` 使用优先级字段来查找下一个需要执行的工作单元。

### alternate

#### flush

冲洗一个 fiber 就是将它的输出渲染到界面

#### work-in-progress

fiber 还未执行完毕，具体地说，还未返回东西


在任何时候，一个组件实例最多有两个 fiber 对应它：一个当前已经冲洗出来的，一个 work-in-progress fiber

当前 fiber 的备用 fiber 是 work-in-progress fiber，work-in-progress fiber 的备用 fiber 是当前 fiber

### output

就是当前环境的原生组件，对浏览器来说就是那些 dom 元素，`div`、`span` 等。

每一个 fiber 最终都有输出，都是通过原生组件的形式。它们的输出会传输到构建的树上。


[纤程](https://zh.wikipedia.org/wiki/%E7%BA%96%E7%A8%8B)

[排程](https://zh.wikipedia.org/wiki/%E6%8E%92%E7%A8%8B)

https://github.com/acdlite/react-fiber-architecture
