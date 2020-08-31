---
title: react 15.4.2 到 16.13.1 升级过程
date: '2020-08-08'
spoiler: 纯记录
cta: 'react'
---

1. react 16.9.0 剥离了 `prop-types`，需要安装 `prop-types` 单独引用

2. `javascript:; '' React 16.9.0 deprecates javascript: URLs`
因为安全原因，react 16.9 开始禁用了 `javascript:` 链接，用 `onClick={e => e.preventDefault()}` 代替，或者使用button按钮。
> Warning: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed "javascript:void(0)".

3. `react-hot-loader` 推荐使用 `react-refresh` 代替了

4. setstate 中再调用 setstate
> Warning: An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.

问题出在用 this.setState 的 callback 的方式，但是在callback里又调用了setState, 比如：
```jsx
this.setState((prevState) => {
  // ...
  this.setState({ a: aaa })
})
```
所以应该返回新的state:
```jsx
this.setState((prevState) => {
  // ...
  return { a: aaa }
})
```
如果必须再使用 setState ，建议换个写法。

5 . API 替换
* componentWillMount
  一般初始化操作放到constructor，获取数据等有副作用操作放到componentDidMount
* componentWillReceiveProps
  这个API涉及到父组件，需要结合业务和本组件内的逻辑来修改，优先考虑拆分清楚组件状态，最好是单一数据源，也可以用getDerivedStateFromProps替代（有必要的话），参考[你可能不需要使用派生 state](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

6 . 父组件两次渲染，完全受控的组件直接修改props，会污染父组件的state
应该是和 props 引用相关，子组件的避免直接修改，可以深拷贝一个，再改。