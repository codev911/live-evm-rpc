import { getPublicRpc } from '../lib';
import { chainList } from '../lib/chain/list.chain';

test('get all public rpc from chain', async () => {
	const result = await getPublicRpc(1);
	await expect(await result).toStrictEqual(chainList[0].urls);
});
