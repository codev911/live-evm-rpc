import { testRpc } from '../lib';

test('test public rpc from chain', async () => {
	const result = await testRpc('https://ethereum.publicnode.com');
	await expect(await result).toStrictEqual({
		isSyncing: expect.any(Boolean),
		lastBlock: expect.any(Number) || expect.any(String),
		chainId: expect.any(Number) || expect.any(String),
		ms: expect.any(Number),
		url: 'https://ethereum.publicnode.com',
	});
});
