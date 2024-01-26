import { getLiveRpc } from '../lib';

test('get live public rpc from chain', async () => {
	const result = await getLiveRpc(1);
	await expect(await result).toStrictEqual(expect.anything());
});
