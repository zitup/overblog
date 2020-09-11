---
title: 在命令行使用谷歌搜索
date: '2020-09-03'
spoiler: 提高效率小知识 search in termianl
cta: 'search in termianl'
---

> 关键词： mac 提效 命令行搜索 search in termianl

1. 在终端的 `bash_profile` 中添加以下代码(如果使用 `zsh` ，则是 `zshrc` 文件)
    ```bash
    function google() {
      open "https://www.google.com/search?q=$1"
    }
    ```
2. 然后 `source ~/.bash_profile`

3. 命令行中输入 `google test`，直接跳转到浏览器搜索界面  
   多字符串搜索用双引号包住 `google "str str str"`


搜索终端中的问题，更快更便捷更极客！  
推荐指数🌟🌟🌟🌟🌟😄

---

顺带提下，vscode 也有一个在终端快速打开当前文件夹的命令 `code .`  
`command+shift+p` 召唤出面板，选择 `install 'code' ...` 安装即可
