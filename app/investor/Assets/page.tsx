"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchInvestorAllocations } from "@/server/db_actions/action";
import { listForSaleAndPersist } from "@/server/blockchain/bond";
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
  IoStorefrontOutline,
} from "react-icons/io5";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  bondId: string;
  seriesObjectId: string;
  name: string;
  ratePct: number; // Stored as percentage (e.g., 5.00 for 5%), NOT decimal
  total: number; // Units held - whole numbers only
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
  purchaseDate?: string;
  bondType?: string;
  faceValue?: number; // Total face value of all units held
  purchasePrice?: number; // Price paid per unit
  totalInvestment?: number; // Actual amount invested
  interestAccrued?: number;
  lastCouponDate?: string; // Last coupon payment date
  couponFrequency?: "monthly" | "quarterly" | "semi-annual" | "annual";
};

/* ========================= Motion ========================= */

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

/* ========================= Helpers ========================= */

// Parse "DD/MM/YYYY" into a Date
const parseMaturity = (dateStr: string): Date | null => {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

// Parse any date string (handles multiple formats)
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY format first
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }
  
  // Try ISO format
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  return null;
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

// Calculate days between two dates
const daysBetween = (startDate: Date, endDate: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay);
};

// Calculate interest accrued based on actual bond mathematics
const calculateInterestAccrued = (row: Row): number => {
  // If API already provides accrued interest, use it
  if (row.interestAccrued !== undefined) return row.interestAccrued;
  
  // Calculate based on actual bond mathematics
  const faceValue = row.faceValue || row.total * 100; // Default: 100 per unit
  
  // Determine interest rate (ensure it's in decimal form)
  const annualRate = row.ratePct > 1 ? row.ratePct / 100 : row.ratePct;
  
  // Get purchase date and current date
  const purchaseDate = parseDate(row.purchaseDate || "");
  if (!purchaseDate) {
    // Fallback: simple calculation without date
    return faceValue * annualRate * 0.5; // Assume 6 months of interest
  }
  
  const currentDate = new Date();
  
  // Calculate days since purchase
  const daysSincePurchase = daysBetween(purchaseDate, currentDate);
  if (daysSincePurchase <= 0) return 0;
  
  // Calculate daily interest rate (ACT/365 day count convention)
  const dailyRate = annualRate / 365;
  
  // Calculate accrued interest
  const accruedInterest = faceValue * dailyRate * daysSincePurchase;
  
  return accruedInterest;
};

// Calculate total investment (principal)
const calculateTotalInvestment = (row: Row): number => {
  if (row.totalInvestment !== undefined) return row.totalInvestment;
  
  // Calculate based on units and price per unit
  const pricePerUnit = row.purchasePrice || 100; // Default: 100 per unit
  return row.total * pricePerUnit;
};

// Format rate for display - handles both decimal (0.05) and percentage (5.00) formats
const formatRateForDisplay = (ratePct: number): string => {
  // If rate is less than 1, it's likely decimal (0.05), convert to percentage
  // If rate is greater than 1, it's likely already percentage (5.00)
  const displayRate = ratePct < 1 ? ratePct * 100 : ratePct;
  return displayRate.toFixed(2);
};

// Validate unit amount (must be whole number)
const validateUnitAmount = (amount: number, maxAmount: number): boolean => {
  return Number.isInteger(amount) && amount > 0 && amount <= maxAmount;
};

