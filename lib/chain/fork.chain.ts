import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extraRpcFile =
	'https://raw.githubusercontent.com/DefiLlama/chainlist/main/constants/extraRpcs.js';
const llamaRpcFile =
	'https://raw.githubusercontent.com/DefiLlama/chainlist/main/constants/llamaNodesRpcs.js';

async function getData(url: string) {
	const { data } = await axios.get(url);
	return data;
}

async function main() {
	const aggregate = await Promise.all([
		getData(extraRpcFile),
		getData(llamaRpcFile),
	]);

	if (fs.existsSync(path.join(__dirname, 'list.chain.ts')) === true) {
		fs.unlinkSync(path.join(__dirname, 'list.chain.ts'));
	}

	if (fs.existsSync(path.join(__dirname, 'temp')) === false) {
		fs.mkdirSync(path.join(__dirname, 'temp'));
	}

	if (fs.existsSync(path.join(__dirname, 'temp/extraRpcs.js')) === false) {
		fs.appendFileSync(
			path.join(__dirname, 'temp/extraRpcs.js'),
			aggregate[0]
				.replace('import { mergeDeep } from "../utils/fetch.js";', '')
				.replace('import { llamaNodesRpcs } from "./llamaNodesRpcs.js";', '')
				.replace(
					'const allExtraRpcs = mergeDeep(llamaNodesRpcs, extraRpcs);',
					''
				)
				.replace('export default allExtraRpcs;', '')
		);
	}

	if (fs.existsSync(path.join(__dirname, 'temp/llamaRpcs.js')) === false) {
		fs.appendFileSync(path.join(__dirname, 'temp/llamaRpcs.js'), aggregate[1]);
	}
}

main();
