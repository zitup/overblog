---
title: Polkadot{.js} 学习
date: '2022-04-06'
spoiler: polkadot
cta: 'polkadot'
---

Polkadot.js 是和 polkadot 网络交互的 JS 库。

# API

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

## Create an instance

### Providers

`const wsProvider = new WsProvider('wss://rpc.polkadot.io');`

仅支持 WS 版本。假如可以访问双向 RPC，会有更强大的能力。

### API Instance

`const api = await ApiPromise.create({ provider: wsProvider });`

### Failures

API 自动处理重新连接。当节点没有准备好时，promise 会在连接上时才 resolve。

在 API 不支持所连接的链时，会 reject。

## Runtime constants

暴露出来的一些常量

## State queries

`api.query.<module>.<method>`

## RPC queries

所有 API 端点（例如 api.query、api.tx 或 api.derive）只是包装 RPC 调用，以节点预期的编码格式提供信息。

### Subscriptions

订阅链的变化

```js
// Subscribe to the new headers
await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});
```

## Query subscriptions

`api.query` 也支持订阅。

### Subscriptions

```js
// Retrieve the current timestamp via subscription
const unsub = await api.query.timestamp.now((moment) => {
  console.log(`The last block has a timestamp of ${moment}`);
});
```

## Multi queries

支持批量查询

## Query extras

`api.query` 上额外的一些API，`.at/.range/.entries/.key`

## Transactions

使用 `api.tx` 进行交易。

```js
// Sign and send a transfer from Alice to Bob
const txHash = await api.tx.balances
  .transfer(BOB, 12345)
  .signAndSend(alice);

// Show the hash
console.log(`Submitted with hash ${txHash}`);
```

## Transaction subscriptions

可以通过订阅，获取添加交易的结果。

## Extending types

API 允许注入自己定义的类型，覆盖和定义新类型。

```js
const api = await ApiPromise.create({
  provider: wsProvider,
  types: {
    Balance: 'u64'
  }
});
```

## Custom RPC

可用自定义 RPC 方法。

# Substrate Metadata

Substrate 是一个开源的构建去中心化系统的框架。Substrate Metadata 表示与 substrate 节点交互时，默认暴露的元数据。本节是这些可用的接口的罗列。

## JSON-RPC

默认可用的一些 rpc 方法。通过 `api.rpc.<module>.<method>` 使用。

## Constants

默认常量。通过 `api.consts.<module>.<method>` 使用。

## Storage

通过 `api.query.<module>.<method>.` 使用。

## Extrinsics

操作外部心的默认方法。通过 `api.tx.<module>.<method>` 使用。

## Events

一些特定的操作会触发事件。通过 `api.events` 使用。

## Errors

不同模块可能遇到的错误。通过 `api.errors` 使用。

# Keyring

Keyring 负责管理一组密钥对。它拥有的唯一功能是允许您向接口添加和删除对。每对本身就是一个特定的帐户，您可以在每个帐户上执行签名、验证和加密/解密帐户等功能。

## Create

```js
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';

// create a keyring with some non-default values specified
const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

// generate a mnemonic with default params (we can pass the number
// of words required 12, 15, 18, 21 or 24, less than 12 words, while
// valid, is not supported since it is more-easily crackable)
const mnemonic = mnemonicGenerate();

// create & add the pair to the keyring with the type and some additional
// metadata specified
const pair = keyring.addFromUri(mnemonic, { name: 'first pair' }, 'ed25519');

// the pair has been added to our keyring
console.log(keyring.pairs.length, 'pairs available');

// log the name & address (the latter encoded with the ss58Format)
console.log(pair.meta.name, 'has address', pair.address);
```

## Sign & Verify

签名和验证


---

Polkadot 学习

# 核心概念

block: 数据的集合，比如交易数据

Staking: 权益质押。质押代币以有机会获得有效的区块。验证人(Validators)和提名人(nominators)质押他们的 DOT 以保护网络。

Consensus: 共识。一组实体就特定数据值达成一致的过程（例如区块链上块的排序和组成）。有多种算法用于确定共识。 Polkadot 使用的共识算法是 GRANDPA。

Proof of Stake(PoS): 一种选择参与共识系统的方法，在该系统中，参与者的选择是基于他们所拥有的代币数量（具有由于行为不当而导致损失的风险）。通常，PoS 系统会限制参与者的数量。

Nominated Proof of Stake(NPoS): 一种权益证明系统，提名人以自己的 stake 支持验证人，以表明对验证人良好行为有信心。假如验证人有不当行为，提名人也会受到惩罚。

Validator: 验证者是波卡中继链上维护网络共识的角色，负责Polkadot的网络出块，会维护中继链的全节点，对平行链上的提名者提交的候选区块进行验证，验证成功将获得押金。验证者们在中继链中对平行链提交的候选区块进行共识验证，当足够多的验证者确认之后，将区块转移到平行链的ingress队列等待处理。验证人是属于中继链的，所有平行链共用。 验证人可以理解为法官，进行最终确认。

Collator: 收集者主要负责收集交易，验证交易有效性，整理交易数据，打包成候选区块并放入egress队列。收集人属于每个平行链独有的。 收集者可以理解为检察官，进行信息采集及提交预案。

Fisherman: 钓鱼者是 Polkadot 中负责监督的节点，用以监督验证者和收集者。当钓鱼者发现某一个区块是无效的，他们需要质押一定数量的 DOT 代币并提出这个区块是无效的质疑指令，然后这个区块会被再次验证和审核，如果最终此区块被证实是无效的，那么提名人质押的DOT代币会被没收，让钓鱼者获得奖励，反之如果该区块是有效的，则钓鱼者质押的DOT代币会被没收。 钓鱼者可以理解为举报者，进行检举不合法的交易。

Nominator: 提名者即为 DOT 的持有群体，对验证人进行维护和选举。提名者通过质押足够的DOT进行投票选举验证者，从而获得验证者的分配收益，当提名者收到的验证者分配的收益过低时，会重新投票给收益分配比更高的验证者。只有在提名人支付了足够押金后，才能向中继链提交区块头和平行链的egress信息 提名者可以理解为选民，负责对法务人员的票选。


跨链交易流程：  
1.中继链根据平行链进行验证人分组。 2.平行链A对交易进行签名和广播 3.平行链A的收集者收集交易，验证交易有效性，整理交易数据，打包成候选区块并放入egress 4.提名人支付押金，向中继链提交区块头和平行链A的egress信息； 5.验证人小组选择候选区块，并验证区块是否包含有效交易，验证成功将获得押金 6.所有验证人对中继链区块达成共识，验证人将平行链A上的交易从平行链A的出口移动到平行链B的入口以完成消息传输(XCMP协议)。 7.平行链B在入口队列中执行该交易并修改自己的账本。
