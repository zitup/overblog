---
title: useCallback 和 useMemo
date: '2021-09-27'
spoiler: 一文搞懂 useCallback 和 useMemo
cta: 'react'
---

useCallback 和 useMemo 都是 react 世界中性能优化的手段，而且两个 API 在某种情况下是完全相等的，所以把它们放到一篇文章中。

## 用法

```jsx
  // useCallback
  const memoizedCallback = useCallback(
    () => {
      doSomething(a, b);
    },
    [a, b],
  );
```

useCallback 接受两个参数，一个函数，一个依赖数组，返回一个记忆化了的函数。它只在依赖改变时，重新声明第一个函数参数。依赖未改变时，返回的是同一个函数引用。

```jsx
  // useMemo
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

useMemo 接受两个参数，一个函数，一个依赖数组，返回一个记忆化了的值。它只在依赖改变时，重新执行第一个函数参数。依赖未改变时，返回的是同一个值。

`useCallback(fn, [deps])` 等于 `useMemo(() => fn, [deps])`。某种程度上，useMemo 可以理解为 useCallback 的超集。

## 用途
两者作为性能优化的手段，在某些场景下非常有用，可以避免一些不必要的重渲染、昂贵的计算，提高页面的响应速度。

  - useCallback 记忆化函数
    useCallback 返回的函数可以作为其它 API 的依赖项，节省一些计算；也可以代替 useReducer 的 dispatch 作为 props 或者搭配 context 向子组件传递，避免一些不必要的重渲染
  - useMemo 记忆化组件
    `const child = useMemo(() => <Child a={a} />, [a])` 可以跳过一些消耗较高组件的重渲染

## 需要注意的地方
useMemo 只在初始化和依赖变化的时候执行函数，这描述像不像 React 的另一个 API - useEffect ?

```jsx
  // 依赖项中的 a 可能是 props，也可能是 state
  useMemo(() => {
    // do something
  }, [a])

  //vs

  useEffect(() => {
    // do something
  }, [a])
```

简直一模一样，而且这样使用 useMemo 没有任何问题，但是并不能把 useMemo 当 useEffect 使用，除了 react 建议 useMemo 只作为性能优化的手段，以后的版本可能有更改之外，这俩在执行时机上也不同。

useMemo 在渲染过程中执行，useEffect 是在浏览器绘制之后执行。在 useMemo 中执行有副作用的代码，可能会延迟 UI 的渲染。

那么，useMemo 和 useLayoutEffect 呢...？

useLayoutEffect 是在组件挂载到组件树上后执行，和 useMemo 的执行时机也不一样。

总之，虽然 useMemo 看起来可以做的更多，但是只建议用在性能优化上。

> 参考  
> [useMemo vs. useEffect + useState](https://stackoverflow.com/questions/56028913/usememo-vs-useeffect-usestate)  
> [Use case for useLayoutEffect + useState vs useMemo](https://stackoverflow.com/questions/57030945/use-case-for-uselayouteffect-usestate-vs-usememo)  
> 注意：例子仅说明两者可以做到类似事情，仍然不建议 useMemo 做性能优化之外的事情。
