import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider('https://regtest.opnet.org', networks.regtest);

// Replace with your actual deployed contract address
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

try {
    const code = await provider.getCode(contractAddress);
    console.log('✅ Contract found!');
    console.log('Bytecode length:', code?.length);
} catch (e) {
    console.error('❌ Error:', e.message);
}
