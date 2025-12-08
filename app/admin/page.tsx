"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Icons
import { 
  IoSearch, 
  IoDocumentTextOutline, 
  IoCopyOutline, 
  IoCheckmark,
  IoFilter,
  IoAdd,
  IoStatsChart,
  IoWallet,
  IoChevronDown,
  IoRefresh,
  IoClose,
  IoCheckmarkCircle,
  IoInformationCircle,
  IoAlertCircle,
  IoTrendingUp,
  IoServer,
  IoChevronForward,
  IoChevronDownOutline,
  IoEyeOutline,
  IoLinkOutline,
  IoCalendarOutline
} from "react-icons/io5";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
// Logic
import { fetchBonds } from "@/server/bond/creation";
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "@/server/blockchain/btnc";

// ========================= Types =========================
interface Bond {
  id: string;
  bond_name: string;
  interest_rate: string;
  tl_unit_offered: number;
  created_at: string;
  status?: "active" | "completed" | "draft";
  transaction_type?: string;
  transaction_hash?: string;
  details?: string;
}

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}

interface TransactionDetail {
  type: string;
  value: string;
  subValue?: string;
  isHighlighted?: boolean;
}

interface TransactionSection {
  title: string;
  details: TransactionDetail[];
  isExpanded?: boolean;
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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
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

// ========================= Hash Details Modal =========================
function HashDetailsModal({ 
  bond, 
  isOpen, 
  onClose 
}: { 
  bond: Bond | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen || !bond) return null;

  const transactionData: TransactionSection[] = [
    {
      title: "Transaction Block Details",
      details: [
        { type: "Transaction Type", value: "ProgrammableTransaction" },
        { type: "Digest", value: bond.transaction_hash || "N/A", isHighlighted: true },
        { type: "Checkpoint Seq. Number", value: "269585109" },
        { type: "Timestamp", value: new Date(bond.created_at).toLocaleString() },
        { type: "Sender", value: "0x2c3e0e72c51179fceeb497fafe66605b18803ff112c3749b992c5c295e82b5eb", isHighlighted: true },
        { type: "Recipient", value: "0xd6b57889a695d0092c9393ee3c9da9f0a4e48460366f2892f7f4303bf65a29c8", isHighlighted: true },
        { type: "Total Gas Fee", value: "0.002398704 SUI", subValue: "2,398,704 MIST" },
        { type: "Gas Budget", value: "0.004376824 SUI", subValue: "4,376,824 MIST" },
      ]
    },
    {
      title: "Bond Details",
      details: [
        { type: "Bond Name", value: bond.bond_name },
        { type: "Interest Rate", value: `${bond.interest_rate}% / year` },
        { type: "Units Offered", value: (bond.tl_unit_offered / 10).toString() },
        { type: "Status", value: bond.status || "active" },
        { type: "Created", value: new Date(bond.created_at).toLocaleDateString() }
      ]
    }
  ];

  const handleCopyHash = () => {
    if (bond.transaction_hash) {
      navigator.clipboard.writeText(bond.transaction_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
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
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-2 bg-blue-100 rounded-lg sm:rounded-xl flex-shrink-0">
                    <IoLinkOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Transaction Details</h2>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">Hash information for {bond.bond_name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0"
                >
                  <IoClose className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Hash Display */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Transaction Hash</span>
                    <button
                      onClick={handleCopyHash}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        copiedHash 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copiedHash ? <IoCheckmark className="w-3 h-3 sm:w-4 h-4" /> : <IoCopyOutline className="w-3 h-3 sm:w-4 h-4" />}
                      {copiedHash ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                  <code className="text-xs sm:text-sm font-mono text-gray-900 break-all bg-white p-2 sm:p-3 rounded-lg border">
                    {bond.transaction_hash || "No transaction hash available"}
                  </code>
                </div>

                {/* Transaction Sections */}
                <div className="space-y-3 sm:space-y-4">
                  {transactionData.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{section.title}</h3>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {section.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-[120px] sm:min-w-[140px]">
                              {detail.type}
                            </span>
                            <div className="flex-1 text-right sm:text-left min-w-0">
                              <span className={`text-xs sm:text-sm break-all ${
                                detail.isHighlighted 
                                  ? 'text-blue-600 font-mono' 
                                  : 'text-gray-900'
                              }`}>
                                {detail.value}
                              </span>
                              {detail.subValue && (
                                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 break-all">{detail.subValue}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 text-sm sm:text-base mb-2 sm:mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap">
                      <IoEyeOutline className="w-3 h-3 sm:w-4 h-4 flex-shrink-0" />
                      <span>View on Explorer</span>
                    </button>
                    <button className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap">
                      <IoDocumentTextOutline className="w-3 h-3 sm:w-4 h-4 flex-shrink-0" />
                      <span>Export Details</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button className="px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base">
                  Save Details
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================= Networks Panel Component =========================
function NetworksPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [customNodeUrl, setCustomNodeUrl] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const handleNodeToggle = (nodeName: string) => {
    setSelectedNodes(prev =>
      prev.includes(nodeName)
        ? prev.filter(name => name !== nodeName)
        : [...prev, nodeName]
    );
  };

  const handleAddCustomNode = () => {
    if (customNodeUrl.trim()) {
      console.log('Adding custom node:', customNodeUrl);
      setCustomNodeUrl('');
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md mx-2 sm:mx-4"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <button
                    onClick={onClose}
                    className="absolute right-3 sm:right-4 top-3 sm:top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <IoClose className="w-4 h-4 sm:w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl flex-shrink-0">
                      <IoServer className="w-5 h-5 sm:w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Sui Networks
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                        Configure your network connections
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                  
                  {/* Mainnet Section */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Mainnet</h3>
                    <div className="bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">Testnet</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs text-green-600 font-medium bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap">active</span>
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4 space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-700">Dexnet</span>
                          <span className="text-xs text-green-600 font-medium bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap">active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testnet Section */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Testnet</h3>
                    <div className="bg-purple-50 rounded-lg sm:rounded-xl border border-purple-200 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Testnet</span>
                        <span className="text-xs text-green-600 font-medium bg-green-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap">active</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Nodes Section */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Custom Nodes</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        value={customNodeUrl}
                        onChange={(e) => setCustomNodeUrl(e.target.value)}
                        placeholder="Enter JSON RPC Link..."
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                      />
                      <button
                        onClick={handleAddCustomNode}
                        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] text-white font-medium rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
                      >
                        Add Custom Node
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 my-3 sm:my-4"></div>

                  {/* Public Nodes Section */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Public Nodes</h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        "Suiscan Mainnet Node",
                        "Suiscan Testnet Node", 
                        "Suiscan Devnet Node"
                      ].map((nodeName) => (
                        <label key={nodeName} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNodes.includes(nodeName)}
                            onChange={() => handleNodeToggle(nodeName)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{nodeName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        console.log('Selected nodes:', selectedNodes);
                        console.log('Custom node URL:', customNodeUrl);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] text-white font-medium rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================= Loading Animation =========================
function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F8FB] p-4">
      <div className="container_SevMini">
        <div className="SevMini">
          <svg
            id="svg_svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 477 578"
            height="578"
            width="477"
          >
            {/* SVG content remains the same */}
          </svg>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 mt-6">Loading Admin Dashboard...</p>
      <p className="text-gray-500 text-sm mt-2 text-center">Preparing your workspace</p>

      <style jsx>{`
        #svg_svg {
          zoom: 0.3;
        }
        .estrobo_animation {
          animation:
            floatAndBounce 4s infinite ease-in-out,
            strobe 0.8s infinite;
        }

        .estrobo_animationV2 {
          animation:
            floatAndBounce 4s infinite ease-in-out,
            strobev2 0.8s infinite;
        }

        #float_server {
          animation: floatAndBounce 4s infinite ease-in-out;
        }

        @keyframes floatAndBounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes strobe {
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

        @keyframes strobev2 {
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

        @keyframes animateGradient {
          0% {
            stop-color: #313f8773;
          }

          50% {
            stop-color: #040d3a;
          }

          100% {
            stop-color: #313f8773;
          }
        }

        #paint13_linear_163_1030 stop {
          animation: animateGradient 4s infinite alternate;
        }
      `}</style>
    </div>
  );
}

// ========================= Filter Dropdown =========================
function FilterDropdown({ 
  onFilterChange, 
  activeFilter,
  onClose 
}: {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  onClose: () => void;
}) {
  const filters = [
    { key: "all", label: "All Bonds", color: "gray" },
    { key: "active", label: "Active", color: "emerald" },
    { key: "completed", label: "Completed", color: "blue" },
    { key: "draft", label: "Drafts", color: "amber" }
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
            filter.key === "active" ? "bg-emerald-500" :
            filter.key === "completed" ? "bg-blue-500" : "bg-amber-500"
          }`} />
          <span>{filter.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ========================= Sort Dropdown =========================
function SortDropdown({ 
  onSortChange, 
  activeSort,
  onClose 
}: {
  onSortChange: (sort: string) => void;
  activeSort: string;
  onClose: () => void;
}) {
  const sortOptions = [
    { key: "latest", label: "Latest Created" },
    { key: "oldest", label: "Oldest Created" },
    { key: "a-z", label: "Name (A-Z)" },
    { key: "z-a", label: "Name (Z-A)" },
    { key: "interest-high", label: "Interest (High-Low)" },
    { key: "interest-low", label: "Interest (Low-High)" }
  ];

  const getSortIcon = (key: string) => {
    switch (key) {
      case "latest":
      case "oldest":
        return <IoCalendarOutline className="w-4 h-4" />;
      case "a-z":
      case "z-a":
        return <IoDocumentTextOutline className="w-4 h-4" />;
      case "interest-high":
      case "interest-low":
        return <IoTrendingUp className="w-4 h-4" />;
      default:
        return <IoCalendarOutline className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Sort by</span>
      </div>
      {sortOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => {
            onSortChange(option.key);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
            activeSort === option.key
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700"
          }`}
        >
          <div className="text-gray-500">
            {getSortIcon(option.key)}
          </div>
          <span>{option.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ========================= Network Status Indicator =========================
function NetworkStatusIndicator({ currentNetwork, onNetworkClick }: { 
  currentNetwork: string;
  onNetworkClick: () => void;
}) {
  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'mainnet': return 'bg-emerald-500';
      case 'testnet': return 'bg-blue-500';
      case 'devnet': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNetworkLabel = (network: string) => {
    switch (network) {
      case 'mainnet': return 'Mainnet';
      case 'testnet': return 'Testnet';
      case 'devnet': return 'Devnet';
      default: return network;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNetworkClick}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getNetworkColor(currentNetwork)}`}></div>
        <span className="text-sm font-medium">{getNetworkLabel(currentNetwork)}</span>
      </div>
      <IoServer className="w-4 h-4 text-blue-600" />
    </motion.button>
  );
}

export default function AdminHomePage() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  
  // --- STATE ---
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [networksOpen, setNetworksOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [hashModalOpen, setHashModalOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('testnet');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // --- LOADING STATES ---
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [bondsLoading, setBondsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [currentUser] = useState(useCurrentUser());
  const [walletAddress, setWalletAddress] = useState(currentUser.wallet_address);
  const [balance, setBalance] = useState<string | null>(null);

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const BONDS_PER_PAGE = 10;

  // --- NOTIFICATION SYSTEM ---
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

  // --- INITIAL LOADING EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // --- BALANCE EFFECT ---
  const loadBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalanceLoading(false);
      return;
    }
    setBalanceLoading(true);
    try {
      const data = await getBtncBalance({ address: walletAddress });
      setBalance(data.balanceHuman);
      setLastRefreshed(new Date());
      addNotification({
        type: "success",
        title: "Balance Updated",
        message: "Your balance has been refreshed successfully"
      });
    } catch (e) {
      console.error(e);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Unable to refresh balance"
      });
    } finally {
      setBalanceLoading(false);
    }
  }, [walletAddress, addNotification]);

  useEffect(() => {
    if (!initialLoading) {
      loadBalance();
    }
  }, [walletAddress, initialLoading, loadBalance]);

  // --- BONDS DATA FETCHING ---
  const loadBonds = async (pageNum: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setBondsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchBonds(pageNum, BONDS_PER_PAGE, false);
      
      const bondsWithTransactionData = data.map((bond: Bond) => ({
        ...bond,
        transaction_type: "Bond Creation",
        transaction_hash: `0x${Math.random().toString(16).substr(2, 16)}`,
        details: `Created bond ${bond.bond_name} with ${bond.tl_unit_offered / 10} units`
      }));
      
      if (pageNum === 1) {
        setBonds(bondsWithTransactionData);
        if (isRefresh) {
          addNotification({
            type: "success",
            title: "Data Refreshed",
            message: `Loaded ${bondsWithTransactionData.length} current offerings`
          });
        }
      } else {
        setBonds(prev => [...prev, ...bondsWithTransactionData]);
      }
      
      setPage(pageNum + 1);
      setHasMore(data.length === BONDS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching bonds:", error);
      addNotification({
        type: "error",
        title: "Load Failed",
        message: "Unable to fetch bond offerings"
      });
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else if (pageNum === 1) {
        setBondsLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // --- INITIAL BONDS ---
  useEffect(() => {
    if (!initialLoading) {
      loadBonds(1);
    }
  }, [initialLoading]);

  // --- REFRESH FUNCTION ---
  const handleRefresh = () => {
    loadBonds(1, true);
  };

  // --- LOAD MORE ---
  const loadMoreBonds = async () => {
    if (loadingMore || !hasMore) return;
    await loadBonds(page);
  };

  // --- OBSERVER ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBondElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (bondsLoading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreBonds();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [bondsLoading, loadingMore, hasMore]
  );

  // --- FILTER & SORT ---
  const filteredBonds = useMemo(() => {
    let result = bonds.filter((bond) => 
      bond.bond_name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (activeFilter !== "all") {
      result = result.filter(bond => bond.status === activeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "latest": 
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": 
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "a-z": 
          return a.bond_name.localeCompare(b.bond_name);
        case "z-a": 
          return b.bond_name.localeCompare(a.bond_name);
        case "interest-high": 
          return (Number(b.interest_rate) || 0) - (Number(a.interest_rate) || 0);
        case "interest-low": 
          return (Number(a.interest_rate) || 0) - (Number(b.interest_rate) || 0);
        default: 
          return 0;
      }
    });
    
    return result;
  }, [bonds, filterText, sortBy, activeFilter]);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const totalBonds = bonds.length;
    const activeBonds = bonds.filter(b => b.status === 'active').length;
    const totalUnits = bonds.reduce((sum, bond) => sum + (bond.tl_unit_offered / 10), 0);
    const avgInterest = bonds.length > 0 
      ? bonds.reduce((sum, bond) => sum + parseFloat(bond.interest_rate), 0) / bonds.length 
      : 0;

    return {
      totalBonds,
      activeBonds,
      totalUnits,
      avgInterest
    };
  }, [bonds]);

  // --- HANDLE COPY ADDRESS ---
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addNotification({
        type: "success",
        title: "Address Copied",
        message: "Wallet address copied to clipboard"
      });
    }
  };

  // --- HANDLE VIEW HASH ---
  const handleViewHash = (bond: Bond) => {
    setSelectedBond(bond);
    setHashModalOpen(true);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
      if (!target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show full screen loading while initial data is loading
  if (initialLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB] pt-4 px-2 sm:px-3 md:px-4 lg:px-6 pb-8 md:pb-10 font-sans overflow-x-hidden">
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      {/* Hash Details Modal */}
      <HashDetailsModal 
        bond={selectedBond}
        isOpen={hashModalOpen}
        onClose={() => setHashModalOpen(false)}
      />

      {/* Networks Panel */}
      <NetworksPanel open={networksOpen} onClose={() => setNetworksOpen(false)} />

      <div className="max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* === SECTION 1: HEADER & WALLET === */}
        <motion.div 
          {...fadeIn}
          className="flex flex-col gap-4 sm:gap-6 border-b border-gray-100 pb-6 sm:pb-8"
        >
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                  Manage bond offerings and monitor system performance
                </p>
              </div>
            </div>
            
            {/* Wallet Address Chip */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyAddress}
                className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all cursor-pointer flex-1 min-w-0 ${
                  copied 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#5A4BDA] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2 overflow-hidden flex-1 min-w-0">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full ${
                    walletAddress ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-mono text-xs sm:text-sm break-all truncate">
                    {walletAddress || 'Connecting...'}
                  </span>
                </div>
                
                <button 
                  className={`shrink-0 p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${
                    copied 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-[#5A4BDA] group-hover:text-white'
                  }`}
                  title="Copy Address"
                >
                  {copied ? <IoCheckmark size={12} className="sm:w-3.5 sm:h-3.5" /> : <IoCopyOutline size={12} className="sm:w-3.5 sm:h-3.5" />}
                </button>
              </motion.div>
              
              {copied && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-medium text-emerald-600 whitespace-nowrap"
                >
                  Copied!
                </motion.span>
              )}
            </div>
          </div>

          <motion.div 
            {...fadeIn}
            className="text-left bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider truncate">
                  Available Balance
                </p>
                {lastRefreshed && (
                  <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">
                    Last updated: {lastRefreshed.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                )}
              </div>
              <button 
                onClick={loadBalance}
                disabled={balanceLoading}
                className="p-1 sm:p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <IoRefresh className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 ${balanceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {balanceLoading ? (
              <div className="h-7 sm:h-8 w-24 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {balance && parseFloat(balance.replace(",", "")) > 0 ? balance : "0.00"} 
                <span className="text-base sm:text-lg text-[#5A4BDA] ml-1">BTN₵</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* === SECTION 2: OFFERINGS CONTROL & TABLE === */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Active Offerings</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Manage and monitor all bond offerings
              </p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
              {/* Search */}
              <div className="relative group flex-1 min-w-0">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A4BDA] transition-colors" size={16} className="sm:w-4.5 sm:h-4.5" />
                <input 
                  type="text" 
                  placeholder="Search bonds..." 
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 h-10 sm:h-11 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] transition-all shadow-sm"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="filter-dropdown-container relative flex-1 xs:flex-none">
                <button 
                  className="w-full xs:w-auto h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] cursor-pointer shadow-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2 justify-center"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <IoFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Filter</span>
                  <IoChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showFilterDropdown && (
                    <FilterDropdown
                      onFilterChange={setActiveFilter}
                      activeFilter={activeFilter}
                      onClose={() => setShowFilterDropdown(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-dropdown-container relative flex-1 xs:flex-none">
                <button 
                  className="w-full xs:w-auto h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] cursor-pointer shadow-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2 justify-center"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <IoCalendarOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Sort</span>
                  <IoChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showSortDropdown && (
                    <SortDropdown
                      onSortChange={setSortBy}
                      activeSort={sortBy}
                      onClose={() => setShowSortDropdown(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Create Button */}
              <Link 
                href="/admin/create-bond" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#5A4BDA] text-white px-3 sm:px-4 md:px-6 h-10 sm:h-11 rounded-lg sm:rounded-xl font-semibold hover:bg-[#4a3ec0] active:scale-[0.98] transition-all shadow-md shadow-[#5A4BDA]/20 whitespace-nowrap text-xs sm:text-sm md:text-base"
              >
                <span>Create Bond</span>
                <IoAdd size={12} className="sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Filter Badge */}
          {activeFilter !== "all" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <span className="text-xs sm:text-sm text-gray-600">Active filter:</span>
              <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                <span>
                  {activeFilter === "all" ? "All Bonds" : 
                   activeFilter === "active" ? "Active" : 
                   activeFilter === "completed" ? "Completed" : "Drafts"}
                </span>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="hover:text-blue-900 transition-colors"
                  aria-label="Clear filter"
                >
                  <IoClose className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header - Responsive */}
            <div className="hidden lg:grid grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm font-semibold text-gray-500 text-xs uppercase tracking-wider">
              <div className="col-span-4">Bond Name</div>
              <div className="col-span-2">Created Date</div>
              <div className="col-span-2">Interest Rate</div>
              <div className="col-span-2">Units Offered</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Mobile Table Header */}
            <div className="lg:hidden px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bond Offerings
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {bondsLoading ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-[#5A4BDA]/20 border-t-[#5A4BDA] rounded-full animate-spin"></div>
                  <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mt-3 sm:mt-4">Loading offerings...</p>
                </div>
              ) : filteredBonds.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 sm:h-48 md:h-64 text-gray-400"
                >
                  <IoSearch size={28} className="sm:w-9 sm:h-9 mb-2 sm:mb-3 md:mb-4 opacity-20" />
                  <p className="text-sm sm:text-base md:text-lg font-medium text-gray-500 mb-1 sm:mb-2">No bonds found</p>
                  <p className="text-xs sm:text-sm text-gray-400 text-center px-3 sm:px-4 max-w-xs">
                    {filterText || activeFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Get started by creating your first bond offering"
                    }
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredBonds.map((bond: Bond, index: number) => {
                    const isLastElement = filteredBonds.length === index + 1;
                    
                    return (
                      <motion.div
                        key={bond.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        ref={isLastElement ? lastBondElementRef : null}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        {/* Desktop View */}
                        <div className="hidden lg:grid grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 items-center">
                          {/* Bond Name */}
                          <div className="col-span-4 flex items-center gap-2 md:gap-3 min-w-0">
                            <div className="relative flex items-center justify-center bg-white rounded-full border border-gray-200 w-9 h-9 md:w-11 md:h-11 p-1 shrink-0">
                              <Image src="/logo.png" alt="Bond Icon" width={24} height={24} className="object-contain w-5 h-5 md:w-7 md:h-7" />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white ${
                                bond.status === 'active' ? 'bg-emerald-500' :
                                bond.status === 'completed' ? 'bg-blue-500' :
                                'bg-amber-500'
                              }`}></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-gray-900 truncate text-sm md:text-base block">
                                {bond.bond_name}
                              </span>
                              <span className="text-xs text-gray-500 capitalize truncate block">
                                {bond.status || 'active'}
                              </span>
                            </div>
                          </div>

                          {/* Created Date */}
                          <div className="col-span-2 text-gray-600 font-medium text-xs md:text-sm truncate">
                            {new Date(bond.created_at).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>

                          {/* Interest Rate */}
                          <div className="col-span-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 text-xs md:text-sm whitespace-nowrap">
                              +{bond.interest_rate}% / yr
                            </span>
                          </div>

                          {/* Units Offered */}
                          <div className="col-span-2 text-gray-900 font-bold font-mono text-sm md:text-base">
                            {bond.tl_unit_offered / 10}
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs font-medium ${
                              bond.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                              bond.status === 'completed' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                              'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            }`}>
                              {bond.status || 'active'}
                            </span>
                          </div>

                          {/* Action */}
                          <div className="col-span-1 flex justify-center">
                            <Link 
                              href={`/admin/bonds/${bond.id}`} 
                              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                              title="View Details"
                            >
                              <IoDocumentTextOutline className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Mobile View */}
                        <div className="lg:hidden p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="relative flex items-center justify-center bg-white rounded-full border border-gray-200 w-8 h-8 sm:w-10 sm:h-10 p-1 shrink-0">
                                <Image src="/logo.png" alt="Bond Icon" width={20} height={20} className="object-contain w-4 h-4 sm:w-6 sm:h-6" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-white ${
                                  bond.status === 'active' ? 'bg-emerald-500' :
                                  bond.status === 'completed' ? 'bg-blue-500' :
                                  'bg-amber-500'
                                }`}></div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold text-gray-900 truncate text-sm sm:text-base block">
                                  {bond.bond_name}
                                </span>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                    bond.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                                    bond.status === 'completed' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                                    'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                  }`}>
                                    {bond.status || 'active'}
                                  </span>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 text-xs whitespace-nowrap">
                                    +{bond.interest_rate}% / yr
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Link 
                              href={`/admin/bonds/${bond.id}`} 
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all shrink-0"
                              title="View Details"
                            >
                              <IoDocumentTextOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Link>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Created Date</span>
                              <p className="font-medium text-gray-900 truncate">
                                {new Date(bond.created_at).toLocaleDateString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Units Offered</span>
                              <p className="font-bold font-mono text-gray-900 truncate">
                                {bond.tl_unit_offered / 10}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              
              {loadingMore && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4 sm:py-6 flex justify-center items-center gap-1.5 sm:gap-2 text-gray-500 text-xs sm:text-sm"
                >
                  <CgSpinner className="animate-spin text-[#5A4BDA] w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Loading more offerings...</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}