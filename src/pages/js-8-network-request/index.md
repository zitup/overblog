---
title: Network requests
date: '2021-12-21'
spoiler: JS 第八篇之 Network requests
cta: 'JS'
---

  Fetch API 提供了一个 JavaScript 接口，用于访问和操作 HTTP 管道的一部分，例如请求和响应。它在浏览器中定义在 window 接口上。

## 介绍

### fetch()

  返回一个 promise。成功时解析为 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。

  promise 仅在 网络错误时 reject，不会因为 HTTP 错误(比如 404/500)而 reject。所以必须使用 `.then` 处理 HTTP 错误。

  fetch() 方法由内容安全策略(CSP)的 connect-src 指令控制，而不是它正在检索的资源的指令。

  #### 语法

  `const fetchResponsePromise = fetch(resource [, init])`

  1. resource 表示想要获取的资源。它可以是以下两种格式：

     - 一个字符串或是包含 URL 对象的对象
     - 一个 `Request` 对象

  2. init 表示可选的请求设置

     - `method` 请求方法
     - `headers` 请求头
     - `body` 请求体，只能是 `Blob, BufferSource, FormData, URLSearchParams, USVString, ReadableStream` 其中之一
     - `mode` 请求模式
       - `cors` 允许跨域
       - `no-cors` 阻止 `HEAD`, `GET` 和 `POST` 之外的请求，而且请求头只可以包含[简单请求头](https://fetch.spec.whatwg.org/#simple-header)
       - `same-origin` 只能发送同源请求
     - `credentials` 控制浏览器如何处理 credentials
       - `omit` 告诉浏览器从请求中排除凭据，并忽略响应中发回的任何凭据(比如 `Set-Cookie` 头设置)
       - `same-origin` 告诉浏览器对同源 URL 的请求中包含凭据，并使用来自同源 URL 的响应中发回的任何凭据，默认设置
       - `include` 告诉浏览器在同源和跨域请求中包含凭据，并始终使用在响应中发回的任何凭据
     - `catch` 告诉浏览器如何处理 HTTP 缓存，选项同 [Request.catch](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)
     - `redirect` 如何处理一个重定向请求 `follow error manual`
     - `referrer` 请求的来源
     - `referrerPolicy` 请求来源策略
     - `integrity` 子资源完整性值
     - `signal` `AbortSignal` 实例。允许我们与 fetch 请求通信，并中止它

  #### 异常

  1. `AbortError`

    调用 `AbortController abort()` 中止请求时触发的错误
  
  2. `TypeError`

    略

### Headers

  响应/请求标头设置接口。用来构建请求头，但是一般直接使用一个普通对象表示。

### Request

  请求接口，表示请求资源对象。用来构建供 `fetch()` 使用的请求对象。

### Response

  响应接口，表示请求的响应对象。用来构建请求响应对象，更多情况下是直接处理返回的 `Response` 对象，比如 `fetch()` 返回的就是一个解析为 `Response` 对象的 promise。

  常用属性

  - `Response.status` 表示响应状态码的整数
  - `Response.statusText` 表示响应状态信息的字符串，http/2 不支持状态消息
  - `Response.ok` 表示响应状态码是否在 200-299 的布尔值

### Body

  请求和相应都可以包含 body 数据。Body 是下列类型之一：

  - `ArrayBuffer`
  - `ArrayBufferView`
  - `Blob/File`
  - string
  - `URLSearchParams`
  - `FormData`

  Request 和 Response 对象都有下列方法提取数据：

  - `Request.arrayBuffer()` / `Response.arrayBuffer()`
  - `Request.blob()` / `Response.blob()`
  - `Request.formData()` / `Response.formData()`
  - `Request.json()` / `Response.json()`
  - `Request.text()` / `Response.text()`



## CORS

  Cross-Origin Resource Sharing(CORS)，跨域资源共享。它允许服务端表明，是否可以让浏览器端跨域请求自己的资源。

  为了安全原因，浏览器严格限制跨域请求。比如，`XMLHttpRequest` 和 `fetch` 就遵守[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)（协议、端口、域名/IP相同，则同源），它们默认只能请求同源资源，阻止跨域请求，除非服务器设置了 CORS 。

### 常见的使用 CORS 的请求

- XMR/Fetch 跨域请求
- Web Fonts（@font-face）
- img/video/audio 标签
- WebGL 纹理
- canvas drawImage()
- ...

### Simple requests 简单请求

简单请求不会触发 CORS。满足以下**所有条件**的就是简单请求：

- `GET, HEAD, POST` 之一
- 手动设置的标头只能是 `Accept, Accept-Language, Content-Language, Content-Type` 之一
- `Content-Type` 只能是 `application/x-www-form-urlencoded, multipart/form-data, text/plain` 之一

> Fetch 规范并不使用 `simple request` 概念。以上这些可以看作是大概的一些条件，不属于规范。

### Preflighted requests 预检请求

除了简单请求，对于预检请求，浏览器会先向服务器发送一个 `OPTIONS` 请求。

### Request and credentials

跨域的简单请求如果携带了凭据，比如携带了 Cookie 头。此时因为是简单请求，浏览器不会发送预检请求，但是如果服务器的响应没有 `Access-Control-Allow-Credentials: true` 头部，浏览器会拒绝掉这个响应。

![img](./credential-req.png)

#### Credentialed requests and wildcards 凭据请求和通配符

当响应一个带凭据的跨域请求时:

  - `Access-Control-Allow-Origin` 头部不能为 `*`，必须为具体的源
  - `Access-Control-Allow-Headers` 头部不能为 `*`，必须为具体的头部项
  - `Access-Control-Allow-Methods` 头部不能为 `*`，必须为具体的方法项

如果一个请求携带了凭据（比如 `Cookie` 头），响应了 `Access-Control-Allow-Origin: *`，浏览器将阻止对响应的访问，并在 devtools 控制台中报告 CORS 错误。

同时，当响应头有 `Set-Cookie`，但是 `Access-Control-Allow-Origin` 为 `*`，此时 cookie 设置不会生效，`Access-Control-Allow-Origin` 必须为具体的源。

### 相关头部

  #### Request header

  CORS 预检请求会带上三个头部

  - `origin` 
  - `Access-Control-Request-Method` 实际请求使用的方法
  - `Access-Control-Request-Headers` 实际请求携带的头部

  #### Response header

  预检请求响应会有以下几个头部

  - `Access-Control-Allow-Origin` 服务器允许的请求源
  - `Access-Control-Allow-Methods` 服务器允许的请求方法
  - `Access-Control-Allow-Headers` 服务器允许的请求携带的头部
  - `Access-Control-Allow-Credentials` 服务器是否允许实际请求携带凭据
  - `Access-Control-Max-Age` 服务器设置的允许客户端缓存响应，不用再次发送预检请求的最大时间，以秒为单位，默认为 5。Firefox 可以设置的最大值为 24 小时，Chromium（v76 之前）为 10 分钟，Chromium（v76 之后）为 2 小时。

### Preflight

  CORS 预检请求，检查服务器是否允许实际的跨域请求。
  
  预检请求是一个 OPTIONS 请求，使用三个头部字段，`Access-Control-Request-Method`, `Access-Control-Request-Headers`,`Origin`，分别表示真实请求使用的方法、头部和源。

  当请求是需要被预检的请求(to be preflighted)时，浏览器会自动发出一个预检请求。

  > PS. 常用的 CORS 库，比如 `@koajs/cors`，都专门拦截了 `OPTIONS` 请求。否则需要手动处理这类请求。

## CSP

  Content-Security-Policy，内容安全策略。它是 HTTP 一个附加的安全层，有助于检测和缓建某些类型的攻击，包括 Cross-Site Scripting（XSS，跨站点脚本）和数据注入攻击。

  CSP 被设计为向后兼容，如果浏览器不支持，会忽略它，并使用默认的同源策略（Same-origin policy）对待网页内容。

  启用 CSP，需要手动在服务器响应加上 `Content-Security-Policy` 头。或者，`<meta>` 元素也可以配置 CSP，比如:

  ```html
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; img-src https://*; child-src 'none';">
  ```

  CSP 允许服务器控制浏览器可以加载脚本的源，保证加载的内容来自可信任的源。

### 使用 CSP

  ```yml
    Content-Security-Policy: <policy-directive>; <policy-directive>
  ```

  `policy-directive` 由 `<directive> <value>` 组成。

  看以下例子：

  ```yml
    Content-Security-Policy: default-src 'self'
    # 表示所有内容只能来自同源

    Content-Security-Policy: default-src 'self' trusted.com *.trusted.com
    # 表示所有内容只能来自同源、信任的域名和所有信任域名的子域名

    Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
    # 在默认所有内容只能来自同源的基础上，定义了几个具体的内容类型所能加载的源
  ```

### Directives 指令列表

#### Fetch directives

  fetch 指令控制可以资源可以加载的源

  - child-src
  - connect-src
  - default-src
  - font-src
  - img-src
  - manifest-src
  - media-src
  - object-src
  - script-src
  - style-src
  
#### Document directives

  - base-uri
  - sandbox

#### Navigation directives

  - form-action
  - frame-ancestors

### Values 指令的值

- none
- self
- unsafe-inline
- unsafe-eval
- Host
- Scheme
- nonce-\*
- sha\*-\*

## 相关知识

1. 浏览器跨域

   跨域是浏览器端对向不同协议、不同域名、不同端口发出的请求进行的限制，它区分于同源策略（Same-origin policy），是一种安全措施。
   
   需要注意的是，跨域是浏览器端的限制，实际请求已经正常发出和响应了。

   跨域解决方案：
   -  CORS
   -  反向代理：用同源服务端对请求做一个转发，将请求从跨域请求转换成同源请求
   -  JSONP

2. LocalStorage 和 SeeionStorage 跨域

  这俩同样受同源策略的限制。

3. ### HTTP 缓存
   HTTP 缓存分为强缓存和协商缓存。

   - 强缓存

      强缓存可以通过 Expires / Cache-Control 控制，命中强缓存不会发起网络请求，直接从本地读取资源。

      1. Expires

            优先级低于 Cache-Control: max-age。  
            Expires 是由服务端返回的资源过期时间，若用户本地时间在过期时间之前，则不发送请求直接使用本地缓存。

      2. Cache-Control

            优先级高于 Expires。

            常用的值有：

            - max-age 设置使用缓存的最大时长，单位秒
            - s-maxage 与 max-age 用法一致，特别用于共享缓存，并且当它存在时将忽略 max-age
            - public 对带有 Authorization 标头字段的请求的响应不得存储在共享缓存中。但是 public 指令将导致此类响应存储在共享缓存中。让缓存对所有请求可用。
            - private 指示响应只能存储在私有缓存中，比如登录后收到的响应以及通过 cookie 管理的会话，可以使用私有缓存，避免用户信息泄漏
            - no-cache 表示响应可以存储在缓存中，但必须在每次重用之前与服务器进行验证（使用协商缓存验证）
            - no-store 表示不存储任何缓存，禁用所有缓存
            - must-revalidate 指示响应可以存储在缓存中，并且可以在新鲜时重用。一旦它变得陈旧，它必须在重用之前与源服务器进行验证。一般与 max-age 共用。
            - immutable 告诉缓存响应在新鲜时是不可变的，避免了对服务器的不必要的请求验证。现代开发最佳实践，会在静态资源链接中加版本号或 hash，这种方式下，静态资源不会改变。

   - 协商缓存

      协商缓存可以通过 Last-Modified/If-Modified-Since 和 ETag/If-None-Match 控制，开启协商缓存向浏览器发起请求时会带上缓存标识，服务器根据标识返回 304 或者 200。

      1. ETag/If-None-Match

           - 通过唯一标识来验证缓存
           - 优先级高于 Last-Modified/If-Modified-Since

            如果资源请求的响应头里包含 ETag，客户端可以在后续请求的头部带上 If-None-Match 来进行验证。如果服务器判断资源标识一致，则返回 304 状态码，告知浏览器可以从本地读取缓存。

            唯一标识符由后端算法生成，可以是资源内容生成的哈希值，也可以最后修改的时间戳。

      2. Last-Modified/If-Modified-Since

           - 通过资源的最后修改时间来验证缓存
           - 优先级低于 ETag/If-None-Match
           - 缺点：只能精确到秒

            如果资源请求的响应头里包含 Last-Modified，客户端可以在后续请求的头部带上 If-Modified-Since 来进行验证。如果服务器判断最后修改时间一致，则返回 304 状态码告知浏览器可以从本地读取缓存。

4. ### HTTP/2
  HTTP/2 正式发表于 2015 年。

   1. HTTP/1.1
       1. 相较 HTTP/1.0 的改进

            主要包括：持久连接、HTTP 管道化请求、分块编码传输、新增 host 头字段、缓存支持、更多状态码等

            **持久连接**

            HTTP/1.0 没进行一次请求都要经过 TCP 三次握手建立连接，极大的增加了服务器的负担，拉长了请求时间，影响用户体验。  
            HTTP/1.1 中添加了持久连接功能，可以复用 TCP 连接。持久连接通过 Connection: kep-live 默认开启。

            **HTTP 管道化**

            在 HTTP/1.1 协议里，允许在响应头中指定 Transfer-Encoding: chunked 标识当前为分块编码传输，可以将内容实体分装成一个个块进行传输。

            **新增 host 头字段**

            在 HTTP/1.0 中认为每台服务器都绑定一个唯一的 IP 地址，因此一台服务器也无法搭建多个 Web 站点。  
            在 HTTP/1.1 中新增了 host 字段，可以指定请求将要发送到的服务器主机名和端口号。

            **并行下载**

            使用 Range 和 Content-Range 头

       2. HTTP/1.1 缺点

            **队头阻塞**

            一个 TCP 连接只能处理一个请求，后续请求会被阻塞

            **头部冗余**

            每个请求都会带上请求头，比如 cookie，如果数据量较大，会影响传输效率

            **TCP 连接数限制**

            浏览器对 TCP 连接数有限制，请求较多时会阻塞

   2. HTTP/2

       - 二进制分帧层

           将一个TCP连接分为若干个流（Stream），每个流中可以传输若干消息（Message），每个消息由若干最小的二进制帧（Frame）组成

       - 多路复用

           HTTP/2 允许在单个 TCP 连接上并行地处理多个请求和响应

       - Header 压缩
       - 服务端推送

           允许服务器直接提供浏览器渲染页面所需资源，而无须浏览器在收到、解析页面后再提起一轮请求，节约了加载时间。

5. ### TLS 握手详细过程
HTTPS 通信建立在 TLS 之上，客户端和服务端建立 TLS 连接需要以下5次握手：

   1. **客户端发送 client hello 消息**，发起握手请求，发送消息包括客户端支持的 tls 版本、加密算法组合，还有一个客户端随机数（client random）
   2. **服务端发送 server hello 消息**进行回应，内容包括数字证书、服务端选择的加密算法和服务端随机数（server random）
   3. 客户端验证发来的证书，包含是否过期、颁发者是否可信、使用颁发机构的公开密钥校验证书的数字签名、证书是否吊销、检测证书中的域名和对话服务器域名是否一致，确保对方的合法身份。验证成功之后，**客户端发送一个随机字符串**（pre-master secret），这个字符串是经过证书公钥加密的，只有服务端的私钥可以解开
   4. 服务器使用私钥解密发来的字符串
   5. 客户端和服务器均使用 client random、server random、pre-master secret，并通过相同的算法生成共享密钥 KEY
   6. **客户端就绪，发送用共享密钥加密的 finished 信号**
   7. **服务端就绪，发送用共享密钥加密的 finished 信号**
   8. 双方分别解密成功，建立 tls 通信，使用对称加密进行安全通信

6. ### GET 请求和 POST 请求的区别

     - get 请求会被浏览器主动 cache，而 post 不会，除非手动设置
     - get 请求在浏览器反复的 回退/前进 操作是无害的，而 post 操作会再次提交表单请求
     - GET请求在URL中传送的参数是有长度限制的，而POST没有
     - GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
     - GET参数通过URL传递，POST放在Request body中
