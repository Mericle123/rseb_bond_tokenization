"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, TrendingUp, TrendingDown, Minus, Info, X, ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchInvestorAllocations } from "@/server/blockchain/bond";
import { listForSaleAndPersist } from "@/server/blockchain/bond";

// ========================= Types =========================

type Status = "up" | "down" | "flat";

type Row = {
  bondId: string;
  seriesObjectId: string;
  name: string;
  ratePct: number;
  total: number;
  maturity: string;
  status: Status;
  disabled?: boolean;
};

// ========================= Motion presets =========================

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// ========================= Enhanced Sell Modal Component =========================

function SellBondModal({
  row,
  isOpen,
  onClose,
  onConfirm
}: {
  row: Row | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
}) {
  const [sellAmount, setSellAmount] = useState("");
  const [sellLoading, setSellLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "processing" | "success">("input");
  const [transactionHash, setTransactionHash] = useState("");

  if (!row || !isOpen) return null;

  const amount = parseFloat(sellAmount) || 0;
  const isValid = amount > 0 && amount <= row.total;
  const percentage = (amount / row.total) * 100;

  const resetModal = () => {
    setSellAmount("");
    setStep("input");
    setTransactionHash("");
    setSellLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    
    setStep("confirm");
  };

  const executeSell = async () => {
    try {
      setStep("processing");
      setSellLoading(true);
      
      await onConfirm(amount);
      
      // Simulate transaction hash (replace with actual from blockchain)
      setTransactionHash(`0x${Math.random().toString(16).slice(2, 42)}`);
      setStep("success");
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Sell failed:", error);
      setStep("input");
      setSellLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (row.status) {
      case "up": return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {step === "success" ? "Sale Listed Successfully!" : "Sell Bond"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {step === "success" 
                          ? "Your bond has been listed for sale" 
                          : `Sell units of ${row.name}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {/* Bond Info Card */}
                  {(step === "input" || step === "confirm") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/RSEB.png"
                            alt="Issuer"
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{row.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              {getStatusIcon()}
                              <span>{(row.ratePct).toFixed(2)}% / yr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Your Holdings</p>
                          <p className="font-semibold text-gray-900">{row.total.toLocaleString()} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Maturity</p>
                          <p className="font-semibold text-gray-900">{row.maturity}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Input Amount */}
                  {step === "input" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Units to Sell
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={row.total}
                            step="0.1"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="0.0"
                          />
                          <button
                            type="button"
                            onClick={() => setSellAmount(row.total.toString())}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                        
                        {/* Amount Slider */}
                        <div className="mt-4">
                          <input
                            type="range"
                            min="0"
                            max={row.total}
                            step={row.total / 100}
                            value={sellAmount || 0}
                            onChange={(e) => setSellAmount(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>{percentage.toFixed(0)}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      {amount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Sale Summary</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Units to sell:</span>
                              <span className="font-semibold text-blue-900">{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Remaining after sale:</span>
                              <span className="font-semibold text-blue-900">{(row.total - amount).toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Warning for full sale */}
                      {amount === row.total && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-amber-50 rounded-xl p-3 border border-amber-200"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Full Sale</span>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">
                            You're selling all your units. This action cannot be undone.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Confirmation */}
                  {step === "confirm" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Confirm Sale
                        </h3>
                        <p className="text-gray-600 text-sm">
                          You are about to list {amount.toLocaleString()} units for sale
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bond Name:</span>
                          <span className="font-medium">{row.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Units Selling:</span>
                          <span className="font-medium">{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Holdings:</span>
                          <span className="font-medium">{(row.total - amount).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Processing */}
                  {step === "processing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Sale
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Listing your bond units on the marketplace...
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>This may take a few seconds</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sale Listed Successfully!
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your {amount.toLocaleString()} units have been listed for sale
                      </p>
                      
                      {transactionHash && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs">
                          <p className="text-gray-600 mb-1">Transaction Hash:</p>
                          <code className="text-gray-800 break-all">{transactionHash}</code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                {(step === "input" || step === "confirm") && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      {step === "input" ? (
                        <>
                          <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirm}
                            disabled={!isValid || sellLoading}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setStep("input")}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={executeSell}
                            disabled={sellLoading}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            {sellLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Listing...
                              </>
                            ) : (
                              "Confirm Sale"
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Custom slider styles */}
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #dc2626;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #dc2626;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================= Main Component =========================

export default function AssetsPage() {
  const currentUser = useCurrentUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; row: Row | null }>({
    isOpen: false,
    row: null
  });

  const walletAddress = currentUser?.wallet_address ?? "";

  const openSellModal = (row: Row) => {
    setSellModal({ isOpen: true, row });
  };

  const closeSellModal = () => {
    setSellModal({ isOpen: false, row: null });
  };

  const handleConfirmSell = async (amount: number) => {
    if (!sellModal.row || !currentUser) return;

    try {
      await listForSaleAndPersist({
        userId: currentUser.id,
        bondId: sellModal.row.bondId,
        sellerAddress: currentUser.wallet_address!,
        sellerMnemonic: currentUser.hashed_mnemonic,
        seriesObjectId: sellModal.row.seriesObjectId,
        amountUnits: amount,
      });

      // Update local state
      setRows(prev =>
        prev.map(r =>
          r.bondId === sellModal.row!.bondId
            ? { ...r, total: r.total - amount }
            : r
        )
      );
    } catch (err) {
      console.error("Sell failed:", err);
      throw err;
    }
  };

  // Load allocated bonds
  useEffect(() => {
    if (!currentUser?.id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchInvestorAllocations(currentUser.id);
        setRows(data);
      } catch (err) {
        console.error("Error loading investor allocations:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        {/* Page title */}
        <motion.header {...fadeIn} className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Investor Assets
          </h1>
        </motion.header>

        {/* My Assets Section */}
        <section className="w-full mt-10" aria-labelledby="market-title">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
              <div>
                <h2
                  id="market-title"
                  className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-900"
                >
                  My Assets
                </h2>
                <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 max-w-3xl">
                  View your purchased units and their stated coupon rates and maturities.
                </p>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <label htmlFor="search" className="sr-only">
                    Search bonds
                  </label>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="search"
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-10 w-[min(270px,75vw)] sm:w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Search by name"
                  />
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <p className="mt-6 text-sm text-neutral-600">
                Loading your allocated bonds...
              </p>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                <p className="text-sm text-neutral-600">
                  You don't have any allocated bonds matching "{query}".
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-3 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Mobile list */}
            <ul
              className="mt-6 grid sm:hidden gap-3"
              role="list"
              aria-label="Your bonds"
            >
              {filtered.map((row) => {
                const dim = row.disabled
                  ? "text-neutral-300"
                  : "text-neutral-900";
                const rateCol = row.disabled
                  ? "text-neutral-300"
                  : row.status === "down"
                    ? "text-red-600"
                    : row.status === "flat"
                      ? "text-neutral-600"
                      : "text-emerald-600";

                return (
                  <li
                    key={row.bondId}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                    aria-disabled={row.disabled || undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                          <Image
                            src="/RSEB.png"
                            alt="Issuer"
                            width={22}
                            height={22}
                            className={`object-contain ${row.disabled ? "opacity-40" : ""
                              }`}
                          />
                          <span
                            aria-hidden
                            className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${row.status === "up"
                                ? "bg-emerald-500"
                                : row.status === "down"
                                  ? "bg-red-500"
                                  : "bg-neutral-300"
                              }`}
                          />
                          <span className="sr-only">
                            {row.status === "up"
                              ? "Trending up"
                              : row.status === "down"
                                ? "Trending down"
                                : "No change"}
                          </span>
                        </div>
                        <div>
                          <p className={`text-[15px] font-medium ${dim}`}>
                            {row.name}
                          </p>
                          <p className={`text-[13px] ${rateCol}`}>
                            {(row.ratePct).toFixed(2)}% / yr
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-[13px]">
                      <div>
                        <p className="text-neutral-500">Units bought</p>
                        <p className={`${dim}`}>{row.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Maturity</p>
                        <p className={`${dim}`}>{row.maturity}</p>
                      </div>
                    </div>

                    {/* Sell Button for Mobile */}
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex h-8 px-4 items-center justify-center rounded-xl text-xs font-medium
                         text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                         shadow-sm hover:shadow-md focus:outline-none disabled:opacity-50 transition-all duration-200"
                        onClick={() => openSellModal(row)}
                        disabled={row.disabled}
                        aria-disabled={row.disabled || undefined}
                      >
                        Sell Units
                      </motion.button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop table */}
            {filtered.length > 0 && (
              <div className="mt-6 overflow-x-auto rounded-2xl hidden sm:block">
                <table
                  aria-labelledby="market-title"
                  className="min-w-full text-left bg-white rounded-2xl overflow-hidden"
                >
                  <caption className="sr-only">
                    Your purchased bonds
                  </caption>
                  <thead>
                    <tr className="text-[13px] text-neutral-500">
                      <th scope="col" className="py-3 pr-3 pl-2 font-medium">
                        Bond
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Interest rate
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Total unit bought
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Maturity date
                      </th>
                      <th scope="col" className="py-3 pl-3 pr-2 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((row) => {
                      const dim = row.disabled
                        ? "text-neutral-300"
                        : "text-neutral-900";
                      const rateCol = row.disabled
                        ? "text-neutral-300"
                        : row.status === "down"
                          ? "text-red-600"
                          : row.status === "flat"
                            ? "text-neutral-600"
                            : "text-emerald-600";

                      return (
                        <tr key={row.bondId} className="align-middle hover:bg-gray-50 transition-colors">
                          <td className="py-5 pr-3 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                                <Image
                                  src="/RSEB.png"
                                  alt="Issuer"
                                  width={22}
                                  height={22}
                                  className={`object-contain ${row.disabled ? "opacity-40" : ""
                                    }`}
                                />
                                <span
                                  aria-hidden
                                  className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${row.status === "up"
                                      ? "bg-emerald-500"
                                      : row.status === "down"
                                        ? "bg-red-500"
                                        : "bg-neutral-300"
                                    }`}
                                />
                                <span className="sr-only">
                                  {row.status === "up"
                                    ? "Trending up"
                                    : row.status === "down"
                                      ? "Trending down"
                                      : "No change"}
                                </span>
                              </div>
                              <span
                                className={`text-[15px] font-medium ${dim}`}
                              >
                                {row.name}
                              </span>
                            </div>
                          </td>

                          <td
                            className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}
                          >
                            {(row.ratePct).toFixed(2)}% / yr
                          </td>

                          <td className={`py-5 px-3 text-[14px] ${dim}`}>
                            {row.total.toLocaleString()}
                          </td>
                          <td className={`py-5 px-3 text-[14px] ${dim}`}>
                            {row.maturity}
                          </td>

                          <td className="py-5 pl-3 pr-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex h-8 px-4 items-center justify-center rounded-xl text-xs font-medium
                             text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                             shadow-sm hover:shadow-md focus:outline-none disabled:opacity-50 transition-all duration-200"
                              onClick={() => openSellModal(row)}
                              disabled={row.disabled}
                              aria-disabled={row.disabled || undefined}
                              aria-label={`Sell ${row.name}`}
                            >
                              Sell
                            </motion.button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Sell Modal */}
        <SellBondModal
          row={sellModal.row}
          isOpen={sellModal.isOpen}
          onClose={closeSellModal}
          onConfirm={handleConfirmSell}
        />
      </main>
    </div>
  );
}