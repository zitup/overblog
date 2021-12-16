---
title: Object
date: '2021-12-10'
spoiler: JS 第七篇之 Object
cta: 'JS'
---
 
JS 中几乎所有的对象都是 Object 的实例，通过 Object.prototype 继承属性和方法。

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

    创建一个新对象，使用参数作为新对象的原型。

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

    冻结一个对象并返回。冻结的对象不能被修改，属性不能增删改，也不能改变属性描述符，原型也不能修改。

    冻结的对象，其数据属性的描述符，writable/configurable 被设置为 false。

    如果属性是一个对象，它仍然可以改变。所以 `Object.freeze(ojb)` 是浅冻结。参考[深冻结](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#:~:text=such%20as%20%5Bwindow%5D.-,function%20deepFreeze,-(object)%20%7B%0A%20%20//%20Retrieve%20the)。

7. ### `Object.fromEntries(iterable)` <font size=1>ES2019</font>

    将键值对列表转换为一个新对象。它是 `Object.entries()` 的相反操作。

    参数是一个可迭代对象，例如 Array 或 Map 或其他实现可迭代协议的对象。

8. ### `Object.getOwnPropertyDescriptor(ojb, prop)`

    获取一个对象上特定自身属性的描述符。如果对象不存在此属性，返回 undefined。

9. ### `Object.getOwnPropertyDescriptors(obj)` <font size=1>ES2017</font>

    获取一个对象上所有自身属性的描述符。

## 相关知识

1. object 属性遍历顺序
https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
