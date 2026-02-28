import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({
    url: 'https://regtest.opnet.org',
    network: networks.regtest,
});

const address = 'bcrt1pfnj2ye4d5efzvtdy20xnfchgpy9dacgv2sy6pz4qzupa6ce4xydswl5pwf';
const utxos = await provider.utxoManager.getUTXOs({ address });
console.log('UTXOs found:', utxos.length);
if (utxos.length > 0) {
    const total = utxos.reduce((sum, u) => sum + u.value, 0n);
    console.log('Total balance:', total, 'sats');
    console.log('✅ Ready to deploy!');
} else {
    console.log('❌ Not funded yet - visit https://faucet.opnet.org');
}
