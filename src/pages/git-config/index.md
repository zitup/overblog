---
title: Git 为不同文件夹配置不同的用户名和邮箱
date: '2022-04-07'
spoiler: Git tip
cta: 'tips'
---

为了区分公司项目和个人项目，往往需要配置不同的用户名和邮箱。Git 支持全局配置和本地配置，但是本地配置只能修改一个项目，如果每个项目都需要配置，往往会遗忘，造成提交信息的错误。

所幸 git 提供了针对文件夹级别的配置方式。

1. 首先新建两个配置文件，我们取名为 `~/.gitconfig-personal` 和 `~/.gitconfig-work`，内容为：

```bash
[user]

  name = xxx
  email = xxx@xxx.com
```

名称和邮箱根据不同文件自己定义。

2. 然后再新建一个总的配置文件 `~/.gitconfig`，内容大致为：

```bash
[includeIf "gitdir:~/work/"]
  path = ~/.gitconfig-work
[includeIf "gitdir:~/project/"]
  path = ~/.gitconfig-personal
```

配置的意思就是根据不同的路径，选择不同的配置文件。

以上两步就完成了，最后在不同的项目下使用以下命令，查看是否配置成功即可：

```bash
git config --show-origin --get user.name
git config --show-origin --get user.email
```
