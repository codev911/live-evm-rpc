import { listSupportedChainId } from '../lib';

test('get live public rpc from chain', async () => {
	const result = listSupportedChainId();
	await expect(result).toStrictEqual(expect.anything());
});
