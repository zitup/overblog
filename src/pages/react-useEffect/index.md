---
title: react - useEffect 小记
date: '2020-11-29'
spoiler: useEffect 和 useLayoutEffect
cta: 'react'
---

`useEffect` 在渲染后执行，假如在 `useEffect` 有一个 `state`，会影响界面的变化，此时，在用户眼中，界面会发生可见的闪烁

```jsx
const [isShowA, setIsShowA] = useState(false)
useEffect(() => {
  setIsShowA(true)
}, [])

return {isShowA ? <A /> : <B />}
```

上述代码，会先把 B 组件渲染到界面上，执行副作用之后，会变成渲染 A，就会造成“闪烁”。
解决办法可以是把 `useEffect` 变成 `useLayoutEffect`，`useLayoutEffect` 会同步执行副作用，就是在渲染 DOM 之前执行副作用，这样渲染时就是最后的界面。

上述 `useEffect` 中同步的代码，可以用 `useLayoutEffect` 处理，但是如果 `useEffect` 中是异步的代码，比如请求数据：

```jsx
useEffect(() => {
  request(url).then((res) => {
    setIsShowA(res);
  });
}, []);
```

此时，替换成 `useLayoutEffect` 也没用了，`setState` 操作还是会在渲染完成之后执行，这样就需要用其他的办法，比如，默认谁也不渲染，等状态确认之后再渲染：

```jsx
const [isShowA, setIsShowA] = useState(false);
const [isShowB, setIsShowB] = useState(false);

useEffect(() => {
  request(url).then((res) => {
    if (res) {
      setIsShowA(true);
    } else {
      setIsShowB(true);
    }
  });
}, []);

return (
  <>
    {isShowA && <A />}
    {isShowB && <B />}
  </>
);
```

这样不会造成明显的两个界面的切换，但是可能界面会有一丢丢的渲染缓慢，可以用 loading 、 骨屏之类的缓冲一下。
