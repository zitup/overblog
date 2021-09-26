---
title: useContext 的全部
date: '2021-09-02'
spoiler: 一文搞懂 useContext
cta: 'react'
---

React Context 提供了一个不用向每层组件手动添加 props，就能在组件树之间进行数据传递的方法。

## 为什么需要 Context

当孙子组件需要使用爷爷组件的变量时，需要在父组件上进行实际上无用的传递。React 数据一般通过 props 由父到子传递，context 提供了一种在组件间共享数据的方式，不用我们显示的层层传递数据。

## 使用 Context 之前的考虑

[官方文档说到](https://zh-hans.reactjs.org/docs/context.html#before-you-use-context)，context 会使组件的复用性变差，所以建议谨慎使用。但是如果我们在纯业务组件中并不会考虑复用性，这时候使用就没有任何问题。

考虑到 context 解决的问题，有时候可以使用组件组合。这种方式是要把需要使用数据的组件提升到高层次组件，然后将组件本身层层传递下去。但是将底层逻辑提升，首先会污染高层组件，使它更复杂，然后还具有传染性，后面的组件还是需要向下层层传递。而且被提升的组件需要和父组件完全解耦，限制也较多。

## 如何使用

### 创建 context

```jsx
  const MyContext = React.createContext(defaultValue)
```

### 提供 context

```jsx
  <MyContext.Provider value={}>
    {children}
  </MyContext.Provider>
```

### 消费 context

```jsx
  // class contextType
  static contextType = MyContext;
  console.log(this.context)

  // function hook
  const value = useContext(MyContext)

  // 使用 consumer
  // Consumer 需要一个函数作为子元素。这个函数接受 context 的值作为参数，并返回一个 React 节点。
  <MyContext.Consumer>
    {value => <span>{value}</span>}
  </MyContext.Consumer>
```

**只有**当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效（有点类似解构赋值时，只有在 undefined 下赋值才会生效）。

Provider 接收一个 value 属性，传递给消费组件。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 value 值发生变化时，它内部的**所有**消费组件都会重新渲染。这是因为更新 value 值一般是使用 setState，会引发后代更新。从 Provider 到其后代 consumer 组件的传播，不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新，甚至 consumer 组件内部的 shouldComponentUpdate 返回了 false，也不影响它消费 context 进而重新渲染。

这里的所有消费组件指 Provider 的所有后代。可以想到，订阅了 context 的后代重新渲染很合理，那么没有订阅的也要重新渲染，是不是有点浪费呢，怎么避免这些无效的重复渲染呢？

  - 合理组织组件结构
    将需要使用的消费组件放到 Provider 中，其它的放到外部。这种方式仅适用于根组件，假如在消费组件中存在未使用 context 的组件，还是会重新渲染。
  - 使用 pureComponent
    或者 shouldComponentUpdate 可以避免 class 组件的更新，也不影响 context 继续向下传播，只适用于 class 组件。
  - 用一个组件包裹 Context.Provider，把子组件以 props.children 的方式传进来
    ```jsx
      // context wrapper
      const MyContext = React.createContext('')

      const ProviderWrapper = (props) => {
        const [value, setValue] = useState('test')
        return (
          <MyContext.Provider value={value}>
            <button onClick={() => {setValue(+new Date())}}>修改 context</button>
            {props.children}
          </MyContext.Provider>
        )
      }

      // App 组件
      import ProviderWrapper from './providerWrapper'

      class App extends React.Component {

        render() {
          return (
            <ProviderWrapper>
              <ClassCompt2 />
              <ClassCompt3 />
            </ProviderWrapper>
          )
        }
      }
    ```
    以上例子，ClassCompt3 使用了 context ，ClassCompt2 未使用，使用上面这种方式，ClassCompt2 不会重新渲染。

    为什么呢？React 默认行为是，父组件 setState 时，如果子组件的 shouldComponentUpdate 返回 true（默认为 true），子组件就会重新渲染。常规代码如下：

    ```jsx
      <MyContext.Provider value={value}>
        <ClassCompt2 />
        <ClassCompt3 />
      </MyContext.Provider>
    ```

    App 组件成了无状态组件，传递给 ProviderWrapper 的 children，在更新时没有发生改变，就不会再重新渲染了。

## 使用技巧
  - 深层组件更新 context
    context 中包含一个修改值的函数，底层组件可以通过调用这个函数修改 context 的值。
  - 同一个组件消费多个 context
    函数组件使用多个 useContext，class 组件用函数包裹使用 Context.Consumer 嵌套包裹
    
    ```jsx
      <ThemeContext.Consumer>
        {theme => (
          <UserContext.Consumer>
            {user => (
              <ProfilePage user={user} theme={theme} />
            )}
          </UserContext.Consumer>
        )}
      </ThemeContext.Consumer>
    ```
  - context 使用浅比较决定是否重渲染订阅的组件，假如使用下面的方式传入 value，会导致多余的重渲染
    ```jsx
      <MyContext.Provider value={{value: 'something'}}>
        {children}
      </MyContext.Provider>
    ```

    由于每一次重渲染传给 value 属性的值都是一个全新的对象，会导致后代每次都会重渲染。所以最好把 value 值放到 state 里。

    ```jsx
      constructor(props) {
        super(props);
        this.state = {
          value: {something: 'something'},
        };
      }

      <MyContext.Provider value={this.state.value}>
        {children}
      </MyContext.Provider>
    ```

## 总结
context 虽然有时候可以满足全局状态的概念，但是还有一些细节需要注意，正确的使用才能避免出现问题。
