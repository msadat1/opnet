import { JSONRpcProvider } from 'opnet';
import { TransactionFactory, Wallet, MLDSASecurityLevel } from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const network = networks.regtest;
const provider = new JSONRpcProvider({ url: 'https://regtest.opnet.org', network });

const wif = process.env.WALLET_WIF;
const mldsaHex = process.env.MLDSA_KEY;
const address = process.env.WALLET_ADDRESS;

const wallet = Wallet.fromPrivateKeys(wif, mldsaHex, network, MLDSASecurityLevel.LEVEL2);
const wasm = fs.readFileSync('./build/MyNFTCollection.wasm');

async function deploy() {
    const utxos = await provider.utxoManager.getUTXOs({ address });
    console.log('UTXOs:', utxos.length, '| Balance:', utxos.reduce((s,u) => s + u.value, 0n), 'sats');

    const factory = new TransactionFactory({ network, provider });
    const challenge = await provider.getChallenge();

    const deployment = await factory.signDeployment({
        from: address,
        utxos,
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        network,
        feeRate: 10,        // higher fee rate
        priorityFee: 1n,    // add priority fee
        gasSatFee: 20_000n, // more gas
        bytecode: wasm,
        calldata: Buffer.alloc(0),
        challenge,
        linkMLDSAPublicKeyToAddress: true,
        revealMLDSAPublicKey: true,
    });

    console.log('Sending tx[0]...');
    const r1 = await provider.sendRawTransaction(deployment.transaction[0]);
    console.log('tx[0] result:', JSON.stringify(r1));

    console.log('Sending tx[1]...');
    const r2 = await provider.sendRawTransaction(deployment.transaction[1]);
    console.log('tx[1] result:', JSON.stringify(r2));

    console.log('📍 Contract address:', deployment.contractAddress);
    console.log('⏳ Waiting 20s for confirmation...');
    await new Promise(r => setTimeout(r, 20000));

    try {
        const code = await provider.getCode(deployment.contractAddress);
        console.log('✅ Verified! Bytecode size:', code?.length);
    } catch(e) {
        console.log('Still pending:', e.message);
    }
}

deploy().catch(console.error);
