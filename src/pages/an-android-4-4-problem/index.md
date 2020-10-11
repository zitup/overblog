---
title: 一个安卓 4.4 H5 的兼容性问题
date: '2020-09-22'
spoiler: react 16、localStorage
cta: 'react'
---

## 解决过程
**现象** 是 react 16+ 在 android4.4 的 webview 和自带的浏览器内，会白屏，本来以为只是 react 16 的兼容性问题，搞了半天，还有别的兼容性问题...


**首先**是 react 16 运行的 JS 环境要求，看这里[官方说明](https://zh-hans.reactjs.org/docs/javascript-environment-requirements.html)，说得很清楚了，因为用到了 `Map` 和 `Set`，而这俩的兼容性也有要求，所以需要加上 polyfill，官方有俩推荐：`core-js` 和 `babel-polyfill`。
我用的是 `core-js` ，像文档里那样，把引用放到入口文件的**最**顶部，或者放到 `webpack` 的打包入口里。


**然后**把上面搞完了，还是白屏，怀疑是引用的姿势不对，把 `core-js` 改到了 `webpack` 的入口那里...其实是一样的，只是还有别的错误。再尝试使用 `window.onerror` 捕获错误，只弹出一个字符串 `Script error.`，没有什么有效信息，也不行，再尝试最笨的办法，从入口文件开始，一步一个 `alert`，最后终于定位到了一个方法，内部用到了 `localStorage`，打印 `window.localStorage` 是 `null`，找到问题就好解决了，判断一下是否存在，做了兼容处理。

> 后续查找 `Script error.` 这几个字符是浏览器的同源策略（Same Origin Policy [参考这里](https://blog.sentry.io/2016/05/17/what-is-script-error)），因为 js 是放在 cdn 上，触发了同源限制，浏览器为了避免信息泄漏，只展示脚本错误几个字。


## 几个关键点

* 解决问题没有明确的思路，一直抱有侥幸心理，胡乱尝试，浪费了很多时间，其实科学的解决思路才是解决问题的最快办法
* 完善错误报警
  * 第一个问题是 react 16 的兼容性问题，会直接导致渲染出错，尝试了使用[错误边界](https://zh-hans.reactjs.org/docs/error-boundaries.html)包裹根组件，没有报出错误，应该是兼容性问题导致错误边界组件本身也无法正确渲染了（猜测是这样，没有看过源码），这样的兼容性问题貌似没有好的错误报警方式
  * 事件处理器内部的错误，也就是 js 的执行错误，只能多使用 `try catch` 包住，尽量避免直接崩溃的情况，还可以及时上报。如果使用了 `sentry`，后端较容易处理，可以自动捕获直接抛出来的错误，前端相对来说比较麻烦，只能手动捕获上报了。


## 一个手机端调试工具

[eruda](https://github.com/liriliri/eruda)，可以展示 `console` 的消息，一定程度上可能有用。
