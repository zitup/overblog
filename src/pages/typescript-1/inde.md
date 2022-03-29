---
title: TypeScript 系统学习之泛型
date: '2022-03-20'
spoiler: TypeScript 第一篇之泛型（Generics）
cta: 'TypeScript'
---

### 泛型是什么

泛型是 TS 中创建可以重用类型的功能。定义一个泛型可以供不同类型使用。

通过一个简单的类型来看下泛型是什么。

```jsx
function identity(arg: number): number {
  return arg;
}
```

函数的参数 arg 只能是 number 类型，假如我们需要也支持其它更多类型，除了使用 any 和枚举所有类型之外，泛型是更合适的方式。

```jsx
function identity<T>(arg: T): T {
  return arg;
}
```

这时候参数 arg 可以是任何类型，返回值也是同样的类型，可以像下面这样使用：

```jsx
identity<string>("myString")
identity<number>(1)

// 或者更简单的使用类型推断
identity("myString")
identity(1)
```

### 泛型变量

```jsx
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);  // Error: T doesn't have .length
  return arg;
}
```

因为 T 可能是数字，数字是没有 length 属性的，所以为报错。这时候可以使用泛型变量，也就是将泛型 T 当作变量使用：

```jsx
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}
```

### 泛型接口

```jsx
interface Identities<V, M> {
  value: V,
  message: M
}
```

以上就是一个泛型接口，可以更灵活、更强大的定义泛型。

```jsx
function identity<T, U>(value: T, message: U): Identities<T, U> {
  return {
    value,
    message
  }
}
```

### 泛型类

```jsx
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
```

### 泛型约束

对泛型进行一定的约束，比如上面获取参数 length 的例子，可以对泛型参数进行约束，确保它包含 length 属性，这样就可以在函数内直接获取它的属性。

```jsx
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // Now we know it has a .length property, so no more error
  return arg;
}
```

还可以结合 keyof 操作符，限制参数的类型：

```jsx
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

这样就限制了 K 必须是 T 的 key，确保类型安全。

### 泛型参数默认类型

```jsx
interface A<T=string> {
  name: T;
}
```

和函数的默认参数类似。

### 泛型工具类

> https://www.typescriptlang.org/docs/handbook/utility-types.html

#### Partial<T>

将某个类型里的属性全部变为可选项 ?。

#### Required<T>

将某个类型里的属性全部变为必选项，Partial 的反操作。

#### Readonly<T>

将某个类型里的属性全部变为只读，意味着不可以重新赋值。

#### Record<Keys, Type>

构建一个对象类型，它的属性键是 Keys，属性的值都是 Type。

#### Pick<Type, Keys>

将某个类型的部分子属性挑选出来，构建一个子集新类型。
