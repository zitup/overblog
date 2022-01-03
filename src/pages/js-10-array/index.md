---
title: Array
date: '2022-01-03'
spoiler: JS 第十篇之 Array
cta: 'JS'
---

本篇聚焦于 JS 中的数组。

## 创建数组

1. `new Array()`

  ```jsx
    // construct from elements
    new Array(element0, element1, /* ... ,*/ elementN)

    // construct from array length
    new Array(arrayLength)
  ```

  如果传入的唯一参数是一个在 0 和 2^31-1 之间的整数，返回一个对应长度的空槽数组。

2. `[element0, element1, /* ... ,*/ elementN]`

## 静态方法

1. ### `Array.from(arrayLike, mapFn, thisArg)`

  从类数组或者可迭代对象上创建一个新的、浅复制(一层深复制，多层浅复制)的数组。

  ```jsx
    Array.from('foo'); // ["f", "o", "o"]
  ```

  参数:

  - `arrayLike`: 要转换为数组的类数组或可迭代对象
  - `mapFn`: 可选参数，对每一个元素都调用的 map 函数，函数参数为当前元素和它的索引
  - `thisArg`: 可选参数，作为 `mapFn` 的 `this`

  `Array.from(obj, mapFn, thisArg)` 和 `Array.from(obj).map(mapFn, thisArg)` 有同样的结果，这样看起来更容易理解。只是前者不会生成一个中间数组。

2. ### `Array.isArray(value)`

  检查传入参数是否是数组。

  ```jsx
    Array.isArray(Array.prototype); // 鲜为人知的是，Array.prototype 是数组。

    Array.isArray({__proto__: Array.prototype}); // false
    ({__proto__: Array.prototype}) instanceof Array // true，通过原型校验有时候也并不准确
  ```

3. ### `Array.of()`

  从一些参数创建一个数组，而不管参数的数量和类型如何。
  
  此方法和 `new Array()` 类似，唯一区别是对待整数参数的不同：`Array.of(7)` 创建一个只有一个元素 `7` 的数组，`new Array(7)` 创建一个长度为 7 的空槽数组。

  ```jsx
    Array.of(7); // [7]
    Array(7); // [empty × 7]

    Array.of(1, 2, 3); // [1, 2, 3]
    Array(1, 2, 3);    // [1, 2, 3]
  ```

## 实例方法

1. ### `Array.prototype.at(index)` <font size=1>ES2022</font>

  返回传入索引位置的元素。索引正负都可，负数从数组最后开始计算。未找到返回 `undefined`

  此方法和方括号表示法作用一致，只是在取数组最后一位时，使用 `at` 比较方便。`array.at(-1)` 代替 `array[array.length-1]`。

2. ### `Array.prototype.concat()`

  合并两个或多个数组，返回一个新的数组。无论传入了几个参数，都返回一个新的数组。

  ```jsx
    concat()
    concat(value0)
    concat(value0, value1)
    concat(value0, value1, ... , valueN)
  ```

  如果参数不是数组，它本身会被放到新数组中。

3. ### `Array.prototype.copyWithin(target, start, end)`

  浅复制一个数组的一部分到同一个数组的另一个位置，返回修改后的原数组，不改变数组长度。相当于覆盖的效果。

  参数:

  - `target`: 从 0 开始的索引，指定复制到的位置，如果是负数，从后向前计算。如果 target 大于最大长度，什么也不会发生。
  - `start`: 可选，复制的元素开始的索引，如果是负数，从后向前计算。如果省略了 start，方法会从 0 开始复制
  - `end`: 可选，复制的元素结束的索引(不包括），如果是负数，从后向前计算。如果省略了 start，方法会复制到最后一个

  如果 start 到 end 元素数量大于可以复制的数量，它会裁剪适应。

4. ### `Array.prototype.entries()`

  返回一个包含数组中每个索引的键/值对的数组迭代器对象。可以使用 `for...of` 遍历。

5. ### `Array.prototype.every(fn, thisArg)`

  测试是否数组所有元素通过了函数参数。全部通过返回 true，否则返回 false。

  只要一个元素执行时返回了 falsy，此方法会立即返回 false。

6. ### `Array.prototype.fill(value, start, end)`

  修改一个数组部分范围为一个统一的值，返回修改后的原数组。

  参数:

  - `value`: 填充的值。如果是对象，所有被填充的地方都指向同一个对象
  - `start`: 可选，开始填充的索引，默认为 0，如果是负数，从后向前计算
  - `end`: 可选，结束填充的索引(不包括），默认为 `arr.length`

7. ### `Array.prototype.filter(fn, thisArg)`

  返回一个新数组，元素为通过函数测试的。

8. ### `Array.prototype.find(fn, thisArg)`

  返回第一个满足测试函数的值，如果没有返回 undefine。

9.  ### `Array.prototype.findIndex()`

  返回第一个满足测试函数的值的索引，如果没有返回 -1。

10. ### `Array.prototype.flat(depth)`

  返回一个新数组，内容为根据参数展开的原数组的元素。

11. ### `Array.prototype.flatMap()`

  

12. ### `Array.prototype.`
13. ### `Array.prototype.`
14. ### `Array.prototype.`
15. ### `Array.prototype.`
16. ### `Array.prototype.`
17. ### `Array.prototype.`
18. ### `Array.prototype.`
19. ### `Array.prototype.`
20. ### `Array.prototype.`
21. ### `Array.prototype.`
22. ### `Array.prototype.`
23. ### `Array.prototype.`
24. ### `Array.prototype.`
25. ### `Array.prototype.`
26. ### `Array.prototype.`
27. ### `Array.prototype.`
28. ### `Array.prototype.`
29. ### `Array.prototype.`
30. ### `Array.prototype.`
31. ### `Array.prototype.`
32. ### `Array.prototype.`

## 相关知识
1. 手写 flat
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#alternatives
