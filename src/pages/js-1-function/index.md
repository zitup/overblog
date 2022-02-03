---
title: Function
date: '2021-10-11'
spoiler: JS 第一篇之 Function
cta: 'JS'
---

作为一个写了好几年的前端，有时候想起 JS 还是很模糊的一个状态，对其中重要的组成部分、繁杂的语法、多样的 API 等等，脑袋里没有一个清晰的脉络，而 JS 作为前端世界核心中的核心，掌握它也是一个好前端必须要做到的。所以重学 JS 很有必要，遂有此系列。希望走完这趟重学之路之后，脑中有脉络，胸中有沟壑，能构建起自己的 JS 知识体系。

函数是 JS 世界中的一等公民，写 JS 差不多就是在写函数，所以掌握函数很有必要，本文将从几个方面去学习，力求一文掌握 function。

## 创建函数

### Constructor vs. declaration vs. expression

创建方式上

```jsx
// Constructor
new Function('x', 'y', 'return x + y')

// Function Declaration
function sum(a, b) {
  return a + b;
}

// Function Expression
let sum = function(a, b) {
  return a + b;
};
```

创建时机上

由于引擎机制，函数声明首先执行，所以在实际代码之前就可以调用。

```jsx
sayHi("John"); // Hello, John

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

函数表达式在它之后才可以调用，引擎在执行完对应代码之后，函数才被创建。

```jsx
sayHi("John"); // error!

let sayHi = function(name) {
  alert( `Hello, ${name}` );
};
```

作用域方面

通过 constructor 创建的函数，总是属于全局作用域，不属于创建它时所在的上下文，只能访问内部变量和全局变量。

函数名称上

  - expression

    函数表达式包括函数名称和函数分配给的变量。函数名称可忽略，但是定义了便不可改变，赋给的变量可随意改变。函数名称只在函数体内可以引用到，在外部使用会报错。

      ```jsx
        var y = function x() {};
        console.log(y.name;) // x
        alert(x); // throws an error
    ```
    
  - declaration

    函数声明时所使用的名称，在函数内和外部均可调用。在外部也可以调用，是因为函数声明同时创建了一个和函数名称相同的变量。

    假如将函数名称重新赋值，改变的是变量的值，函数名称没变。

      ```jsx
        function fn() {
          console.log(111)
        }
        const test = fn;
        fn = 1;

        console.log(fn); // 1
        test() // 111
        console.log(test.name) // 'fn'
      ```

## 箭头函数

箭头函数作为普通函数的紧凑简洁版本，使用起来很方便，但是并不适用所有情况，其中的局限性需要了解：

  - 没有自己的 this/super 绑定，（所以不应该当作对象方法）
  - 内部不能使用 new.target 关键字（会直接报语法错误）
  - call, apply, bind 无法使用（因为 this 在函数定义时已确定，无法改变）
  - 不能作为构造函数（因为构造函数通过 new 调用时，需要构造函数的 prototype 属性和 this，箭头函数这两样都没有）
  - 内部没有 arguments 对象

## generator function

`function*` 声明定义了一个生成器函数，它返回一个 Generator 对象。

```jsx
  function* name([param[, param[, ... param]]]) {
    statements
  }
