import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { encrypt, decrypt } from "../cryptography/encryption";
import * as bip39  from "bip39"


const RPC_URL = process.env.SUI_RPC_URL || "https://fullnode.devnet.sui.io:443"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

const client = new SuiClient({url: RPC_URL})


async function restoreKeypairFromEncryptedMnemonic(encryptedMnemonic: string) {
    if(!ENCRYPTION_KEY){
    throw new  Error("NO ENCRYPTION  KEY")
}
  const mnemonic = decrypt(encryptedMnemonic, ENCRYPTION_KEY); // your decrypt
  // derive seed using bip39 (same as in your code):
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const ed25519Seed = new Uint8Array(seed).slice(0, 32);
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, "m/44'/784'/0'/0'/0'");
//   const keypair = Ed25519Keypair.fromSecretKey(ed25519Seed);
  return keypair;
}

export async function sendSui(
    encryptedMnemonic: string,
    toAddress : string,
    amountInMist : bigint
){

    const keypair = await restoreKeypairFromEncryptedMnemonic(encryptedMnemonic)

    const senderAddress = keypair.getPublicKey().toSuiAddress()

    //Build transaction
    const tx = new Transaction()
    tx.setSender(senderAddress);
    tx.setGasPrice(1000)
    tx.setGasBudget(10000000)
    
    const [coin] = tx.splitCoins(tx.gas, [amountInMist])
    tx.transferObjects([coin], toAddress)

    await  tx.build({client})

    const result  = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction : tx,
        options: {showObjectChanges: true, showBalanceChanges: true}
    })

    return result;
}

export async function getAssets(encryptedMnemonic: string){
    const keypair = await restoreKeypairFromEncryptedMnemonic(encryptedMnemonic)
    const ownerAddress = keypair.getPublicKey().toSuiAddress();

    const allCoins =  await client.getAllCoins({owner: ownerAddress})

    const  allObjects = await client.getOwnedObjects({
        owner:  ownerAddress,
        options:{
            showType:true,
            showContent: true,
            showDisplay: true
        }
    })

    return {address: ownerAddress, coins:  allCoins, objects: allObjects}
}