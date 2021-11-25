---
title: Module
date: '2021-11-22'
spoiler: JS 第三篇之 Module
cta: 'JS'
---

随着 JS 能做的事情越来越多，应用程序也越来越复杂，便出现了模块的概念，将 JS 程序分割成不同的块。模块化可以解决命名冲突/污染问题，良好的模块化设计可以降低代码之间的耦合，提高代码的可维护性、可扩展性和可复用性。

## ES Modules

ESM 加载模块的方式取决于所处的环境，Node.js 同步加载，浏览器端异步加载。支持模块静态分析。可以作为外部文件引入，也可以在嵌入式脚本中使用，script 需要有 `type="module"` 属性，异步加载异步执行。

### import

  特性

  1. 引入只读的**实时绑定**的模块。实时绑定指导出的模块改变时，引入的值也会更新。
  2. 引入的模块默认在**严格模式**下运行。

  语法

    ```jsx
      import defaultExport from "module-name";
      import * as name from "module-name";
      import { export1 [, export2] } from "module-name";
      import { export1 as alias1, export2 } from "module-name";
      import defaultExport, { export1 } from "module-name";
      import defaultExport, * as name from "module-name";
      import "module-name";
      var promise = import("module-name");
    ```

  dynamic import()

  返回一个 promise。有些情况下适合使用动态引入，但是没必要最好不用。静态引用一般满足使用，而且还可以用于 tree shaking。

### export

  特性

  1. 导出实时绑定的函数、对象、原始值，供其他模块引入。
  2. 导出的模块默认在**严格模式**下运行。
  3. 不可以在嵌入式脚本中使用

  语法

  1. Named Exports(一个模块有0个或多个)

      ```jsx
        export let name1, name2, …, nameN
        export let name1 = …, name2 = …, …, nameN;
        export function functionName(){...}
        export class ClassName {...}
        // Export list
        export { name1, name2, …, nameN };
        // Renaming exports
        export { variable1 as name1, variable2 as name2, …, nameN };
        // Exporting destructured assignments with renaming
        export const { name1, name2: bar } = o;
      ```

  2. Default Exports(一个模块只有1个)

      ```jsx
        export default expression;
        export default function (…) { … }
        export default function name1(…) { … }
        export { name1 as default, … };
        // Aggregating modules
        export * from …;
        export * as name1 from …;
        export { name1, name2, …, nameN } from …;
        export { import1 as name1, import2 as name2, …, nameN } from …;
        export { default, … } from …;
      ```

## CommonJS Modules

CommonJS 通过同步的方式加载模块，首次加载会缓存结果，后续加载则是直接读取缓存结果。

  特性

  - 同步加载
  - 缓存模块

  语法

  - exports
  - modules.exports
  - require [require(x) 算法](https://nodejs.org/dist/latest-v16.x/docs/api/modules.html#all-together)

## 相关知识

1. ES modules 浏览器支持情况？现在编译成了什么样子？Vite？
2. 模块化与工程化：webpack。webpack 同时支持 CommonJS、AMD 和 ESM 三种模块化规范的打包。根据不同规范 webpack 会将模块处理成不同的产物。看看产物
