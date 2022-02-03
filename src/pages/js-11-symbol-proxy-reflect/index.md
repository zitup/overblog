---
title: Symbol Proxy Reflect Generator
date: '2022-01-27'
spoiler: JS 第十一篇之 Symbol Proxy Reflect Generator
cta: 'JS'
---

## Symbol

Symbol 是 JS 的内置对象，构造函数返回一个 symbol 原始值。Symbol 经常用来作为一个对象的唯一属性键，不会与任何其它键冲突。

### Constructor

```jsx
  Symbol()
  Symbol(key)
```

返回一个唯一的 symbol 值。

不可以作为构造函数调用，`new Symbol()` 会报 TypeError。

### Static properties

Symbol 的静态属性都是 JS 中内置的 symbol 值，表示各种含义，它们都可以修改，自定义具体的行为。

1. #### Symbol.asyncIterator

Symbol.asyncIterator 是一个方法。一个对象设置了这个方法时，可以供 `for await...of` 迭代使用。

目前 JS 中没有默认设置这个属性的对象。

2. #### Symbol.hasInstance

Symbol.hasInstance 是一个方法。用来判断一个对象是否是一个构造函数的实例。`Instanceof` 操作符的行为可以通过这个属性修改。

```jsx
  Object.defineProperty(Array, Symbol.hasInstance, {
    value: instance => false
  })

  console.log([] instanceof Array); // 永远是 false
```

3. #### Symbol.isConcatSpreadable

一个布尔值。决定使用 `Array.prototype.concat()` 时，值是否应该被展开。(对 Array-like 对象使用 concat 时会有用)

4. #### Symbol.iterator

一个方法。指定一个对象使用 `for...of` 时的默认迭代器。

下列内置对象包含这个属性：
- `Array.prototype[@@iterator]()`
- `TypedArray.prototype[@@iterator]()`
- `String.prototype[@@iterator]()`
- `Map.prototype[@@iterator]()`
- `Set.prototype[@@iterator]()`

---

5. #### Symbol.match

一个方法。指定正则表达式和字符串匹配的方式，也用于确定对象是否可以用作正则表达式。

`String.prototype.matchAll()` 使用这个方法。

6. #### Symbol.matchAll

一个方法。它返回一个迭代器，指定正则表达式和字符串匹配的方式。

它用于 `RegExp.prototype[@@matchAll]()` 和 `String.prototype.matchAll()`（`String.prototype.matchAll()` 内部调用的也是 `RegExp.prototype[@@matchAll]()`）。

7. #### Symbol.replace

一个方法。替换匹配到的字符串，用于 `String.prototype.replace()`。

8. #### Symbol.search

一个方法。返回字符串中与正则表达式匹配的索引，用于 `String.prototype.search()`。

9. #### Symbol.split

一个方法。在匹配正则表达式的索引处拆分字符串，用于 `String.prototype.split()`。

10. #### Symbol.species

一个构造函数，用于创建派生对象。

11. #### Symbol.toPrimitive

一个方法。将对象转换为字符串，在需要将对象转换为字符串时调用。

12. #### Symbol.toStringTag

一个方法。表示对象的默认字符串描述。用于 `Object.prototype.toString()`。

13. #### Symbol.unscopables

略。


### Static methods

1. #### Symbol.for(key)

使用给定键搜索现有符号，如果找到则返回。否则，将在全局符号注册表中使用键创建一个新符号。

2. #### Symbol.keyFor(sym)

查询给定 symbol 的键。没有返回 undefined。

### Instance properties

1. #### Symbol.prototype.description

一个字符串。表示 symbol 的描述符。

```jsx
  Symbol('desc').description;  // "desc"
  Symbol('').description;      // ""
  Symbol().description;        // undefined
  Symbol.iterator.description; // "Symbol.iterator"
```

### Instance methods

1. #### Symbol.prototype.toSource()

> 不再推荐使用。

返回一个表示对象源代码的字符串。

2. #### Symbol.prototype.toString()

返回一个表示指定 Symbol 对象的字符串。覆写 `Object.prototype.toString()`。

3. #### Symbol.prototype.valueOf()

返回一个 Symbol 对象的原始值。覆写 `Object.prototype.valueOf()`。

4. #### Symbol.prototype[@@toPrimitive]

即 Symbol 对象的 `Symbol.toPrimitive` 属性。将 Symbol 转为原始值。

## Proxy

Proxy 可以让我们为对象创建一个代理，该代理可以拦截和重新定义该对象的默认操作。

### Constructor

创建 Proxy 对象。

```jsx
  new Proxy(target, handler)
```

参数
- `target`: 用 Proxy 包装的目标对象。可以是任何对象。
- `handler`: 一个对象，其属性都是函数，定义了代理在对目标对象执行操作时的行为。

#### Handler functions

下面列出了 handler 可以定义的所有属性。处理程序函数有时称为陷阱，因为它们会捕获对底层目标对象的调用。

- **`handler.apply()`**: 对函数调用的拦截
- **`handler.construct()`**: 对 new 操作符的拦截
- **`handler.defineProperty()`**: 对 `Object.defineProperty` 操作的拦截
- **`handler.deleteProperty()`**: 对 delete 操作符的拦截
- **`handler.get()`**: 对 get 描述符的拦截
- **`handler.getOwnPropertyDescriptor()`**: 对 `Object.getOwnPropertyDescriptor` 操作的拦截
- **`handler.getPrototypeOf()`**: 对 `Object.getPrototypeOf` 操作的拦截
- **`handler.has()`**: 对 in 操作符的拦截
- **`handler.isExtensible()`**: 对 `Object.isExtensible` 操作的拦截
- **`handler.ownKeys()`**: 对 `Object.getOwnPropertyNames` 和 `Object.getOwnPropertySymbols` 的拦截
- **`handler.preventExtensions()`**: 对 `Object.preventExtensible()` 操作的拦截
- **`handler.set()`**: 对 set 描述符的拦截
- **`handler.setPrototypeOf()`**: 对 `Object.setPrototypeOf` 操作的拦截

### Static methods

#### Proxy.revocable()

创建一个可撤销的 Proxy 对象。

```jsx
  Proxy.revocable(target, handler);
```

## Reflect

Reflect 为可拦截的 JS 操作提供方法。这些方法和 `proxy handler` 的那些属性方法一样。

Reflect 是一个对象，它的所有属性和方法都是静态的（就像 Math 对象一样）。

### Static methods

略。参看上面的 `proxy handler` 列表。

其中有些方法和 Object 上的方法相同，就是可能会有些[细微差别](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)。

## Generator

Generator 对象由生成器函数（function*）返回，它同时符合可迭代协议和迭代器协议。

### Instance methods

1. #### Generator.prototype.next()

返回由 yield 表达式产生的值。

2. #### Generator.prototype.return()

返回给定值并结束生成器。

3. #### Generator.prototype.throw()

向生成器抛出错误（也结束生成器，除非从该生成器中捕获）。
