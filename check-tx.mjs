import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });

const tx0 = 'b7ca34b3fa5e959ef9216ca9ec6923b4b7a91929044cc9ae2392942732f9770e';
const tx1 = '4d70d3005704725ea6738113e10abc3f88fe5dcfb8f8a6ec32c8648fd894bbda';

console.log('Checking tx0...');
try {
    const r0 = await provider.getTransaction(tx0);
    console.log('tx0:', JSON.stringify(r0, null, 2));
} catch(e) { console.log('tx0 error:', e.message); }

console.log('Checking tx1...');
try {
    const r1 = await provider.getTransaction(tx1);
    console.log('tx1:', JSON.stringify(r1, null, 2));
} catch(e) { console.log('tx1 error:', e.message); }
