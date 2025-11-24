"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wallet,
  Copy,
  Send as SendIcon,
  Ticket,
  ShoppingCart,
  Download,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { buyBtn } from '../server/blockchain/btnc'
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "../server/blockchain/btnc";
import { transBtn } from "../server/blockchain/btnc";
import { strict } from "assert";


const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

type Props = { walletAddress: string };
type View =
  | null
  | "receive"
  | "send"
  | "redeem-amount"
  | "redeem-bank"
  | "buy-amount"
  | "buy-bank"
  | "buy-otp";

/* =================================================================== */
/*                                MAIN                                  */
/* =================================================================== */
export default function WalletSection({ walletAddress, mnemonics }: {walletAddress: Props, mnemonics: string}) {
  const currentUser = useCurrentUser();

  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>(null);
  const [activeAction, setActiveAction] = useState<
    null | "send" | "redeem" | "buy" | "receive"
  >(null);

  const timeoutRef = useRef<number | null>(null);
  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);

  const copyMainAddr = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
  };

  const openSheet = (v: Exclude<View, null>) => {
    setView(v);
    const map: Record<Exclude<View, null>, "send" | "redeem" | "buy" | "receive"> = {
      receive: "receive",
      send: "send",
      "redeem-amount": "redeem",
      "redeem-bank": "redeem",
      "buy-amount": "buy",
      "buy-bank": "buy",
      "buy-otp": "buy",
    };
    setActiveAction(map[v]);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setTimeout(() => {
      setView(null);
      setActiveAction(null);
    }, 250);
  };

  useEffect(() => {
    async function loadBalance() {
      try {
        const data = await getBtncBalance({ address: walletAddress });
        setBalance(data.balanceHuman);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (walletAddress) loadBalance();
  }, [walletAddress]);


  return (
    <>
      {/* ===== Wallet summary card ===== */}
      <motion.section
        {...fadeIn}
        className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden"
        aria-labelledby="wallet-summary-title"
      >
        {/* Address Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-black/5 bg-gradient-to-b from-white to-white/80">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
              <Wallet className="w-4 h-4 text-[#5B50D9]" strokeWidth={1.75} />
            </span>
            <span className="font-medium">Wallet address:</span>
            <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all">
              {walletAddress}
            </code>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyMainAddr}
              className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all"
              aria-live="polite"
              aria-label="Copy wallet address"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? "Wallet address copied" : ""}
            </span>
          </div>
        </div>

        {/* Empty State + Actions */}
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl border border-black/10 bg-white/60 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
            <div className="p-6 sm:p-8 text-center">
              {/* Coin icon pill */}
              <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
                <Image src="/coin.png" alt="coin" width={24} height={24} />
              </div>
              <h2 id="wallet-summary-title" className="text-lg font-semibold text-gray-900">
                {loading ? (
                  "Loading balance..."
                ) : balance && parseFloat(balance) > 0 ? (
                  <>
                    {balance} <span className="text-sm font-medium text-gray-500">BTN₵</span>
                  </>
                ) : (
                  "No coins"
                )}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {loading
                  ? "Please wait..."
                  : balance && parseFloat(balance) > 0
                    ? "Your current BTN₵ balance"
                    : "Once you have purchased or received coins, they will appear here."}
              </p>


              {/* Actions */}
             <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
  <ActionButton
    label="Send"
    icon={SendIcon}
    active={activeAction === "send"}
    onClick={() => openSheet("send")}
  />
  <ActionButton
    label="Redeem"
    icon={Ticket}
    active={activeAction === "redeem"}
    onClick={() => openSheet("redeem-amount")}
  />
  <ActionButton
    label="Buy"
    icon={ShoppingCart}
    active={activeAction === "buy"}
    onClick={() => openSheet("buy-amount")}
  />
</div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== Slide-over sheet for all 4 flows ===== */}
      <Sheet open={open} onClose={closeSheet} title={titleFor(view)}>
        {view === "receive" && <ReceiveView walletAddress={walletAddress} />}
        {view === "send" && <SendView mnemonics={mnemonics} balance={balance} walletAddress={walletAddress}/>}
        {view === "redeem-amount" && <RedeemAmount onNext={() => setView("redeem-bank")} />}
        {view === "redeem-bank" && <RedeemBank onBack={() => setView("redeem-amount")} />}
        {view === "buy-amount" && <BuyAmount balance={balance} walletAddress={walletAddress} />}
        {view === "buy-bank" && (
          <BuyBank
            walletAddress={walletAddress}
            onBack={() => setView("buy-amount")}
            onNext={() => setView("buy-otp")}
          />
        )}
        {view === "buy-otp" && <BuyOtp onBack={() => setView("buy-bank")} />}
      </Sheet>
    </>
  );
}

