---
title: ESLint
date: '2021-12-13'
spoiler: 前端工程化之 ESLint
cta: 'JS'
---

>前言
>
>现在的前端早已不是以前的 JS + CSS 一把梭的时代，它包含了广泛的内容，前端工程化是其中绕不开的基础建设。而在不同的开发阶段，工程化又包含不同的内容。
>
>开发阶段：eslint、babel  
>构建阶段：webpack  
>测试阶段：..  
>部署阶段：CI/CD  
>监控阶段：..  
>
>每一项技术包含的内容非常多，但是作为一个前端人是怎么也绕不开的，只能用力学习了。
>
>本系列聚焦于开发阶段和构建阶段，以实际的业务项目为本，力求逐篇掌握 eslint、babel、webpack 的原理和使用。系列结束时，希望可以完全掌握业务项目，并进行升级优化。
>
>本篇为 eslint。


## 介绍

ESLint 是识别和报告 JS 中特定模式的库，在开发阶段避免 bug。

它有以下几个特点：

  - 使用 Espree 解析 JS
  - 使用 AST(Abstract Syntax Tree) 评估代码中的模式
  - 可插拔，每条规则都是一个插件

## 配置

ESLint 由配置驱动，在配置中定义需要的规则。

有两种方式配置 ESLint：

  1. JS 注释
  2. 配置文件

配置文件是主要的方式，它包含很多选项，让我们可以细粒度的控制 ESLint 如何对待代码。

### Configuration Files

  ESLint 支持多个文件后缀：`js,cjs,yaml/yml,json`，和 `package.json` 中的 `eslintConfig` 字段。

  多个配置文件存在时，优先级如下：

  1. `.eslintrc.js`
  2. `.eslintrc.cjs`
  3. `.eslintrc.yaml`
  4. `.eslintrc.yml`
  5. `.eslintrc.json`
  6. `package.json`

配置

1. #### setting

    共享信息可以通过此字段分享给所有插件。

    ```jsxon
      {
        "settings": {
          "sharedData": "Hello"
        }
      }
    ```

2. #### extends

    继承其它配置文件的规则、插件和语言选项。

    ```jsxon
      {
        "extends": "eslint:recommended",
      }
    ```

3. #### rules

    规则列表。

4.  #### plugin

    插件是一个 npm 包，可以为 ESLint 提供各种扩展，比如规则、配置。

    ```jsxon
      {
        "plugins": [
          "react"
        ],
        "extends": [
          "eslint:recommended",
          "plugin:react/recommended"
        ],
        "rules": {
          "react/no-set-state": "off"
        }
      }
    ```

5.  #### overrides

    可使用 overrides 键覆盖配置中的设置，覆盖文件基于 glob 模式选择。

    ```jsxon
      {
        "rules": {
          "quotes": ["error", "double"]
        },
        "overrides": [
          {
            "files": ["bin/*.js", "lib/*.js"],
            "excludedFiles": "*.test.js",
            "rules": {
              "quotes": ["error", "single"]
            }
          }
        ]
      }
    ```

### Language Options

1. #### env

    设置脚本的运行环境，每种环境都有一组特定的预定义全局变量。供 ESLint 判断当前环境和可以使用的全局变量。

    ```jsxon
      {
        "env": {
          "browser": true,
          "node": true,
          "es6": true
        }
      }
    ```

2. #### globals

    自定义的全局变量。也可以在这里禁止某些全局变量的使用。

    ```jsxon
      {
        "globals": {
          "var1": "writable",
          "var2": "readonly",
          "Promise": "off",
        }
      }
    ```

    代码中可以像全局变量那样直接使用 `var1/var2` ，而且 `var2` 只读，不可以更改。同时禁用了全局变量 `Promise` 的使用。

