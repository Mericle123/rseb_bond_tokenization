"use client";

import {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  IoDocumentTextOutline, 
  IoSearch, 
  IoFilter,
  IoClose,
  IoCheckmarkCircle,
  IoInformationCircle,
  IoAlertCircle,
  IoWallet,
  IoTrendingUp,
  IoStatsChart
} from "react-icons/io5";

import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import WalletSection from "@/Components/Coin";
import { fetchBonds } from "@/server/bond/creation";
import { Market } from "@prisma/client";
import { useCurrentUser } from "@/context/UserContext";
import { fetchResaleBonds } from "@/server/db_actions/action";

// ========================= Types =========================

type Status = "up" | "down" | "flat";

interface Bond {
  id: string;
  bond_name: string;
  interest_rate: string;
  tl_unit_offered: number;
  tl_unit_subscribed: number;
  listing_onchain?: Number;
  face_value: bigint;
  market: Market;
  status?: Status;
  disabled?: boolean;
}

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}

// ========================= Motion presets =========================

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const notificationVariants = {
  hidden: { opacity: 0, x: 300, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
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
    x: 300,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
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

// ========================= Number formatters =========================

const nfInt = new Intl.NumberFormat("en-IN");
const nfCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "BTN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

// ========================= Helper Functions =========================

const safeBigIntToNumber = (value: bigint): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    console.warn('BigInt value exceeds safe integer range, truncating');
    return Number(value) / 10;
  }
  return Number(value);
};

const formatBigIntCurrency = (value: bigint): string => {
  const numberValue = safeBigIntToNumber(value);
  return nfCurrency.format(numberValue);
};

// ========================= Notification System =========================

