---
title: useReducer 的全部
date: '2021-09-27'
spoiler: 一文搞懂 useReducer
cta: 'react'
---

useReducer 是 useState 的替代方案。当 useState 不能很好的满足需要的时候，useReducer 可能会解决我们的问题。

## 用法

`const [state, dispatch] = useReducer(reducer, initialArg, init);`

第一个参数 reducer 是函数 `(state, action) => newState`，接受当前的 state 和操作行为。第二个参数 initialArg 是状态初始值。第三个参数 init 是懒惰初始化函数。

用官方的一个例子看一下使用方式

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

dispatch 的参数是 reducer 的 action，reducer 函数根据传入的 action 执行某些逻辑，最后返回的就是新状态。

## 用途
  - dispatch 向下传递
    dispatch 可以代替 callback 的方式向子组件传递，进行从下向上的更新。优点在于 dispatch 在更新时不会重新定义，或多或少的减少了一点重新定义 callback 函数的开销，还便于子组件根据 props 判断是否需要更新。

    假如层级过深，还可以搭配 context 使用，此时使用 dispatch 代替 callback 优势更明显。因为 dispatch 在 re-render 时不变，不会引起使用 context 的组件执行无意义的更新。

  - 批量更新
    react 对事件之外的更新不会批量处理，使用 reducer 可以避免此类问题，代码如下：
    
    ```jsx
      const reducer = (state, action) => {
        switch(action.type) {
          case 'update':
            return {
              ...state,
              data: action.payload.data,
              loading: false,
            }
          default:
            return state;
        }
      }
      // 事件外触发
      dispatch({ type: 'update', payload: { data }})

      // 或者干脆
      const reducer = (state, newState) => {
        return {...state, ...newState}
      }
      const [state, dispatch] = useReducer(reducer, {loading: true, data: null, something: ''})
      // 触发
      dispatch({loading: false})
    ```

    其本质还是将 state 放到同一个地方处理，只是比 useState 更具可读性。

  - forceUpdate
    useState 和 useReducer 在值一样时会跳过更新，函数组件也没有强制更新方法，我们可以使用 useReducer 模拟一个。

    ```jsx
      const [, forceUpdate] = useReducer(x => x + 1, 0)

      function onClick = () => {
        forceUpdate()
      }
    ```

## 总结
useReducer 是 useState 的替代方案，useState 能做到的事，它都能做到，甚至做得更好。useReducer 某种程度上解耦了操作逻辑(action)和后续的行为(一般是 UI 的更新)，虽然代码量变多了，但是看起来更加整洁。
