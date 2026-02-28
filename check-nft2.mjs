import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

// Some versions take url as first arg directly
const provider = new JSONRpcProvider('https://regtest.opnet.org', networks.regtest);

try {
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ Connected! Block:', blockNumber);
} catch (e) {
    console.error('❌ Error:', e.message);
}
