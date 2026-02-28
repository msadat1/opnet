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
    console.log('Deploying NFT contract to regtest...');
    console.log('From address:', address);
    console.log('WASM size:', wasm.length, 'bytes');

    const utxos = await provider.utxoManager.getUTXOs({ address });
    console.log('UTXOs found:', utxos.length);

    const factory = new TransactionFactory({ network, provider });
    const challenge = await provider.getChallenge();

    const deployment = await factory.signDeployment({
        from: address,
        utxos,
        signer: wallet.keypair,
        mldsaSigner: wallet.mldsaKeypair,
        network,
        feeRate: 5,
        priorityFee: 0n,
        gasSatFee: 15_000n,
        bytecode: wasm,
        calldata: Buffer.alloc(0),
        challenge,
        linkMLDSAPublicKeyToAddress: true,
        revealMLDSAPublicKey: true,
    });

    await provider.sendRawTransaction(deployment.transaction[0]);
    await provider.sendRawTransaction(deployment.transaction[1]);

    console.log('✅ NFT Contract deployed!');
    console.log('📍 Contract address:', deployment.contractAddress);
}

deploy().catch(console.error);
