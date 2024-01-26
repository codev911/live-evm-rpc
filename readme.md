# live-evm-rpc
Get Public Live EVM RPC url easily.

## Install
1. Via NPM : `npm i live-evm-rpc`
2. Via Yarn : `yarn add live-evm-rpc`

## Import
1. CJS : `const { getPublicRpc, testRpc, getLiveRpc, getBestLiveRpc } = require('live-evm-rpc')`
2. ESM : `import { getPublicRpc, testRpc, getLiveRpc, getBestLiveRpc } from 'live-evm-rpc'`

### A. getPublicRpc
```JavaScript
    import { getPublicRpc } from 'live-evm-rpc';
    // if use commonjs use this :
    // const { getPublicRpc } = require('live-evm-rpc');

    // example chain
    const chain = 1;

    // example function for test
    async function test(){
        console.log(await getPublicRpc(chain));
    }
    test();

    // result will be like
    // [
    //      'https://api.mycryptoapi.com/eth',
	// 	    'https://cloudflare-eth.com',
    //      ...
    // ]
```

### B. testRpc
```JavaScript
    import { testRpc } from 'live-evm-rpc';
    // if use commonjs use this :
    // const { testRpc } = require('live-evm-rpc');

    // example function for test
    async function test(){
        console.log(await testRpc('https://cloudflare-eth.com'));
        // or you can set custom timeout will be like, default timeout is 1500ms
        // console.log(await testRpc('https://cloudflare-eth.com', 3000));
    }
    test();

    // result will be like
    // {
    //     isSyncing: false,
    //     lastBlock: 19089064,
    //     chainId: 1,
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }

    // if syncing, result will be like
    // {
    //     isSyncing: true,
    //     lastBlock: 19089064,
    //     chainId: 1,
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }

    // if timeout, result will be like
    // {
    //     isSyncing: true,
    //     lastBlock: 'unknown',
    //     chainId: 'unknown',
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }

    // if partial timeout, result will be like
    // {
    //     isSyncing: false,
    //     lastBlock: 19089064,
    //     chainId: 'unknown',
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }
    // or
    // {
    //     isSyncing: true,
    //     lastBlock: 'unknown',
    //     chainId: 1,
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }
```

### C. getLiveRpc
```JavaScript
    import { getLiveRpc } from 'live-evm-rpc';
    // if use commonjs use this :
    // const { getLiveRpc } = require('live-evm-rpc');

    // example chain
    const chain = 1;

    // example function for test
    async function test(){
        console.log(await getLiveRpc(chain));
        // or you can set custom timeout will be like, default timeout is 1500ms
        // console.log(await getLiveRpc('https://cloudflare-eth.com', {timeout: 3000}));
        // or you can set custom rpc if you have premium rpc
        // console.log(await getLiveRpc(
        //     'https://cloudflare-eth.com', {rpcs: ['https://ethereum.g.alchemy.com/v2/demo']}
        // ));
    }
    test();

    // result will be like
    // [
    //     {
    //         isSyncing: false,
    //         lastBlock: 19089064,
    //         chainId: 1,
    //         ms: 621,
    //         url: 'https://cloudflare-eth.com'
    //     },
    //     {
    //         isSyncing: false,
    //         lastBlock: 19089064,
    //         chainId: 1,
    //         ms: 1107,
    //         url: 'https://ethereum.publicnode.com'
    //     },
    //     ...
    // ]

    // if no live rpc detected, result will be like
    // []
```

### D. getBestLiveRpc
```JavaScript
    import { getLiveRpc } from 'live-evm-rpc';
    // if use commonjs use this :
    // const { getBestLiveRpc } = require('live-evm-rpc');

    // example chain
    const chain = 1;

    // example function for test
    async function test(){
        console.log(await getBestLiveRpc(chain));
        // or you can set custom timeout will be like, default timeout is 1500ms
        // console.log(await getBestLiveRpc('https://cloudflare-eth.com', {timeout: 3000}));
        // or you can set custom rpc if you have premium rpc
        // console.log(await getBestLiveRpc(
        //     'https://cloudflare-eth.com', {rpcs: ['https://ethereum.g.alchemy.com/v2/demo']}
        // ));
    }
    test();

    // result will be like
    // {
    //     isSyncing: false,
    //     lastBlock: 19089064,
    //     chainId: 1,
    //     ms: 621,
    //     url: 'https://cloudflare-eth.com'
    // }

    // if no live rpc detected, result will be like
    // []
```