```

## 函数返回值
如果没有显式定义返回值，New 一个构造函数，函数的默认返回值为 new 创建的新对象，其它函数都默认返回 undefined。

如果定义了返回值，其它函数都返回定义的值，new 一个构造函数，需要区分定义值的类型，如果返回的是一个非 null 对象，那么就直接返回，如果返回的是之外的其他任何值，那么就返回默认的 new 创建的新对象

## Properties and methods

### 实例属性

- Function.prototype.arguments
  
  已废弃，使用函数内部的 arguments 代替

- Function.prototype.caller 废弃
- Function.prototype.displayName 非标准
- Function.prototype.length 函数参数数量

  ```jsx
    Function.length // 1
    (function(...rest) {}).length // 0 rest 参数不计算
    (function(a, b = 1, c) {}).length // 1 只计算有默认值的参数之前的
  ```

- Function.prototype.name

  ```jsx
    // 函数声明
    function fn() {}
    fn.name; // 'fn'

    // 构造函数
    (new Function).name; // 'anonymous'

    // 匿名函数
    (function() {}).name; // ''

    let y = function x() {}
    y.name; // 'x'

    // inferred name 推断名称
    // ES2015 新增，变量和属性可以推断作为匿名函数的名称
    let f = function() {}
    f.name; // 'f'
    let obj = {
      someMethod: function() {}
    }
    obj.someMethod.name; // 'someMethod'

    // bound name
    function foo() {}
    foo.bind({}).name; // 'bound foo'

    // class name
    class Foo {
      constructor() {}
    }
    Foo.name; // 'Foo'
    // 如果使用 ES2015 新增的 static 关键字定义 name
    class Foo {
      constructor() {}
      static name() {}
    }
    Foo.name; // name() {} 覆盖了实际的 class name
    // 类似以下 ES5 语法
    function Foo() {}
    Object.defineProperty(Foo, 'name', {writable: true});
    Foo.name = function() {}

    // Symbols name
    let sym1 = Symbol('foo');
    let sym2 = Symbol();
    let obj = {
      [sym1]: function() {},
      [sym2]: function() {}
    }
    obj[sym1].name; // 'foo'
    obj[sym2].name; // ''
  ```

### 实例方法
- Function.prototype.apply(thisArg[, argsArray])
- Function.prototype.call(thisArg[, arg1, arg2, ...argN])
  
  apply 和 call 使用给定的 this 和参数调用一个函数，两者语法几乎相同，根本区别在于 apply 接受一个参数类数组，call 接受一个参数列表。

  call 和 apply 的 this 表现参考 [函数中的 this](#函数中的this)

- Function.prototype.bind(thisArg[, arg1[, arg2[, ...argN]]])

  bind 创建一个设置了 this 和参数的新函数。
  
  创建的 bound function 在 ES2015 中被称为 exotic function object（异质对象，和默认对象属性有区别的对象），对于 bound function 来说和普通函数的区别在于多了几个内部属性。

  对 bound function 使用 new 操作符，this 会被忽略。

- Function.prototype.toString 函数的字符串表示

## Arguments 对象

是一个 Array-like 对象，保存传入函数的参数。建议使用剩余函数代替。

  ### 属性
  - callee
    指向 arguments 所属的函数。严格模式下禁用，可以使用函数名称代替。

    ES3 之前不允许给函数表达式命名，callee 就成了递归调用函数的妥协方案，而且是一个差的解决方案。比如原函数和 callee 的 this 可能不同。

    ```jsx
      var global = this;

      var sillyFunction = function(recursed) {
          if (!recursed) { return arguments.callee(true); }
          if (this !== global) {
              alert('This is: ' + this);
          } else {
              alert('This is the global');
          }
      }

      sillyFunction();
    ```

  - length

## 函数中的this

- 一般情况下，函数中的 this 在调用时确定，即运行时绑定

  在严格模式和非严格模式下，this 的表现不同。

  ```jsx
    // 非严格模式
    function fn() {
      return this;
    }
    fn() === window; // true 指向 window
  ```

  ```jsx
    // 严格模式
    function fn() {
      'use strict';
      return this;
    }
    fn() === undefined; // true
  ```

  可以看到，在严格模式下，this 的值为 undefined。怎么让它指向 window 呢？需要显式的使用 window 调用函数 fn: window.fn()。此时的 this 为 window。

- 函数可以使用 call apply bind 改变函数的 this 值。他们在不同情况下又有不同的表现

  - call/apply/bind 在非严格模式下，传入空参数/null/undefined，this 指向全局对象(非严格模式下默认对象)
  - call/apply/bind 在非严格模式下，传入的 this 不是对象，将被转为对象。例如，7 会被转换为 `new Number(7)`（因为在非严格模式下，this 必须是对对象的引用，而在严格模式下可以是任何值。）
    
    vs.

  - call/apply/bind 在严格模式下，传入空参数/null/undefined，this 分别为 undefined/null/undefined
  - call/apply/bind 在严格模式下，传入的 this 是什么就是什么，不会转换

- 箭头函数中的 this
  
  箭头函数中的 this 在定义时确定。

- 对象方法
  
  当一个函数作为一个对象方法调用时，它的 this 被设置为调用该方法的对象。通俗点说，就是点操作符(.)左边的对象。

- 构造函数

  当一个函数用作构建函数时，它的 this 绑定到正在被构建的新对象。

- DOM 事件处理函数

  当一个函数用作事件处理器时，它的 this 被设置为添加监听(addEventListener)的那个元素。

- 内联事件处理函数

  this 被设置为添加监听的那个元素，但是仅限于外部函数代码。

  ```html
    <!-- button -->
    <button onclick="alert(this.tagName.toLowerCase());">
      Show this
    </button>

    <!-- 非严格模式下为默认值 window，严格模式下为 undefined -->
    <button onclick="alert((function() { return this; })());">
      Show inner this
    </button>
  ```

## 块级函数
ES6 之后，在严格模式下，支持块级函数，声明的函数只属于对应块。

```jsx
  'use strict';

  function f() {
    return 1;
  }

  {
    function f() {
      return 2;
    }
  }

  f() === 1; // true
  // f() === 2; // 非严格模式
