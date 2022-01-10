---
title: Event
date: '2021-12-30'
spoiler: JS 第九篇之 Event
cta: 'JS'
---

本篇聚焦于 JS 中的事件系统。

  - [事件流](#事件流)
    - [冒泡](#冒泡)
    - [捕获](#捕获)
    - [DOM 事件流](#dom-事件流)
  - [事件处理程序](#事件处理程序)
    - [HTML 事件处理程序](#html-事件处理程序)
    - [DOM0 事件处理程序](#dom0-事件处理程序)
    - [DOM2 事件处理程序](#dom2-事件处理程序)
  - [事件对象](#事件对象)
    - [事件属性](#事件属性)
    - [事件方法](#事件方法)
      - [`Event.composedPath()`](#eventcomposedpath)
      - [`Event.preventDefault()`](#eventpreventdefault)
      - [`Event.stopImmediatePropagation()`](#eventstopimmediatepropagation)
      - [`Event.stopPropagation()`](#eventstoppropagation)
  - [常用事件类型](#常用事件类型)
    - [UIEvent 用户界面事件](#uievent-用户界面事件)
    - [FocusEvent 焦点事件](#focusevent-焦点事件)
    - [MouseEvent 鼠标事件](#mouseevent-鼠标事件)
      - [属性](#属性)
    - [TouchEvent 触摸事件](#touchevent-触摸事件)
    - [WheelEvent 滚轮事件](#wheelevent-滚轮事件)
    - [InputEvent 输入事件](#inputevent-输入事件)
    - [KeyboardEvent 键盘事件](#keyboardevent-键盘事件)

## 事件流

事件流描述了页面接受事件的顺序。

### 冒泡

冒泡是 IE 定义的一种事件流的方式，被定义为从最具体的元素开始触发，然后向上传播。现代浏览器中的事件会一直冒泡到 window 对象。

### 捕获

捕获是网景提出的事件流方式，意思是从最外层先收到事件，向最具体的元素传播。现代浏览器都是从 window 对象开始捕获。

### DOM 事件流

DOM2 Events 规范规定事件分为 3 个阶段：事件捕获、到达目标和事件冒泡。事件捕获最先发生，然后实际的目标元素触发事件，最后一个阶段是冒泡。

DOM2 Events 规范明确在捕获阶段不命中目标元素，但是现代浏览器都会在捕获阶段也出发目标元素的事件，即目标元素上的事件会触发两次。

## 事件处理程序

事件处理程序表示响应事件的函数。

### HTML 事件处理程序

HTML 属性可以接受事件处理程序。属性名称一般以 `on` 开头

```html
  <button onclick="'console.log('Clicked')">Click</button>
```

HTML 事件处理程序的主要缺点，就是 HTML 和  JS 强耦合，代码混在一起很乱。

### DOM0 事件处理程序

在 JS 中为定义事件可以使用元素属性，比如 `onclick`，把事件处理函数赋给它即可:

```jsx
  let btn = document.getElementById("myBtn");
  btn.onclick = function() {
    console.log("Clicked");
  }; 
```

函数内的 this 为元素本身。这种方式定义的事件，注册在事件流的冒泡阶段。

这种方式定义的事件，可以通过将属性设为 `null` 来移除事件。

### DOM2 事件处理程序

DOM2 Events 添加了两个方法：`addEventListener` 和 `removeEventListener`，这种方式也是我们现在最常用的事件添加和移除方式。

它们可以控制是在捕获阶段还是冒泡阶段处理事件:

```jsx
  let btn = document.getElementById("myBtn");
  btn.addEventListener("click", () => {
    console.log(this.id);
  }, false); // 第三个参数默认为 false，表示在冒泡阶段处理，true 为在捕获阶段
```

`addEventListener` 可以为同一个元素同一个事件添加多个事件处理程序，以添加的顺序执行。

## 事件对象

Event 对象包含了事件相关的信息。Event 对象是默认传给事件处理程序的唯一参数。

### 事件属性

| 属性             | 类型   | 说明                                                      |
| :--------------- | :----- | :-------------------------------------------------------- |
| bubbles          | 布尔值 | 表示事件是否冒泡                                          |
| cancelable       | 布尔值 | 表示是否可以取消事件的默认行为                            |
| target           | 元素   | 触发事件的目标元素                                        |
| currentTarget    | 元素   | 当前事件处理程序所在的元素                                |
| defaultPrevented | 布尔值 | true 表示已经调用了 preventDefault() 方法                 |
| eventPhase       | 整数   | 表示调用事件处理程序的阶段：<br/>1-捕获 2-目标元素 3-冒泡 |
| composed         | 布尔值 | 表示事件是否可以跨越shadow DOM <br/>向 standard DOM 传播  |
| isTrusted        | 布尔值 | true 表示事件是否由浏览器生成，<br>false 表示由开发者创建 |
| timeStamp        | 整数   | 表示事件触发时距离事件创建时的时间，<br>单位为毫秒        |
| type             | 字符串 | 触发事件的类型                                            |

### 事件方法

#### `Event.composedPath()`

shadow DOM 相关。略

#### `Event.preventDefault()`

取消事件的默认行为，比如取消链接的默认跳转行为。

事件对象的 `cancelable` 为 true 时，可以通过此方法取消默认行为。但是不会影响事件继续传播。

#### `Event.stopImmediatePropagation()`

阻止当前元素上所有的后续同类型事件，包括捕获阶段和冒泡阶段。

#### `Event.stopPropagation()`

阻止当前事件的后续传播。

## 常用事件类型

### UIEvent 用户界面事件

- error
- select
- resize

### FocusEvent 焦点事件

`Event <-- UIEvent <-- FocusEvent`

- focus
- blur
- focusin
- focusout

### MouseEvent 鼠标事件

`Event <-- UIEvent <-- MouseEvent`

- click
- dblclick
- mousedown
- mouseenter
- mouseleave
- mousemove
- mouseout
- mouseover
- mouseup

click 事件触发的前提是 mousedown 事件触发后，紧接着又在同一个元素上触发了 mouseup
事件。如果 mousedown 和 mouseup 中的任意一个事件被取消，那么 click 事件就不会触发。类似地，
两次连续的 click 事件会导致 dblclick 事件触发。只要有任何逻辑阻止了这两个 click 事件发生（比
如取消其中一个 click 事件或者取消 mousedown 或 mouseup 事件中的任一个），dblclick 事件就不
会发生。这 4 个事件永远会按照如下顺序触发：

- (1) mousedown

- (2) mouseup

- (3) click

- (4) mousedown

- (5) mouseup

- (6) click

- (7) dblclick

click 和 dblclick 在触发前都依赖其他事件触发，mousedown 和 mouseup 则不会受其他事件影响。

> 摘自红宝书 4

#### 属性

鼠标事件包含了很多特有的属性。略。

### TouchEvent 触摸事件

`Event <-- UIEvent <-- TouchEvent`

- touchcancel
- touchend
- touchmove
- touchstart

### WheelEvent 滚轮事件

`Event <-- UIEvent <-- MouseEvent <-- WheelEvent`

- wheel

### InputEvent 输入事件

`Event <-- UIEvent <-- InputEvent`

- beforeInput
- input
- change

### KeyboardEvent 键盘事件

- keydown
- keypress
- keyup

属性略。

相关知识:

1. https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events


JS 中的事件很复杂，种类多，各种规范也很乱，以上只是 Event 的简单脉络，不过也达到本系列的目的了。
