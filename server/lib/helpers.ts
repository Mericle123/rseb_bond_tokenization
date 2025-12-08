import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";


// signing keys (⚠️ must not be exposed to the browser)
const ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_ADMIN_KEY_B64 || "").trim();
const ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_ADMIN_KEY_HEX || "").trim();
const BTNC_ADMIN_KEY_B64 = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_B64 || "").trim();
const BTNC_ADMIN_KEY_HEX = (process.env.NEXT_PUBLIC_BTNC_ADMIN_KEY_HEX || "").trim();

// ---------- Shared formatting helpers ----------

// Format numbers like 1,23,456.7
export const nfUnits = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Format money (BTN / BTNC) with 2 decimals
export const nfMoney = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Nice date formatting: 1st November 2025
export  function formatDMY(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? "st"
      : day % 10 === 2 && day % 100 !== 12
      ? "nd"
      : day % 10 === 3 && day % 100 !== 13
      ? "rd"
      : "th";
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

// Convert on-chain “tenths” to number of units
export function tenthsToUnits(t: bigint | number | string): number {
  if (typeof t === "bigint") return Number(t) / 10;
  return Number(t) / 10;
}

// Human label for units (e.g. "1,234.5")
export function formatUnitsFromTenths(t: bigint | number | string): string {
  return nfUnits.format(tenthsToUnits(t));
}

// Human BTN label from tenths (e.g. "1,000.00")
export function formatBtnFromTenths(t: bigint | number | string): string {
  return nfMoney.format(tenthsToUnits(t));
}




// -----------------------------
// Utilities (units & secrets)
// -----------------------------
function hexToBytes(hex: string) {
  const clean = hex.replace(/^0x/i, "").trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("hex key has odd length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const b = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(b)) throw new Error("hex key contains non-hex chars");
    out[i] = b;
  }
  return out;
}

function parseSecret({ b64, hex }: { b64?: string; hex?: string }) {
  if (b64) {
    let raw: Uint8Array;
    try {
      raw = fromBase64(b64.replace(/^"+|"+$/g, "").trim());
    } catch {
      throw new Error("base64 secret invalid");
    }
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`base64 decoded unexpected length: ${raw.length}`);
  }
  if (hex) {
    const raw = hexToBytes(hex.replace(/^"+|"+$/g, "").trim());
    if (raw.length === 32) return raw;
    if (raw.length === 33) return raw.slice(1, 33);
    if (raw.length === 64) return raw.slice(0, 32);
    if (raw.length === 65) return raw.slice(1, 33);
    throw new Error(`hex decoded unexpected length: ${raw.length}`);
  }
  throw new Error("missing admin secret");
}

// Default admin (KYC + BTNC default)
let _DEFAULT_ADMIN: Ed25519Keypair | undefined;
export function getDefaultAdmin() {
  if (_DEFAULT_ADMIN) return _DEFAULT_ADMIN;
  const secret = parseSecret({ b64: ADMIN_KEY_B64, hex: ADMIN_KEY_HEX }) as Uint8Array;
  _DEFAULT_ADMIN = Ed25519Keypair.fromSecretKey(secret);
  console.log("[admin] default signer:", _DEFAULT_ADMIN.getPublicKey().toSuiAddress());
  return _DEFAULT_ADMIN;
}

// optional BTNC admin
let _BTNC_ADMIN: Ed25519Keypair | undefined;
export function getBtncAdmin() {
  if (_BTNC_ADMIN) return _BTNC_ADMIN;
  if (BTNC_ADMIN_KEY_B64 || BTNC_ADMIN_KEY_HEX) {
    const secret = parseSecret({ b64: BTNC_ADMIN_KEY_B64, hex: BTNC_ADMIN_KEY_HEX }) as Uint8Array;
    _BTNC_ADMIN = Ed25519Keypair.fromSecretKey(secret);
    console.log("[admin] BTNC signer:", _BTNC_ADMIN.getPublicKey().toSuiAddress());
    return _BTNC_ADMIN;
  }
  _BTNC_ADMIN = getDefaultAdmin();
  return _BTNC_ADMIN;
}

// Units: tenths (decimals=1)
export function toTenths(human: string | number) {
  if (typeof human === "number") {
    if (!Number.isFinite(human)) throw new Error("Invalid amount");
    const scaled = Math.round(human * 10);
    if (Math.abs(scaled - human * 10) > 1e-9) throw new Error("Only 1 decimal allowed");
    if (scaled <= 0) throw new Error("Amount must be > 0");
    return scaled;
  }
  const s = String(human).trim();
  if (!/^\d+(\.\d{1})?$/.test(s)) {
    if (/^\d+$/.test(s)) return parseInt(s, 10) * 10;
    throw new Error("Only integers or 1 decimal place allowed");
  }
  const [i, f = ""] = s.split(".");
  const tenths = parseInt(i, 10) * 10 + (f ? parseInt(f, 10) : 0);
  if (tenths <= 0) throw new Error("Amount must be > 0");
  return tenths;
}

export function formatTenths(tenths: number | bigint | string) {
  const t = Number(tenths);
  if (!Number.isFinite(t)) return "0";
  const intPart = Math.trunc(t / 10);
  const frac = Math.abs(t % 10);
  return frac === 0 ? String(intPart) : `${intPart}.${frac}`;
}



