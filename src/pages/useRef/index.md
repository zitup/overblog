---
title: useRef 的全部
date: '2021-08-18'
spoiler: 一文搞懂 useRef
cta: 'react'
---

## refs 介绍

在 React 数据流中，props 是父组件和子组件交互的唯一方式。要修改一个子组件，必须使用新的 props 去重新渲染它。而 refs 提供了另一种方式，允许我们在 React 典型数据流之外，去操作 DOM 元素和类组件的实例。

### DOM、类组件和 ref
React 中有两个创建 ref 的方法，createRef() 和 useRef()。

```jsx
const ref = React.createRef(defaultValue)

// 仅限函数组件
const ref = useRef(defaultValue)
```

使用 ref，只需要将创建的 ref 赋到 DOM 和类组件的 ref 属性上即可。当组件挂载之后，ref 的 current 属性访问的就是对该节点的引用，DOM 元素时就是该元素，类组件时就是该组件的实例。

### 函数组件和 ref
函数组件不支持 ref 属性，因为它没有实例，有时候可以使用下面介绍的 ref 转发来做一些操作，比如将 ref 传递给函数组件的某个 DOM。除了 ref 转发之外，也可以在函数组件的 props 中添加一个特殊的 prop ，接收父组件的 ref，再赋值到具体的 DOM 上。

这两种做法都是将子组件的某些掌控权交给父组件。

## 回调 refs
这是 react 中另外一个使用 ref 的方式。在 DOM 或者类组件的 ref 属性上，传递一个函数。React 会将当前的元素的引用作为此函数的参数，进行后面的操作。

```jsx
const refCallback = (ref) => {
  if (ref) {
    //
  }
}
<div ref={refCallback}></div>
```

React 将在组件挂载时，执行传入 ref 的回调函数并传入 DOM 元素，卸载时调用它传入 null。

需要注意的是，回调函数传入的值可能会是 null，在回调函数中需要针对 null 的情况做处理，避免出现问题。

为什么会有 null 呢？如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。  

ref 应该没有新旧之分，清空旧的应该是针对回调函数中的引用的 props 和 state。经过测试，在回调函数中打印 state 的值，第一次传入参数 null 时，回调函数中引用的 state 还是更新之前的值，第二次传入 DOM 元素时，回调函数中的 state 已经是最新值，所以猜测是 React 想清除回调函数在上一次执行环境中的副作用。

## ref 转发
refs 转发是将 ref 向下传递，允许某些组件接收 ref，比如函数组件。函数组件本身没有 ref 属性，但是可以通过转发，将子组件 DOM 的控制权暴露给父组件。

```jsx
React.forwardRef((props, ref) => {
  return <button ref={ref}>click me</button>
})
```

forwardRef 接受渲染函数作为参数，普通函数和 class 组件无法使用 ref 转发。将普通函数传入 forwardRef 时，第二个参数 ref 不存在；将 class 组件传入 forwardRef 时会出错，因为 class 组件不是函数类型。

在高阶组件（HOC）中使用 ref 时，需要避免 ref 不向下传递的问题。高阶组件会将所有的 props 向下传递，但是 ref 是单独的一个属性，和 key 类似，不向下传递，所以当你希望可以获取到被包裹的组件实例，而将一个 ref 挂到高阶组件上时，获取到的并不是相应的组件。  
这时候可以通过 ref 转发，在高阶组件中获取到 ref，再将 ref 通过特殊的 prop 名字向下传递。[参考](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)


## ref 的几种用法

  - 类似实例变量，存储某些值  
    ref 就像一个盒子，可以保存任何一个可变的值。它会确保在每次更新渲染中返回的是同一个 ref 对象。这给函数式组件提供了一种在更新之外使用可变变量的方式。
    > Unless you’re doing lazy initialization, avoid setting refs during rendering — this can lead to surprising behavior. Instead, typically you want to modify refs in event handlers and effects.  
    > React 不建议在渲染过程中修改 ref，也没说原因，估计是底层相关部分没那么坚固，尽量避免吧，在函数或者 effect 中修改。
    - 获取上一轮的 props 或 state  
      在 useEffect 中将值保存在 ref.current，下次更新时取到的就是上一轮的数据
    - 在 setTimeout/setInterval 中使用  
      [ref 是解决定时器重复定义的好办法](https://overreacted.io/making-setinterval-declarative-with-react-hooks)
  - 使用回调 ref 连接 DOM  
    useRef 和 createRef 不会把值的变化通知到我们，回调 ref 可以做到这一点，在变化时会执行传入的函数。不要忘了处理 null 的情况
  - 引用函数组件  
    我们可以使用 ref 直接引用 class 组件，那么可以引用函数组件吗？也可以，但是和 class 组件方式不一样，我们使用 useImperativeHandle hook 结合 ref 转发，自定义向父组件暴露的方法。

    useImperativeHandle 函数签名
    ```useImperativeHandle(ref, createHandle, [deps])```  
    它一般结合 ref 转发使用，自定义向父组件暴露的一些值。

    ```jsx
    // 子组件
    function Form(props, ref) {
      const onChange = () => {
        //
      }

      const inputRef = useRef(null)
      useImperativeHandle(ref, () => ({
        focus: () => {
          inputRef.current.focus()
        },
        onChange,
      }))

      return <input ref={inputRef} onChange={onChange}/>
    }
    export default forwardRef(Form)

    // 父组件
    function Page() {
      const ref = useRef(null)

      return <Form ref={ref} />
    }
    ```
    这样在父组件的 ref.current 上，就有了两个方法：focus 和 onChange

## 总结
以上便是 ref 的相关内容，涵盖了一些基本概念，和常用的具体实践，没事回来看看，常看常新～
