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
  - `end`: 可选，复制的元素结束的索引(不包含），如果是负数，从后向前计算。如果省略了 start，方法会复制到最后一个

  如果 start 到 end 元素数量大于可以复制的数量，它会裁剪适应。

4. ### `Array.prototype.entries()`

  返回一个包含每个元素的 索引/值 数组的数组迭代器对象。可以使用 `for...of` 遍历。

5. ### `Array.prototype.every(fn, thisArg)`

  测试是否数组所有元素通过了函数参数。全部通过返回 true，否则返回 false。

  只要一个元素执行时返回了 falsy，此方法会立即返回 false。

6. ### `Array.prototype.fill(value, start, end)`

  修改一个数组部分范围为一个统一的值，返回修改后的原数组。

  参数:

  - `value`: 填充的值。如果是对象，所有被填充的地方都指向同一个对象
  - `start`: 可选，开始填充的索引，默认为 0，如果是负数，从后向前计算
  - `end`: 可选，结束填充的索引(不包含），默认为 `arr.length`

---

7. ### `Array.prototype.filter(fn, thisArg)`

  返回一个新数组，元素为通过函数测试的。

8. ### `Array.prototype.find(fn, thisArg)`

  返回第一个满足测试函数的值，如果没有返回 undefine。

9.  ### `Array.prototype.findIndex()`

  返回第一个满足测试函数的值的索引，如果没有返回 -1。

10. ### `Array.prototype.flat(depth)`

  返回一个新数组，内容为根据参数展开的原数组的元素。

11. ### `Array.prototype.flatMap(mapFn, thisArg)`

  先遍历数组，再将结果展开 1 级，返回一个新的数组。

  等于 `map()` 后面跟着 `flat()`，但是更高效。

12. ### `Array.prototype.forEach(fn, thisArg)`

  为数组的每一位元素执行一次传入的函数。返回 undefine。

  `forEach` 没办法打断，除非抛出异常。有中途打断的需要，可以考虑以下几个方法：

  - `for`
  - `for...of`/`for...in`
  - `Array.prototype.every()`
  - `Array.prototype.some()`
  - `Array.prototype.find()`
  - `Array.prototype.findIndex()`

---

13. ### `Array.prototype.includes(searchElement, fromIndex)`

  判断一个数组是否包含传入的元素。

  `fromIndex` 参数可选，开始搜索的起始位置，默认为 0，负数从后向前计算。

  `includes` 匹配元素使用 `sameValueZero` 算法，`-0` 和 `+0` 相等。

14. ### `Array.prototype.indexOf(searchElement, fromIndex)`

  返回传入的元素在数组内匹配到的第一个索引，没有返回 -1。

  `fromIndex` 参数可选，如果大于等于数组长度，数组不会被搜索。

  `indexOf` 匹配元素使用 `Strict Equality Comparison(===)` 算法

15. ### `Array.prototype.join(separator)`

  返回一个由传入参数隔开的数组元素串联的字符串，默认使用 `,` 隔开。如果数组只有一个元素，返回由这个元素组成的字符串。数组长度为 0，返回一个空字符串。

  `undefined`/`null` 转为空字符串。

16. ### `Array.prototype.keys()`

  返回一个由每一个索引组成的数组迭代器。

  ```jsx
    var arr = ['a', , 'c'];
    var sparseKeys = Object.keys(arr);
    var denseKeys = [...arr.keys()];
    console.log(sparseKeys); // ['0', '2']
    console.log(denseKeys);  // [0, 1, 2]
  ```

17. ### `Array.prototype.lastIndexOf(searchElement, fromIndex)`

  返回传入的元素在数组内匹配到的最后一个索引，没有返回 -1。此方法从后向前搜索。

  `fromIndex` 参数可选，如果大于等于数组长度，整个数组被搜索。如果是负数，从后向前计算位置，但是如果`arr.length + fromIndex` 小于 0，整个数组不会被搜索。

  `lastIndexOf` 匹配元素使用 `Strict Equality Comparison(===)` 算法，和 `indexOf` 方法一样。

18. ### `Array.prototype.map(fn, thisArg)`

  为数组的每一位元素执行传入的函数，使用返回值作为新数组的元素。

19. ### `Array.prototype.pop()`

  移除数组的最后一个元素，并返回这个元素。会改变数组。空数组返回 undefined。

20. ### `Array.prototype.push()`

  向数组的末尾添加一个或多个元素，返回这个数组的新长度。

21. ### `Array.prototype.reduce(callbackFn, initialValue)`

  对数组的每一位元素执行传入的函数，把前一个元素的执行结果作为下一个元素执行时的参数，最终返回一个值。

  如果没有传入初始值，在第一次运行回调时没有“上次计算的返回值”，这时候会把第一个元素作为初始值，从第二个元素开始迭代。

  `callbackFn` 参数接收以下 4 个参数：
  - `previousValue`: 上一次 `callbackFn` 的执行结果。第一次执行时为传入的初始值或 `array[0]`。
  - `currentValue`: 当前元素的值。
  - `currentIndex`: 当前元素的索引。
  - `array`: 要遍历的数组。

  空数组调用 `reduce` 且没有定义初始值，将抛出 `TypeError`。

  例子：

  ```jsx
    // 按顺序执行 promise，生成了一条 promise chain
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#running_promises_in_sequence
  ```

22. ### `Array.prototype.reduceRight()`

  和 `reduce()` 方法一样，只是从右向左遍历。

23. ### `Array.prototype.reverse()`

  使用原地算法翻转数组。返回修改后的原数组。

24. ### `Array.prototype.shift()`

  移除数组的第一个元素，返回这个元素。

25. ### `Array.prototype.slice(start, end)`

  浅复制数组的一部分到一个新创建的数组。不会改变原数组。

  参数：
  - `start`: 可选，负数从后向前计算，如果大于等于数组长度，方法返回空数组
  - `end`: 可选，选取元素不包含 `end`。默认为数组长度，如果大于数组长度，也为数组长度。负数从后向前计算，如果 `array.length + end` 小于等于 0，方法返回空数组

---

26. ### `Array.prototype.some(fn, thisArg)`

  检测是否至少有一个元素通过了传入函数的测试。

27. ### `Array.prototype.sort(compareFn)`

  使用原地算法排序数组，返回改变后的数组。
  
  如果没有参数，默认排序顺序是升序，数组元素将转换为字符串，然后根据每个字符的 Unicode 代码点值进行排序。如果数组有 `undefined` 元素，会被排到数组末尾。如果有空元素，则排在 `undefined` 之后。

  参数：
  - `compareFn`: 比较函数有两个参数 `a` 和 `b`，分别代表两个比较的元素。
  
  如果提供了 `compareFn`，排序会按比较函数的返回值确定（`undefined` 不调用比较函数，直接放到数组末尾）：

  | `compareFn(a, b)` 返回值 | 排序          |
  | :----------------------- | :------------ |
  | > 0                      | b 排在 a 之前 |
  | < 0                      | a 排在 b 之前 |
  | === 0                    | 保持原排序    |

  需要注意的是，从 ES2019 开始，`sort` 方法保证了[排序稳定性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sort_stability)。

28. ### `Array.prototype.splice(start, deleteCount, item1, ...itemN)`

  修改数组的一部分，可以是移除、替换、添加新元素。返回一个包含删除元素的数组。

  参数：
  - `start`: 开始修改数组的起始索引。如果大于等于数组长度，不会删除元素，方法会表现为向数组末尾添加元素。负数从后先前计算。
  - `deleteCount`: 表示从 `start` 开始删除的元素个数。如果省略，或者大于等于可以移除的元素，那么从 `start` 到最后所有元素都会被删除。如果为 0 或负数，方法表现为添加元素。
  - `item1, item2, ...`: 从 `start` 开始，向数组添加的元素

  -----

29. ### `Array.prototype.toLocaleString(locales, options)`

  返回表示数组及其元素的本地化字符串。使用 `,` 分隔。

30. ### `Array.prototype.toString()`

  返回一个表示数组及其元素的字符串。使用 `,` 分隔。

31. ### `Array.prototype.unShift()`

  向数组开头添加一个或多个元素，返回这个数组的新长度。

32. ### `Array.prototype.values()`

  返回一个由每一个索引的值组成的数组迭代器。

33. ### `Array.prototype[@@iterator]()`

  `@@iterator` 方法是[可迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)的一部分，它定义了如何同步迭代一系列值。

  `@@iterator` 属性的初始值与 `values()` 方法的初始值是相同的函数对象。`arr[Symbol.iterator]` 返回 `values()` 函数。

## 相关知识
1. 手写 flat
   
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#alternatives