3. #### parserOptions

    定义支持的 ECMAScript 语法版本。比如 `{ parserOptions: { ecmaVersion: 6 } }`。支持的配置项如下：

    - ecmaVersion: 3, 5 (default), 6, 7, 8, 9, 10, 11, 12, or 13。或者 latest
    - sourceType: script(default)/module，设置代码是否在 ESModule 下运行
    - allowReserved
    - ecmaFeatures
      - globalReturn
      - impliedScript
      - jsx

    ```jsxon
      {
        "parserOptions": {
          "ecmaVersion": "latest",
          "sourceType": "module",
          "ecmaFeatures": {
            "jsx": true
          }
        }
      }
    ```

### Rules

ESLint 自身携带了很多规则。也可以通过插件引入其它规则，也可以在配置中覆盖某些规则。通过以下几个值修改规则：

   - "off" / 0 关闭规则
   - "warn" / 1 触发时警告
   - "error" / 2 触发式报错

   ```jsxon
     {
       "rules": {
         "eqeqeq": "off",
         "curly": "error",
         "quotes": ["error", "double"]
       }
     }
   ```

代码内修改规则：

  ```jsx
    /* eslint eqeqeq: "off", curly: "error" -- Here's a description about why this configuration is necessary. */
  ```

代码内禁止规则：

  ```jsx
    /* eslint-disable */
    alert('foo');
    /* eslint-enable */

    alert('foo'); // eslint-disable-line
    // eslint-disable-next-line
    alert('foo');
    /* eslint-disable-next-line */
    alert('foo');
    alert('foo'); /* eslint-disable-line */
  ```

针对性的禁用规则还可以在配置文件的 overrides 字段设置。

### Plugins

1. #### parser

  ESLint 默认使用 [Espree](https://github.com/eslint/espree) 解析器。也可以使用第三方符合规范的解析器：

  ```jsxon
    {
      "parser": "esprima",
      "rules": {
        "semi": "error"
      }
    }
  ```

  以下是三个常用的解析器

  - [Esprima](https://www.npmjs.com/package/esprima)
  - [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) babel 解析器的包装，使其与 ESLint 兼容
  - [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) 将 TypeScript 转换为 ESTree 兼容的形式，以便 TS 可以在 ESLint 中使用

2. #### processor

  processor 可以从其它类型文件中提取 JS 代码，供 ESLint 检测，或是在预处理阶段转换 JS 代码。

  ```jsxon
    {
      "plugins": ["a-plugin"],
      "processor": "a-plugin/a-processor"
    }
  ```

  也可以结合 overrides 使用，只处理特定文件:

  ```jsxon
    {
      "plugins": ["a-plugin"],
      "overrides": [
        {
          "files": ["*.md"],
          "processor": "a-plugin/markdown"
        }
      ]
    }
  ```

3. #### plugins

  ESLint 支持第三方插件，安装后可以在配置文件中引入使用。插件的 `eslint-plugin-` 前缀可以省略。

  ```jsxon
    {
      "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
      ]
    }
  ```

  带有作用域的包，同样可以省略 `eslint-plugin-`:

  ```jsxon
    {
      // ...
      "plugins": [
        "@jquery/jquery", // means @jquery/eslint-plugin-jquery
        "@foobar" // means @foobar/eslint-plugin
      ]
    }
  ```

### Ignoring Code

1. #### ignorePatterns

  告诉 ESLint 忽略检查的文件或文件夹。

  ```jsxon
    {
      "ignorePatterns": ["temp.js", "**/vendor/*.js"],
      "rules": {
        //...
      }
    }
  ```

2. #### `.eslintignore` file

  单独的一个文件，告诉 ESLint 忽略检查的文件或文件夹。优先级高于 `ignorePatterns` 配置项。

  Glob 模式匹配使用 `node-ignore` 库，遵循以下规则:

  - `#` 开头的行会被忽略
  - 路径相对于当前文件夹
  - `!` 表示否定，重新包含一个前面被忽略的模式


## TODO

### 升级

1. 项目 eslint 依赖库升级
   - 查看每个库的更新情况，是否有必要升级
   - 
2. 项目 eslint 升级

### 脚手架 eslint 部分
