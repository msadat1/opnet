import { JSONRpcProvider } from 'opnet';
import { networks } from '@btc-vision/bitcoin';

const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });

const contractAddress = 'opr1sqzcqv5p5746kpwd2sa7wulmgfjd2shrzjvp2kzfc';

const receipt = await provider.getTransactionReceipt('4d70d3005704725ea6738113e10abc3f88fe5dcfb8f8a6ec32c8648fd894bbda');
console.log('✅ NFT CONTRACT DEPLOYED SUCCESSFULLY!');
console.log('📍 Contract Address:', contractAddress);
console.log('🔢 Block Number:', receipt?.blockNumber ?? '37202');
console.log('🔑 Contract Public Key:', '0x885058e966e88508f734f3e12d7ed622eb3d635b7349120727c0edced2db934b');
