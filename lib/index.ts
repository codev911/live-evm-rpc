import axios from 'axios';

import { chainList } from './chain/list.chain';
import { reportState } from './interface/report.interface';

const defaultTimeout: number = 1500;

const getChainPost = async (
	rpcUrl: string,
	timeout?: number
): Promise<number | 'unknown'> => {
	try {
		const { status, data } = await axios.post(
			rpcUrl,
			{ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 83 },
			{
				timeout:
					timeout !== undefined && timeout !== null ? timeout : defaultTimeout,
			}
		);

		if (status === 200 && data.result !== undefined) {
			return parseInt(data.result);
		} else {
			return 'unknown';
		}
	} catch (error) {
		return 'unknown';
	}
};

const getBlockPost = async (
	rpcUrl: string,
	timeout?: number
): Promise<number | 'unknown'> => {
	try {
		const { status, data } = await axios.post(
			rpcUrl,
			{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 83 },
			{
				timeout:
					timeout !== undefined && timeout !== null ? timeout : defaultTimeout,
			}
		);

		if (status === 200 && data.result !== undefined) {
			return parseInt(data.result);
		} else {
			return 'unknown';
		}
	} catch (error) {
		return 'unknown';
	}
};

const getIsSyncingPost = async (
	rpcUrl: string,
	timeout?: number
): Promise<boolean> => {
	try {
		const { status, data } = await axios.post(
			rpcUrl,
			{ jsonrpc: '2.0', method: 'eth_syncing', params: [], id: 83 },
			{
				timeout:
					timeout !== undefined && timeout !== null ? timeout : defaultTimeout,
			}
		);

		if (status === 200 && data.result !== undefined) {
			if (typeof data.result === 'boolean') {
				return data.result;
			} else {
				console.log(data.result);
			}
		} else {
			return true;
		}
	} catch (error) {
		return true;
	}
};

export const getPublicRpc = (chainId: number): string[] => {
	try {
		const rpcList = chainList.filter(a => a.chainId === chainId);
		return rpcList[0].urls;
	} catch (error) {
		return [];
	}
};

export const testRpc = async (
	rpcUrl: string,
	timeout?: number
): Promise<reportState> => {
	const getStart = new Date().getTime();
	const aggregate = await Promise.all([
		getChainPost(rpcUrl, timeout),
		getBlockPost(rpcUrl, timeout),
		getIsSyncingPost(rpcUrl, timeout),
	]);

	const getEnd = new Date().getTime();
	const getMs = getEnd - getStart;

	return {
		isSyncing: aggregate[2],
		lastBlock: aggregate[1],
		chainId: aggregate[0],
		ms: getMs,
		url: rpcUrl,
	};
};

export const getLiveRpc = async (
	targetChain: number,
	timeout?: number,
	rpcList?: string[]
): Promise<reportState[]> => {
	const getRpc = getPublicRpc(targetChain);
	if (getRpc.length === 0 && rpcList === undefined) throw new Error('no rpc');

	const promt = [];

	getRpc.forEach(rpc => {
		promt.push(
			testRpc(
				rpc,
				timeout !== undefined && timeout !== null ? timeout : undefined
			)
		);
	});

	if (rpcList !== undefined && rpcList.length > 0) {
		rpcList.forEach(rpc => {
			promt.push(
				testRpc(
					rpc,
					timeout !== undefined && timeout !== null ? timeout : undefined
				)
			);
		});
	}

	const res = await Promise.all(promt);
	const final: reportState[] = [];

	res.forEach(a => {
		if (
			a.chainId === targetChain &&
			a.lastBlock !== 'unknown' &&
			a.isSyncing === false
		) {
			final.push(a);
		}
	});

	return final;
};