```

非严格模式下，块级函数声明在不同浏览器有不同的表现，**不要使用**。

```jsx
  // 有的浏览器不管 shouldDefineZero 真假，都会声明 zero
  if (shouldDefineZero) {
    function zero() {     // DANGER: compatibility risk
      console.log("This is zero.");
    }
  }

  // 严格模式下，会有统一的表现：只在 shouldDefineZero 为 true 时，才会声明 zero，而且只在 if-block 中可调用。
```

## 函数作用域

## 闭包

闭包由函数和创建函数时的词法作用域组成。在 JS 中，每创建一个函数，就创建了闭包。

以下列代码为例：

```jsx
  function makeFunc() {
    var name = 'Mozilla';
    function displayName() {
      alert(name);
    }
    return displayName;
  }

  var myFunc = makeFunc();
  myFunc();
```

myFunc 是对 displayName 实例的引用。displayName 在 makeFunc 执行时创建，包含了一个对它词法环境的引用，这个词法环境包含变量 name，所以 myFunc 也可以访问到 name 变量。

### 闭包的本质
函数仍然记录着它创建时所在的词法作用域的引用，包含其中的变量。词法作用域是用来定义标识符与变量和函数的关联。可以简单理解为在当前词法作用域内创建的变量和值之间的一个映射。

对词法作用域的引用赋予了函数可以访问外部变量的能力，而且无论它在哪或什么时候执行。可以理解为将外部的值捕获(capture)了。

函数通过内部的属性 `[[scope]]` 记录它创建时所在的词法作用域，和更外层的词法作用域。

> 参考：https://262.ecma-international.org/11.0/#sec-lexical-environments

```jsx
function fn1() {
  var a = 1
  return function fn2() {
    var b = 1
    console.log(a)
    return function fn3() {
        var c = 1
        console.log(b)
    }
  }
}

