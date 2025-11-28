"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Copy,
  Send as SendIcon,
  Ticket,
  ShoppingCart,
  ChevronDown,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { buyBtn, getUserFromAddress } from "../server/blockchain/btnc";
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "../server/blockchain/btnc";
import { transBtn } from "../server/blockchain/btnc";

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

type View =
  | null
  | "receive"
  | "send"
  | "redeem-amount"
  | "redeem-bank"
  | "redeem-otp"
  | "buy-amount"
  | "buy-bank"
  | "buy-otp";

/* =================================================================== */
/*                                MAIN                                  */
/* =================================================================== */
export default function WalletSection({
  walletAddress,
  mnemonics,
}: {
  walletAddress: string;
  mnemonics: string;
}) {
  const currentUser = useCurrentUser();

  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>(null);
  const [activeAction, setActiveAction] = useState<
    null | "send" | "redeem" | "buy" | "receive"
  >(null);

  // ✅ Simplified success state
  const [successMessage, setSuccessMessage] = useState<null | {
    type: "send" | "buy" | "redeem";
    amount?: string;
  }>(null);

  const timeoutRef = useRef<number | null>(null);
  useEffect(
    () => () => timeoutRef.current && clearTimeout(timeoutRef.current),
    []
  );

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyMainAddr = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
  };

  const openSheet = (v: Exclude<View, null>) => {
    setView(v);
    const map: Record<
      Exclude<View, null>,
      "send" | "redeem" | "buy" | "receive"
    > = {
      receive: "receive",
      send: "send",
      "redeem-amount": "redeem",
      "redeem-bank": "redeem",
      "redeem-otp": "redeem",
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

  // helper to reload balance (also used after buy/send)
  async function loadBalanceFor(address: string) {
    try {
      setLoading(true);
      const data = await getBtncBalance({ address });
      setBalance(data.balanceHuman);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (walletAddress && isClient) {
      loadBalanceFor(walletAddress);
    }
  }, [walletAddress, isClient]);

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Show loading skeleton on server and initial client render
  const displayBalance = !isClient ? (
    <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
  ) : loading ? (
    "Loading balance..."
  ) : balance && parseFloat(balance) > 0 ? (
    <>
      {balance}{" "}
      <span className="text-lg sm:text-xl font-medium text-gray-500">
        BTN₵
      </span>
    </>
  ) : (
    "No coins"
  );

  const displayBalanceText = !isClient ? (
    <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto mt-2"></div>
  ) : loading ? (
    "Please wait..."
  ) : balance && parseFloat(balance) > 0 ? (
    "Your current BTN₵ balance"
  ) : (
    "Once you have purchased or received coins, they will appear here."
  );

  return (
    <>
      {/* ===== Wallet summary card ===== */}
      <motion.section
        {...fadeIn}
        className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden mx-4 sm:mx-0"
        aria-labelledby="wallet-summary-title"
      >
        {/* Address Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-black/5 bg-gradient-to-b from-white to-white/80">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-800">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B50D9]" strokeWidth={1.75} />
            </span>
            <span className="font-medium whitespace-nowrap">Your wallet:</span>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-black/5">
              <code className="text-gray-700 break-all text-xs sm:text-sm font-mono">
                {formatWalletAddress(walletAddress)}
              </code>
              <button
                type="button"
                onClick={copyMainAddr}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Copy wallet address"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => openSheet("receive")}
              className="group inline-flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all whitespace-nowrap"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Receive</span>
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? "Wallet address copied" : ""}
            </span>
          </div>
        </div>

        {/* Empty State + Actions */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-2xl border border-black/10 bg-white/60 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
            <div className="p-6 sm:p-8 lg:p-10 text-center">
              {/* Coin icon pill */}
              <div className="mx-auto mb-4 sm:mb-6 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
                <Image 
                  src="/coin.png" 
                  alt="coin" 
                  width={32} 
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <h2
                id="wallet-summary-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
              >
                {displayBalance}
              </h2>

              <div className="mt-2 text-sm sm:text-base text-gray-600">
                {displayBalanceText}
              </div>

              {/* Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
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

      {/* ===== Slide-over sheet for all flows ===== */}
      <Sheet open={open} onClose={closeSheet} title={titleFor(view)} view={view} setView={setView}>
        {view === "receive" && <ReceiveView walletAddress={walletAddress} />}

        {view === "send" && (
          <SendView
            mnemonics={mnemonics}
            balance={balance ?? "0"}
            walletAddress={walletAddress}
            onSuccess={(res, amount, recipient) => {
              closeSheet();
              setSuccessMessage({
                type: "send",
                amount,
              });
              loadBalanceFor(walletAddress);
            }}
          />
        )}

        {view === "redeem-amount" && (
          <RedeemAmount onNext={() => setView("redeem-bank")} />
        )}

        {view === "redeem-bank" && (
          <RedeemBank 
            onBack={() => setView("redeem-amount")} 
            onNext={() => setView("redeem-otp")}
          />
        )}

        {view === "redeem-otp" && (
          <RedeemOtp 
            onBack={() => setView("redeem-bank")}
            onSuccess={(amount) => {
              closeSheet();
              setSuccessMessage({
                type: "redeem",
                amount,
              });
              loadBalanceFor(walletAddress);
            }}
          />
        )}

        {view === "buy-amount" && (
          <BuyAmount
            balance={balance ?? "0"}
            walletAddress={walletAddress}
            onSuccess={(amount) => {
              closeSheet();
              setSuccessMessage({ 
                type: "buy",
                amount 
              });
              loadBalanceFor(walletAddress);
            }}
          />
        )}

        {view === "buy-bank" && (
          <BuyBank
            walletAddress={walletAddress}
            onBack={() => setView("buy-amount")}
            onNext={() => setView("buy-otp")}
          />
        )}

        {view === "buy-otp" && <BuyOtp onBack={() => setView("buy-bank")} />}
      </Sheet>

      {/* ✅ Simple Success Toast */}
      <SuccessToast 
        successMessage={successMessage} 
        onClose={() => setSuccessMessage(null)} 
      />
    </>
  );
}

/* =================================================================== */
/*                          SIMPLE SUCCESS TOAST                       */
/* =================================================================== */

function SuccessToast({ 
  successMessage, 
  onClose 
}: { 
  successMessage: null | {
    type: "send" | "buy" | "redeem";
    amount?: string;
  };
  onClose: () => void;
}) {
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  const getMessage = () => {
    if (!successMessage) return "";
    
    const amount = successMessage.amount ? `${successMessage.amount} ` : "";
    
    switch (successMessage.type) {
      case "send": return `Sent ${amount}BTN₵ successfully!`;
      case "buy": return `Purchased ${amount}BTN₵ successfully!`;
      case "redeem": return `Redeemed ${amount}BTN₵ successfully!`;
      default: return "Operation completed successfully!";
    }
  };

  return (
    <AnimatePresence>
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[120]"
        >
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg border border-green-600 max-w-sm mx-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{getMessage()}</span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-green-600 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
    "group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 text-base font-semibold ring-1 ring-black/10 transition-all duration-200";

  const skin = active
    ? "bg-[#5B50D9] text-white hover:opacity-95 shadow-lg"
    : "bg-white text-gray-900 hover:ring-black/20 shadow-sm hover:shadow-md hover:scale-[1.02]";

  const iconWrap = active
    ? "bg-white/10 ring-1 ring-white/20"
    : "bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20";

  const iconColor = active ? "text-white" : "text-[#5B50D9]";

  return (
    <button type="button" onClick={onClick} className={`${base} ${skin}`}>
      <span className={`grid place-items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full ${iconWrap}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} />
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
  view,
  setView,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
}) {
  const firstRef = useRef<HTMLButtonElement | null>(null);
  
  useEffect(() => {
    if (!open) return;
    
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Handle back button based on current view
  const handleBack = () => {
    if (view === "redeem-bank" || view === "buy-bank") {
      setView("redeem-amount");
    } else if (view === "redeem-otp") {
      setView("redeem-bank");
    } else if (view === "buy-otp") {
      setView("buy-bank");
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          "absolute right-0 top-0 h-full",
          "w-full sm:w-[420px] lg:w-[480px]",
          "bg-white border-l border-black/10",
          "rounded-l-0 sm:rounded-l-[18px]",
          "shadow-[0_12px_40px_rgba(0,0,0,0.10)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
          "will-change-transform",
        ].join(" ")}
      >
        <div className="relative flex items-center border-b border-black/10 px-4 sm:px-6 py-4">
          <button
            ref={firstRef}
            onClick={handleBack}
            aria-label="Back"
            className="relative z-20 p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-lg sm:text-xl font-medium tracking-[0.2px] pointer-events-none">
            {title ?? ""}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </div>
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
    case "redeem-otp":
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
/*                          LOADING ANIMATION                          */
/* =================================================================== */

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="loader">
        <style>{`
          .loader {
            width: 120px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
          }
          .loader::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            animation: loading-shimmer 1.5s infinite;
            border-radius: 4px;
          }
          @keyframes loading-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
      <span className="text-white text-sm font-medium">Processing...</span>
    </div>
  );
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

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] w-full">
        <LogoBlob />
        <div className="rounded-2xl border border-black/10 bg-white p-4 mx-auto w-full max-w-[280px] shadow-sm">
          <img
            src="/wallet.png"
            alt="QR code"
            className="rounded-xl border border-black/10 w-full h-auto"
          />
        </div>

        <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-xl border border-black/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Wallet Address</p>
            <button
              onClick={copy}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              aria-label="Copy address"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <p className="text-sm font-mono break-all bg-white p-3 rounded-lg border border-black/5">
            {formatWalletAddress(walletAddress)}
          </p>
          {copied && (
            <p className="mt-2 text-sm text-green-600 text-center">Copied to clipboard!</p>
          )}
        </div>

        <button
          onClick={copy}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          {copied ? "Copied!" : "Copy Address"}
        </button>
      </div>
    </div>
  );
}

// SEND – amount + recipient
function SendView({
  walletAddress,
  balance,
  mnemonics,
  onSuccess,
}: {
  walletAddress: string;
  balance: string;
  mnemonics: string;
  onSuccess?: (res: any, amount?: string, recipient?: string) => void;
}) {
  const currentUser = useCurrentUser();
  const mnemonic = currentUser.hashed_mnemonic;

  const [sender] = useState(walletAddress);
  const [to, setTo] = useState<string | null>("");
  const [amt, setAmt] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>();

  async function handleSend() {
    setMessage(null);

    if (!to || !amt) {
      setMessage("Please fill in all fields.");
      return;
    }
    const toUserId = await getUserFromAddress(to)

    try {
      setLoading(true);
      const res = await transBtn({
        mnemonics: mnemonic,
        sender: sender.trim(),
        toAddress: to.trim(),
        amountBTNC: amt,
        fromUserId: currentUser.id,
        toUserId: toUserId,
      });

      if (res.ok) {
        setMessage(null);
        onSuccess?.(res, amt, to);
        setTo("");
        setAmt("");
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

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70">
            <span className="font-semibold">Your wallet</span>
            <br />
            {balance && parseFloat(balance) > 0 ? (
              <>
                {balance}{" "}
                <span className="text-sm font-medium text-gray-500">BTN₵</span>
              </>
            ) : (
              "No coins"
            )}
            <br />
            <span className="text-sm text-gray-600 break-all mt-2 inline-block">
              {formatWalletAddress(sender)}
            </span>
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">
          Transfer Your BTN Coin
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Coin Amount
            </label>
            <input
              value={amt ?? ""}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Recipient Address
            </label>
            <input
              value={to ?? ""}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              placeholder="0x..."
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className={`mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg flex justify-center items-center gap-2 hover:bg-[#4a46c4] transition-colors shadow-lg min-h-[60px] ${
            loading ? "opacity-90 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Confirm Transfer"
          )}
        </button>

        {message && (
          <p
            className={`mt-4 text-base p-4 rounded-lg text-center ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : message.startsWith("⚠️")
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : "bg-red-50 text-red-700 border border-red-200"
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

    const num = parseFloat(value);
    if (!isNaN(num)) {
      setAmtNu(value);
    } else {
      setAmtNu("");
    }
  }

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70 text-center">
            <span className="font-semibold">Your wallet has</span>
            <br />
            1000 coins
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">
          Amount to Redeem?
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Coin Amount
            </label>
            <input
              value={amtCoin}
              onChange={handleRedeemChange}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
            <p className="mt-2 text-sm text-black/60">
              1 BTN Coin = BTN Nu 1
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Redeem Amount (Nu)
            </label>
            <input
              value={amtNu}
              readOnly
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

// REDEEM – step 2
function RedeemBank({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const banks = demoBanks();
  const [openDD, setOpenDD] = useState(false);
  const [bank, setBank] = useState(banks[1]);
  const [acct, setAcct] = useState("");

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              1000 coins
            </p>
          </div>
          <h3 className="mt-6 text-2xl font-bold">Redeem to Bank</h3>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Select Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDD(!openDD)}
                className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base flex items-center justify-between hover:border-[#5B50D9] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <img src={bank.icon} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-base">{bank.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openDD ? 'rotate-180' : ''}`} />
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
                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={b.icon}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-base">{b.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-sm text-black/70">
              The coin will be redeemed and transferred to{" "}
              <span className="font-semibold">your {bank.name} account</span>.
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Account Number
            </label>
            <input
              placeholder="Account number"
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
          </div>
        </div>

        <hr className="my-6 border-black/10" />
        <div className="flex items-center justify-between text-base">
          <span>Total amount:</span>
          <span className="font-semibold">1000</span>
        </div>
        <p className="text-sm text-black/60 mt-1">(1 BTN coin = Nu 1)</p>

        <button 
          onClick={onNext}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Continue to OTP
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// REDEEM – step 3 (OTP STEP)
function RedeemOtp({ 
  onBack, 
  onSuccess 
}: { 
  onBack: () => void; 
  onSuccess?: (amount?: string) => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`redeem-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`redeem-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleRedeemConfirm = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess?.("1000"); // Pass the redeemed amount
    }, 2000);
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Redeeming</span>
              <br />
              1000 BTN₵
            </p>
          </div>

          <h3 className="mt-6 text-2xl font-bold">Enter OTP</h3>
          <p className="mt-2 text-base text-black/60">
            Please enter the 6-digit OTP sent to your registered mobile number
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`redeem-otp-${index}`}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border border-[#9DB6D3] text-center text-xl sm:text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              inputMode="numeric"
              maxLength={1}
              type="text"
            />
          ))}
        </div>

        <button className="mt-4 text-base text-[#5B50D9] hover:text-[#4a46c4] transition-colors font-medium">
          Resend OTP
        </button>

        <button
          onClick={handleRedeemConfirm}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg disabled:opacity-90 disabled:cursor-not-allowed min-h-[60px]"
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Confirm Redeem"
          )}
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 1
function BuyAmount({
  walletAddress,
  balance,
  onSuccess,
}: {
  walletAddress: string;
  balance: string;
  onSuccess?: (amount?: string) => void;
}) {
  const [coinbalance] = useState(balance);
  const [buy, setBuy] = useState("");
  const [spend, setSpend] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleBuy() {
    setMessage(null);

    const amountBTN = parseFloat(buy);
    if (isNaN(amountBTN) || amountBTN <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      await buyBtn(walletAddress, amountBTN);
      onSuccess?.(buy);
    } catch (e) {
      console.error("Buy failed:", e);
      setMessage("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBuyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setBuy(value);

    const num = parseFloat(value);
    if (!isNaN(num)) {
      setSpend(value);
    } else {
      setSpend("");
    }
  }

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70 text-center">
            <span className="font-semibold">Your wallet has</span>
            <br />
            {loading ? (
              "Loading balance..."
            ) : coinbalance && parseFloat(coinbalance) > 0 ? (
              <>
                {coinbalance}{" "}
                <span className="text-sm font-medium text-gray-500">BTN₵</span>
              </>
            ) : (
              "No coins"
            )}
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">Buy BTN Coin</h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              You Buy
            </label>
            <input
              value={buy}
              onChange={handleBuyChange}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
            <p className="mt-2 text-sm text-black-60">1 BTN Coin = BTN 1</p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              You Spend (Nu)
            </label>
            <input
              value={spend}
              readOnly
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg disabled:opacity-90 disabled:cursor-not-allowed min-h-[60px]"
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Buy"
          )}
        </button>

        {message && (
          <p className="mt-4 text-base p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center">
            {message}
          </p>
        )}
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

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              No coins
            </p>
          </div>

          <div className="mt-4 p-4 bg-white rounded-xl border border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Wallet address:</span>
              <button
                onClick={copy}
                title="Copy"
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                type="button"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 break-all font-mono text-left">
              {formatWalletAddress(walletAddress)}
            </p>
            {copied && (
              <p className="mt-1 text-sm text-green-600">Copied to clipboard!</p>
            )}
          </div>

          <h3 className="mt-6 text-2xl font-bold">
            Enter Account Details
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Select Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDD(!openDD)}
                className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base flex items-center justify-between hover:border-[#5B50D9] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <img src={bank.icon} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-base">{bank.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openDD ? 'rotate-180' : ''}`} />
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
                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={b.icon}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-base">{b.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-sm text-black/70">
              The coin will be transferred to{" "}
              <span className="font-semibold">{bank.name}</span>
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Account Number
            </label>
            <input
              placeholder="Account number"
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Confirm
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 3
function BuyOtp({ onBack }: { onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              No coins
            </p>
          </div>

          <h3 className="mt-6 text-2xl font-bold">Enter OTP</h3>
          <p className="mt-2 text-base text-black/60">
            Please enter the 6-digit OTP sent to your registered mobile number
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border border-[#9DB6D3] text-center text-xl sm:text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              inputMode="numeric"
              maxLength={1}
              type="text"
            />
          ))}
        </div>

        <button className="mt-4 text-base text-[#5B50D9] hover:text-[#4a46c4] transition-colors font-medium">
          Resend OTP
        </button>

        <button className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg">
          Confirm
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
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
    <div className="mx-auto grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
      <Image 
        src="/coin.png" 
        alt="coin" 
        width={32} 
        height={32}
        className="w-6 h-6 sm:w-8 sm:h-8"
      />
    </div>
  );
}

function demoBanks() {
  return [
    { id: "bnb", name: "Bhutan National Bank", icon: "/RSEB.png" },
    { id: "bob", name: "Bank of Bhutan", icon: "/RSEB.png" },
    { id: "bdb", name: "Bhutan Development Bank", icon: "/RSEB.png" },
    { id: "dpnb", name: "Druk PNB", icon: "/RSEB.png" },
    { id: "tashi", name: "Tashi Bank", icon: "/RSEB.png" },
    { id: "kidu", name: "Digital Kidu", icon: "/RSEB.png" },
  ];
}