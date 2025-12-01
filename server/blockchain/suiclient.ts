import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { encrypt, decrypt } from "../cryptography/encryption";
import * as bip39  from "bip39"


const RPC_URL = process.env.SUI_RPC_URL || "https://fullnode.devnet.sui.io:443"
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

const client = new SuiClient({url: RPC_URL})


export async function restoreKeypairFromEncryptedMnemonic(encryptedMnemonic: string) {
    if(!ENCRYPTION_KEY){
    throw new  Error("NO ENCRYPTION  KEY")
}
  const mnemonic = decrypt(encryptedMnemonic, ENCRYPTION_KEY); // your decrypt
  // derive seed using bip39 (same as in your code):
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, "m/44'/784'/0'/0'/0'");
//   const keypair = Ed25519Keypair.fromSecretKey(ed25519Seed);
  return keypair;
}
