import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });

// Check current block
const block = await provider.getBlockNumber();
console.log('Current block:', block);

// Check UTXOs to confirm tx was spent
const utxos = await provider.utxoManager.getUTXOs({ 
    address: 'bcrt1pfnj2ye4d5efzvtdy20xnfchgpy9dacgv2sy6pz4qzupa6ce4xydswl5pwf' 
});
console.log('Remaining UTXOs:', utxos.length);

// Try getCode
try {
    const code = await provider.getCode('opr1sqpelgl0ec7tvnskpyu6klqmtve890txejvfescc4');
    console.log('✅ Contract found! Bytecode size:', code?.length);
} catch(e) {
    console.log('⏳ Contract not yet confirmed:', e.message);
    console.log('Wait a few seconds and try again...');
}
