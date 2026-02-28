import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });
const contractAddress = 'opr1sqzcqv5p5746kpwd2sa7wulmgfjd2shrzjvp2kzfc';

console.log('Polling for contract confirmation...');
for (let i = 0; i < 30; i++) {
    try {
        const code = await provider.getCode(contractAddress);
        console.log('✅ Contract confirmed! Bytecode size:', code?.length);
        process.exit(0);
    } catch(e) {
        const block = await provider.getBlockNumber();
        console.log(`Block ${block} - still pending... (attempt ${i+1}/30)`);
        await new Promise(r => setTimeout(r, 10000));
    }
}
console.log('❌ Timed out after 5 minutes');