const fn = fn1()()
console.dir(fn)
```

可以看到 fn[[scope]] 对外部三个词法环境的引用。

上述词法环境可以理解为是静态的，JS 中还有动态的所谓执行环境(Execution Context)。和词法环境相反，它是在函数执行时才能确定的。考虑下面代码：

```jsx
function fn(myParam) {
    var myVar = 123;
    return myFloat;
}
var myFloat = 1.3;
fn('abc'); // fn 声明时，myFloat 为 undefined，执行时为 1.3
```

### 实用的闭包
- 私有实例变量
  
  ```jsx
    function Car(manufacturer, model, year, color) {
      return {
        toString() {
          return `${manufacturer} ${model} (${year}, ${color})`
        }
      }
    }
    const car = new Car('Aston Martin','V8 Vantage','2012','Quantum Silver')
    console.log(car.toString())
  ```

- 函数编程

  ```jsx
    function curry(fn) {
      const args = []
      return function inner(arg) {
        if(args.length === fn.length) return fn(...args)
        args.push(arg)
        return inner
      }
    }
    function add(a, b) {
      return a + b
    }

    const curriedAdd = curry(add)
    console.log(curriedAdd(2)(3)()) // 5
  ```

### 缺陷
不必要的使用闭包会影响执行速度和造成内存消耗。在不必要的情况下，尽量避免在其它函数内声明函数。

> 参考: https://stackoverflow.com/questions/111102/how-do-javascript-closures-work

## 立即执行函数 immediately invoked function expression

```jsx
// 以下都是 IIFE
(function () { // open IIFE
    // inside IIFE
}()); // close IIFE

!function () { // open IIFE
    // inside IIFE
}(); // close IIFE

void function () { // open IIFE
    // inside IIFE
}(); // close IIFE

var File = function () { // open IIFE
    var UNTITLED = 'Untitled';
    function File(name) {
        this.name = name || UNTITLED;
    }
    return File;
}();
```

## 相关知识

### this
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

### call apply bind

1. apply

  apply 做了两件事：

  - 改变调用函数内的 this
  - 传入参数执行调用函数

  再加上 this 和参数的类型判断，便可以模仿它的行为：

  ```jsx{18,19,31}
    Function.prototype.fakeApply = function fakeApply() {
      // 判断类型
      if (typeof this !== 'function') {
        throw new TypeError('调用 fakeApply 的不是一个函数')
      }

      // 获取参数
      let [thisArg, args] = arguments

      // 处理 thisArg
      if (thisArg === '' || thisArg === null || thisArg === undefined) {
        thisArg = window
      } else {
        thisArg = Object(thisArg)
      }

      // 使用对象调用方法的方式，改变调用函数的 this
      const func = Symbol("func"); // 唯一属性名称，避免冲突
      thisArg[func] = this

      // 处理参数
      if (args && typeof args === 'object' && 'length' in args) {
        args = Array.from(args) // 处理 array-like 参数
      } else (args === null || args === undefined) {
        args = []
      } else {
        throw new TypeError('CreateListFromArrayLike called on non-object')
      }

      // 传入参数执行调用函数
      const result = thisArg[func](...args)
      // 删除属性
      delete thisArg[func]

      return result 
    }
  ```

2. call 

  call 实现和 apply 类似，只是改变了处理第二个参数的方式

3. bind

  bind 主要做了两件事：

  - 返回一个绑定后的新函数
  - 新函数内传入参数执行调用函数，并改变调用函数的this

  再加上一些边缘情况的处理，就可以模仿它的行为了：

  ```jsx{16,17,18,19,20,21,22}
    Function.prototype.fakeBind = function fakeBind() {
      // 判断类型
      if (typeof this !== 'function') {
        throw new TypeError('调用 fakeBind 的不是一个函数')
      }

      let [thisArg, ...prependArgs] = arguments

      // 处理 thisArg
      if (thisArg === '' || thisArg === null || thisArg === undefined) {
        thisArg = window
      } else {
        thisArg = Object(thisArg)
      }

      const F = this;
      function boundFunction() {
        const args = prependArgs.concat(...arguments)
        // 包括作为构造函数调用和正常执行
        return this instanceof boundFunction ? new F(...args) : F.apply(thisArg, args)
      }

      // 绑定函数继承原函数的原型对象
      boundFunction.prototype = Object.create(F.prototype)

      return boundFunction
    }
  ```

  core-js源码：https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/function-bind.js

### 柯里化
手写

### 函数式编程

### 节流、去抖函数

### 看不懂的

1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#using_apply_to_chain_constructors
