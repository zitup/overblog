---
title: Class
date: '2021-11-08'
spoiler: JS 第二篇之 Class
cta: 'JS'
---

Classes 是 ES6 新增的用于定义对象的模板，替代了之前使用基于原型的构造函数创建实例对象的方式。

## Defining classes

```jsx
  // class 声明(和函数声明不同，类声明没有提升)
  class Car {
    constructor(height, weight) {
      this.height = height;
      this.weight = weight;
    }
  }
  
  // class 表达式(同样没有声明提升，即使使用 var)
  // unnamed
  let Rectangle = class {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  };
  console.log(Rectangle.name); // output: "Rectangle"

  // named
  let Rectangle = class Rectangle2 {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  };
  console.log(Rectangle.name); // output: "Rectangle2"
```

## 核心概念

- ## class 内的代码默认严格模式下执行

- ## constructor
用于创建和初始化用 class 创建的对象。在其中可以定义对象的属性，这些属性会在其它函数之前定义，以保证能正确引用到。

如果声明的 class 没有定义 constructor 函数，JS 引擎会创建一个默认的构造函数。

如果是一个基本的 class，默认的构造函数如下：

```jsx
  constructor() {}
```

如果是一个派生 class，默认的构造函数如下，它调用父类的构造函数，并传递提供的任何参数：

```jsx
  constructor(...args) {
    super(...args)
  }
```

如果在派生 class 中，自定义了构造函数，则必须在其中首先使用 super 调用父类的构造函数。

这是对派生 class 自定义构造函数的硬性语法要求，但是为什么要这么做文档中没有说明，这里猜测一下。假如派生类中的构造函数或者方法，用到了父类的属性，但是之前并没有初始化父类的属性，这就肯定会导致问题，所以，在派生类中首先使用 super 初始化父类的属性是有必要的。

- ## methods

```jsx
  class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }}
  // Method
  calcArea() {
    return this.height * this.width;
  }
}
```

- ## static methods and properties

静态方法和属性不能被实例对象调用，只能通过 class 直接调用。也可以被子类通过原型链访问到。

- ## static initialization blocks

- ## class 中的 this

首先要记住的是 class 内的代码默认在严格模式下执行，所以 this 的表现只需要考虑严格模式。

```jsx
  class Animal {
    speak() {
      return this;
    }
    static eat() {
      return this;
    }
  }

  let obj = new Animal();
  obj.speak(); // the Animal object
  let speak = obj.speak;
  speak(); // undefined

  Animal.eat() // class Animal
  let eat = Animal.eat;
  eat(); // undefined
```

和函数在严格模式下的表现一致。继续看以下例子：

```jsx
  speak.call(); // undefined
  eat.call(); // undefined
```

仍然是 undefined。然而这时候是在非严格模式下，如果 speak 和 eat 是一个普通的函数，this 应该是 window 才对，而这里仍然是严格模式下的表现。

如何让 this 无论在哪里执行都指向正确的对象呢？

  - Bind in Constructor (ES2015)
  
    ```jsx
      class Bound {
        constructor() {
          this.x = 1;
          this.myMethod = this.myMethod.bind(this)
        }

        myMethod() { return this.x }
      }
    ```

    有个细节是，myMethod 从 prototype 上复制到了实例对象本身上。

  - Class Properties (Stage 3 Proposal)

    ```jsx
      class Bound {
        myMethod = () => { return this.x }
      }
    ```

    应该就是利用了箭头函数定义时绑定 this 的特性

- ## 实例属性

在 constructor 中定义，或者使用下面的字段声明

- ## 字段

  [class fields](https://github.com/tc39/proposal-class-fields) 是目前在 stage3 的提案，还不是正式标准，但是现在基本都是使用这种方式声明类的属性，取代 ES2015 中在 constructor 中声明的形式。

  - public field declaration

    ```jsx
      class ClassWithInstanceField {
        instanceField = 'instance field'
      }

      class ClassWithStaticField {
        static staticField = 'static field'
      }

      class ClassWithPublicInstanceMethod {
        publicMethod() {
          return 'hello world'
        }
      }
    ```
  - private field declaration

    ```jsx
      // 从类外部引用私有字段会导致语法错误
      class ClassWithPrivateField {
        #privateField;
      }

      class ClassWithPrivateMethod {
        #privateMethod() {
          return 'hello world';
        }
      }

      class ClassWithPrivateStaticField {
        static #PRIVATE_STATIC_FIELD;
      }

      class ClassWithPrivateStaticMethod {
        static #privateStaticMethod() {
          return 'hello world';
        }
      }

      class Rectangle {
        #height = 0;
        #width; // 私有字段必须在字段部分先声明
        constructor(height, width) {
          this.#height = height;
          this.#width = width;
        }
      }
    ```

- ## extends
  
  用于创建子类。

- ## super

  使用 super 可以在派生类中调用父类的构造函数和调用方法。在 constructor 使用了 this ，必须在执行完 super() 之后，否则会报 ReferenceError 错误。

## 相关知识

1. ES5、ES6 如何实现继承
class 转换成 es5 是什么样?

2. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model