/* =================================================================== */
/*                           SHARED COMPONENTS                          */
/* =================================================================== */

function ActionButton({
  label,
  icon: Icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ring-1 ring-black/10 transition-all";

  const skin = active
    ? "bg-[#5B50D9] text-white hover:opacity-95"
    : "bg-white text-gray-900 hover:ring-black/20 shadow-sm hover:shadow-md hover:scale-[1.02]";

  const iconWrap = active
    ? "bg-white/10 ring-1 ring-white/20"
    : "bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20";

  const iconColor = active ? "text-white" : "text-[#5B50D9]";

  return (
    <button type="button" onClick={onClick} className={`${base} ${skin}`}>
      <span className={`grid place-items-center w-6 h-6 rounded-full ${iconWrap}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.75} />
      </span>
      {label}
    </button>
  );
}

function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const firstRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
          }`}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          "absolute right-0 top-0 h-full",
          "w-[92%] sm:w-[420px]", // FIXED: sm:w-[420px]
          "bg-white border border-black/10",
          "rounded-l-[18px]", // rounded leading edge like mock
          "shadow-[0_12px_40px_rgba(0,0,0,0.10)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
      >
        <div className="relative flex items-center border-b border-black/10 px-4 py-3">
          <button
            ref={firstRef}
            onClick={onClose}
            aria-label="Back"
            className="relative z-20 p-2 rounded-full hover:bg-black/5 active:bg-black/10"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium tracking-[0.2px] pointer-events-none">
            {title ?? ""}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

function titleFor(v: View) {
  switch (v) {
    case "receive":
      return "Receive";
    case "send":
      return "Send";
    case "redeem-amount":
    case "redeem-bank":
      return "Redeem";
    case "buy-amount":
    case "buy-bank":
    case "buy-otp":
      return "Buy";
    default:
      return "";
  }
}

/* =================================================================== */
/*                                 VIEWS                                */
/* =================================================================== */

// RECEIVE – QR + copy
function ReceiveView({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px]">
        <div className="rounded-2xl border border-black/10 bg-white p-3 mx-auto w-[260px] shadow-sm">
          {/* Replace src with your QR image or generator */}
          <img src="/wallet.png" alt="QR code" className="rounded-xl border border-black/10 w-full h-auto" />
        </div>

        <button onClick={copy} className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold">
          {copied ? "Copied" : "Copy address"}
        </button>
      </div>
    </div>
  );
}

// SEND – amount + recipient
function SendView({walletAddress, balance, mnemonics}: {walletAddress: string, balance: string, mnemonics: string}) {
  const  currentUser = useCurrentUser()
  const mnemonic = currentUser.hashed_mnemonic

  const [sender, setSender] = useState(walletAddress)
  const [to, setTo] = useState<string |  null>()
  const [amt, setAmt] = useState<string |  null>()
   const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>();

  async function handleSend() {
    setMessage(null);

    if (!to || !amt) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await transBtn({
        mnemonics: mnemonic,
        sender: sender.trim(),
        toAddress: to.trim(),
        amountBTNC: amt,
      });

      if (res.ok) {
        setMessage(`✅ Transfer successful! TX: ${res.txDigest}`);
        setAmt("");
        setTo("");
      } else {
        setMessage(`❌ ${res.detail || "Transfer failed"}`);
      }
    } catch (e: any) {
      console.error("SendView error:", e);
      setMessage(`⚠️ ${e.message || "Unexpected error"}`);
    } finally {
      setLoading(false);
    }
  }

   return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] text-center">
        <LogoBlob />
        <p className="mt-2 text-[13px] text-black/70">
          <span className="font-semibold">Your wallet</span>
          <br/>
             {loading ? (
                  "Loading balance..."
                ) : balance && parseFloat(balance) > 0 ? (
                  <>
                    {balance} <span className="text-sm font-medium text-gray-500">BTN₵</span>
                  </>
                ) : (
                  "No coins"
                )}
          <br />
          <span className="text-xs text-gray-600 break-all">{sender}</span>
        </p>

        <h3 className="mt-4 text-[20px] font-semibold">
          Transfer
          <br />
          your BTN coin
        </h3>

        <label className="block text-left mt-6 text-[13px] font-medium text-black/60">
          Coin amount
        </label>
        <input
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
          placeholder="Enter amount"
        />

        <label className="block text-left mt-4 text-[13px] font-medium text-black/60">
          Recipient address
        </label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
          placeholder="0x..."
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`mt-8 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold flex justify-center items-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// REDEEM – step 1
function RedeemAmount({ onNext }: { onNext: () => void }) {
  const [amtCoin, setAmtCoin] = useState("");
  const [amtNu, setAmtNu] = useState("");
  
  function handleRedeemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setAmtCoin(value);

    // 1 BTN = 1 Nu – if you later change the rate, multiply here
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setAmtNu(value);          // or setSpend(String(num * rate))
    } else {
      setAmtNu("");
    }
  }

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] text-center">
        <LogoBlob />
        <p className="mt-2 text-[13px] text-black/70">
          <span className="font-semibold">Your wallet has</span>
          <br />
          1000 coins
        </p>

        <h3 className="mt-4 text-[20px] font-semibold leading-snug">
          Amount to redeem?
          <br />
          
          <br />
          
        </h3>

        <label className="block text-left mt-6 text-[13px] font-medium text-black/60">Coin amount</label>
        <input
          value={amtCoin}
          onChange={handleRedeemChange}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />
        <p className="mt-1 text-[12px] text-black/60">1 BTN Coin = BTN Nu 1</p>

        <label className="block text-left mt-5 text-[13px] font-medium text-black/60">Redeem amount (Nu)</label>
        <input
          value={amtNu}
          readOnly
          // onChange={(e) => setAmtNu(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />

        <button
          onClick={onNext}
          className="mt-8 w-full h-10 rounded-full bg-[#5B50D9] text-white text-[14px] font-semibold"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

// REDEEM – step 2
function RedeemBank({ onBack }: { onBack: () => void }) {
  const banks = demoBanks();
  const [openDD, setOpenDD] = useState(false);
  const [bank, setBank] = useState(banks[1]);
  const [acct, setAcct] = useState("");

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px]">
        <div className="text-center">
          <LogoBlob />
          <p className="mt-2 text-[13px] text-black/70">
            <span className="font-semibold">Your wallet has</span>
            <br />
            1000 coins
          </p>
          <p className="mt-4 text-[13px]">
            <span className="font-semibold">Wallet address:</span> {useCurrentUser().wallet_address}
          </p>
          <h3 className="mt-4 text-[20px] font-semibold">Redeem to Bank</h3>
        </div>

        <label className="block mt-6 text-[13px] font-medium text-black/60">Select Bank</label>
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setOpenDD(!openDD)}
            className="w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <img src={bank.icon} alt="" className="w-5 h-5 rounded-full" />
              {bank.name}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openDD && (
            <ul className="absolute z-10 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg max-h-64 overflow-y-auto">
              {banks.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setBank(b);
                      setOpenDD(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <img src={b.icon} alt="" className="w-5 h-5 rounded-full" />
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 text-[12px] text-black/70">
          The coin will be redeemed and transferred to{" "}
          <span className="font-semibold">your {bank.name} account</span>.
        </p>

        <input
          placeholder="Account number"
          value={acct}
          onChange={(e) => setAcct(e.target.value)}
          className="mt-4 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />

        <hr className="my-6 border-black/10" />
        <div className="flex items-center justify-between text-[14px]">
          <span>Total amount:</span>
          <span className="font-semibold">1000</span>
        </div>
        <p className="text-[12px] text-black/60 mt-1">(1 BTN coin = Nu 1)</p>

        <button className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold">
          Redeem
        </button>

        <button onClick={onBack} className="mt-3 w-full text-[13px] text-black/60 underline">
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 1
function BuyAmount({ walletAddress, balance }: { walletAddress: string, balance : string }) {
  const [coinbalance, setBalance] = useState(balance)
  const [buy, setBuy] = useState("");
  const [spend, setSpend] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    try {
      setLoading(true);
      const amountBTN = parseFloat(buy);
      await buyBtn(walletAddress, amountBTN);
      alert("Transaction successful!");
    } catch (e) {
      console.error("Buy failed:", e);
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

   function handleBuyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setBuy(value);

    // 1 BTN = 1 Nu – if you later change the rate, multiply here
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setSpend(value);          // or setSpend(String(num * rate))
    } else {
      setSpend("");
    }
  }

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] text-center">
        <LogoBlob />
        <p className="mt-2 text-[13px] text-black/70">
          <span className="font-semibold">Your wallet has</span>
          <br />
           {loading ? (
                  "Loading balance..."
                ) : coinbalance && parseFloat(coinbalance) > 0 ? (
                  <>
                    {coinbalance} <span className="text-sm font-medium text-gray-500">BTN₵</span>
                  </>
                ) : (
                  "No coins"
                )}
        </p>

        <h3 className="mt-4 text-[20px] font-semibold">Buy BTN Coin</h3>

        <label className="block text-left mt-6 text-[13px] font-medium text-black/60">You Buy</label>
        <input
          value={buy}
          onChange={handleBuyChange}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />
        <p className="mt-1 text-[12px] text-black/60">1 BTN Coin = BTN 1</p>

        <label className="block text-left mt-5 text-[13px] font-medium text-black/60">You Spend (Nu)</label>
        <input
          value={spend}
          // onChange={(e) => setBuy(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />

        <button onClick={handleBuy} disabled={loading} className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold">
          {loading ? "Processing..." : "Buy"}
        </button>
      </div>
    </div>
  );
}

// BUY – step 2
function BuyBank({
  onBack,
  onNext,
  walletAddress,
}: {
  onBack: () => void;
  onNext: () => void;
  walletAddress: string;
}) {
  const banks = demoBanks();
  const [openDD, setOpenDD] = useState(false);
  const [bank, setBank] = useState(banks[1]);
  const [acct, setAcct] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px]">
        <div className="text-center">
          <LogoBlob />
          <p className="mt-2 text-[13px] text-black/70">
            <span className="font-semibold">Your wallet has</span>
            <br />
            No coins
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-[13px]">
            <span className="font-semibold">Wallet address:</span>
            <span className="truncate max-w-[170px]">{walletAddress}</span>
            <button onClick={copy} title="Copy" className="p-1 rounded hover:bg-black/5" type="button">
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <h3 className="mt-4 text-[20px] font-semibold">Enter account detail</h3>
        </div>

        <label className="block mt-6 text-[13px] font-medium text-black/60">Select Bank</label>
        <div className="relative mt-1">
          <button
            type="button"
            onClick={() => setOpenDD(!openDD)}
            className="w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <img src={bank.icon} alt="" className="w-5 h-5 rounded-full" />
              {bank.name}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {openDD && (
            <ul className="absolute z-10 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg max-h-64 overflow-y-auto">
              {banks.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setBank(b);
                      setOpenDD(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <img src={b.icon} alt="" className="w-5 h-5 rounded-full" />
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 text-[12px] text-black/70">
          The coin will be transferred to <span className="font-semibold">{bank.name}</span>
          <br />
          Wallet address : <span className="font-mono">{walletAddress}</span>
          <button onClick={copy} className="ml-2 p-1 rounded hover:bg-black/5" title="Copy" type="button">
            <Copy className="w-4 h-4 inline" />
          </button>
          {copied && <span className="ml-2 text-[12px] text-black/60">Copied</span>}
        </p>

        <input
          placeholder="Account number"
          value={acct}
          onChange={(e) => setAcct(e.target.value)}
          className="mt-4 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />

        <button onClick={onNext} className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold">
          Confirm
        </button>

        <button onClick={onBack} className="mt-3 w-full text-[13px] text-black/60 underline">
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 3
function BuyOtp({ onBack }: { onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] text-center">
        <LogoBlob />
        <p className="mt-2 text-[13px] text-black/70">
          <span className="font-semibold">Your wallet has</span>
          <br />
          No coins
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[13px]">
          <span className="font-semibold">Wallet address:</span>
          <span className="truncate max-w-[170px]">0i4u1290nfkjd809214190poij</span>
          <button className="p-1 rounded hover:bg-black/5" title="Copy" type="button">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <h3 className="mt-5 text-[16px] font-semibold">Enter OTP</h3>

        <div className="mt-3 flex items-center justify-center gap-2">
          {otp.map((v, i) => (
            <input
              key={i}
              value={v}
              onChange={(e) => {
                const next = [...otp];
                next[i] = e.target.value.replace(/\D/g, "").slice(0, 1);
                setOtp(next);
              }}
              className="w-10 h-12 rounded-lg border border-[#9DB6D3] text-center text-[18px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>

        <button className="mt-2 text-[13px] text-[#5B50D9]">Resend OTP</button>

        <button className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold">Confirm</button>

        <button onClick={onBack} className="mt-3 w-full text-[13px] text-black/60 underline">
          Back
        </button>
      </div>
    </div>
  );
}

/* =================================================================== */
/*                              SMALL BITS                              */
/* =================================================================== */

function LogoBlob() {
  return (
    <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
      <Image src="/coin.png" alt="coin" width={24} height={24} />
    </div>
  );
}

function demoBanks() {
  // Replace with real assets
  return [
    { id: "bnb", name: "Bhutan National Bank", icon: "/RSEB.png" },
    { id: "bob", name: "Bank of Bhutan", icon: "/RSEB.png" },
    { id: "bdb", name: "Bhutan Development Bank", icon: "/RSEB.png" },
    { id: "dpnb", name: "Druk PNB", icon: "/RSEB.png" },
    { id: "tashi", name: "Tashi Bank", icon: "/RSEB.png" },
    { id: "kidu", name: "Digital Kidu", icon: "/RSEB.png" },
  ];
}
