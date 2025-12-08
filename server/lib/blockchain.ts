import { Transaction } from "@mysten/sui/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import {fromBase64} from "@mysten/sui/utils"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const SUI_RPC = process.env.SUI_RPC || getFullnodeUrl('testnet');
const client = new SuiClient({ url: SUI_RPC });

const NDI_PACKAGE_ID = process.env.NEXT_PUBLIC_NDI_PACKAGE_ID;
const REGISTRY_ID = process.env.NEXT_PUBLIC_NDI_REGISTRY_ID;
const KYC_ADMIN_CAP_ID = process.env.NEXT_PUBLIC_NDI_ADMIN_CAP_ID;

// Signing keys (shared/default)
const ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_ADMIN_KEY_B64 || '').trim();
const ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_ADMIN_KEY_HEX || '').trim();


let _DEFAULT_ADMIN;
function getDefaultAdmin() {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX });
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  console.log('[admin] default signer:', _DEFAULT_ADMIN.getPublicKey().toSuiAddress());
  return _DEFAULT_ADMIN;
}
function parseSecret({ b64, hex }) {
  if (b64) {
    let raw;
    try {
      raw = fromBase64(b64.replace(/^"+|"+$/g, '').trim());
    } catch {
      throw new Error('base64 secret invalid');
    }
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`base64 decoded unexpected length: ${raw.length}`);
  }
  if (hex) {
    const raw = hexToBytes(hex.replace(/^"+|"+$/g, '').trim());
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`hex decoded unexpected length: ${raw.length}`);
  }
  throw new Error('missing admin secret');
}


function hexToBytes(hex) {
  const clean = hex.replace(/^0x/i, '').trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error('hex key has odd length');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(b)) throw new Error('hex key contains non-hex chars');
    out[i] = b;
  }
  return out;
}
// -----------------------------
// On-chain calls
// -----------------------------
export async function writeKycOnChain({ userAddress, age, ndiHashBytes }) {
  if (!NDI_PACKAGE_ID || !REGISTRY_ID || !KYC_ADMIN_CAP_ID) {
    throw new Error('NDI_PACKAGE_ID / REGISTRY_ID / ADMIN_CAP_ID missing');
  }
  const signer = getDefaultAdmin();
  const tx = new Transaction();
  tx.moveCall({
    target: `${NDI_PACKAGE_ID}::ndi_kyc::set_verified`,
    arguments: [
      tx.object(KYC_ADMIN_CAP_ID),
      tx.object(REGISTRY_ID),
      tx.pure.address(userAddress),
      tx.pure.u16(age),
      tx.pure.vector('u8', new Uint8Array(ndiHashBytes)),
      tx.pure.address(userAddress),
      tx.pure.u64(Date.now()),
    ],
  });
  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true, showEvents: true },
  });
  return res.digest;
}
