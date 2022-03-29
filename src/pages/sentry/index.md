---
title: sentry 部署极简教程
date: '2020-08-31'
spoiler: docker 一键部署
cta: 'react'
---

> 关键词： sentry docker 更换源

## 1. 克隆 sentry 官方部署仓库

```bash
# git clone https://github.com/getsentry/onpremise
wget https://github.com/getsentry/self-hosted/archive/refs/tags/20.8.0.tar.gz
```

注意：克隆仓库下来的是最新的版本，需要安装 README.md 中对应的 docker、docker-compose 版本。本次安装使用的 20.8.0，安装的 docker 最新版、docker-compose@1.27.4。

## 2. 安装 docker docker-compose  

  ### **版本要求**

  * Docker 17.05.0+
  * Compose 1.23.0+
  
  > Ubuntu16-18 安装
  ### **安装 docker**
  * 删除旧版本 Docker
    ```
    sudo apt-get remove docker docker-engine docker.io
    ```
  * 添加 Docker 软件源
    ```bash
    sudo apt-get update
    sudo apt-get install apt-transport-https ca-certificates  curl software-properties-common
    curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
    ```
  * 安装 Docker CE（社区版）
    ```bash
    sudo apt-get update -y
    sudo apt-get install docker-ce -y
    ```
  * 设置开机启动
    ```bash
    sudo systemctl enable docker
    sudo systemctl start docker
    ```
  * 把当前用户加入 docker 组
    ```bash
    sudo groupadd docker
    sudo usermod -aG docker $USER
    ```
  * 测试
    ```bash
    docker run hello-world
    ```
  * 如果出现 `permission denied` 错误，尝试执行
    ```bash
    newgrp docker
    ```
    再重复上一步
  ### **安装 docker-compose**
  * 安装
    ```bash
    sudo curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```
  * 测试
    ```bash
      docker-compose --version
    ```

  > mac 安装  
  
  直接官网下载安装，[地址点我](https://docs.docker.com/docker-for-mac/install/)，国内下载较慢，可以使用迅雷下载（迅雷用完就删😼），Docker for Mac 和 Docker Toolbox 已经包含了 Compose , 所以 Mac 用户不用单独安装Compose

## 3. 最重要的一步：更换源

这里主要更换两处源
  * 更换 docker 镜像源
    在 `/etc/docker/daemon.json` 中写入以下内容（文件不存在请自行创建）
    ```jsxon
    "registry-mirrors": [
      // 阿里云的源，需要申请
      "https://xxxxxx.mirror.aliyuncs.com",
      "http://docker.mirrors.ustc.edu.cn",
      "http://hub-mirror.c.163.com"
    ]
    ```
    然后重启服务
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    ```
    
  * **更换 apt-get 源(重要！！！)**  
    这里是修改镜像中 apt debian 的源，否则国内下载要很久很久  
      * 进到第一步克隆的 self-hosted 目录
      * 打开 cron 下的 Dockerfile
      * 将
        ```bash
        RUN apt-get update && apt-get install -y --no-install-recommends cron && \
            rm -r /var/lib/apt/lists/*
        ```
        替换成
        ```bash
        RUN sed -i "s@http://deb.debian.org@http://mirrors.aliyun.com@g" /etc/apt/sources.list
        RUN sed -i "s@http://security.debian.org/debian-security@http://mirrors.aliyun.com/debian-security@g" /etc/apt/sources.list && rm -Rf /var/lib/apt/lists/*

        RUN apt-get update && apt-get install -y --no-install-recommends cron apt-utils && \
            rm -r /var/lib/apt/lists/*
        ```

## 4. 最后
* self-hosted 目录下 `./install.sh`
* 启动
  ```bash
  docker-compose up -d
  ```
* 停止
  ```bash
  docker-compose stop
  ```

结束，完美。