function NotificationSystem({ 
  notifications, 
  onRemove 
}: { 
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <button
              onClick={() => onRemove(notification.id)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IoClose className="w-4 h-4 text-gray-400" />
            </button>
            
            <div className="flex items-start gap-3 pr-6">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                notification.type === "success" ? "bg-emerald-100 text-emerald-600" :
                notification.type === "error" ? "bg-red-100 text-red-600" :
                notification.type === "warning" ? "bg-amber-100 text-amber-600" :
                "bg-blue-100 text-blue-600"
              }`}>
                {notification.type === "success" && <IoCheckmarkCircle className="w-4 h-4" />}
                {notification.type === "error" && <IoAlertCircle className="w-4 h-4" />}
                {notification.type === "warning" && <IoAlertCircle className="w-4 h-4" />}
                {notification.type === "info" && <IoInformationCircle className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ========================= Negotiation Modal Component - EXACT DESIGN FROM IMAGE =========================

function NegotiationModal({
  bond,
  isOpen,
  onClose,
  onConfirm
}: {
  bond: Bond;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (offerData: any) => Promise<void>;
}) {
  const [proposedInterestRate, setProposedInterestRate] = useState("");
  const [negotiationLoading, setNegotiationLoading] = useState(false);

  if (!bond || !isOpen) return null;

  const baseRatePct = parseFloat(bond.interest_rate);
  const proposedRatePct = parseFloat(proposedInterestRate) || baseRatePct;
  
  const interestDifference = proposedRatePct - baseRatePct;
  const isValid = proposedInterestRate !== "" && 
                  proposedRatePct >= baseRatePct - 0.2 && 
                  proposedRatePct <= baseRatePct + 0.2;

  const resetModal = () => {
    setProposedInterestRate("");
    setNegotiationLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    
    try {
      setNegotiationLoading(true);
      
      const offerData = {
        bondId: bond.id,
        bondName: bond.bond_name,
        proposedInterestRate: proposedRatePct,
        baseInterestRate: baseRatePct,
        interestDifference: interestDifference
      };

      await onConfirm(offerData);
      handleClose();
    } catch (error) {
      console.error("Negotiation failed:", error);
    } finally {
      setNegotiationLoading(false);
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
                <div className="relative p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <IoClose className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <IoTrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Negotiate Price
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Propose a better price for {bond.bond_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {/* Bond Info Card */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
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
                          <h3 className="font-semibold text-gray-900">{bond.bond_name}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <span>• {baseRatePct}% / yr (current)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Available Units</p>
                        <p className="font-semibold text-gray-900">{bond.tl_unit_offered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Price/Unit</p>
                        <p className="font-semibold text-gray-900">BTN Nu 300.066</p>
                      </div>
                    </div>
                  </div>

                  {/* Proposed Interest Rate Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposed Interest Rate (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={baseRatePct - 0.2}
                          max={baseRatePct + 0.2}
                          step="0.01"
                          value={proposedInterestRate}
                          onChange={(e) => setProposedInterestRate(e.target.value)}
                          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder={baseRatePct.toString()}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: {(baseRatePct - 0.2).toFixed(2)}%</span>
                        <span>Current: {baseRatePct}%</span>
                        <span>Max: {(baseRatePct + 0.2).toFixed(2)}%</span>
                      </div>
                    </div>

                    {/* Interest Rate Slider */}
                    <div className="mt-4">
                      <input
                        type="range"
                        min={baseRatePct - 0.2}
                        max={baseRatePct + 0.2}
                        step="0.01"
                        value={proposedInterestRate || baseRatePct}
                        onChange={(e) => setProposedInterestRate(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer interest-slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-0.2%</span>
                        <span className="font-semibold">
                          {interestDifference > 0 ? '+' : ''}{interestDifference.toFixed(2)}%
                        </span>
                        <span>+0.2%</span>
                      </div>
                      <div className="text-center text-sm mt-2">
                        <span className="text-gray-600">Proposed Rate: </span>
                        <span className="font-semibold text-gray-900">
                          {proposedRatePct.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Rules Info */}
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <div className="flex items-center gap-2">
                        <IoInformationCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Negotiation Rules</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        You can adjust the interest rate by ±0.2%. The seller will review your offer and can accept, reject, or counter-offer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!isValid || negotiationLoading}
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {negotiationLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Custom slider styles */}
                <style jsx>{`
                  .interest-slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  }
                  
                  .interest-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================= Original Loading Animation =========================

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="container_SevMini">
        <div className="SevMini">
          <svg
            width="74"
            height="90"
            viewBox="0 0 74 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 76.5L72 57V69.8615C72 70.5673 71.628 71.2209 71.0211 71.5812L40 90V76.5Z"
              fill="#396CAA"
            ></path>
            <path
              d="M34 75.7077L2 57V69.8615C2 70.5673 2.37203 71.2209 2.97892 71.5812L34 90V75.7077Z"
              fill="#396DAC"
            ></path>
            <path d="M34 76.5H40V90H34V76.5Z" fill="#396CAA"></path>
            <path
              d="M3.27905 55.593L35.2806 37.5438C36.3478 36.9419 37.6522 36.9419 38.7194 37.5438L70.721 55.593C71.7294 56.1618 71.7406 57.6102 70.7411 58.1945L39.2712 76.593C37.8682 77.4133 36.1318 77.4133 34.7288 76.593L3.25887 58.1945C2.25937 57.6102 2.27061 56.1618 3.27905 55.593Z"
              fill="#163C79"
              stroke="#396CAA"
            ></path>
            <path
              d="M40 79L72 60V70.4001C72 71.1151 71.6183 71.7758 70.9987 72.1329L40 90V79Z"
              fill="#173D7A"
            ></path>
            <path d="M34 79L3 61V71.5751L34 90V79Z" fill="#0665B2"></path>
            <path
              id="strobe_color1"
              d="M58 72.5L60.5 71V74L58 75.5V72.5Z"
              fill="#FF715E"
            ></path>
            <path
              id="strobe_color2"
              d="M63 69.5L65.5 68V71L63 72.5V69.5Z"
              fill="#17e300b4"
            ></path>
            <path d="M68 66.5L70.5 65V68L68 69.5V66.5Z" fill="#FF715E"></path>
            <path
              d="M40 58.5L72 39V51.8615C72 52.5673 71.628 53.2209 71.0211 53.5812L40 72V58.5Z"
              fill="#396CAA"
            ></path>
            <path
              d="M34 57.7077L2 39V51.8615C2 52.5673 2.37203 53.2209 2.97892 53.5812L34 72V57.7077Z"
              fill="#396DAC"
            ></path>
            <path d="M34 58.5H40V72H34V58.5Z" fill="#396CAA"></path>
            <path
              d="M3.27905 37.593L35.2806 19.5438C36.3478 18.9419 37.6522 18.9419 38.7194 19.5438L70.721 37.593C71.7294 38.1618 71.7406 39.6102 70.7411 40.1945L39.2712 58.593C37.8682 59.4133 36.1318 59.4133 34.7288 58.593L3.25887 40.1945C2.25937 39.6102 2.27061 38.1618 3.27905 37.593Z"
              fill="#163C79"
              stroke="#396CAA"
            ></path>
            <path
              d="M40 61L72 42V52.4001C72 53.1151 71.6183 53.7758 70.9987 54.1329L40 72V61Z"
              fill="#173D7A"
            ></path>
            <path d="M34 61L3 43V53.5751L34 72V61Z" fill="#0665B2"></path>
            <path d="M58 54.5L60.5 53V56L58 57.5V54.5Z" fill="#FF715E"></path>
            <path d="M63 51.5L65.5 50V53L63 54.5V51.5Z" fill="black"></path>
            <path
              id="strobe_color1"
              d="M63 51.5L65.5 50V53L63 54.5V51.5Z"
              fill="#FF715E"
            ></path>
            <path d="M68 48.5L70.5 47V50L68 51.5V48.5Z" fill="#FF715E"></path>
            <path
              d="M40 40.5L72 21V33.8615C72 34.5673 71.628 35.2209 71.0211 35.5812L40 54V40.5Z"
              fill="#396CAA"
            ></path>
            <path
              d="M34 39.7077L2 21V33.8615C2 34.5673 2.37203 35.2209 2.97892 35.5812L34 54V39.7077Z"
              fill="#396DAC"
            ></path>
            <path d="M34 40.5H40V54H34V40.5Z" fill="#396CAA"></path>
            <path
              d="M3.27905 19.593L35.2806 1.54381C36.3478 0.941872 37.6522 0.941872 38.7194 1.54381L70.721 19.593C71.7294 20.1618 71.7406 21.6102 70.7411 22.1945L39.2712 40.593C37.8682 41.4133 36.1318 41.4133 34.7288 40.593L3.25887 22.1945C2.25937 21.6102 2.27061 20.1618 3.27905 19.593Z"
              fill="#124E89"
              stroke="#396CAA"
            ></path>
            <path
              d="M40 43L72 24V34.4001C72 35.1151 71.6183 35.7758 70.9987 36.1329L40 54V43Z"
              fill="#173D7A"
            ></path>
            <path d="M34 43L3 25V35.5751L34 54V43Z" fill="#0665B2"></path>
            <path d="M68 30.5L70.5 29V32L68 33.5V30.5Z" fill="#FF715E"></path>
            <path
              id="strobe_color3"
              d="M58 36.5L60.5 35V38L58 39.5V36.5Z"
              fill="#FF715E"
            ></path>
            <path d="M63 33.5L65.5 32V35L63 36.5V33.5Z" fill="#FF715E"></path>
            <path
              d="M20.1902 22.0719C18.8101 21.3026 18.8252 19.3119 20.2168 18.5636L36.1054 10.0189C37.2884 9.3827 38.7116 9.3827 39.8946 10.0189L55.7832 18.5636C57.1748 19.3119 57.1899 21.3026 55.8098 22.0719L40.4345 30.6429C38.9211 31.4865 37.0789 31.4865 35.5655 30.6429L20.1902 22.0719Z"
              fill="#396CAA"
            ></path>
            <path
              d="M11 52.755C11 51.9801 11.8432 51.4997 12.5098 51.8947L23.5196 58.419C24.1273 58.7792 24.5 59.4332 24.5 60.1396V60.245C24.5 61.0199 23.6568 61.5003 22.9902 61.1053L11.9804 54.581C11.3727 54.2208 11 53.5668 11 52.8604V52.755Z"
              fill="#396CAA"
            ></path>
            <mask
              id="mask0_2_176"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="11"
              y="51"
              width="14"
              height="11"
            >
              <path
                d="M11 52.755C11 51.9801 11.8432 51.4997 12.5098 51.8947L23.5196 58.419C24.1273 58.7792 24.5 59.4332 24.5 60.1396V60.245C24.5 61.0199 23.6568 61.5003 22.9902 61.1053L11.9804 54.581C11.3727 54.2208 11 53.5668 11 52.8604V52.755Z"
                fill="#396CAA"
              ></path>
            </mask>
            <g mask="url(#mask0_2_176)">
              <path
                d="M11.5 52.7417C11.5 51.9803 12.3349 51.5138 12.9833 51.9128L23.5482 58.4143C24.1397 58.7783 24.5 59.4231 24.5 60.1176V61.5L12.4598 54.4195C11.8651 54.0698 11.5 53.4315 11.5 52.7417V52.7417Z"
                fill="#163874"
              ></path>
            </g>
            <mask
              id="mask1_2_176"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="19"
              y="9"
              width="38"
              height="23"
            >
              <path
                d="M20.1902 22.0719C18.8101 21.3026 18.8252 19.3119 20.2168 18.5636L36.1054 10.0189C37.2884 9.3827 38.7116 9.3827 39.8946 10.0189L55.7832 18.5636C57.1748 19.3119 57.1899 21.3026 55.8098 22.0719L40.4345 30.6429C38.9211 31.4865 37.0789 31.4865 35.5655 30.6429L20.1902 22.0719Z"
                fill="#396CAA"
              ></path>
            </mask>
            <g mask="url(#mask1_2_176)">
              <path
                d="M18 21.3115L36.167 11.9451C37.3171 11.3521 38.6829 11.3521 39.833 11.9451L58 21.3115L40.3567 30.7405C38.8841 31.5275 37.1159 31.5275 35.6433 30.7405L18 21.3115Z"
                fill="#173D7A"
              ></path>
            </g>
            <path
              d="M37.447 21.565L35 19.9799L37.6941 18.66L40.141 20.245L37.447 21.565Z"
              fill="#FF715E"
            ></path>
            <path
              d="M48.9738 30.8646L47.0741 29.7745L49.1792 28.684L51.0789 29.7741L48.9738 30.8646Z"
              fill="#173E7B"
            ></path>
            <path
              d="M52.0661 29.0093L50.1635 27.9242L52.2657 26.8282L54.1682 27.9133L52.0661 29.0093Z"
              fill="#173E7B"
            ></path>
            <path
              id="strobe_led1"
              d="M55.1521 27.1464L53.2538 26.054L55.3602 24.9661L57.2585 26.0586L55.1521 27.1464Z"
              fill="#3A6DAB"
            ></path>
          </svg>
        </div>
        <div className="Ghost">
          <svg
            width="60"
            height="36"
            viewBox="0 0 60 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.96545 19.4296C0.643777 18.6484 0.658726 16.7309 1.99242 15.9705L28.0186 1.12982C29.2467 0.429534 30.7533 0.429533 31.9814 1.12982L58.0076 15.9704C59.3413 16.7309 59.3562 18.6484 58.0346 19.4296L32.5442 34.4962C30.9749 35.4238 29.0251 35.4238 27.4558 34.4962L1.96545 19.4296Z"
              fill="#3C4F6D"
            ></path>
          </svg>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 mt-6">Loading marketplace...</p>
      <p className="text-gray-500 text-sm mt-2">Fetching the latest bond offerings</p>

      <style jsx>{`
        .container_SevMini {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .Ghost {
          transform: translate(0px, -25px);
          z-index: -1;
          animation: opacidad 4s infinite ease-in-out;
        }

        @keyframes opacidad {
          0% {
            opacity: 1;
            scale: 1;
          }

          50% {
            opacity: 0.5;
            scale: 0.9;
          }

          100% {
            opacity: 1;
            scale: 1;
          }
        }

        @keyframes estroboscopico {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          51% {
            opacity: 1;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes rebote {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes estroboscopico1 {
          0%,
          50%,
          100% {
            fill: rgb(255, 95, 74);
          }

          25%,
          75% {
            fill: rgb(16, 53, 115);
          }
        }

        @keyframes estroboscopico2 {
          0%,
          50%,
          100% {
            fill: #17e300;
          }

          25%,
          75% {
            fill: #17e300b4;
          }
        }

        .SevMini {
          animation: rebote 4s infinite ease-in-out;
        }

        #strobe_led1 {
          animation: estroboscopico 0.5s infinite;
        }

        #strobe_color1 {
          animation: estroboscopico2 0.8s infinite;
        }

        #strobe_color3 {
          animation: estroboscopico1 0.8s infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}

// ========================= Filter & Sort Component =========================

function FilterSortBar({ 
  onFilterChange, 
  activeFilter,
  onClose
}: {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  onClose: () => void;
}) {
  const filters = [
    { key: "all", label: "All Bonds" },
    { key: "up", label: "High Interest" },
    { key: "down", label: "Low Interest" },
    { key: "flat", label: "Stable" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Filter by Status</span>
      </div>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => {
            onFilterChange(filter.key);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
            activeFilter === filter.key
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            filter.key === "all" ? "bg-gray-400" :
            filter.key === "up" ? "bg-emerald-500" :
            filter.key === "down" ? "bg-red-500" : "bg-amber-500"
          }`} />
          <span>{filter.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ========================= Component =========================

const PAGE_SIZE = 10;

export default function InvestorPage() {
  const currentUser = useCurrentUser();

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [currentBonds, setCurrentBonds] = useState<Bond[]>([]);
  const [resaleBonds, setResaleBonds] = useState<Bond[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [negotiationModal, setNegotiationModal] = useState<{ isOpen: boolean; bond: Bond | null }>({
    isOpen: false,
    bond: null
  });

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Market>("current");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const walletAddress = currentUser?.wallet_address;
  const mnemonics = currentUser?.hashed_mnemonics;
  const [resaleLoading, setResaleLoading] = useState(false);

  // Notification system
  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Negotiation handlers
  const openNegotiationModal = (bond: Bond) => {
    setNegotiationModal({ isOpen: true, bond });
  };

  const closeNegotiationModal = () => {
    setNegotiationModal({ isOpen: false, bond: null });
  };

  const handleNegotiationConfirm = async (offerData: any) => {
    // Implement your negotiation logic here
    console.log("Negotiation offer:", offerData);
    // await createNegotiationOffer(offerData);
    
    addNotification({
      type: "success",
      title: "Offer Sent",
      message: `Interest rate proposal sent for ${offerData.bondName}`
    });
  };

  // -------- Load one page of bonds --------
  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (loadingMore && pageToLoad !== 1) return;
      try {
        if (pageToLoad === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        const data = await fetchBonds(pageToLoad, PAGE_SIZE, false);

        if (pageToLoad === 1) {
          setCurrentBonds(data || []);
          addNotification({
            type: "success",
            title: "Marketplace Loaded",
            message: `Found ${data?.length || 0} current bond offerings`
          });
        } else {
          setCurrentBonds((prev) => [...prev, ...(data || [])]);
        }

        setHasMore((data?.length ?? 0) === PAGE_SIZE);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Error fetching bonds:", error);
        addNotification({
          type: "error",
          title: "Loading Failed",
          message: "Unable to fetch bond offerings. Please try again."
        });
      } finally {
        if (pageToLoad === 1) {
          setInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [loadingMore, addNotification]
  );

  // Initial load
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Memoized derived data (search + tab filter + status filter)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = activeTab === "current" ? currentBonds : resaleBonds;

    let filteredData = source;
    
    if (q) {
      filteredData = filteredData.filter((b) =>
        b.bond_name.toLowerCase().includes(q)
      );
    }
    
    if (activeFilter !== "all") {
      filteredData = filteredData.filter((b) => b.status === activeFilter);
    }
    
    return filteredData;
  }, [currentBonds, resaleBonds, activeTab, query, activeFilter]);

  const counts = useMemo(
    () => ({
      current: currentBonds.length,
      resale: resaleBonds.length,
    }),
    [currentBonds, resaleBonds]
  );

  // Calculate statistics safely
  const stats = useMemo(() => {
    if (filtered.length === 0) return null;

    const totalFaceValue = filtered.reduce((sum, bond) => {
      return sum + safeBigIntToNumber(bond.face_value);
    }, 0);

    const avgFaceValue = totalFaceValue / filtered.length;
    const totalUnits = filtered.reduce((sum, bond) => sum + bond.tl_unit_offered, 0);
    const avgInterest = filtered.reduce((sum, bond) => sum + parseFloat(bond.interest_rate), 0) / filtered.length;

    return {
      totalOfferings: filtered.length,
      avgInterest,
      totalUnits,
      avgFaceValue
    };
  }, [filtered]);

  useEffect(() => {
    if (activeTab !== "resale") return;
    if (resaleBonds.length > 0) return;

    (async () => {
      try {
        setResaleLoading(true);
        const data = await fetchResaleBonds(1, PAGE_SIZE);
        const mapped: Bond[] = (data || []).map((l) => ({
          id: l.id,
          bond_name: l.bond_name,
          interest_rate: l.interest_rate,
          tl_unit_offered: l.tl_unit_subscribed,
          listing_onchain: l.listing_onchain,
          tl_unit_subscribed: l.tl_unit_subscribed,
          face_value: BigInt(l.face_value || 0),
          market: "resale",
        }));
        setResaleBonds(mapped);
        addNotification({
          type: "success",
          title: "Resale Market Loaded",
          message: `Found ${mapped.length} resale listings`
        });
      } catch (e) {
        console.error("Error fetching resale bonds:", e);
        addNotification({
          type: "error",
          title: "Resale Load Failed",
          message: "Unable to fetch resale listings"
        });
      } finally {
        setResaleLoading(false);
      }
    })();
  }, [activeTab, resaleBonds.length, addNotification]);

  // -------- IntersectionObserver for lazy loading --------
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (initialLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadPage(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [initialLoading, hasMore, loadingMore, loadPage, page]
  );

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========================= Render =========================

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <motion.header {...fadeIn} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Investor Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Manage your investments and explore market opportunities
          </p>
        </motion.header>

        {/* Wallet Summary */}
        <WalletSection walletAddress={walletAddress} mnemonics={mnemonics} />

        {/* ======================= Tokens Available ======================= */}
        <section className="w-full mt-10" aria-labelledby="tokens-title">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div>
                <h2
                  id="tokens-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
                >
                  Bond Marketplace
                </h2>
                <p className="mt-2 text-sm text-gray-600 max-w-3xl">
                  Discover and invest in government bonds listed on the Royal Securities Exchange of Bhutan
                </p>
                
                {/* Active Filter Badge */}
                {activeFilter !== "all" && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-gray-600">Active filter:</span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <span>
                        {activeFilter === "all" ? "All Bonds" : 
                         activeFilter === "up" ? "High Interest" : 
                         activeFilter === "down" ? "Low Interest" : "Stable"}
                      </span>
                      <button
                        onClick={() => setActiveFilter("all")}
                        className="hover:text-blue-900"
                        aria-label="Clear filter"
                      >
                        <IoClose className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 min-w-0">
                  <label htmlFor="search" className="sr-only">
                    Search bonds
                  </label>
                  <div className="relative">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="search"
                      type="search"
                      enterKeyHint="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      placeholder="Search bonds..."
                    />
                  </div>
                </div>
                
                {/* Filter Button with Dropdown */}
                <div className="filter-dropdown-container relative">
                  <button 
                    className="h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center sm:justify-start"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    aria-expanded={showFilterDropdown}
                    aria-haspopup="true"
                  >
                    <IoFilter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter</span>
                  </button>
                  
                  <AnimatePresence>
                    {showFilterDropdown && (
                      <FilterSortBar
                        onFilterChange={setActiveFilter}
                        activeFilter={activeFilter}
                        onClose={() => setShowFilterDropdown(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            {stats && (
              <motion.div 
                {...fadeIn}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total {activeTab === "current" ? "Offerings" : "Listings"}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalOfferings}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <IoDocumentTextOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Interest</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                        {stats.avgInterest.toFixed(2)}%
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <IoTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                        {stats.totalUnits.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <IoStatsChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Face Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                        {nfCurrency.format(stats.avgFaceValue)}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <IoWallet className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <div
                role="tablist"
                aria-label="Bond markets"
                className="flex gap-1"
              >
                <TabButton
                  id="tab-current"
                  active={activeTab === "current"}
                  onClick={() => setActiveTab("current")}
                  badge={counts.current}
                  loading={initialLoading && activeTab === "current"}
                >
                  Current Offerings
                </TabButton>
                <TabButton
                  id="tab-resale"
                  active={activeTab === "resale"}
                  onClick={() => setActiveTab("resale")}
                  badge={counts.resale}
                  loading={resaleLoading && activeTab === "resale"}
                >
                  Resale Market
                </TabButton>
              </div>
            </div>

            {/* Loading State - USING ORIGINAL ANIMATION */}
            {(initialLoading && activeTab === "current") || (resaleLoading && activeTab === "resale") ? (
              <LoadingAnimation />
            ) : (
              <>
                {/* Empty search state */}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IoDocumentTextOutline className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {activeTab === "current" ? "current offerings" : "resale listings"} found
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                      {query || activeFilter !== "all"
                        ? `No ${activeTab === "current" ? "offerings" : "listings"} match your current filters.`
                        : `No ${activeTab === "current" ? "bond offerings" : "resale listings"} available at the moment.`
                      }
                    </p>
                    {(query || activeFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setActiveFilter("all");
                        }}
                        className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Desktop Table */}
                {filtered.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hidden lg:block"
                  >
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50/80">
                        <tr>
                          <th scope="col" className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                            Bond Details
                          </th>
                          <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                            Interest Rate
                          </th>
                          <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                            Total Units
                          </th>
                          <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                            Available
                          </th>
                          <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                            Face Value
                          </th>
                          <th scope="col" className="py-4 pl-4 pr-6 text-left text-sm font-semibold text-gray-900">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filtered.map((bond, index) => {
                          const isLast = activeTab === "current" && index === filtered.length - 1;
                          return (
                            <BondRow
                              key={bond.id}
                              bond={bond}
                              variant={activeTab === "current" ? "primary" : "resale"}
                              ref={isLast ? lastRowRef : undefined}
                            />
                          );
                        })}
                      </tbody>
                    </table>

                    {loadingMore && (
                      <div className="py-6 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-4 h-4 border-2 border-[#5B50D9] border-t-transparent rounded-full animate-spin"></div>
                          Loading more bonds...
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Mobile Cards */}
                {filtered.length > 0 && (
                  <div className="mt-6 lg:hidden space-y-4">
                    {filtered.map((bond, index) => {
                      const isLast = activeTab === "current" && index === filtered.length - 1;
                      return (
                        <MobileBondCard
                          key={bond.id}
                          bond={bond}
                          variant={activeTab === "current" ? "primary" : "resale"}
                          ref={isLast ? lastRowRef : undefined}
                        />
                      );
                    })}

                    {loadingMore && (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-4 h-4 border-2 border-[#5B50D9] border-t-transparent rounded-full animate-spin"></div>
                          Loading more...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Negotiation Modal */}
        <NegotiationModal
          bond={negotiationModal.bond!}
          isOpen={negotiationModal.isOpen}
          onClose={closeNegotiationModal}
          onConfirm={handleNegotiationConfirm}
        />
      </main>
    </div>
  );
}

// ========================= Subcomponents =========================

function TabButton({
  id,
  active,
  onClick,
  children,
  badge,
  loading = false,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
  loading?: boolean;
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative inline-flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors rounded-t-lg ${
        active
          ? "text-[#5B50D9] border-b-2 border-[#5B50D9] bg-white"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span>{children}</span>
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        typeof badge === "number" && (
          <span
            className={`inline-flex items-center justify-center text-xs font-medium rounded-full px-2 py-1 min-w-6 ${
              active
                ? "bg-[#5B50D9]/10 text-[#5B50D9]"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {badge}
          </span>
        )
      )}
    </button>
  );
}

const BondRow = forwardRef<
  HTMLTableRowElement,
  { 
    bond: Bond; 
    variant: "primary" | "resale";
  }
>(({ bond, variant }, ref) => {
  const dim = bond.disabled ? "text-gray-300" : "text-gray-900";
  const rateCol = bond.disabled
    ? "text-gray-300"
    : "text-emerald-600";

  // Calculate subscription percentage and determine color
  const subscribed = Number(bond.tl_unit_subscribed) / 10;
  const offered = Number(bond.tl_unit_offered) / 10;
  const subscriptionPercentage = (subscribed / offered) * 100;
  
  let progressBarColor = "#5B50D9"; // default purple
  if (subscriptionPercentage > 100) {
    progressBarColor = "#EF4444"; // red for over-subscribed
  } else if (subscriptionPercentage === 100) {
    progressBarColor = "#10B981"; // green for exactly subscribed
  }

  return (
    <tr 
      ref={ref} 
      className="group hover:bg-gray-50/50 transition-colors"
    >
      {/* Bond + status dot */}
      <td className="py-5 pl-6 pr-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="relative h-12 w-12 rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
              <Image
                src="/RSEB.png"
                alt="RSEB logo"
                width={24}
                height={24}
                className={`object-contain ${bond.disabled ? "opacity-40" : ""}`}
              />
            </div>
            <span
              aria-hidden="true"
              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white ${
                bond.status === "up"
                  ? "bg-emerald-500"
                  : bond.status === "down"
                    ? "bg-red-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
          <div>
            <span className={`text-base font-semibold ${dim} block`}>
              {bond.bond_name}
            </span>
            <span className={`text-sm ${bond.disabled ? "text-gray-300" : "text-gray-500"} mt-0.5 block`}>
              {variant === "primary" ? "Primary Offering" : "Resale Listing"}
            </span>
          </div>
        </div>
      </td>

      {/* Interest rate */}
      <td className="py-5 px-4">
        <div className={`text-lg font-bold ${rateCol}`}>
          {bond.interest_rate}%
        </div>
        <div className="text-xs text-gray-500 mt-0.5">per annum</div>
      </td>

      {/* Different middle columns depending on tab */}
      {variant === "primary" ? (
        <>
          {/* Total units offered */}
          <td className="py-5 px-4">
            <div className={`text-base font-medium ${dim}`}>
              {nfInt.format(offered)}
            </div>
          </td>
          {/* Subscribed / Offered */}
          <td className="py-5 px-4">
            <div className={`text-base font-medium ${dim}`}>
              {nfInt.format(subscribed)}
              <span className="text-sm text-gray-500 font-normal ml-1">
                / {nfInt.format(offered)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="h-1.5 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${Math.min(100, subscriptionPercentage)}%`,
                  backgroundColor: progressBarColor
                }}
              />
            </div>
          </td>
        </>
      ) : (
        <>
          {/* For resale */}
          <td className="py-5 px-4">
            <div className={`text-base font-medium ${dim}`}>
              {nfInt.format(bond.tl_unit_offered)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">units listed</div>
          </td>
          <td className="py-5 px-4">
            <div className={`text-base font-medium ${dim}`}>
              {nfInt.format(bond.tl_unit_offered)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">available</div>
          </td>
        </>
      )}

      {/* Face value */}
      <td className="py-5 px-4">
        <div className={`text-base font-bold ${dim}`}>
          {formatBigIntCurrency(bond.face_value)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">per unit</div>
      </td>

      {/* Action */}
      <td className="py-5 pl-4 pr-6">
        <Link 
          href={variant === "primary" 
            ? `/investor/AboutBond/${bond.id}`
            : `/investor/resale/${bond.id}`
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#5B50D9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm hover:shadow-md"
        >
          <IoDocumentTextOutline className="w-4 h-4" />
          {variant === "primary" ? "View Details" : "View Listing"}
        </Link>
      </td>
    </tr>
  );
});

BondRow.displayName = "BondRow";

const MobileBondCard = forwardRef<
  HTMLDivElement,
  { 
    bond: Bond; 
    variant: "primary" | "resale";
  }
>(({ bond, variant }, ref) => {
  const dim = bond.disabled ? "text-gray-300" : "text-gray-900";
  const rateCol = bond.disabled ? "text-gray-300" : "text-emerald-600";

  // Calculate subscription percentage and determine color
  const subscribed = Number(bond.tl_unit_subscribed) / 10;
  const offered = Number(bond.tl_unit_offered) / 10;
  const subscriptionPercentage = (subscribed / offered) * 100;
  
  let progressBarColor = "#5B50D9"; // default purple
  if (subscriptionPercentage > 100) {
    progressBarColor = "#EF4444"; // red for over-subscribed
  } else if (subscriptionPercentage === 100) {
    progressBarColor = "#10B981"; // green for exactly subscribed
  }

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative h-12 w-12 rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm">
              <Image
                src="/RSEB.png"
                alt="RSEB logo"
                width={24}
                height={24}
                className={`object-contain ${bond.disabled ? "opacity-40" : ""}`}
              />
            </div>
            <span
              aria-hidden="true"
              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white ${
                bond.status === "up"
                  ? "bg-emerald-500"
                  : bond.status === "down"
                    ? "bg-red-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${dim}`}>
              {bond.bond_name}
            </h3>
            <p className="text-sm text-gray-500">
              {variant === "primary" ? "Primary Offering" : "Resale Listing"}
            </p>
          </div>
        </div>
        <div className={`text-lg font-bold ${rateCol}`}>
          {bond.interest_rate}%
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {variant === "primary" ? (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Total Units</p>
              <p className={`text-base font-semibold ${dim}`}>
                {nfInt.format(offered)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Subscribed</p>
              <p className={`text-base font-semibold ${dim}`}>
                {nfInt.format(subscribed)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, subscriptionPercentage)}%`,
                    backgroundColor: progressBarColor
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Units Listed</p>
              <p className={`text-base font-semibold ${dim}`}>
                {nfInt.format(bond.tl_unit_offered)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Available</p>
              <p className={`text-base font-semibold ${dim}`}>
                {nfInt.format(bond.tl_unit_offered)}
              </p>
            </div>
          </>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">Face Value</p>
          <p className={`text-base font-bold ${dim}`}>
            {formatBigIntCurrency(bond.face_value)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-gray-100">
        <Link 
          href={variant === "primary" 
            ? `/investor/AboutBond/${bond.id}`
            : `/investor/resale/${bond.id}`
          }
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B50D9] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm"
        >
          <IoDocumentTextOutline className="w-4 h-4" />
          {variant === "primary" ? "View Bond Details" : "View Resale Listing"}
        </Link>
      </div>
    </div>
  );
});

MobileBondCard.displayName = "MobileBondCard";