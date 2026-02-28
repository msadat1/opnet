import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({
    url: 'https://regtest.opnet.org',
    network: networks.regtest,
});

const blockNumber = await provider.getBlockNumber();
console.log('✅ Connected! Current regtest block:', blockNumber);
