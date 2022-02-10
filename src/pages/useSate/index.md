---
title: useState 的全部
date: '2021-07-21'
spoiler: 一文搞懂 useState
cta: 'react'
---

state 是 React 中很重要的一部分，它让 react 有了状态，想象一下假如没有 state，react 就没有办法让 UI 对用户的操作作出反应，只能是静态的页面。

useState 是 Hooks 的一部分，拥有了在函数组件内使用状态的能力。

## 声明一个 state
```jsx
  const [state, setState] = useState()
  // React 保证 setState 函数在**重新渲染中是不变的**，所以可以在 useEffect 或 userCallback 的依赖列表中省略

  // 在更新执行时，useState() 内的参数会被省略，只是读取这个 state 和 setState 并返回
```

### state 的懒惰声明
```jsx
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

```jsx
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

首先来看下这两个的区别，第一个是函数执行，相当于

```jsx
const value = createRows(props.count);
const [rows, setRows] = useState(value);
```
所以在 re-render 时每次都执行，但是 rows 的值是不变的，除非调用 setRows ；
第二个是函数定义，虽然 re-render 时每次都会重新声明，但是只会在初始化的时候执行一次，更新时，react 不会再执行它。

第二个其实就是懒惰初始化，可以避免一些昂贵的计算重复执行。

## 更新一个 state
使用 useState 返回的第二个参数更新 state
```jsx
const [state, setState] = useState()

const fn = (value) => {
  // 更新 state 并触发重新渲染
  // 另外，如果更新返回的值和当前状态相同，那么将完全跳过后续的重新渲染。判断是否相同使用 `Object.is` 进行值的对比。
  setState(value)
}
```

useState 没有 this.setState 那样的回调函数，可以确保在 state 更新后再做些什么。但是可以借助 useEffect 来实现。

```jsx
const [value, setValue] = useState(0)

function () {
  setValue(newValue)
}

useEffect(() => {
  // ...
}, [value])
```

## setState 是异步还是同步？
严格来说，不是异步也不是同步。setState 有时候不会即时更新是因为 React 的优化机制，在事件处理器中批量处理更新。而在某些时候，setState 会同步更新。分别看一下这两种情况。

### batch
在事件处理器中，React 会批量处理更新，比如
```jsx
const onClick = () => {
  this.setState({a: 1})
  this.setState({a: 2})
}
```
组件只会更新一次

而在异步代码（promise、async/await、setTimeout/setInterval、fetch）中的更新，不会批量处理，
比如:
```jsx
const onClick = () => {
  callAPI().then(() => {
    this.setState({a: 1})
    this.setState({a: 2})
  })
}
```
组件会更新两次，我们称这样的更新是 outside of react event handlers, 发生在 react 事件处理器之外，此时的回调在 react 执行机制完成之后进行，react 没办法批量更新。

### 那么为什么 setState 要设计成“异步”的，或者说为什么要有 batch？

简单概括就是为了避免多次更新。
如果 setState 是同步的，多次调用 setState 时，react 就有多次重新渲染，而有些渲染是没有必要的。


> ？？：多次调用 setState 时，react 就有多次重新渲染。不会影响 setState 之后的逻辑执行吗？

> 不会。react 在class组件中异步调用 setState 时，会先进行状态更新、re-render，然后按生命周期有序执行，在生命周期完成之后再继续执行 setState 之后的逻辑。
> 但是在函数式组件中，react 在 setState、re-render 之后，会先执行 setState 之后的逻辑（直到遇到另一个 setState），然后再去按生命周期执行。
> 区别如下：
> class 式组件
> ```jsx
> state = {
>    a: 0,
>    b: 0
>  }
>
>  componentDidMount() {
>    setTimeout(() => {
>      this.setState({a: 1})
>      console.log('a', this.state.a)
>
>      this.setState({b: 1})
>      console.log('b', this.state.b)
>    }, 1000)
>  }
>
>  componentDidUpdate() {
>    console.log('updated', this.state.a, this.state.b)
>  }
>
>  render() {
>    const {a, b} = this.state
>    return <div>{a} {b}</div>
>  }
> ```
> 输出：updated 1 0 , a 1 , updated 1 1 , b 1
> 
> 函数式组件
> ```jsx
>   const [a, setA] = useState(0)
>   const [b, setB] = useState(0)
>
>   useEffect(() => {
>      setTimeout(() => {
>        setA(1)
>        console.log('a')
>
>        setB(1)
>        console.log('b')
>      }, 1000)
>    }, [])
>
>    useEffect(() => {
>      console.log('effect', a, b)
>    }, [a, b])
>
>    return <div>{a} {b}</div>
> ```
> 输出：effect 0 0 , a , effect 1 0 , b , effect 1 1


## 如何优化无法批量更新的更新呢？
1. 把 state 整合进一个 object，这样多个更新就变成了一个更新
2. 可以使用 React 提供的一个 API，手动强制批量更新。

```jsx
promise.then(() => {
  ReactDom.unstable_batchedUpdates(() => {
    this.setState({a: true}); // Doesn't re-render yet
    this.setState({b: true}); // Doesn't re-render yet
    this.props.setParentState(); // Doesn't re-render yet
  })
  // When we exit unstable_batchedUpdates, re-renders once
})
```

React event handlers 默认被包含在 unstable_batchedUpdates，所以它们可以批量更新。在其他地方可以强制使用 unstable_batchedUpdates，当 unstable_batchedUpdates 结束时，更新会被刷新到界面。
3. useReducer

> React 18 针对 react 事件之外的更新后会自动 batch
> 参考: https://github.com/reactwg/react-18/discussions/21

## useState 技巧
以上是 useState 基本使用总结，这一节记录一些实际业务中遇到的 useState 问题和解决办法。

1. useState 懒惰初始化函数中，依赖的 props 或者 redux 某个值发生变化怎么办？
   1. 首先看逻辑是否可以适配props值的改变
   2. 通过 useEffect 更新 state
      1. 问题：state 值需要重新计算
      2. 懒惰初始化函数需要抽象出来
   3. 使用 useMemo
      1. 问题：可能会依赖其它变量，其他变量保持不变还好，如果也发生改变，可能会重新计算，要确定这是否是想要的结果。

## 参考：
1. https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
2. https://github.com/reactwg/react-18/discussions/21
