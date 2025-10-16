import { Ed25519Keypair, Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import * as bip39  from "bip39"
import { fromBase64 } from "@mysten/sui/utils";
import { encodeSuiPrivateKey } from "@mysten/sui/cryptography";
import  crypto from "crypto"
import { encrypt, decrypt } from "./encryption";


export async function walletGeneration(){
    const mnemonic = bip39.generateMnemonic(128)
    
    const seed = await bip39.mnemonicToSeed(mnemonic)

    const ed25519Seed = new Uint8Array(seed).slice(0, 32)

    // const keypair = Ed25519Keypair.fromSecretKey(ed25519Seed)
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic, "m/44'/784'/0'/0'/0'");
    const suiAddress = keypair.getPublicKey().toSuiAddress()
    const FullSuiPrivateB64 = keypair.getSecretKey();

    const privateKeyBytes = new Uint8Array(fromBase64(FullSuiPrivateB64)).slice(0, 32)

    const bech32Seccret = encodeSuiPrivateKey(privateKeyBytes, "ED25519")


    const encryptionKey = process.env.ENCRYPTION_KEY
    if(!encryptionKey){
        throw new Error("MISSING ENV VARIABLE")
    }
    const encryptedMnemonic = encrypt(mnemonic, encryptionKey)
    const decryptedMnemonic = decrypt(encryptedMnemonic, encryptionKey)
    return {suiAddress, bech32Seccret, encryptedMnemonic, decryptedMnemonic}
}


 // function saltMnemonic(salt: string): Promise<string>{
    //     return new Promise ((resolve, reject) =>{crypto.scrypt(mnemonic.normalize(), salt, 64, (error, hash) =>{
    //       if (error) reject(error)

    //         resolve(hash.toString("hex").normalize())
    //     })}) 
    // }


        // const saltMnemonics = saltMnemonic(salt)