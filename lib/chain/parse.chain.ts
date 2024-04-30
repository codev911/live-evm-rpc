import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { chain } from 'lib/interface/chain.interface';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chainListDart: chain[] = [];
const chainIdList: number[] = [];

const chainNetworkFile = 'https://chainid.network/chains.json';

async function getData(url: string) {
	const { data } = await axios.get(url);
	return data;
}

async function main() {
	const aggregate = await Promise.all([
		getData(chainNetworkFile),
		import('./temp/extraRpcs.js'!).then(s => s.extraRpcs),
		import('./temp/llamaRpcs.js'!).then(s => s.llamaNodesRpcs),
	]);

	await aggregate[0].forEach(async res => {
		const data: chain = {
			chainId: res.chainId,
			name: res.name,
			urls: [],
		};

		chainIdList.push(res.chainId);

		await res.rpc.forEach(rpc => {
			if (
				rpc.includes('https://') === true &&
				rpc.includes('${INFURA_API_KEY}') === false &&
				rpc.includes('${API_KEY}') === false &&
				rpc.includes('${ALCHEMY_API_KEY}') === false &&
				rpc.includes('api_key') === false
			) {
				if (rpc.includes('${ANKR_API_KEY}') === true) {
					const finalRpc = rpc.replace('${ANKR_API_KEY}', '');
					data.urls.push(finalRpc);
				} else {
					data.urls.push(rpc);
				}
			}
		});

		if (data.urls.length > 0) chainListDart.push(data);
	});

	for (let index = 0; index < chainIdList.length; index++) {
		if (
			aggregate[1][chainIdList[index]] !== undefined &&
			(aggregate[1][chainIdList[index]]['websiteDead'] === undefined ||
				aggregate[1][chainIdList[index]]['websiteDead'] !== true) &&
			(aggregate[1][chainIdList[index]]['rpcWorking'] === undefined ||
				aggregate[1][chainIdList[index]]['rpcWorking'] !== false)
		) {
			for (let index3 = 0; index3 < chainListDart.length; index3++) {
				if (chainListDart[index3].chainId === chainIdList[index]) {
					aggregate[1][chainIdList[index]]['rpcs'].forEach(dat => {
						if (typeof dat !== 'object' && dat.includes('https://') === true)
							chainListDart[index3].urls.push(dat);
						if (
							typeof dat === 'object' &&
							dat.url.includes('https://') === true
						)
							chainListDart[index3].urls.push(dat.url);
					});
				}
			}
		}
	}

	for (let index = 0; index < chainIdList.length; index++) {
		if (aggregate[2][chainIdList[index]] !== undefined) {
			for (let index3 = 0; index3 < chainListDart.length; index3++) {
				if (chainListDart[index3].chainId === chainIdList[index]) {
					aggregate[2][chainIdList[index]]['rpcs'].forEach(dat => {
						if (typeof dat !== 'object' && dat.includes('https://') === true)
							chainListDart[index3].urls.push(dat);
						if (
							typeof dat === 'object' &&
							dat.url.includes('https://') === true
						)
							chainListDart[index3].urls.push(dat.url);
					});
				}
			}
		}
	}

	for (let index3 = 0; index3 < chainListDart.length; index3++) {
		chainListDart[index3].urls.push(
			`https://${chainListDart[index3].chainId}.rpc.thirdweb.com`
		);
	}

	if (fs.existsSync(path.join(__dirname, 'list.chain.ts')) === false) {
		fs.appendFileSync(
			path.join(__dirname, 'list.chain.ts'),
			'import { chain } from "lib/interface/chain.interface";\r\nexport const chainList: chain[] = ' +
				JSON.stringify(chainListDart) +
				';'
		);
	}

	if (fs.existsSync(path.join(__dirname, 'temp/extraRpcs.js')) === true) {
		fs.unlinkSync(path.join(__dirname, 'temp/extraRpcs.js'));
	}

	if (fs.existsSync(path.join(__dirname, 'temp/llamaRpcs.js')) === true) {
		fs.unlinkSync(path.join(__dirname, 'temp/llamaRpcs.js'));
	}

	if (fs.existsSync(path.join(__dirname, 'temp')) === true) {
		fs.rmdirSync(path.join(__dirname, 'temp'));
	}
}

main();
