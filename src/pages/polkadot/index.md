---
title: Polkadot{.js} 学习
date: '2022-04-06'
spoiler: polkadot
cta: 'polkadot'
---

## Daofi

DAO: decentralized autonomous organization，去中心化自治组织
airdrops: 空投
DOT: 波卡币
KSM:
relay-chain: 中继链。中继链位于 Polkadot 的体系的核心地位，负责为系统提供统一的共识和安全性保障。通过中继链，实现多个平行链之间的跨链交易。值得一提的是，中继链上的平行链卡槽是有限的，平行链想注册到中继链的话，要先对卡槽进行竞拍。
paraChain: 平行链。在Polkadot中平行链负责具体的业务场景，平行链自身不具备区块的共识，它们将共识的职责让给了中继链，所有平行链共享来自中继链的安全保障。需要注意的是，在Polkadot的理念中，平行链理论上可以作为二级中继链，从而实现Polkadot的扩展性，解决了中继链卡槽固定的局限性。 平行链与中继链之间有两条消息通道：出口队列egress和入口队列ingress，egress负责提交候选区块到中继链，ingress负责接收中继链共识验证成功的验证区块。

### Bulk Transfer

批量发放代币

### Payroll Management

酬劳管理，实时支付

### Multi-Signature Approval

### Spending Management

支出管理





Polkadot.js 是和 polkadot 网络交互的 JS 库。

## Overview

`@polkadot/api` 最重要的特性之一，是它的大部分接口是在它连接到一个正在运行的节点时自动生成的。

### Metadata

当 API 连接到一个节点时，它会获取元数据并基于它装饰 API。API 的格式为 `api.<type>.<module>.<section>`。有三类 API：

- consts: 所有的运行时常量。例如 `api.consts.balances.existentialDeposit`
- query: 所有链的状态。例如 `api.query.system.account(<accountId>)`
- tx: 所有外部信息。例如 `api.tx.balances.transfer(<accountId>, <value>)`

需要注意的是，`api.{consts, query, tx}.<module>.<method>` 是动态的，连接不同的链，元数据和 API 装饰器也会不同，取决于连接的链可以使用的 API 接口。

其他信息

除了上述三类 API，在连接到链上时，也向 API 上附加了一些信息，包括：

- `api.genesisHash`: 
- `api.runtimeMetadata`: 
- `api.runtimeVersion`: 
- `api.libraryInfo`: 
