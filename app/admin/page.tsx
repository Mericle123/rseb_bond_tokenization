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
  IoLinkOutline
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <IoLinkOutline className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                    <p className="text-sm text-gray-600">Hash information for {bond.bond_name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <IoClose className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Hash Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Transaction Hash</span>
                    <button
                      onClick={handleCopyHash}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        copiedHash 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copiedHash ? <IoCheckmark className="w-4 h-4" /> : <IoCopyOutline className="w-4 h-4" />}
                      {copiedHash ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                  <code className="text-sm font-mono text-gray-900 break-all bg-white p-3 rounded-lg border">
                    {bond.transaction_hash || "No transaction hash available"}
                  </code>
                </div>

                {/* Transaction Sections */}
                <div className="space-y-4">
                  {transactionData.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {section.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm font-medium text-gray-600 min-w-[140px]">
                              {detail.type}
                            </span>
                            <div className="flex-1 text-right sm:text-left">
                              <span className={`text-sm ${
                                detail.isHighlighted 
                                  ? 'text-blue-600 font-mono break-all' 
                                  : 'text-gray-900'
                              }`}>
                                {detail.value}
                              </span>
                              {detail.subValue && (
                                <p className="text-xs text-gray-500 mt-1">{detail.subValue}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium">
                      <IoEyeOutline className="w-4 h-4" />
                      View on Explorer
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">
                      <IoDocumentTextOutline className="w-4 h-4" />
                      Export Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
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
                <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <IoClose className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <IoServer className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Sui Networks
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Configure your network connections
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  
                  {/* Mainnet Section */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-[16px] font-bold text-gray-900">Mainnet</h3>
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-semibold text-gray-900">Testnet</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                      <div className="ml-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-gray-700">Dexnet</span>
                          <span className="text-[12px] text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testnet Section */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-[16px] font-bold text-gray-900">Testnet</h3>
                    <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-gray-900">Testnet</span>
                        <span className="text-[12px] text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">active</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Nodes Section */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-[16px] font-bold text-gray-900">Custom Nodes</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customNodeUrl}
                        onChange={(e) => setCustomNodeUrl(e.target.value)}
                        placeholder="Enter JSON RPC Link..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-[14px]"
                      />
                      <button
                        onClick={handleAddCustomNode}
                        className="w-full py-3 bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] text-white font-medium rounded-xl hover:shadow-lg transition-all"
                      >
                        Add Custom Node
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 my-4"></div>

                  {/* Public Nodes Section */}
                  <div className="space-y-3">
                    <h3 className="text-[16px] font-bold text-gray-900">Public Nodes</h3>
                    <div className="space-y-2">
                      {[
                        "Suiscan Mainnet Node",
                        "Suiscan Testnet Node", 
                        "Suiscan Devnet Node"
                      ].map((nodeName) => (
                        <label key={nodeName} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNodes.includes(nodeName)}
                            onChange={() => handleNodeToggle(nodeName)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-[14px] font-medium text-gray-900">{nodeName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        console.log('Selected nodes:', selectedNodes);
                        console.log('Custom node URL:', customNodeUrl);
                        onClose();
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] text-white font-medium rounded-xl hover:shadow-lg transition-all"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F8FB]">
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
            <g filter="url(#filter0_i_163_1030)">
              <path
                fill="#E9E9E9"
                d="M235.036 304.223C236.949 303.118 240.051 303.118 241.964 304.223L470.072 435.921C473.898 438.13 473.898 441.712 470.072 443.921L247.16 572.619C242.377 575.38 234.623 575.38 229.84 572.619L6.92817 443.921C3.10183 441.712 3.10184 438.13 6.92817 435.921L235.036 304.223Z"
              ></path>
            </g>
            <path
              stroke="white"
              d="M235.469 304.473C237.143 303.506 239.857 303.506 241.531 304.473L469.639 436.171C473.226 438.242 473.226 441.6 469.639 443.671L246.727 572.369C242.183 574.992 234.817 574.992 230.273 572.369L7.36118 443.671C3.77399 441.6 3.774 438.242 7.36119 436.171L235.469 304.473Z"
            ></path>
            <path
              stroke="white"
              fill="#C3CADC"
              d="M234.722 321.071C236.396 320.105 239.111 320.105 240.785 321.071L439.477 435.786C443.064 437.857 443.064 441.215 439.477 443.286L240.785 558.001C239.111 558.967 236.396 558.967 234.722 558.001L36.0304 443.286C32.4432 441.215 32.4432 437.857 36.0304 435.786L234.722 321.071Z"
            ></path>
            <path
              fill="#4054B2"
              d="M234.521 366.089C236.434 364.985 239.536 364.985 241.449 366.089L406.439 461.346L241.247 556.72C239.333 557.825 236.231 557.825 234.318 556.72L69.3281 461.463L234.521 366.089Z"
            ></path>
            <path
              fill="#30439B"
              d="M237.985 364.089L237.984 556.972C236.144 556.941 235.082 556.717 233.13 556.043L69.3283 461.463L237.985 364.089Z"
            ></path>
            <path
              fill="url(#paint0_linear_163_1030)"
              d="M36.2146 117.174L237.658 0.435217V368.615C236.541 368.598 235.686 368.977 233.885 370.124L73.1836 463.678L39.2096 444.075C37.0838 442.229 36.285 440.981 36.2146 438.027V117.174Z"
              id="layer_pared"
            ></path>
            <path
              fill="url(#paint1_linear_163_1030)"
              d="M439.1 116.303L237.657 0.435568V368.616C238.971 368.585 239.822 369.013 241.43 370.135L403.64 462.925L436.128 444.089C437.832 442.715 438.975 441.147 439.1 439.536V116.303Z"
              id="layer_pared"
            ></path>
            <path
              fill="#27C6FD"
              d="M64.5447 181.554H67.5626V186.835L64.5447 188.344V181.554Z"
              id="float_server"
            ></path>
            <path
              fill="#138EB9"
              d="M88.3522 374.347L232.415 457.522C234.202 458.405 234.866 458.629 236.335 458.71V468.291C235.356 468.291 234.086 468.212 232.415 467.275L88.3522 384.1C86.3339 382.882 85.496 382.098 85.4707 380.198V370.428L88.3522 374.347Z"
              id="float_server"
            ></path>
            <path
              fill="#138EB9"
              d="M384.318 374.445L240.254 457.62C238.914 458.385 238.295 458.629 236.335 458.71V468.291C237.315 468.291 238.704 468.211 240.236 467.274L384.318 384.198C386.457 383.091 387.151 382.244 387.258 380.228V370.917C386.768 372.387 386.21 373.295 384.318 374.445Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint3_linear_163_1030)"
              fill="url(#paint2_linear_163_1030)"
              d="M240.452 226.082L408.617 323.172C412.703 325.531 412.703 329.355 408.617 331.713L240.452 428.803C238.545 429.904 235.455 429.904 233.548 428.803L65.3832 331.713C61.298 329.355 61.298 325.531 65.3832 323.172L233.548 226.082C235.455 224.982 238.545 224.982 240.452 226.082Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M408.896 332.123L241.489 428.775C240.013 429.68 238.557 430.033 236.934 430.033V464.518C238.904 464.518 239.366 464.169 241.489 463.233L408.896 366.58C411.372 365.292 412.125 363.262 412.312 361.317C412.312 361.317 412.312 326.583 412.312 327.722C412.312 328.86 411.42 330.514 408.896 332.123Z"
              id="float_server"
            ></path>
            <path
              fill="#6879AF"
              d="M240.92 429.077L255.155 420.857V432.434L251.511 439.064V457.432L241.489 463.242C240.116 463.858 239.141 464.518 236.934 464.518V430.024C238.695 430.024 239.862 429.701 240.92 429.077Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint4_linear_163_1030)"
              d="M65.084 331.984L232.379 428.571C233.882 429.619 235.101 430.005 236.934 430.005V464.523C234.656 464.523 234.285 464.215 232.379 406.273L65.084 309.501C62.4898 308.059 61.6417 306.051 61.6699 304.349V327.125C61.6899 329.24 62.4474 330.307 65.084 331.984Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M400.199 361.032C403.195 359.302 405.623 355.096 405.623 351.637C405.623 348.177 403.195 346.775 400.199 348.505C397.203 350.235 394.775 354.441 394.775 357.9C394.775 361.359 397.203 362.762 400.199 361.032Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M221.404 446.444C224.4 448.174 226.828 446.771 226.828 443.312C226.828 439.853 224.4 435.646 221.404 433.917C218.408 432.187 215.979 433.589 215.979 437.049C215.979 440.508 218.408 444.714 221.404 446.444Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M102.895 359.589L97.9976 356.762V380.07L102.895 382.897V359.589Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M102.895 359.619L98.3394 356.989V379.854L102.895 382.484V359.619Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M78.9793 345.923L74.0823 343.096V366.37L78.9793 369.198V345.923Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M86.9512 350.478L82.0542 347.651V370.959L86.9512 373.787V350.478Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M94.9229 355.034L90.0259 352.206V375.515L94.9229 378.342V355.034Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M86.951 350.509L82.3958 347.879V370.743L86.951 373.373V350.509Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M94.9227 355.064L90.3674 352.434V375.299L94.9227 377.929V355.064Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#313654"
              d="M78.9794 345.954L74.4241 343.324V366.188L78.9794 368.818V345.954Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#333B5F"
              d="M221.859 446.444C224.855 448.174 227.284 446.771 227.284 443.312C227.284 439.853 224.855 435.646 221.859 433.917C218.863 432.187 216.435 433.589 216.435 437.049C216.435 440.508 218.863 444.714 221.859 446.444Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M399.516 361.032C402.511 359.302 404.94 355.096 404.94 351.637C404.94 348.177 402.511 346.775 399.516 348.505C396.52 350.235 394.091 354.441 394.091 357.9C394.091 361.359 396.52 362.762 399.516 361.032Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M88.3522 317.406L232.415 400.581C234.202 401.464 234.866 401.688 236.335 401.769V411.35C235.356 411.35 234.086 411.271 232.415 410.334L88.3522 327.159C86.3339 325.941 85.496 325.157 85.4707 323.256V313.486L88.3522 317.406Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M384.318 317.504L240.254 400.679C238.914 401.444 238.295 401.688 236.335 401.769V411.35C237.315 411.35 238.704 411.27 240.236 410.333L384.318 327.257C386.457 326.15 387.151 325.303 387.258 323.287V313.976C386.768 315.446 386.21 316.354 384.318 317.504Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint6_linear_163_1030)"
              fill="url(#paint5_linear_163_1030)"
              d="M240.452 169.141L408.617 266.231C412.703 268.59 412.703 272.414 408.617 274.772L240.452 371.862C238.545 372.962 235.455 372.962 233.548 371.862L65.3832 274.772C61.298 272.414 61.298 268.59 65.3832 266.231L233.548 169.141C235.455 168.04 238.545 168.04 240.452 169.141Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M408.896 275.182L241.489 371.834C240.013 372.739 238.557 373.092 236.934 373.092V407.577C238.904 407.577 239.366 407.229 241.489 406.292L408.896 309.64C411.372 308.352 412.125 306.321 412.312 304.376C412.312 304.376 412.312 269.642 412.312 270.781C412.312 271.92 411.42 273.573 408.896 275.182Z"
              id="float_server"
            ></path>
            <path
              fill="#6879AF"
              d="M240.92 372.135L255.155 363.915V375.493L251.511 382.123V400.491L241.489 406.3C240.116 406.916 239.141 407.577 236.934 407.577V373.083C238.695 373.083 239.862 372.759 240.92 372.135Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint7_linear_163_1030)"
              d="M65.084 275.043L232.379 371.63C233.882 372.678 235.101 373.064 236.934 373.064V407.582C234.656 407.582 234.285 407.274 232.379 406.273L65.084 309.501C62.4898 308.059 61.6417 306.051 61.6699 304.349V270.184C61.6899 272.299 62.4474 273.366 65.084 275.043Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M400.199 304.091C403.195 302.362 405.623 298.155 405.623 294.696C405.623 291.237 403.195 289.835 400.199 291.564C397.203 293.294 394.775 297.5 394.775 300.959C394.775 304.419 397.203 305.821 400.199 304.091Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M221.404 389.503C224.4 391.232 226.828 389.83 226.828 386.371C226.828 382.912 224.4 378.705 221.404 376.976C218.408 375.246 215.979 376.648 215.979 380.107C215.979 383.567 218.408 387.773 221.404 389.503Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M102.553 301.281L97.656 298.454V321.762L102.553 324.59V301.281Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M102.553 301.312L97.9976 298.682V321.546L102.553 324.176V301.312Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#494F76"
              d="M78.6377 287.615L73.7407 284.788V308.063L78.6377 310.89V287.615Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M86.6094 292.171L81.7124 289.343V312.652L86.6094 315.479V292.171Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M94.5811 296.726L89.6841 293.899V317.207L94.5811 320.034V296.726Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M86.6095 292.201L82.0542 289.571V312.436L86.6095 315.066V292.201Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M94.5812 296.756L90.0259 294.126V316.991L94.5812 319.621V296.756Z"
              className="estrobo_animationV2"
            ></path>
            <path
              fill="#313654"
              d="M78.6376 287.646L74.0823 285.016V307.88L78.6376 310.51V287.646Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M221.859 389.503C224.855 391.232 227.284 389.83 227.284 386.371C227.284 382.912 224.855 378.705 221.859 376.976C218.863 375.246 216.435 376.648 216.435 380.107C216.435 383.567 218.863 387.773 221.859 389.503Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M399.516 304.091C402.511 302.362 404.94 298.155 404.94 294.696C404.94 291.237 402.511 289.835 399.516 291.564C396.52 293.294 394.091 297.5 394.091 300.959C394.091 304.419 396.52 305.821 399.516 304.091Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M89.4907 214.912L233.554 298.087C235.341 298.97 236.003 299.194 237.474 299.275V308.856C236.494 308.856 235.223 308.777 233.554 307.84L89.4907 224.665C87.4726 223.447 86.6347 222.663 86.6094 220.762V210.993L89.4907 214.912Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M385.457 215.01L241.393 298.185C240.053 298.951 239.434 299.194 237.474 299.275V308.856C238.454 308.856 239.844 308.776 241.375 307.839L385.457 224.763C387.597 223.656 388.29 222.809 388.397 220.793V211.482C387.907 212.953 387.349 213.86 385.457 215.01Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint8_linear_163_1030)"
              d="M66.1102 196.477L233.517 293.129C235.593 294.154 236.364 294.416 238.073 294.509V305.642C236.934 305.642 235.458 305.551 233.517 304.463L66.1102 207.81C63.7651 206.394 62.7914 205.483 62.762 203.275V191.922L66.1102 196.477Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M410.101 196.591L242.694 293.243C241.135 294.132 240.35 294.375 238.073 294.468V305.643C239.211 305.643 240.892 305.55 242.671 304.46L410.101 207.923C412.587 206.638 413.392 205.653 413.517 203.31V192.491C412.948 194.199 412.3 195.254 410.101 196.591Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint10_linear_163_1030)"
              fill="url(#paint9_linear_163_1030)"
              d="M241.59 90.5623L409.756 187.652C413.842 190.011 413.842 193.835 409.756 196.194L241.59 293.284C239.684 294.384 236.593 294.384 234.687 293.284L66.5219 196.194C62.4367 193.835 62.4367 190.011 66.5219 187.652L234.687 90.5623C236.593 89.4616 239.684 89.4616 241.59 90.5623Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M89.0427 195.334C92.0385 197.063 96.8956 197.063 99.8914 195.334C102.887 193.604 102.887 190.8 99.8914 189.07C96.8956 187.341 92.0385 187.341 89.0427 189.07C86.0469 190.8 86.0469 193.604 89.0427 195.334Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M231.396 111.061C234.391 112.791 239.249 112.791 242.244 111.061C245.24 109.331 245.24 106.527 242.244 104.798C239.249 103.068 234.391 103.068 231.396 104.798C228.4 106.527 228.4 109.331 231.396 111.061Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M374.887 194.195C377.883 195.925 382.74 195.925 385.736 194.195C388.732 192.465 388.732 189.661 385.736 187.932C382.74 186.202 377.883 186.202 374.887 187.932C371.891 189.661 371.891 192.465 374.887 194.195Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M231.396 279.607C234.391 281.336 239.249 281.336 242.244 279.607C245.24 277.877 245.24 275.073 242.244 273.343C239.249 271.613 234.391 271.613 231.396 273.343C228.4 275.073 228.4 277.877 231.396 279.607Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M232.109 279.607C235.104 281.336 239.962 281.336 242.957 279.607C245.953 277.877 245.953 275.073 242.957 273.343C239.962 271.613 235.104 271.613 232.109 273.343C229.113 275.073 229.113 277.877 232.109 279.607Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M89.7563 195.334C92.7521 197.063 97.6092 197.063 100.605 195.334C103.601 193.604 103.601 190.8 100.605 189.07C97.6092 187.341 92.7521 187.341 89.7563 189.07C86.7605 190.8 86.7605 193.604 89.7563 195.334Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M232.109 111.061C235.104 112.791 239.962 112.791 242.957 111.061C245.953 109.331 245.953 106.527 242.957 104.798C239.962 103.068 235.104 103.068 232.109 104.798C229.113 106.527 229.113 109.331 232.109 111.061Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M375.6 194.195C378.595 195.925 383.453 195.925 386.448 194.195C389.444 192.465 389.444 189.661 386.448 187.932C383.453 186.202 378.595 186.202 375.6 187.932C372.604 189.661 372.604 192.465 375.6 194.195Z"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M371.315 166.009L354.094 176.748C351.92 178.337 350.677 179.595 350.677 181.872L351.247 196.108C351.412 198.824 350.734 200.095 347.83 201.802L251.03 257.603C248.955 258.968 247.598 259.356 244.767 259.312L215.727 258.743C212.711 258.605 211.233 259.005 208.894 260.45L193.659 269.072"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M345.691 151.204L328.328 161.374C326.154 162.963 324.911 164.221 324.911 166.498L325.481 180.734C325.646 183.45 324.968 184.721 322.064 186.428L225.264 242.229C223.19 243.594 221.832 243.982 219.001 243.938L189.961 243.369C186.946 243.231 185.468 243.631 183.128 245.076L167.124 253.698"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M105.482 218.098L122.697 207.363C124.87 205.773 126.111 204.516 126.111 202.24L125.537 188.007C125.371 185.291 126.048 184.02 128.951 182.314L225.715 126.533C227.788 125.17 229.146 124.782 231.976 124.825L261.012 125.398C264.026 125.535 265.503 125.136 267.842 123.691L283.072 115.072"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M131.121 232.893L148.482 222.725C150.656 221.136 151.898 219.879 151.898 217.601L151.327 203.367C151.162 200.65 151.839 199.379 154.743 197.673L251.531 141.878C253.605 140.514 254.962 140.126 257.794 140.17L286.832 140.74C289.847 140.878 291.325 140.478 293.664 139.032L309.667 130.412"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M327.961 242.79L301.907 227.748L300.673 228.46L326.727 243.503L327.961 242.79Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M354.625 227.426L328.56 212.377L327.326 213.09L353.392 228.139L354.625 227.426Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M300.864 258.519L274.707 243.417L273.474 244.129L299.631 259.231L300.864 258.519Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M176.498 155.101L150.21 139.924L148.977 140.636L175.264 155.813L176.498 155.101Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M193.703 145.191L167.388 129.998L166.154 130.711L192.469 145.903L193.703 145.191Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M158.333 165.69L131.974 150.472L130.74 151.184L157.099 166.402L158.333 165.69Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M232.079 135.83C234.258 134.573 237.79 134.573 239.969 135.83L329.717 187.647C334.074 190.163 334.074 194.242 329.717 196.757L239.969 248.574C237.79 249.832 234.258 249.832 232.079 248.574L142.33 196.757C137.972 194.242 137.972 190.163 142.33 187.647L232.079 135.83Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint11_linear_163_1030)"
              d="M234.357 135.83C236.535 134.573 240.068 134.573 242.246 135.83L331.995 187.647C336.352 190.163 336.352 194.242 331.995 196.757L242.246 248.574C240.068 249.832 236.535 249.832 234.357 248.574L144.608 196.757C140.25 194.242 140.25 190.163 144.608 187.647L234.357 135.83Z"
              id="float_server"
            ></path>
            <path
              strokeWidth="3"
              stroke="#27C6FD"
              d="M380.667 192.117V181.97C380.667 179.719 383.055 178.27 385.052 179.309L409.985 192.282C410.978 192.799 411.601 193.825 411.601 194.943V301.113C411.601 302.642 409.953 303.606 408.62 302.856L399.529 297.742"
              className="after_animation"
              id="float_server"
            ></path>
            <path
              strokeWidth="3"
              stroke="#27C6FD"
              d="M94.7234 192.117V180.306C94.7234 179.214 94.1301 178.208 93.1744 177.68L70.5046 165.152C68.5052 164.047 66.0536 165.493 66.0536 167.778V185.326"
              id="float_server"
            ></path>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="192.117"
              cx="380.667"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="192.117"
              cx="94.7235"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="297.742"
              cx="399.529"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="383.751"
              cx="221.474"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="439.583"
              cx="221.474"
              id="float_server"
            ></ellipse>
            <path
              strokeWidth="3"
              stroke="#27C6FD"
              d="M221.474 383.752L211.746 388.941C210.768 389.462 210.157 390.48 210.157 391.588V444.34C210.157 445.108 210.988 445.589 211.654 445.208L221.474 439.583"
              id="float_server"
            ></path>
            <path
              fill="url(#paint13_linear_163_1030)"
              d="M237.376 236.074L36 119.684V439.512C36.0957 441.966 36.7214 443.179 39.0056 445.021L200.082 538.547L231.362 556.441C233.801 557.806 235.868 558.222 237.376 558.328V236.074Z"
              id="layer_pared"
            ></path>
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="556.454"
                x2="438.984"
                y1="235.918"
                x1="237.376"
                id="paint13_linear_163_1030"
              >
                <stop style={{stopColor:"#4457b3", stopOpacity:0}} offset="10%"></stop>
                <stop style={{stopColor:"#4457b3", stopOpacity:1}} offset="100%"></stop>
              </linearGradient>
            </defs>
            <path
              fill="url(#paint13_linear_163_1030)"
              d="M237.376 235.918L438.984 119.576V439.398C439.118 441.699 438.452 442.938 435.975 444.906L274.712 538.539L243.397 556.454C240.955 557.821 238.886 558.23 237.376 558.336V235.918Z"
              className="animatedStop"
              id="layer_pared"
            ></path>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="275.295"
                width="468.883"
                y="303.394"
                x="4.05835"
                id="filter0_i_163_1030"
              >
                <feFlood result="BackgroundImageFix" floodOpacity="0"></feFlood>
                <feBlend
                  result="shape"
                  in2="BackgroundImageFix"
                  in="SourceGraphic"
                  mode="normal"
                ></feBlend>
                <feColorMatrix
                  result="hardAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  type="matrix"
                  in="SourceAlpha"
                ></feColorMatrix>
                <feOffset dy="4"></feOffset>
                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                <feComposite
                  k3="1"
                  k2="-1"
                  operator="arithmetic"
                  in2="hardAlpha"
                ></feComposite>
                <feColorMatrix
                  values="0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 1 0"
                  type="matrix"
                ></feColorMatrix>
                <feBlend
                  result="effect1_innerShadow_163_1030"
                  in2="shape"
                  mode="normal"
                ></feBlend>
              </filter>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="336.055"
                x2="294.366"
                y1="60.1113"
                x1="135.05"
                id="paint0_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="335.208"
                x2="180.935"
                y1="59.2405"
                x1="340.265"
                id="paint1_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="420.619"
                x2="88.5367"
                y1="327.152"
                x1="412.313"
                id="paint2_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="211.092"
                x2="168.239"
                y1="426.799"
                x1="236.934"
                id="paint3_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="349.241"
                x2="232.379"
                y1="349.241"
                x1="65.0839"
                id="paint4_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="363.678"
                x2="88.5367"
                y1="270.211"
                x1="412.313"
                id="paint5_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="154.15"
                x2="168.239"
                y1="369.858"
                x1="236.934"
                id="paint6_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="292.3"
                x2="232.379"
                y1="292.3"
                x1="65.0839"
                id="paint7_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="198.899"
                x2="238.073"
                y1="198.899"
                x1="62.762"
                id="paint8_linear_163_1030"
              >
                <stop stopColor="#7382B9"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="191.599"
                x2="67.1602"
                y1="191.633"
                x1="413.451"
                id="paint9_linear_163_1030"
              >
                <stop stopColor="#5F6E99"></stop>
                <stop stopColor="#465282" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="191.599"
                x2="63.6601"
                y1="191.599"
                x1="417.16"
                id="paint10_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="243.221"
                x2="156.734"
                y1="191.633"
                x1="335.442"
                id="paint11_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="421.983"
                x2="-1.9283"
                y1="179.292"
                x1="138.189"
                id="paint12_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 mt-6">Loading Admin Dashboard...</p>
      <p className="text-gray-500 text-sm mt-2">Preparing your workspace</p>

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

        /* Animación de los colores del gradiente */
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

        /* Animación aplicada a los puntos del gradiente */
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [networksOpen, setNetworksOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [hashModalOpen, setHashModalOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('testnet'); // Default to testnet

  // --- LOADING STATES ---
  const [balanceLoading, setBalanceLoading] = useState(true);
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
  useEffect(() => {
    async function loadBalance() {
      if (!walletAddress) {
        setBalanceLoading(false);
        return;
      }
      setBalanceLoading(true);
      try {
        const data = await getBtncBalance({ address: walletAddress });
        setBalance(data.balanceHuman);
      } catch (e) {
        console.error(e);
      } finally {
        setBalanceLoading(false);
      }
    }
    
    if (!initialLoading) {
      loadBalance();
    }
  }, [walletAddress, initialLoading]);

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
      
      // Add mock transaction data for demonstration
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

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter(bond => bond.status === activeFilter);
    }

    // Apply sorting
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

  // Show full screen loading while initial data is loading
  if (initialLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB] pt-4 px-4 pb-10 md:px-8 font-sans">
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

      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* === SECTION 1: HEADER & WALLET === */}
        <motion.div 
          {...fadeIn}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8"
        >
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2 text-sm">
                  Manage bond offerings and monitor system performance
                </p>
              </div>
              
              {/* Network Status Indicator */}
              <div className="flex items-center gap-3">
                <NetworkStatusIndicator 
                  currentNetwork={currentNetwork}
                  onNetworkClick={() => setNetworksOpen(true)}
                />
              </div>
            </div>
            
            {/* Wallet Address Chip */}
            <div className="mt-4 flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyAddress}
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer w-full md:w-auto ${
                  copied 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#5A4BDA] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`w-2 h-2 shrink-0 rounded-full ${
                    walletAddress ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-mono text-sm break-all">
                    {walletAddress || 'Connecting...'}
                  </span>
                </div>
                
                <button 
                  className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-[#5A4BDA] group-hover:text-white'
                  }`}
                  title="Copy Address"
                >
                  {copied ? <IoCheckmark size={14} /> : <IoCopyOutline size={14} />}
                </button>
              </motion.div>
              
              {copied && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-medium text-emerald-600 hidden sm:block"
                >
                  Copied!
                </motion.span>
              )}
            </div>
          </div>

          <motion.div 
            {...fadeIn}
            className="text-left md:text-right bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Available Balance
              </p>
              <button 
                onClick={() => loadBalance()}
                disabled={balanceLoading}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <IoRefresh className={`w-4 h-4 text-gray-400 ${balanceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {balanceLoading ? (
              <div className="h-8 md:h-9 w-24 md:w-32 bg-gray-200 rounded animate-pulse md:ml-auto"></div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {balance && parseFloat(balance.replace(",", "")) > 0 ? balance : "0.00"} 
                <span className="text-base md:text-lg text-[#5A4BDA] ml-1">BTN₵</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* === SECTION 2: STATS === */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 w-fit"
            >
              <IoRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {/* Total Bonds */}
            <motion.div
              variants={fadeIn}
              className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <BsFileEarmarkTextFill />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Bonds</p>
                {bondsLoading ? (
                  <div className="h-6 md:h-8 w-12 md:w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-900 text-2xl md:text-3xl font-bold">{stats.totalBonds}</p>
                )}
              </div>
            </motion.div>

            {/* Active Offerings */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.1 }}
              className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <IoStatsChart />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active Offerings</p>
                {bondsLoading ? (
                  <div className="h-6 md:h-8 w-12 md:w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-900 text-2xl md:text-3xl font-bold">{stats.activeBonds}</p>
                )}
              </div>
            </motion.div>

            {/* Total Units */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <IoDocumentTextOutline />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Units</p>
                {bondsLoading ? (
                  <div className="h-6 md:h-8 w-12 md:w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-900 text-2xl md:text-3xl font-bold">
                    {stats.totalUnits.toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Avg Interest */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.3 }}
              className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-center gap-4 md:gap-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <IoWallet />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Avg Interest</p>
                {bondsLoading ? (
                  <div className="h-6 md:h-8 w-12 md:w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-900 text-2xl md:text-3xl font-bold">
                    {stats.avgInterest.toFixed(2)}%
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* === SECTION 3: OFFERINGS CONTROL & TABLE === */}
        <motion.section
          {...fadeIn}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Active Offerings</h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage and monitor all bond offerings
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative group flex-1 min-w-0">
                <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A4BDA] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search bonds..." 
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] transition-all shadow-sm"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="filter-dropdown-container relative flex-1 sm:flex-none">
                <button 
                  className="w-full sm:w-auto h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] cursor-pointer shadow-sm font-medium text-gray-700 flex items-center gap-2 justify-center"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <IoFilter className="w-4 h-4" />
                  Filter
                  <IoChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
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

              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <select 
                  className="w-full sm:w-auto h-11 pl-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] cursor-pointer appearance-none shadow-sm font-medium text-gray-700"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest Created</option>
                  <option value="oldest">Oldest Created</option>
                  <option value="a-z">Name (A-Z)</option>
                  <option value="z-a">Name (Z-A)</option>
                  <option value="interest-high">Interest (High-Low)</option>
                  <option value="interest-low">Interest (Low-High)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Create Button */}
              <Link 
                href="/admin/create-bond" 
                className="flex items-center justify-center gap-2 bg-[#5A4BDA] text-white px-4 md:px-6 h-11 rounded-xl font-semibold hover:bg-[#4a3ec0] active:scale-[0.98] transition-all shadow-md shadow-[#5A4BDA]/20 whitespace-nowrap text-sm md:text-base"
              >
                Create Bond <IoAdd size={14} />
              </Link>
            </div>
          </div>

          {/* Active Filter Badge */}
          {activeFilter !== "all" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-600">Active filter:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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
                  <IoClose className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px] md:h-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(150px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_70px] gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 font-semibold text-gray-500 text-xs uppercase tracking-wider">
              <div className="truncate">Bond Name</div>
              <div className="truncate">Created Date</div>
              <div className="truncate">Interest Rate</div>
              <div className="truncate">Units Offered</div>
              <div className="truncate">Transaction Type</div>
              <div className="truncate">Transaction Hash</div>
              <div className="truncate">Status</div>
              <div className="text-center">Action</div>
            </div>

            {/* Table Body */}
            <div className="overflow-y-auto flex-1">
              <div>
                {bondsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#5A4BDA]/20 border-t-[#5A4BDA] rounded-full animate-spin"></div>
                    <p className="text-base md:text-lg font-medium text-gray-700 mt-4">Loading offerings...</p>
                  </div>
                ) : filteredBonds.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 md:h-64 text-gray-400"
                  >
                    <IoSearch size={36} className="mb-3 md:mb-4 opacity-20" />
                    <p className="text-base md:text-lg font-medium text-gray-500 mb-2">No bonds found</p>
                    <p className="text-xs md:text-sm text-gray-400 text-center px-4">
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
                          className="grid grid-cols-[minmax(150px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_70px] gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 items-center border-b border-gray-50 hover:bg-gray-50/80 transition-colors text-sm"
                        >
                          {/* Bond Name */}
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className="relative flex items-center justify-center bg-white rounded-full border border-gray-200 w-8 h-8 md:w-11 md:h-11 p-1 shrink-0 group-hover:border-[#5A4BDA]/30 transition-colors">
                              <Image src="/logo.png" alt="Bond Icon" width={28} height={28} className="object-contain w-5 h-5 md:w-7 md:h-7" />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-white ${
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
                          <div className="text-gray-600 font-medium text-sm">
                            {new Date(bond.created_at).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>

                          {/* Interest Rate */}
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-md font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 text-xs md:text-sm">
                              +{bond.interest_rate}% / yr
                            </span>
                          </div>

                          {/* Units Offered */}
                          <div className="text-gray-900 font-bold font-mono text-sm md:text-base">
                            {bond.tl_unit_offered / 10}
                          </div>

                          {/* Transaction Type */}
                          <div className="text-gray-700 font-medium text-sm">
                            {bond.transaction_type || "Bond Creation"}
                          </div>

                          {/* Transaction Hash */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-gray-600 truncate bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                {bond.transaction_hash ? `${bond.transaction_hash.slice(0, 8)}...` : "N/A"}
                              </code>
                              {bond.transaction_hash && (
                                <button
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                  onClick={() => handleViewHash(bond)}
                                  title="View Hash Details"
                                >
                                  <IoEyeOutline className="w-3 h-3 text-gray-500" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              bond.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                              bond.status === 'completed' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                              'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            }`}>
                              {bond.status || 'active'}
                            </span>
                          </div>

                          {/* Action */}
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => handleViewHash(bond)}
                              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              title="View Hash Details"
                            >
                              <IoEyeOutline size={14} className="md:w-4 md:h-4" />
                            </button>
                            <Link 
                              href={`/admin/bonds/${bond.id}`} 
                              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                              title="View Details"
                            >
                              <IoDocumentTextOutline size={14} className="md:w-4 md:h-4" />
                            </Link>
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
                    className="py-4 md:py-6 flex justify-center items-center gap-2 text-gray-500 text-sm"
                  >
                    <CgSpinner className="animate-spin text-[#5A4BDA]" size={20} />
                    <span>Loading more offerings...</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}