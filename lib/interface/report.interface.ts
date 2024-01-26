export interface reportState {
	chainId: number | 'unknown';
	ms: number | 'timeout';
	isSyncing: boolean;
	lastBlock: number | 'unknown';
	url: string;
}
