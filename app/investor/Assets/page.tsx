// app/investor/earnings/page.tsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { fetchInvestorEarnings } from "@/server/db_actions/action";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoTimeOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoEyeOutline,
  IoLockClosed,
  IoInformationCircle,
  IoTrendingUp,
  IoStatsChart,
  IoCalendarOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoSearchOutline,
  IoArrowRedoOutline,
} from "react-icons/io5";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number; // 0.05 -> 5%
  interestAccrued: number; // e.g. 10, 20 ...
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
  purchaseDate: string;
  bondType: string;
  faceValue: number;
  totalInvestment: number;
  bondId?: string; // Added for sell functionality
  seriesObjectId?: string; // Added for sell functionality
  total?: number; // Added for sell functionality (units held)
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

/* ========================= Helpers ========================= */

// Parse "DD/MM/YYYY" into a Date
const parseMaturity = (dateStr: string): Date | null => {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

// Check if maturity date is in the past or today
const isMatured = (maturityStr: string): boolean => {
  const maturityDate = parseMaturity(maturityStr);
  if (!maturityDate) return false;
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const maturityMidnight = new Date(
    maturityDate.getFullYear(),
    maturityDate.getMonth(),
    maturityDate.getDate()
  );
  return maturityMidnight.getTime() <= todayMidnight.getTime();
};

/* ========================= Loader (Book Animation) ========================= */

function BookLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* From Uiverse.io by anand_4957 */}
      <style>{`
        .book,
        .book__pg-shadow,
        .book__pg {
          animation: cover 5s ease-in-out infinite;
        }
        .book {
          background-color: hsl(268, 90%, 65%);
          border-radius: 0.25em;
          box-shadow:
            0 0.25em 0.5em hsla(0, 0%, 0%, 0.3),
            0 0 0 0.25em hsl(278, 100%, 57%) inset;
          padding: 0.25em;
          perspective: 37.5em;
          position: relative;
          width: 8em;
          height: 6em;
          transform: translate3d(0, 0, 0);
          transform-style: preserve-3d;
        }
        .book__pg-shadow,
        .book__pg {
          position: absolute;
          left: 0.25em;
          width: calc(50% - 0.25em);
        }
        .book__pg-shadow {
          animation-name: shadow;
          background-image: linear-gradient(
            -45deg,
            hsla(0, 0%, 0%, 0) 50%,
            hsla(0, 0%, 0%, 0.3) 50%
          );
          filter: blur(0.25em);
          top: calc(100% - 0.25em);
          height: 3.75em;
          transform: scaleY(0);
          transform-origin: 100% 0%;
        }
        .book__pg {
          animation-name: pg1;
          background-color: hsl(223, 10%, 100%);
          background-image: linear-gradient(
            90deg,
            hsla(223, 10%, 90%, 0) 87.5%,
            hsl(223, 10%, 90%)
          );
          height: calc(100% - 0.5em);
          transform-origin: 100% 50%;
        }
        .book__pg--2,
        .book__pg--3,
        .book__pg--4 {
          background-image: repeating-linear-gradient(
              hsl(223, 10%, 10%) 0 0.125em,
              hsla(223, 10%, 10%, 0) 0.125em 0.5em
            ),
            linear-gradient(90deg, hsla(223, 10%, 90%, 0) 87.5%, hsl(223, 10%, 90%));
          background-repeat: no-repeat;
          background-position: center;
          background-size:
            2.5em 4.125em,
            100% 100%;
        }
        .book__pg--2 {
          animation-name: pg2;
        }
        .book__pg--3 {
          animation-name: pg3;
        }
        .book__pg--4 {
          animation-name: pg4;
        }
        .book__pg--5 {
          animation-name: pg5;
        }

        /* Dark theme */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: hsl(223, 10%, 30%);
            --fg: hsl(223, 10%, 90%);
          }
        }

        /* Animations */
        @keyframes cover {
          from,
          5%,
          45%,
          55%,
          95%,
          to {
            animation-timing-function: ease-out;
            background-color: hsl(278, 84%, 67%);
          }
          10%,
          40%,
          60%,
          90% {
            animation-timing-function: ease-in;
            background-color: hsl(271, 90%, 45%);
          }
        }
        @keyframes shadow {
          from,
          10.01%,
          20.01%,
          30.01%,
          40.01% {
            animation-timing-function: ease-in;
            transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
          }
          5%,
          15%,
          25%,
          35%,
          45%,
          55%,
          65%,
          75%,
          85%,
          95% {
            animation-timing-function: ease-out;
            transform: translate3d(0, 0, 1px) scaleY(0.2) rotateY(90deg);
          }
          10%,
          20%,
          30%,
          40%,
          50%,
          to {
            animation-timing-function: ease-out;
            transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
          }
          50.01%,
          60.01%,
          70.01%,
          80.01%,
          90.01% {
            animation-timing-function: ease-in;
            transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
          }
          60%,
          70%,
          80%,
          90%,
          to {
            animation-timing-function: ease-out;
            transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
          }
        }
        @keyframes pg1 {
          from,
          to {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.4deg);
          }
          10%,
          15% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(180deg);
          }
          20%,
          80% {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(180deg);
          }
          85%,
          90% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(180deg);
          }
        }
        @keyframes pg2 {
          from,
          to {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(0.3deg);
          }
          5%,
          10% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.3deg);
          }
          20%,
          25% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.9deg);
          }
          30%,
          70% {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(179.9deg);
          }
          75%,
          80% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.9deg);
          }
          90%,
          95% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.3deg);
          }
        }
        @keyframes pg3 {
          from,
          10%,
          90%,
          to {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(0.2deg);
          }
          15%,
          20% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.2deg);
          }
          30%,
          35% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.8deg);
          }
          40%,
          60% {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(179.8deg);
          }
          65%,
          70% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.8deg);
          }
          80%,
          85% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.2deg);
          }
        }
        @keyframes pg4 {
          from,
          20%,
          80%,
          to {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(0.1deg);
          }
          25%,
          30% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.1deg);
          }
          40%,
          45% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.7deg);
          }
          50% {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(179.7deg);
          }
          55%,
          60% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.7deg);
          }
          70%,
          75% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0.1deg);
          }
        }
        @keyframes pg5 {
          from,
          30%,
          70%,
          to {
            animation-timing-function: ease-in;
            background-color: hsl(223, 10%, 45%);
            transform: translate3d(0, 0, 1px) rotateY(0);
          }
          35%,
          40% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0deg);
          }
          50% {
            animation-timing-function: ease-in-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(179.6deg);
          }
          60%,
          65% {
            animation-timing-function: ease-out;
            background-color: hsl(223, 10%, 100%);
            transform: translate3d(0, 0, 1px) rotateY(0);
          }
        }
      `}</style>

      <div className="book">
        <div className="book__pg-shadow" />
        <div className="book__pg" />
        <div className="book__pg book__pg--2" />
        <div className="book__pg book__pg--3" />
        <div className="book__pg book__pg--4" />
        <div className="book__pg book__pg--5" />
      </div>

      <p className="mt-4 text-gray-600 text-sm sm:text-base">
        Loading your earnings...
      </p>
    </div>
  );
}

