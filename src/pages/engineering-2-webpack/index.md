---
title: Webpack
date: '2022-01-05'
spoiler: 前端工程化之 Webpack
cta: 'JS'
---

Webpack 是一个静态模块打包器。

## 核心概念

  Webpack 由配置驱动，配置主要写在一个配置文件中，这个配置文件就是一个遵循 CommonJS 模块规范的 JS 文件，导出一个配置对象。以下是配置对象中主要使用的属性。

### Entry

  指示 webpack 构建依赖图的入口模块。

  ```jsx
    module.exports = {
      entry: './path/to/my/entry/file.js',
    };
  ```

  默认是 `./src/index.js`。

  #### 详解

  在 webpack 中有多种方式配置 entry 属性。

  1. **单入口语法**

  `entry: string | [string]`

  单一个字符串就是上面的写法，也可以传入包含多个文件路径的数组。数组写法会将多个依赖文件一起注入到一个 `chunk` 。

  2. **对象语法**

  `entry: { <entryChunkName> string | [string] } | {}`

  ```jsx
    module.exports = {
      entry: {
        app: './src/app.js',
        adminApp: './src/adminApp.js',
      },
    };
  ```

  对象语法比较繁琐，但是可扩展性更高。对象可定义的属性如下：
  - `dependOn`: 当前入口依赖的入口点，必须在当前入口点之前加载它们
  - `filename`: 定义每一个输出文件的名称
  - `import`: 启动时加载的模块
  - `library`: 定义库选项，以从当前入口点打包一个库，参考 output.library
  - `runtime`: 运行时块的名称。当设置时，会为当前入口创建一个新的运行时块（runtime chunk，指执行一个模块所需要的 webpack runtime 代码，单独打包可以让浏览器长缓存，参考 optimization.runtimeChunk）
  - `publicPath`: 定义当前入口点的公共路径，参考 output.publicPath

  使用参数几个需要注意的地方：
  - `runtime` 和 `dependOn` 不能同时使用。
  - `runtime` 不能是已存在的入口的名称
  - `dependOn` 入口点不能循环引用

---

  3. **使用场景 Scenarios**

  > https://webpack.js.org/concepts/entry-points/#scenarios

  - 分离 app(应用程序) 和 vendor(第三方库) 入口
  - 多页面应用

### Output

  告诉 webpack 在哪里存放创建的包和如何命名它们。

  ```jsx
    const path = require('path');

    module.exports = {
      entry: './path/to/my/entry/file.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js',
      },
    };
  ```

  默认是 `./dist/main.js`

  #### 详解

  output 属性是一个对象，常用属性如下：
  - `path`: 存放打包文件的目录
  - `filename`: 打包文件的名称，如果不指定 `filename`，webpack 会使用 `entry` 的名称作为文件名
  - `publicPath`: CND 路径，如果在编译时还不知道 `publicPath`，它可以留空并在运行时通过入口点文件中的 `__webpack_public_path__` 变量动态设置

  多入口点的情况下，可以使用 `[name]` 来指定每个入口点的名称。

  ```jsx
    module.exports = {
      entry: {
        app: './src/app.js',
        search: './src/search.js',
      },
      output: {
        filename: '[name].js',
        path: __dirname + '/dist',
      },
    };
    // writes to disk: ./dist/app.js, ./dist/search.js
  ```

### Loaders

  Webpack 默认只能识别 JS 和 JSON 文件，loaders 赋予了 webpack 处理其他类型文件的能力。

  Loaders 有两个属性：
  - `test`: 表示哪个文件或文件夹应该被转换
  - `use`: 表示使用哪个 loader 做转换

  ```jsx
    const path = require('path');
    module.exports = {
      output: {
        filename: 'my-first-webpack.bundle.js',
      },
      module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }],
      },
    };
  ```

  #### 详解

  Loader 有两种使用方式：
  1. **配置**

  就是上面的那种配置方式，在 `module.rules` 中指定，`use` 包含为数组时，loaders 从右向左执行（从下向上）执行

  2. **内联**

  在 `import` 语句中（或其它模块的引入语法）定义。不常用，推荐使用配置方式。

  ```jsx
    import Styles from 'style-loader!css-loader?modules!./styles.css';
  ```



### Plugins

  Loaders 用来处理具体类型的模块，plugins 用来执行更宽泛的作用，比如包优化，资源管理和环境变量注入等。

  ```jsx
    const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
    const webpack = require('webpack'); //to access built-in plugins
    module.exports = {
      module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }],
      },
      plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
    };
  ```

  #### 详解

  Webpack 插件是一个有 apply 方法的对象，这个方法在编译时被 webpack 调用。

  ```jsx
    const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

    class ConsoleLogOnBuildWebpackPlugin {
      apply(compiler) {
        compiler.hooks.run.tap(pluginName, (compilation) => {
          console.log('The webpack build process is starting!');
        });
      }
    }

    module.exports = ConsoleLogOnBuildWebpackPlugin;
  ```

  插件可以接收参数，所以必须通过 `new` 创建一个实例，再把实例传给 plugins 属性。

  使用方式：
  1. **配置**

  ```jsx
    const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
    const webpack = require('webpack'); //to access built-in plugins

    module.exports = {
      // ...
      plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
      ],
    };
  ```

  2. **Node API**

  ```jsx
    const webpack = require('webpack'); //to access webpack runtime
    const configuration = require('./webpack.config.js');

    let compiler = webpack(configuration);

    new webpack.ProgressPlugin().apply(compiler);

    compiler.run(function (err, stats) {
      // ...
    });
  ```

### Mode

  Mode 可以设置为 `development`, `production` 或 `none`，进而使用 webpack 内置的对应每个模式的优化。默认是 `production`。

## 其它概念

### Modules

  模块化编程中，开发者将程序分解成多个块，各司其职。

  Webpack 模块
