---
title: 怎么用 nodejs 写一个 Git Hook
date: '2020-12-27'
spoiler: Git Hook
cta: 'git'
---

### 介绍 Git Hook

`Git Hook` 是 Git 执行命令时前后可以触发的的脚本，比如 pre-commit ，在提交前执行某些东西，这个也是在前端体系中用的较多的一个 Hook，常见的使用一般也是搭配 Husky 和 lint-staged ，做代码提交前的检查。还有其他的比如，pre-rebase 、 post-rewrite 、post-checkout 、post-merge ，看名字就知道他们的执行时间了。

### 怎么快速创建自己的钩子？

 1. 创建一个文件，命名为对应的钩子名称，语言随便，这里用的nodejs
 2. 将文件放到项目下的 .git/hooks
 3. chmod 777 xxx(你的文件) ，将文件改为可执行文件

使用对应的 git 命令，钩子就生效啦

### 本文主角 👉 pre-commit

直接上代码

```jsx
#!/usr/bin/env node

const { execSync } = require('child_process');

// 客户端文件夹名称
const client = 'client-src';

try {
 const stagedFile = execSync('git diff --cached --name-only', {encoding: 'utf-8'});

 // 提交文件包含 client 下文件，不包含 views/index.html
 if (stagedFile.includes(client) && !stagedFile.includes('index.html')) {
   execSync(`cd ${client} && npm run build`)
   process.exit(1)
 } else {
  process.exit(0)
 }

} catch (e) {
 console.log(e);
 process.exit(1)
}
```

代码的目的是当 staged 的文件中包含 client 下的文件时，在 client 下执行 build，跟我们的项目结构有关。
`git diff --cached --name-only` 是获取 stage 的文件，可以根据条件来执行某些逻辑。
process.exit(0) 是可以继续执行 commit，0 之外的返回，会打断 commit 。


So easy? 就是这么简单，然鹅不得不说 git 是个很庞大的技术栈，数不清的命令...

快去试试你自己的钩子吧～不要忘了 chmod 777 赋予文件可执行权限哟～
