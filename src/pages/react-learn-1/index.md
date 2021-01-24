---
title: 最近读的几篇 react 文章
date: '2021-01-23'
spoiler: 老文章读来也有收获。
cta: 'react'
---

## React Components, Elements, and Instances

1. Components 是创建的组件。

2. Instances 是创建的组件的实例，比如，创建了一个`<Button />`组件，在`<Form />`中使用了很多次，那么每一个就是一个实例。

3. Elements 是一个普通对象，用来描述上面说的组件实例、原生 Dom 元素，和它们的属性。比如：

   ```jsx
   {
   type: 'button',
   props: {
      className: 'button button-blue',
      children: {
         type: 'b',
         props: {
         children: 'OK!'
         }
      }
   }
   }
   ```
本质就是一个 object，描述一个原生按钮，包括它的属性、子元素。如果是描述一个 instance，type 会是定义的组件，比如：`type: 'Button'`。
React 对这两类的处理有什么不一样呢？如果是实例类型，React 会询问对应组件渲染返回的内容。而组件返回的也是一个 element 对象。这样周而复始，React 就组建了一个描述界面所需的所有元素的普通对象。

4. Top-Down Reconciliation  
上面描述的过程大概是酱紫，假设根组件是一个 Form

   ```jsx
   ReactDom.render(<Form isSubmitted={false} buttonText="ok" />, document.queryElementById('root'))
   ```
   React 首先会问 Form 返回什么样的 element tree，再基于这个树，层层往下的构建一整个树
   ```jsx
   // Form
   {
      type: Form,
      props: {
         isSubmitted: false,
         buttonText: 'OK!'
      }
   }

   // Form 告诉 React 返回的 element 结构
   {
      type: Button,
      props: {
         children: 'OK!',
         color: 'blue'
      }
   }

   // Button 再告诉 React 返回的 element 结构
   {
      type: 'button',
      props: {
         className: 'button button-blue',
         children: {
            type: 'b',
            props: {
            children: 'OK!'
            }
         }
      }
   }
   // 到原生元素就结束了
   ```
上面的过程是 React reconciliation 的一部分，它结束的时候，React 已经有了完成的一个 element tree。然后 React renderer 会将最小的改动集合应用到界面上。

值得说明的是，instances 在 React 中并不重要，它自己会创建每一个类组件的实例并管理它。

## Reconciliation
是 React 中负责处理更新的模块，包含了 Diff 算法。
因为使用现有算法比较两个 element tree，复杂度太高，React 定义了两个假设：
   1. 两个不一样类型的元素会产生不同的树
   2. 开发者可以通过 key 属性来标示某个元素在不同的渲染中可能是不变的
### The Diffing Algorithm
React 在比较树时，会先对比根元素，如果两个元素不一样，会直接舍弃旧树，构建新树。舍弃旧树时，如果是 class 组件， `componentWillUnmount()` 会被调用。构建新树时，`UNSAFE_componentWillMount()` 会被调用。

当比较相同类型的 Dom 类元素时，React 只会查找属性并**只**更新改变的。当处理完当前元素时，会遍历(recurse)处理它的子元素。

当比较相同类型的组件实例时，React 会更新实例的 props，并调用 `UNSAFE_componentWillReceiveProps()`，`UNSAFE_componentWillUpdate()` and `componentDidUpdate()`。16.3 之后的版本，会调用 `static getDerivedStateFromProps()`。
需要注意的是，组件的状态会跨院更新存在。

然后，`render()`方法被调用，react 会对返回的结果和之前的结果，递归的执行 diff 算法。


### Recursing On Children
默认情况下，对于 Dom 元素，React 同一时间比对它们的子元素，同一位置只要不一样就会生成一个改变。而下面的例子 1 和 2，性能方面明显是 2 好于 1 的，因为 React 不知道哪些元素可以保留复用。
   ```jsx
      // 1
      <ul>
         <li>first</li>
         <li>second</li>
      </ul>

      <ul>
         <li>first</li>
         <li>second</li>
         <li>third</li>
      </ul>
   ```

   ```jsx
      // 2
      <ul>
         <li>Duke</li>
         <li>Villanova</li>
      </ul>

      <ul>
         <li>Connecticut</li>
         <li>Duke</li>
         <li>Villanova</li>
      </ul>
   ```

所以，我们使用 key 属性告诉 React，哪些元素在更新前后是同一个元素，如果更新后仍然存在，React 需要做的可能就是更新一下属性，挪动一下位置，而不用重新生成，提高了性能。

这里有个需要注意的地方，不要使用数组索引作为 key，尤其是在数组会重新排序的情况下。为什么呢？通过上面可以知道，React 使用 key 来确认同一个元素，然后只更新它的 props。这里的元素可能是 Dom 节点，也可能是组件实例。
对于 Dom 节点，主要是 form 类元素，它们有默认的内部状态(没搜到浏览器对于此类元素对处理)。对于实例，我们假设它内部有 form 类元素，或者有自己的状态。然后触发一次倒序排列，因为使用数组索引作为 key，所以同一位置的 key 不变。
react 在 diff 新树和旧树时，发现同一位置的 key 一致，就只更新它的 props，保留它的状态。这就产生了问题，**更新完后排在第一个的实例，使用的是最后一个实例的 props，但 state 还是更新之前的状态**。
我改了下[官方](https://reactjs.org/redirect-to-codepen/reconciliation/index-used-as-key)的例子，在 input 元素的默认状态之外，加了个自己定义的状态，可以更清楚的看到，props 改变，state 未变：https://codesandbox.io/s/stupefied-snow-f1bxb?file=/src/App.js

`Math.random()`也不要用，每次更新 key 都不一样，会导致不必要的实例创建。
