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

### 实现继承的多种方式
   
1. 原型链继承

  原型链是实现继承的一种方式，通过设置原型属性（prototype）继承其它对象的属性和方法。

  缺点：
  
  - 原型中包含的引用值在所有实例间共享，意味着一个实例改变了引用值，会影响其它实例
  - 子类型在实例化时不能向父类型的构造函数传参

  ---

2. 构造函数继承

为了解决原型链继承引用值共享的问题，"盗用构造函数"（constructor stealing）式继承被提了出来。

它的基本思想就是，在子类构造函数中调用父类构造函数。

```jsx{7}
  function SuperType(name) {
    this.colors = ["red", "blue", "green"];
    this.name = name;
  }
  function SubType() {
    // 继承 SuperType
    SuperType.call(this);
  }
```

这样就隔离了实例的引用值共享。同时也可以在调用父类构造函数时传递参数，还可以实现多继承（call 多个父类对象）。

缺点：

- 子类不能访问父类原型上定义的方法和属性
- 父类必须在构造函数中定义方法，函数不能重用，其定义的方法会在每个实例上都创建一遍

---

3. 组合继承

组合继承综合了原型链和盗用构造函数，基本思路是通过原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。

```jsx{10,14}
  function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
  }
  SuperType.prototype.sayName = function() {
    console.log(this.name);
  };
  function SubType(name, age){
    // 继承属性
    SuperType.call(this, name);
    this.age = age;
  }
  // 继承方法
  SubType.prototype = new SuperType();
```

缺点：

- 父类构造函数始终会被调用两次
- 第二次调用，会将本属于父类实例的属性，添加到子类的原型上，造成子类实例本身和原型上存在两组属性

---

4. 寄生式组合继承

寄生式组合继承为了解决父类构造函数调用两次的问题，基本思路是在第二次时，不调用父类的构造函数，而是生成一个副本：

```jsx{16,20}
  // Shape - superclass
  function Shape() {
    this.x = 0;
    this.y = 0;
  }

  // superclass method
  Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.info('Shape moved.');
  };

  // Rectangle - subclass
  function Rectangle() {
    Shape.call(this); // call super constructor.
  }

  // subclass extends superclass
  Rectangle.prototype = Object.create(Shape.prototype);

  //If you don't set Rectangle.prototype.constructor to Rectangle,
  //it will take the prototype.constructor of Shape (parent).
  //To avoid that, we set the prototype.constructor to Rectangle (child).
  Rectangle.prototype.constructor = Rectangle;
```

**寄生式组合继承可以算是引用类型继承的最佳模式**。


5. 原型式继承

上面例子中的 `Rectangle.prototype = Object.create(Shape.prototype);` 可以叫做原型式继承。也可以用以下写法。

```jsx
  function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
  } 
```

原型式继承适合用于不需要构建函数，但仍然需要在**对象间**共享信息的场合。

6. 寄生式继承

寄生式继承增强了原型式继承，允许以某种方式增强对象。

```jsx
  function createAnother(original){
    let clone = object(original); // 通过调用函数创建一个新对象
      clone.sayHi = function() { // 以某种方式增强这个对象
      console.log("hi");
    };
    return clone; // 返回这个对象
  }
```

寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。

7. ES6 class 继承

### new 操作符做了什么/描述new一个对象的过程

new 操作符创建一个给定构造函数或内置构造函数的实例。new 操作符执行以下操作：

1. 创建一个新对象
2. 新对象内部的[[Prototype]]特性(__proto__)被赋值为构造函数的 prototype 属性
3. 构造函数内部的 this 指向新对象
4. 执行构造函数内的代码（给新对象添加属性）
5. 如果构造函数返回非 null 对象，则返回该对象；否则，返回新创建的对象。

模拟实现：

```jsx
  /**
   * @param {function} 构造函数
   * @param {*} 构造函数的参数
   */
  function fakeNew() {
    // 1. 创建一个新对象
    const obj = Object.create(null)
    // 参数处理
    const [Constructor, ...args] = [].slice.call(arguments)
    // 2. 将新对象的原型指向构造函数的原型
    obj.__proto__ = Constructor.prototype
    // 3-4. 构造函数内 this 指向新对象，并执行构造函数内的代码
    const result = Constructor.apply(obj, args)
    // 5. 根据构造函数返回，决定最终返回结果
    return typeof result === 'object' && result !== null ? result : obj;
  }
```

### es6 实现继承的底层原理是什么
###  zepto 及其他源码中如何使用原型链

参考:
1. JavaScript高级程序设计（第4版) 8.2.4
