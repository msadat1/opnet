import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });

const contractAddress = 'opr1sqpelgl0ec7tvnskpyu6klqmtve890txejvfescc4';
const code = await provider.getCode(contractAddress);
console.log('✅ Contract verified on-chain!');
console.log('Bytecode size:', code?.length, 'bytes');