/* ========================= Full Screen Loading Component ========================= */

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          id="svg-global"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 94 136"
          height="200"
          width="140"
          className="mx-auto"
        >
          {/* ... SVG content remains the same ... */}
        </svg>
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-8">Loading your earnings...</p>
      <p className="text-gray-500 mt-2">Please wait while we fetch your bond allocations</p>
      
      <style jsx>{`
        #svg-global {
          zoom: 1.2;
          overflow: visible;
        }

        @keyframes fade-particles {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }

        #particles {
          animation: fade-particles 5s infinite alternate;
        }
        .particle {
          animation: floatUp linear infinite;
        }

        .p1 {
          animation-duration: 2.2s;
          animation-delay: 0s;
        }
        .p2 {
          animation-duration: 2.5s;
          animation-delay: 0.3s;
        }
        .p3 {
          animation-duration: 2s;
          animation-delay: 0.6s;
        }
        .p4 {
          animation-duration: 2.8s;
          animation-delay: 0.2s;
        }
        .p5 {
          animation-duration: 2.3s;
          animation-delay: 0.4s;
        }
        .p6 {
          animation-duration: 3s;
          animation-delay: 0.1s;
        }
        .p7 {
          animation-duration: 2.1s;
          animation-delay: 0.5s;
        }
        .p8 {
          animation-duration: 2.6s;
          animation-delay: 0.2s;
        }
        .p9 {
          animation-duration: 2.4s;
          animation-delay: 0.3s;
        }

        @keyframes bounce-lines {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        #line-v1,
        #line-v2,
        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation: bounce-lines 3s ease-in-out infinite alternate;
        }
        #line-v2 {
          animation-delay: 0.2s;
        }

        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation-delay: 0.4s;
        }
      `}</style>
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
  const [validationError, setValidationError] = useState("");

  if (!row || !isOpen) return null;

  const amount = parseInt(sellAmount) || 0;
  const isValid = validateUnitAmount(amount, row.total);
  const percentage = (amount / row.total) * 100;

  const resetModal = () => {
    setSellAmount("");
    setStep("input");
    setTransactionHash("");
    setSellLoading(false);
    setValidationError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleAmountChange = (value: string) => {
    setSellAmount(value);
    const numValue = parseInt(value);
    
    if (value && !Number.isInteger(numValue)) {
      setValidationError("Units must be whole numbers");
    } else if (numValue > row.total) {
      setValidationError(`Cannot exceed ${row.total} units`);
    } else if (numValue <= 0) {
      setValidationError("Must be at least 1 unit");
    } else {
      setValidationError("");
    }
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
    } catch (error: any) {
      console.error("Sell failed:", error);
      setValidationError(error.message || "Sale failed. Please try again.");
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
                    <span className="text-xl">×</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <IoStorefrontOutline className="w-6 h-6 text-red-600" />
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
                              <span>{formatRateForDisplay(row.ratePct)}% / yr</span>
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
                          Units to Sell (Whole numbers only)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max={row.total}
                            step="1"
                            value={sellAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`w-full px-4 py-3 text-lg border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                              validationError 
                                ? "border-red-300 focus:ring-red-500" 
                                : "border-gray-300 focus:ring-red-500"
                            }`}
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={() => handleAmountChange(row.total.toString())}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                        
                        {validationError && (
                          <p className="mt-2 text-sm text-red-600">{validationError}</p>
                        )}
                        
                        {/* Amount Slider */}
                        <div className="mt-4">
                          <input
                            type="range"
                            min="1"
                            max={row.total}
                            step="1"
                            value={sellAmount || 1}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 unit</span>
                            <span>{percentage.toFixed(0)}%</span>
                            <span>{row.total} units</span>
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
                              <span className="font-semibold text-blue-900">{(row.total - amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Percentage sold:</span>
                              <span className="font-semibold text-blue-900">{percentage.toFixed(1)}%</span>
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
                          <IoStorefrontOutline className="w-8 h-8 text-red-600" />
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
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coupon Rate:</span>
                          <span className="font-medium">{formatRateForDisplay(row.ratePct)}%</span>
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
                            disabled={!isValid || sellLoading || !!validationError}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            Continue
                            <IoArrowRedoOutline className="w-4 h-4" />
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
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-red-400 disabled:to-orange-300 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
  const currentUser = useCurrentUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [sortBy, setSortBy] = useState<"maturity" | "rate" | "interest" | "units">("maturity");
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

  // Load data from API
  useEffect(() => {
    if (!currentUser?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInvestorAllocations(currentUser.id);
        
        // Transform the data
        const transformedData = data.map((row: any) => {
          // Calculate interest and investment
          const interestAccrued = calculateInterestAccrued(row);
          const totalInvestment = calculateTotalInvestment(row);
          
          return {
            ...row,
            total: row.total || 0,
            interestAccrued: interestAccrued,
            totalInvestment: totalInvestment,
            bondType: row.bondType || "Government Bond",
            faceValue: row.faceValue || (row.total || 0) * 100, // Default: 100 per unit
            purchaseDate: row.purchaseDate || "01/01/2024",
            purchasePrice: row.purchasePrice || 100, // Default: 100 per unit
            lastCouponDate: row.lastCouponDate || row.purchaseDate || "01/01/2024",
            couponFrequency: row.couponFrequency || "semi-annual"
          };
        });
        
        setRows(transformedData);
      } catch (e: any) {
        console.error("Failed to load earnings:", e);
        setError("Failed to load earnings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser?.id]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const fields = [
        r.name,
        r.bondType || "",
        r.maturity,
        r.purchaseDate || "",
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
        // Use formatted rate for comparison
        const aRate = formatRateForDisplay(a.ratePct);
        const bRate = formatRateForDisplay(b.ratePct);
        return sortDir === "asc" ? parseFloat(aRate) - parseFloat(bRate) : parseFloat(bRate) - parseFloat(aRate);
      }
      if (sortBy === "interest") {
        const aInterest = calculateInterestAccrued(a);
        const bInterest = calculateInterestAccrued(b);
        return sortDir === "asc" ? aInterest - bInterest : bInterest - aInterest;
      }
      if (sortBy === "units") {
        return sortDir === "asc" ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

    return copy;
  }, [filteredRows, sortBy, sortDir]);

  const toggleSort = (field: "maturity" | "rate" | "interest" | "units") => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + calculateInterestAccrued(r), 0),
    [rows]
  );

  const totalInvested = useMemo(
    () => rows.reduce((sum, r) => sum + calculateTotalInvestment(r), 0),
    [rows]
  );

  const totalUnits = useMemo(
    () => rows.reduce((sum, r) => sum + r.total, 0),
    [rows]
  );

  const averageRate = useMemo(() => {
    if (!rows.length) return 0;
    // Convert all rates to percentage for averaging
    const sum = rows.reduce((acc, r) => {
      const rate = parseFloat(formatRateForDisplay(r.ratePct));
      return acc + rate;
    }, 0);
    return sum / rows.length;
  }, [rows]);

  const handleRedeem = (row: Row) => {
    if (!isMatured(row.maturity)) return;
    // TODO: plug actual redeem backend/blockchain logic here
    console.log("Redeem clicked for", row.bondId);
    alert(`Redeem functionality for ${row.name} would be implemented here.`);
  };

  const openSellModal = (row: Row) => {
    setSellModal({ isOpen: true, row });
  };

  const closeSellModal = () => {
    setSellModal({ isOpen: false, row: null });
  };

  // FIXED: Using the simple logic from old code
  const handleConfirmSell = async (amount: number) => {
    if (!sellModal.row || !currentUser) {
      throw new Error("User or bond information missing");
    }

    try {
      console.log("Selling with params:", {
        userId: currentUser.id,
        bondId: sellModal.row.bondId,
        sellerAddress: currentUser.wallet_address,
        sellerMnemonic: currentUser.hashed_mnemonic,
        seriesObjectId: sellModal.row.seriesObjectId,
        amountUnits: amount, // Direct amount, no conversion
      });

      await listForSaleAndPersist({
        userId: currentUser.id,
        bondId: sellModal.row.bondId,
        sellerAddress: currentUser.wallet_address!,
        sellerMnemonic: currentUser.hashed_mnemonic,
        seriesObjectId: sellModal.row.seriesObjectId,
        amountUnits: amount, // Direct amount like in old code
      });

      // Update local state
      setRows(prev =>
        prev.map(r =>
          r.bondId === sellModal.row!.bondId
            ? { ...r, total: r.total - amount }
            : r
        )
      );
    } catch (err: any) {
      console.error("Sell failed:", err);
      throw new Error(err.message || "Failed to list bond for sale");
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
      "Units Held",
      "Purchase Date",
      "Maturity",
      "Status",
    ];

    const lines = sortedRows.map((r) => {
      const cells = [
        r.name,
        r.bondType || "Government Bond",
        formatRateForDisplay(r.ratePct),
        calculateInterestAccrued(r).toFixed(2),
        calculateTotalInvestment(r).toFixed(2),
        (r.faceValue || r.total * 100).toFixed(2),
        r.total.toLocaleString(),
        r.purchaseDate || "01/01/2024",
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
      `Total Units Held: ${totalUnits.toLocaleString()}`,
      `Average Coupon Rate: ${averageRate.toFixed(2)}%`,
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

  // Show loading screen while data is being fetched
  if (loading) {
    return <FullScreenLoading />;
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
                    minimumFractionDigits: 2,
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
                    minimumFractionDigits: 2,
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

          {/* Total Units */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Units Held
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {totalUnits.toLocaleString()}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoStatsChart className="w-4 h-4" />
                  <span>Whole units only</span>
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
                      onClick={() => toggleSort("units")}
                    >
                      Units Held
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
                        colSpan={8}
                        className="px-6 py-6 text-center text-red-500 text-sm"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!error && sortedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
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
                      const interestAccrued = calculateInterestAccrued(row);
                      const totalInvestment = calculateTotalInvestment(row);
                      const displayRate = formatRateForDisplay(row.ratePct);

                      return (
                        <tr
                          key={row.bondId}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Bond */}
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-lg border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                  src="/RSEB.png"
                                  alt="Issuer"
                                  width={22}
                                  height={22}
                                  className="object-contain"
                                />
                                <span
                                  aria-hidden
                                  className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                    row.status === "up"
                                      ? "bg-emerald-500"
                                      : row.status === "down"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
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
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-gray-900">
                                  {row.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {row.bondType || "Government Bond"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Purchased on {row.purchaseDate || "01/01/2024"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-emerald-600">
                              {displayRate}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Fixed coupon rate
                            </p>
                          </td>

                          {/* Interest */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {interestAccrued.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
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
                              {totalInvestment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Face value: Nu.{" "}
                              {(row.faceValue || row.total * 100).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </td>

                          {/* Units Held */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {row.total.toLocaleString()}
                              <span className="text-xs text-gray-500 ml-1">units</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Whole units only
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

                          {/* IMPROVED Actions Section */}
                          <td className="px-6 py-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRow(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                <IoEyeOutline className="w-4 h-4" />
                                View
                              </button>

                              {/* IMPROVED Sell Button */}
                              <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openSellModal(row)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold
                                 text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                                 shadow-md hover:shadow-lg focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                                 transition-all duration-200 border border-red-600/20"
                                disabled={row.disabled}
                                aria-disabled={row.disabled || undefined}
                                aria-label={`Sell ${row.name}`}
                              >
                                <IoStorefrontOutline className="w-3.5 h-3.5" />
                                Sell Units
                              </motion.button>

                              {/* IMPROVED Redeem Button */}
                              <button
                                type="button"
                                onClick={() => handleRedeem(row)}
                                disabled={redeemDisabled}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold border transition-all duration-200 ${
                                  redeemDisabled
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                                    : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-lg"
                                }`}
                              >
                                <IoCheckmarkCircle className="w-3.5 h-3.5" />
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
              const interestAccrued = calculateInterestAccrued(row);
              const totalInvestment = calculateTotalInvestment(row);
              const displayRate = formatRateForDisplay(row.ratePct);

              return (
                <div
                  key={row.bondId}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
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
                        <p className="text-xs text-gray-500">{row.bondType || "Government Bond"}</p>
                        <p className="text-xs text-gray-400">
                          Purchased on {row.purchaseDate || "01/01/2024"}
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
                          {displayRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Interest</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {interestAccrued.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Principal</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {totalInvestment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Units Held</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.total.toLocaleString()}
                          <span className="text-xs text-gray-500 ml-1">units</span>
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

                  {/* IMPROVED Actions Section */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                      View
                    </button>
                    
                    {/* IMPROVED Sell Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openSellModal(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold
                       text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                       shadow-md hover:shadow-md focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                       transition-all duration-200 border border-red-600/20"
                      disabled={row.disabled}
                      aria-disabled={row.disabled || undefined}
                    >
                      <IoStorefrontOutline className="w-3.5 h-3.5" />
                      Sell
                    </motion.button>
                    
                    {/* IMPROVED Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(row)}
                      disabled={redeemDisabled}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-all duration-200 ${
                        redeemDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                          : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-md"
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
                const interestAccrued = calculateInterestAccrued(row);
                const totalInvestment = calculateTotalInvestment(row);
                const displayRate = formatRateForDisplay(row.ratePct);

                return (
                  <div
                    key={row.bondId}
                    className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
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
                            {row.bondType || "Government Bond"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {row.purchaseDate || "01/01/2024"}
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
                            {displayRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Interest</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {interestAccrued.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Principal</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {totalInvestment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Units Held</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.total.toLocaleString()}
                            <span className="text-xs text-gray-500 ml-1">units</span>
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

                    {/* IMPROVED Actions Section */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </button>
                      
                      {/* IMPROVED Sell Button */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openSellModal(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold
                         text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                         shadow-md hover:shadow-md focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                         transition-all duration-200 border border-red-600/20"
                        disabled={row.disabled}
                        aria-disabled={row.disabled || undefined}
                      >
                        <IoStorefrontOutline className="w-3.5 h-3.5" />
                        Sell
                      </motion.button>
                      
                      {/* IMPROVED Redeem Button */}
                      <button
                        type="button"
                        onClick={() => handleRedeem(row)}
                        disabled={redeemDisabled}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-all duration-200 ${
                          redeemDisabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                            : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-md"
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

        {/* Slide-over details modal - FIXED LARGER BUTTONS */}
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
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-gray-200 shadow-xl p-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <div className="space-y-5 pt-2">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bond Details
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedRow.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedRow.bondType || "Government Bond"} · Purchased on{" "}
                        {selectedRow.purchaseDate || "01/01/2024"}
                      </p>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Coupon Rate</p>
                      <p className="text-gray-900 font-semibold">
                        {formatRateForDisplay(selectedRow.ratePct)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Earned</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {calculateInterestAccrued(selectedRow).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Principal</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {calculateTotalInvestment(selectedRow).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Face Value</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {(selectedRow.faceValue || selectedRow.total * 100).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Units Held</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedRow.total.toLocaleString()} units
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
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                    <div className="flex items-start gap-2">
                      <IoTimeOutline className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">
                          How redemption works
                        </p>
                        <p className="text-sm">
                          Once this bond reaches maturity, your principal and
                          final coupon are eligible for redemption. The{" "}
                          <span className="font-semibold">Redeem</span> button
                          will be enabled and the transaction will be processed
                          on-chain via the RSEB tokenization platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FIXED: LARGER Footer actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Close
                    </button>
                    
                    {/* FIXED: LARGER Sell Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openSellModal(selectedRow)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold
                       text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                       shadow-md hover:shadow-lg focus:outline-none disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 border border-red-600/20 px-4 py-3"
                      disabled={selectedRow.disabled}
                      aria-disabled={selectedRow.disabled || undefined}
                    >
                      <IoStorefrontOutline className="w-4 h-4" />
                      Sell Units
                    </motion.button>
                    
                    {/* FIXED: LARGER Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(selectedRow)}
                      disabled={
                        !isMatured(selectedRow.maturity) || selectedRow.disabled
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-200 ${
                        !isMatured(selectedRow.maturity) ||
                        selectedRow.disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                          : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-lg"
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