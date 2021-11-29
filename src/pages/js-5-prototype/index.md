---
title: Prototype
date: '2021-11-25'
spoiler: JS 第五篇之 Prototype
cta: 'JS'
---

JS 没有像其它基于类的语言那样，提供一个 `class` 的实现，尽管 ES2015 添加了 class 关键字，但它只是语法糖，其中的实现还是基于原型。

## 介绍

### Prototype 原型

JS 中每一个对象都有一个私有属性([[Prototype]])指向另一个对象。这个属性叫做**原型(prototype)**。

使用函数来举例。

在 JS 中，只要创建一个函数，就会为这个函数创建一个 prototype 属性（指向原型对象）。默认情况下，所有原型对象自动获得一个名为 constructor 的属性，指回与之关联的函数/构造函数。

```jsx
function doSomething(){}
console.log( doSomething.prototype );

// 输出:
{
  constructor: ƒ doSomething()
  [[Prototype]]: Object
}
```

每次调用构造函数创建一个新实例，这个实例的内部 `[[Prototype]]` 指针就会被赋值为构造函数的原型对象。部分浏览器中可以使用 `__proto__` 属性访问到这个原型对象。关键在于理解这一点：实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。

```jsx
// 接上面的例子
console.log(doSomething.__proto__)

// 输出:
ƒ () { [native code] } // 这里其实是 Function.prototype。和其它原型对象不同，它是一个函数对象
```

使用 new 创建的实例对象，更容易理解:

```jsx
function Person() {}
let p1 = new Person()

console.log(p1.__proto__ === Person.prototype) // true
```

<!-- ## __proto__
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto -->

### Prototype Chain 原型链

如果一个原型对象自己的原型属性指向了另一个原型，这就形成了一条原型链。

```jsx
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.subProperty = false
}
const superType = new SuperType()
SubType.prototype = superType
SubType.prototype.getSubValue = function() {
  return this.subProperty
}

const subType = new SubType()
```

上面的代码中，实例 subType 的原型指向 SubType.prototype（即实例 superType），它的原型指向 SuperType.prototype。这就形成了一条原型链。

再看一下函数的默认原型链:

```jsx
function fn() {}

console.log(fn.__proto__) // ƒ () { [native code] } 其实是 Function.prototype

console.log(fn.__proto__.__proto__)
// {
//   constructor: ƒ Object()
//   hasOwnProperty: ƒ hasOwnProperty()
//   isPrototypeOf: ƒ isPrototypeOf()
//   ...略
// }

console.log(doSomething.__proto__.__proto__.__proto__) // null
```

可以清楚的看到一个普通函数的原型链: fn ---> Function.prototype ---> Object.prototype ---> null

再看一个数组的:

```jsx
var b = ['yo', 'whadup', '?'];
```

b ---> Array.prototype ---> Object.prototype ---> null

### [[Prototype]] 和 prototype

`someObject.[[Prototype]]` 表示 someObject 对象的原型，它是私有属性，不能直接访问。

prototype 是函数的一个属性，在函数用作构造函数时，它指向的对象就是实例的内部属性[[Prototype]]指向的对象，即实例的原型对象。

### in 操作符

in 操作符在可以通过对象访问到属性时，返回 true，无论属性是在实例还是在原型上。

```jsx
function Person() {}
Person.prototype.name = 'san'

let p1 = new Person()
console.log(p1.hasOwnProperty('name')) // false
console.log('name' in p1) // true
```

在 for-in 循环中使用 in 操作符时，可以通过对象访问且可以被枚举的属性都会返回，包括实例
属性和原型属性。

## 相关知识

1. 实现继承的多种方式
2. new 关键字做了什么/描述new一个对象的过程
3. es6 实现继承的底层原理是什么
4. zepto 及其他源码中如何使用原型链
5. Object 的 N 中方法

参考:
1. JavaScript高级程序设计（第4版) 8.2.4
