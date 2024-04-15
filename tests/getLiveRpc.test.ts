import { getLiveRpc } from '../lib';
import { config } from 'dotenv';

config();

test('get live public rpc from chain', async () => {
	const result = await getLiveRpc(1);
	await expect(await result).toStrictEqual(expect.anything());
});

test('get live public rpc from chain with timeout', async () => {
	const result = await getLiveRpc(1, { timeout: 3000 });
	await expect(await result).toStrictEqual(expect.anything());
});

test('get live public rpc from chain with premium rpc', async () => {
	const result = await getLiveRpc(1, {
		rpcs: [
			process.env.RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
		],
	});
	await expect(await result).toStrictEqual(expect.anything());
});
