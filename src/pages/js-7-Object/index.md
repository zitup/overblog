---
title: Object
date: '2021-12-10'
spoiler: JS 第七篇之 Object
cta: 'JS'
---
 
JS 中几乎所有的对象都是 Object 的实例，通过 Object.prototype 继承属性和方法。

Object 有 21 个静态方法，6 个实例方法。

- [创建对象](#创建对象)
- [静态方法](#静态方法)
- [实例属性](#实例属性)
- [实例方法](#实例方法)
- [相关知识](#相关知识)

## 创建对象

1. `new Object(value)`

   - value 是 null/undefined，创建并返回一个空对象
   - 否则返回一个与给定值对应类型的对象
   - value 是对象，返回这个对象

2. `Object.create()`
3. `let object = {}`

## 静态方法

1. ### `Object.assign(target, ...sources)`

    从一个或多个源对象，将可枚举的自身属性复制到目标对象，并返回修改后的目标对象。

    用例：

    1. 合并对象
    2. 克隆对象，一层深克隆，多层浅克隆
    3. 源对象包含 null/undefined 会被忽略，原始值只有 string 有自身可枚举属性，其他原始值也会被忽略。

      ```jsx
      const v1 = 'abc';
      const v2 = true;
      const v3 = 10;
      const v4 = Symbol('foo');

      const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
      console.log(obj); // { "0": "a", "1": "b", "2": "c" }
      ```

    4. 如果目标对象被覆盖的一个属性是 none-writable 的，会抛出一个 `TypeError`。但是报错之前的改变会生效。

      ```jsx
      const target = Object.defineProperty({}, 'foo', {
        value: 1,
        writable: false
      }); // target.foo is a read-only property

      Object.assign(target, { bar: 2 }, { foo2: 3, foo: 3, foo3: 3 }, { baz: 4 });
      // 报错：TypeError: "foo" is read-only
      // The Exception is thrown when assigning target.foo

      // 稍后打印
      console.log(target); // {bar: 2, foo2: 3, foo: 1}
      ```
  
    5. 复制访问器属性

    它在源对象上使用 [[Get]]，在目标对象上使用 [[Set]]，如果合并源包含 getter，这可能使其不适合将新属性合并到原型中。

      ```jsx
        const obj = {
          foo: 1,
          get bar() {
            return 2;
          }
        };

        let copy = Object.assign({}, obj);
        console.log(copy); // { foo: 1, bar: 2 }
        // The value of copy.bar is obj.bar's getter's return value.
      ```
      
    这是一个复制完整描述符的函数 [👉👉👉](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#copying_accessors)

2. ### `Object.create(proto[, propertiesObject])`

    创建一个新对象，使用第一个参数作为新对象的原型。

    proto 必须是 null 或者 object。否则抛出 `TypeError`。

    用例：

    1. 实现继承

      ```jsx{20}
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

    2. 使用第二个参数

      和 `Object.defineProperties()` 的第二个参数一致。

3. ### `Object.defineProperty(obj, prop, descriptor)`

    在一个对象上定义一个新的属性，或者修改一个存在的属性，返回这个对象。

    此方法展示了一个对象属性更多的细节，允许从默认值更改这些额外的详细信息。

    #### 属性的类型

      对象的属性可以分为两类：数据属性和访问器属性。分别通过数据描述符(data descriptor)和访问器描述符(accessor descriptor)表示。

      两类描述符共有的可选键如下：

       1. `configurable`

          属性的描述符是否可以更改，属性是否可以在对象上删除。默认为 false

       2. `enumerable`

          属性是否可以被遍历。默认为 false

      只包含此两项，属性会被视为数据属性。

      数据描述符还有以下两个可选键：

       1. `value`

          属性的值。默认为 undefined

       2. `writable`

          属性的值是否可以更改。默认为 false

      访问器描述符还有以下两个可选键：

      1. `get`

         作为这个属性的 getter 函数，读取属性时调用。默认为 undefined

      2. `set`

         作为这个属性的 setter 函数，设置属性时调用。默认为 undefined

    需要注意的是，描述符不一定是自身的属性，继承的属性也会被考虑。考虑以下代码：

    ```jsx
      var descriptor = Object.create({value: 2})

      var obj = {}

      Object.defineProperty(obj, 'key', descriptor)

      console.log(obj.key); // 2
    ```

    descriptor 本身没有 value 属性，但是原型包含了 value，也会被 defineDescriptor 采用。

4. ### `Object.defineProperties(obj, props)`

    在一个对象上，定义多个新的属性或修改多个存在的属性，返回这个对象。

    ```jsx
      var obj = {};
      Object.defineProperties(obj, {
        'property1': {
          value: true,
          writable: true
        },
        'property2': {
          value: 'Hello',
          writable: false
        }
        // etc. etc.
      });
    ```

5. ### `Object.entries(obj)` <font size=1>ES2017</font>

    获取一个对象的自身可枚举且是字符串键的属性的键值对(`[key, value] pairs`)，返回一个数组。

    特殊例子：

    ```jsx
      // non-object argument will be coerced to an object
      console.log(Object.entries('foo')); // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]
      // 其它原始值返回空数组，因为没有自身属性
      console.log(Object.entries(100)); // [ ]
    ```

6. ### `Object.freeze(ojb)`

    冻结一个对象并返回。冻结的对象不能添加新属性，已存在的属性变为不可写、不可配置，原型也不能修改。

    冻结的对象，其数据属性的描述符，writable/configurable 被设置为 false。

    如果属性是一个对象，它仍然可以改变。所以 `Object.freeze(ojb)` 是浅冻结。参考[深冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#:~:text=such%20as%20%5Bwindow%5D.-,function%20deepFreeze,-(object)%20%7B%0A%20%20//%20Retrieve%20the)。

7. ### `Object.fromEntries(iterable)` <font size=1>ES2019</font>

    将键值对列表转换为一个新对象。它是 `Object.entries()` 的相反操作。

    参数是一个可迭代对象，例如 Array 或 Map 或其他实现可迭代协议的对象。

8. ### `Object.getOwnPropertyDescriptor(ojb, prop)`

    获取一个对象上特定自身属性的描述符。如果对象不存在此属性，返回 undefined。

9. ### `Object.getOwnPropertyDescriptors(obj)` <font size=1>ES2017</font>

    获取一个对象上所有自身属性的描述符。

10. ### `Object.getOwnPropertyNames(obj)`

    获取一个对象上所有自身属性(包括枚举和不可枚举，除了 Symbol 键属性)的名称，返回一个数组。

    根据 ES6，对象的整数键首先按升序添加到数组中，然后按插入顺序添加字符串键。属性枚举顺序和 `for...in`/`Object.keys()`/`Object.entries()` 一致。

11. ### `Object.getOwnPropertySymbols(obj)`

    获取一个对象上所有自身上的 Symbol 属性。

12. ### `Object.getPrototypeOf(obj)`

    返回一个对象的原型，没有继承的属性则返回 null。

13. ### `Object.setPrototypeOf(obj, prototype)`

    设置给定对象的原型(即内部的`[[Prototype]]`属性)。

14. ### `Object.is()`

    判断两个值是否是[同一个值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)。

    以下情况，是同一个值：

      - 都是 `undefined`
      - 都是 `null`
      - 都是 `true` 或 `false`
      - 都是字符串，且长度相等、字符顺序相同
      - 都是同一个对象（指向内存中的同一个对象）
      - 都是数字且
        - 都是 +0
        - 都是 -0
        - 都是 NaN
        - 或都是其他相同数字

    > PS. `Object.is()` 和 `===` 唯二不同的是：1. -0 === +0 为 true 2. NaN === NaN 为 false

15. ### `Object.isExtensible(obj)`

    确定对象是否可扩展（是否可以向其添加新属性）。

    对一个对象使用 `Object.preventExtensions()`, `Object.seal()`, 或者 `Object.freeze().` ，它会变为不可扩展的。

16. ### `Object.preventExtensions(obj)`

    防止向对象自身添加新属性。这个方法将目标对象的 `[[prototype]]` 变为不可变的，重复赋值 `[[prototype]]` 会报错。
    
    但是仍可以删除/修改对象上的属性。没有办法把 non-extensible 对象变回 extensible，也就是说这个方法是不可逆的。

17. ### `Object.isFrozen(obj)`

    确定对象是否被冻住(即使用了 `Object.freeze(ojb)` 后的效果)。

    不可扩展、属性不可配置(configurable 为 false)、数据属性不可写。

18. ### `Object.isSealed(obj)`

    确定对象是否被密封(即使用了 `Object.seal(ojb)` 后的效果)。

    不可扩展、属性不可配置、属性不可删除。

19. ### `Object.seal(obj)`

    防止向对象添加新属性，并把所有已存在的属性标记为不可配置(configurable 为 false)。

    这具有使对象上的属性集固定的效果。

20. ### `Object.keys(obj)`

    返回对象的自身可枚举属性名称数组(不包括 symbol 属性)。

21. ### `Object.values(obj)`

    返回对象的自身可枚举属性值数组(不包括 symbol 属性)。

## 实例属性

1. ### `Object.prototype.constructor`

    constructor 属性返回创建这个实例对象的构造函数的引用。

    所有对象(除了使用 `Object.create(null)` 创建的对象)都有 constructor 属性。

    ```jsx
      let a = []
      a.constructor === Array // true
    ```

    constructor 不是实例本身的属性，它属于原型对象。以上面代码为例，它属于 `Array.prototype`。

2. ### `Object.prototype.__proto__`

    > 废弃：此功能不再推荐使用。使用 `Object.getPrototypeOf()` 代替。
    > 警告：更改对象的 [[Prototype]] 是一个非常缓慢的操作，应避免设置对象的 [[Prototype]]，使用 Object.create() 创建一个具有所需 [[Prototype]] 的新对象。
    > 
    __proto__ 属性是 Object.prototype 上的一个访问器属性，它暴露了访问它的对象的内部属性 `[[Prototype]]`。

## 实例方法

1. ### `Object.prototype.hasOwnProperty(prop)`

    返回一个布尔值，表示一个对象的自身属性是否包含传入的属性。

    > ES2022 的 `Object.hasOwn()` 可以代替此方法。它的优势在于可以在使用 `Object.create(null)` 创建的对象上使用，不会受原型链的限制，也不用担心被覆盖。

2. ### `Object.prototype.isPrototypeOf(obj)`

    检查一个对象是否存在于传入对象的原型链上。

    和 `isPrototypeOf` 不同的是，`instanceof` 参考的是右侧参数的 `prototype` 属性，`isPrototypeOf` 使用传入对象本身。

3. ### `Object.prototype.propertyIsEnumerable(prop)`

    返回一个布尔值，表示传入的属性是否是这个对象的自身可枚举属性。

4. ### `Object.prototype.toLocaleString()`

    返回一个代表此对象的字符串。`Object` 的 `toLocaleString` 返回调用 `toString()` 的结果。

    此方法一般会被其他对象上的同名方法覆盖。

    - `Array`: `Array.prototype.toLocaleString()`
    - `Number`: `Number.prototype.toLocaleString()`
    - `Date`: `Date.prototype.toLocaleString()`
    - `TypedArray`: `TypedArray.prototype.toLocaleString()`
    - `BigInt`: `BigInt.prototype.toLocaleString()`

5. ### `Object.prototype.toString()`

    返回一个代表此对象的字符串。其他内置对象一般都覆盖了此方法。

6. ### `Object.prototype.valueOf()`

    返回一个对象的原始值。其他内置对象一般都覆盖了此方法。

    在需要将对象转为原始值时(比如隐式转换)，JS 会自动调用此方法。

## 相关知识

1. object 属性遍历顺序
https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