/* ========================= Enhanced Sell Modal Component ========================= */

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

  const totalUnits = row.total || row.totalInvestment; // Fallback to totalInvestment if total not available
  const amount = parseFloat(sellAmount) || 0;
  const isValid = amount > 0 && amount <= totalUnits;
  const percentage = (amount / totalUnits) * 100;

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <IoArrowRedoOutline className="w-6 h-6 text-red-600" />
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
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{row.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <span>{row.bondType}</span>
                              <span>•</span>
                              <span>{(row.ratePct * 100).toFixed(2)}% / yr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Available Units</p>
                          <p className="font-semibold text-gray-900">{totalUnits.toLocaleString()} units</p>
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
                            max={totalUnits}
                            step="0.1"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="0.0"
                          />
                          <button
                            type="button"
                            onClick={() => setSellAmount(totalUnits.toString())}
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
                            max={totalUnits}
                            step={totalUnits / 100}
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
                            <IoInformationCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Sale Summary</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Units to sell:</span>
                              <span className="font-semibold text-blue-900">{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Remaining after sale:</span>
                              <span className="font-semibold text-blue-900">{(totalUnits - amount).toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Warning for full sale */}
                      {amount === totalUnits && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-amber-50 rounded-xl p-3 border border-amber-200"
                        >
                          <div className="flex items-center gap-2">
                            <IoLockClosed className="w-4 h-4 text-amber-600" />
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
                          <IoArrowRedoOutline className="w-8 h-8 text-red-600" />
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
                          <span className="font-medium">{(totalUnits - amount).toLocaleString()}</span>
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
                        <IoTimeOutline className="w-4 h-4" />
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
                        <IoCheckmarkCircle className="w-10 h-10 text-green-600" />
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
                            <span>→</span>
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

/* ========================= Component ========================= */

export default function EarningsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [sortBy, setSortBy] = useState<"maturity" | "rate" | "interest">(
    "maturity"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // list vs cards (desktop behaviour)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // search
  const [searchQuery, setSearchQuery] = useState("");

  // Sell modal state
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; row: Row | null }>({
    isOpen: false,
    row: null
  });

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInvestorEarnings();
        setRows(data as Row[]);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load earnings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const fields = [
        r.name,
        r.bondType,
        r.maturity,
        r.purchaseDate,
      ].map((f) => f.toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows];

    copy.sort((a, b) => {
      if (sortBy === "maturity") {
        const aDate = parseMaturity(a.maturity)?.getTime() ?? 0;
        const bDate = parseMaturity(b.maturity)?.getTime() ?? 0;
        return sortDir === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === "rate") {
        return sortDir === "asc" ? a.ratePct - b.ratePct : b.ratePct - a.ratePct;
      }
      if (sortBy === "interest") {
        return sortDir === "asc"
          ? a.interestAccrued - b.interestAccrued
          : b.interestAccrued - a.interestAccrued;
      }
      return 0;
    });

    return copy;
  }, [filteredRows, sortBy, sortDir]);

  const toggleSort = (field: "maturity" | "rate" | "interest") => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + r.interestAccrued, 0),
    [rows]
  );

  const totalInvested = useMemo(
    () => rows.reduce((sum, r) => sum + r.totalInvestment, 0),
    [rows]
  );

  const averageRate = useMemo(() => {
    if (!rows.length) return 0;
    const sum = rows.reduce((acc, r) => acc + r.ratePct, 0);
    return sum / rows.length;
  }, [rows]);

  const handleRedeem = (row: Row) => {
    if (!isMatured(row.maturity)) return;
    // TODO: plug actual redeem backend/blockchain logic here
    console.log("Redeem clicked for", row.id);
  };

  const openSellModal = (row: Row) => {
    setSellModal({ isOpen: true, row });
  };

  const closeSellModal = () => {
    setSellModal({ isOpen: false, row: null });
  };

  const handleConfirmSell = async (amount: number) => {
    if (!sellModal.row) return;

    try {
      // TODO: Replace with actual sell logic from blockchain
      console.log("Selling", amount, "units of", sellModal.row.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state if needed
      // setRows(prev => prev.map(r => 
      //   r.id === sellModal.row!.id 
      //     ? { ...r, total: (r.total || 0) - amount } 
      //     : r
      // ));
    } catch (err) {
      console.error("Sell failed:", err);
      throw err;
    }
  };

  const handleExportCSV = () => {
    if (!sortedRows.length) return;

    const header = [
      "Bond Name",
      "Bond Type",
      "Coupon Rate (%)",
      "Interest Earned",
      "Principal",
      "Face Value",
      "Purchase Date",
      "Maturity",
      "Status",
    ];

    const lines = sortedRows.map((r) => {
      const cells = [
        r.name,
        r.bondType,
        (r.ratePct * 100).toFixed(2),
        r.interestAccrued.toFixed(2),
        r.totalInvestment.toFixed(2),
        r.faceValue.toFixed(2),
        r.purchaseDate,
        r.maturity,
        isMatured(r.maturity) ? "Matured" : "Ongoing",
      ];
      // Wrap each cell in quotes to be safe for CSV
      return cells.map((c) => `"${c}"`).join(",");
    });

    const csvContent = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "earnings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!rows.length) return;

    const summary = [
      "RSEB Earnings Summary",
      "",
      `Total Interest Earned: Nu. ${totalInterest.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Total Principal: Nu. ${totalInvested.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Average Coupon Rate: ${(averageRate * 100).toFixed(2)}%`,
      "",
      "Shared from the RSEB Bond Tokenization Platform.",
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "RSEB Earnings Summary",
          text: summary,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        alert("Earnings summary copied to clipboard.");
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  // Loading state with book animation
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <BookLoader />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header {...fadeIn} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Earnings & Redemptions
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Track your coupon earnings, monitor maturity timelines, and redeem
            matured bond positions.
          </p>
        </motion.header>

        {/* KPI cards – light theme, consistent with marketplace */}
        <motion.section
          {...fadeIn}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {/* Total Interest */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Interest Earned
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInterest.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <IoTrendingUp className="w-4 h-4" />
                  <span>Accruing over time</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoCashOutline className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Principal */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Principal
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInvested.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>Across all active bonds</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoDocumentTextOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Average Rate */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Average Coupon Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {(averageRate * 100).toFixed(2)}%
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoStatsChart className="w-4 h-4" />
                  <span>Weighted by holdings</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B50D9]" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Toolbar – info + Export / Share */}
        <motion.div
          {...fadeIn}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <div className="mt-0.5">
              <IoInformationCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p>
              <span className="font-medium text-gray-800">
                Redemption & Sale rules:
              </span>{" "}
              Bonds can be redeemed only after reaching maturity. You can sell bonds anytime on the secondary market.{" "}
              <span className="text-[#5B50D9] font-medium">Redeem</span>{" "}
              button is enabled when eligible.{" "}
              <span className="text-red-600 font-medium">Sell</span>{" "}
              button is always available.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoDownloadOutline className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoShareSocialOutline className="w-4 h-4" />
              Share Summary
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div {...fadeIn} className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative max-w-md w-full">
              <IoSearchOutline className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bond name, type, maturity or purchase date..."
                className="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl border border-gray-300 bg-white pl-9 pr-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B50D9] focus:border-[#5B50D9] transition-all"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {sortedRows.length}
              </span>{" "}
              earning position{sortedRows.length === 1 ? "" : "s"}
              {searchQuery.trim()
                ? " matching your search."
                : " across your portfolio."}
            </p>
          </div>
        </motion.div>

        {/* Desktop view toggle (list/table vs box/cards) */}
        <motion.div
          {...fadeIn}
          className="hidden lg:flex items-center justify-between mb-3"
        >
          <h2 className="text-sm font-semibold text-gray-800">
            Earning Positions
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "cards"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Card view"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "table"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Table view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Desktop table (list view) */}
        {viewMode === "table" && (
          <motion.div
            {...fadeIn}
            className="hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Bond
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("rate")}
                    >
                      Rate
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("interest")}
                    >
                      Interest Earned
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Principal
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("maturity")}
                    >
                      Maturity
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {error && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-red-500 text-sm"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!error && sortedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-gray-500 text-sm"
                      >
                        {searchQuery.trim()
                          ? "No earnings match your search."
                          : "No earnings to display yet."}
                      </td>
                    </tr>
                  )}

                  {!error &&
                    sortedRows.map((row) => {
                      const matured = isMatured(row.maturity);
                      const redeemDisabled = !matured || row.disabled;

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Bond */}
                          <td className="px-6 py-4 align-top">
                            <div className="space-y-0.5">
                              <p className="text-sm font-semibold text-gray-900">
                                {row.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {row.bondType}
                              </p>
                              <p className="text-xs text-gray-400">
                                Purchased on {row.purchaseDate}
                              </p>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-emerald-600">
                              {(row.ratePct * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Fixed coupon rate
                            </p>
                          </td>

                          {/* Interest */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {row.interestAccrued.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Accrued to date
                            </p>
                          </td>

                          {/* Principal */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {row.totalInvestment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Face value: Nu.{" "}
                              {row.faceValue.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </td>

                          {/* Maturity */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {row.maturity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {matured ? "Maturity reached" : "Ongoing tenure"}
                            </p>
                          </td>

                          {/* Status pill */}
                          <td className="px-4 py-4 align-top">
                            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs bg-gray-50 border-gray-200">
                              {matured ? (
                                <>
                                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-700 font-medium">
                                    Ready to redeem
                                  </span>
                                </>
                              ) : (
                                <>
                                  <IoLockClosed className="w-4 h-4 text-amber-500" />
                                  <span className="text-amber-700 font-medium">
                                    Locked till maturity
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Actions - UPDATED with Sell button */}
                          <td className="px-6 py-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRow(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                              >
                                <IoEyeOutline className="w-4 h-4" />
                                View
                              </button>

                              {/* Sell Button */}
                              <button
                                type="button"
                                onClick={() => openSellModal(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
                              >
                                <IoArrowRedoOutline className="w-4 h-4" />
                                Sell
                              </button>

                              {/* Redeem Button */}
                              <button
                                type="button"
                                onClick={() => handleRedeem(row)}
                                disabled={redeemDisabled}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                                  redeemDisabled
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                                }`}
                              >
                                <IoCheckmarkCircle className="w-4 h-4" />
                                Redeem
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Desktop cards (box view) */}
        {viewMode === "cards" && !error && sortedRows.length > 0 && (
          <motion.div
            {...fadeIn}
            className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 mt-2"
          >
            {sortedRows.map((row) => {
              const matured = isMatured(row.maturity);
              const redeemDisabled = !matured || row.disabled;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Bond
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.name}
                        </p>
                        <p className="text-xs text-gray-500">{row.bondType}</p>
                        <p className="text-xs text-gray-400">
                          Purchased on {row.purchaseDate}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                        <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-0.5">Rate</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {(row.ratePct * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Interest</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.interestAccrued.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Principal</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.totalInvestment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Maturity</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.maturity}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                        {matured ? (
                          <>
                            <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">
                              Ready to redeem
                            </span>
                          </>
                        ) : (
                          <>
                            <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-amber-700 font-medium">
                              Locked till maturity
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - UPDATED with Sell button */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                      View
                    </button>
                    
                    {/* Sell Button */}
                    <button
                      type="button"
                      onClick={() => openSellModal(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
                    >
                      <IoArrowRedoOutline className="w-3.5 h-3.5" />
                      Sell
                    </button>
                    
                    {/* Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(row)}
                      disabled={redeemDisabled}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                        redeemDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-3.5 h-3.5" />
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Desktop cards view error / empty messaging (when cards selected) */}
        {viewMode === "cards" && error && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-red-500 bg-white rounded-2xl border border-gray-200 py-8">
            {error}
          </div>
        )}
        {viewMode === "cards" && !error && sortedRows.length === 0 && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-gray-500 bg-white rounded-2xl border border-gray-200 py-8">
            {searchQuery.trim()
              ? "No earnings match your search."
              : "No earnings to display yet."}
          </div>
        )}

        {/* Mobile / small screens – horizontal slider with fixed-size cards */}
        <motion.div {...fadeIn} className="lg:hidden mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Swipe horizontally to view all of your bond earnings.
          </p>
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {!error &&
              sortedRows.map((row) => {
                const matured = isMatured(row.maturity);
                const redeemDisabled = !matured || row.disabled;

                return (
                  <div
                    key={row.id}
                    className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Bond
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {row.bondType}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {row.purchaseDate}
                          </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                          <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-0.5">Rate</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {(row.ratePct * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Interest</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.interestAccrued.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Principal</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.totalInvestment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Maturity</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.maturity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                          {matured ? (
                            <>
                              <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">
                                Ready to redeem
                              </span>
                            </>
                          ) : (
                            <>
                              <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-amber-700 font-medium">
                                Locked till maturity
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fixed-size action strip - UPDATED with Sell button */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </button>
                      
                      {/* Sell Button */}
                      <button
                        type="button"
                        onClick={() => openSellModal(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
                      >
                        <IoArrowRedoOutline className="w-3.5 h-3.5" />
                        Sell
                      </button>
                      
                      {/* Redeem Button */}
                      <button
                        type="button"
                        onClick={() => handleRedeem(row)}
                        disabled={redeemDisabled}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                          redeemDisabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                        }`}
                      >
                        <IoCheckmarkCircle className="w-3.5 h-3.5" />
                        Redeem
                      </button>
                    </div>
                  </div>
                );
              })}

            {error && (
              <div className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-center text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Slide-over details modal */}
        <AnimatePresence>
          {selectedRow && (
            <motion.div
              className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-gray-200 shadow-xl p-5 sm:p-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="absolute right-4 top-4 w-7 h-7 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <div className="space-y-4 pt-4 sm:pt-2">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                      <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bond Details
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedRow.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedRow.bondType} · Purchased on{" "}
                        {selectedRow.purchaseDate}
                      </p>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500">Coupon Rate</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedRow.ratePct * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Earned</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.interestAccrued.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Principal</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.totalInvestment.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Face Value</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.faceValue.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Maturity</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedRow.maturity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="text-gray-900 font-semibold">
                        {isMatured(selectedRow.maturity)
                          ? "Maturity reached"
                          : "Still in tenure"}
                      </p>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                    <div className="flex items-start gap-2">
                      <IoTimeOutline className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">
                          How redemption works
                        </p>
                        <p>
                          Once this bond reaches maturity, your principal and
                          final coupon are eligible for redemption. The{" "}
                          <span className="font-semibold">Redeem</span> button
                          will be enabled and the transaction will be processed
                          on-chain via the RSEB tokenization platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions - UPDATED with Sell button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    
                    {/* Sell Button */}
                    <button
                      type="button"
                      onClick={() => openSellModal(selectedRow)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
                    >
                      <IoArrowRedoOutline className="w-4 h-4" />
                      Sell
                    </button>
                    
                    {/* Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(selectedRow)}
                      disabled={
                        !isMatured(selectedRow.maturity) || selectedRow.disabled
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                        !isMatured(selectedRow.maturity) ||
                        selectedRow.disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-4 h-4" />
                      Redeem
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

/* ========================= View Icons ========================= */

function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}