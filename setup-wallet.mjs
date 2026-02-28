import { Wallet, MLDSASecurityLevel } from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';
import fs from 'fs';

const network = networks.regtest;
const wallet = Wallet.generate(network, MLDSASecurityLevel.LEVEL2);
const wif = wallet.toWIF();
const mldsaKey = Buffer.from(wallet._mldsaKeypair.privateKey).toString('hex');
const address = wallet.address.p2tr(network);

console.log('=== YOUR WALLET ===');
console.log('Address:', address);
console.log('WIF:', wif);
console.log('MLDSA_KEY:', mldsaKey.slice(0, 30) + '...');

fs.writeFileSync('.env', `WALLET_ADDRESS=${address}\nWALLET_WIF=${wif}\nMLDSA_KEY=${mldsaKey}\n`);
console.log('\n✅ Saved to .env');
console.log('\n👉 Now fund your address at: https://faucet.opnet.org');
console.log('   Address to fund:', address);
