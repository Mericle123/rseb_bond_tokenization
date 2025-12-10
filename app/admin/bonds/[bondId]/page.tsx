'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoArrowBack, 
  IoCheckmarkCircle, 
  IoAlertCircle, 
  IoTimeOutline, 
  IoTrashOutline,
  IoTrendingUp,
  IoCalendarOutline,
  IoCashOutline,
  IoBusinessOutline,
  IoStatsChart,
  IoDocumentTextOutline
} from 'react-icons/io5';
import { fetchBondById } from '@/server/bond/creation';
import BondCountDown from '../../countdown';
import { allocateBondAndPersist } from '@/server/blockchain/bond';

/* ====================== Motion Variants ====================== */
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const staggerChildren = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
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

/* --- Helpers --- */
function formatDMY(dateISO: string) {
  const d = new Date(dateISO);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? 'st'
      : day % 10 === 2 && day % 100 !== 12
      ? 'nd'
      : day % 10 === 3 && day % 100 !== 13
      ? 'rd'
      : 'th';
  const month = d.toLocaleString('en-GB', { month: 'long' });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

/* ====================== Full Screen Loading Component ====================== */
function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#5B50D9]/30 border-t-[#5B50D9] rounded-full animate-spin mb-4"></div>
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-4">Loading bond details...</p>
      <p className="text-gray-500 mt-2">Please wait while we fetch the information</p>
    </div>
  );
}

/* ====================== Enhanced Allocation Modal ====================== */
function AllocationModal({
  isOpen,
  onClose,
  onAllocate,
  loading,
  error
}: {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: (alg: 'prorata' | 'equal') => void;
  loading: boolean;
  error: string | null;
}) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'prorata' | 'equal' | null>(null);

  const handleConfirm = () => {
    if (selectedAlgorithm) {
      onAllocate(selectedAlgorithm);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
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
                    disabled={loading}
                  >
                    <IoAlertCircle className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <IoTrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Allocate Bond</h2>
                      <p className="text-sm text-gray-600 mt-1">Choose allocation method</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedAlgorithm('prorata')}
                      disabled={loading}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedAlgorithm === 'prorata'
                          ? 'border-[#5B50D9] bg-[#F8F7FF] shadow-sm'
                          : 'border-gray-200 hover:border-[#5B50D9]/50 hover:bg-gray-50'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAlgorithm === 'prorata' 
                            ? 'border-[#5B50D9] bg-[#5B50D9]' 
                            : 'border-gray-300'
                        }`}>
                          {selectedAlgorithm === 'prorata' && (
                            <IoCheckmarkCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-800">Pro-rata Allocation</span>
                          <span className="block text-sm text-gray-500 mt-1">
                            Distribute units based on subscription share percentage
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedAlgorithm('equal')}
                      disabled={loading}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedAlgorithm === 'equal'
                          ? 'border-[#5B50D9] bg-[#F8F7FF] shadow-sm'
                          : 'border-gray-200 hover:border-[#5B50D9]/50 hover:bg-gray-50'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAlgorithm === 'equal' 
                            ? 'border-[#5B50D9] bg-[#5B50D9]' 
                            : 'border-gray-300'
                        }`}>
                          {selectedAlgorithm === 'equal' && (
                            <IoCheckmarkCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-800">Equal Allocation</span>
                          <span className="block text-sm text-gray-500 mt-1">
                            Distribute units equally among all subscribers
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <IoAlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedAlgorithm || loading}
                      className="flex-1 px-4 py-3 bg-[#5B50D9] hover:bg-[#4a40b9] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Allocating...
                        </>
                      ) : (
                        'Confirm Allocation'
                      )}
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

/* ====================== Enhanced Success Modal ====================== */
function SuccessModal({
  isOpen,
  onClose,
  onDashboard,
  algorithm,
  txDigest
}: {
  isOpen: boolean;
  onClose: () => void;
  onDashboard: () => void;
  algorithm: string | null;
  txDigest: string | null;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-center">
                <div className="p-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IoCheckmarkCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Allocation Completed</h3>
                  
                  {/* Algorithm Tag */}
                  {algorithm && (
                    <div className="flex justify-center mb-4">
                      <div className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
                        {algorithm === 'prorata' ? 'Pro-rata Allocation' : 'Equal Allocation'}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Allocation finalized successfully{algorithm ? ` using the ${algorithm === 'prorata' ? 'pro-rata' : 'equal'} method.` : '.'}
                  </p>
                  
                  {txDigest && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">Transaction Digest</p>
                      <code className="text-xs font-mono text-gray-800 break-all bg-white/80 p-2 rounded-lg block">
                        {txDigest}
                      </code>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                      onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      className="py-3 px-4 bg-[#5B50D9] text-white font-semibold rounded-xl hover:bg-[#4a40b9] shadow-lg shadow-indigo-200 transition-all"
                      onClick={onDashboard}
                    >
                      Dashboard
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

/* ====================== Delete Bond Panel ====================== */
type DeletePanelProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bond: { name: string; symbol: string; interestRate: string; issuer: string; };
};

function DeleteBondPanel({ open, onClose, onConfirm, bond }: DeletePanelProps) {
    const mounted = useMounted();
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = "Yes I am sure";

    useEffect(() => {
        if (!open) setConfirmationText('');
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button 
                type="button" 
                onClick={onClose} 
                aria-label="Close overlay" 
                className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} 
            />
            
            <aside 
                className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-l-[18px] border-l border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`} 
                role="dialog"
            >
                <div className="relative flex items-center border-b border-black/10 px-4 py-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        aria-label="Back" 
                        className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                    >
                        <IoArrowBack className="w-5 h-5" />
                    </button>
                    <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium pointer-events-none text-gray-800">Deletion</h2>
                </div>

                <div className="flex flex-col justify-between flex-1 p-6 text-center overflow-y-auto">
                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Are you sure you want to Delete this bond? Doing so will remove this from the marketplace permanently.
                        </p>
                        
                        <div className="flex gap-4 p-4 bg-purple-50 rounded-xl text-left mb-6 border border-purple-100">
                            <div className="relative flex-shrink-0">
                                <Image src="/logo.png" alt="Bond Icon" width={40} height={40} className="object-contain" />
                                <div className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-purple-50"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{bond.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">{bond.symbol}</p>
                                <p className="text-xs text-green-600 font-bold mt-1">Rate: {bond.interestRate}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Issuer: {bond.issuer}</p>
                            </div>
                        </div>

                        <div className="text-left">
                            <label className="block text-xs text-gray-500 mb-2">
                                Type "<strong className="text-gray-800">{requiredText}</strong>" to confirm:
                            </label>
                            <input
                                type="text"
                                placeholder={requiredText}
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                className="w-full p-4 text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-gray-50 focus:bg-white font-medium"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={onConfirm}
                        disabled={confirmationText !== requiredText} 
                        className="w-full p-4 mt-6 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-[0.98] transition shadow-lg shadow-red-200 disabled:bg-red-200 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Delete Permanently
                    </button>
                </div>
            </aside>
        </div>,
        document.body
    );
}

/* ====================== Helper Components ====================== */
const DetailItem = ({ label, value, icon: Icon }: { label: string; value: string | number; icon?: any }) => (
    <motion.div
        {...fadeIn}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
    >
        {Icon && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#5B50D9]" />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">{label}</span>
            <span className="text-gray-900 font-semibold text-lg truncate block">{value}</span>
        </div>
    </motion.div>
);

const StatCard = ({ title, value, subtitle, gradient }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    gradient?: string;
}) => (
    <motion.div
        {...fadeIn}
        className={`p-5 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all ${
            gradient || 'bg-gradient-to-br from-gray-50 to-gray-100/50'
        }`}
    >
        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {subtitle && <span className="text-sm text-gray-500 font-medium">{subtitle}</span>}
        </div>
    </motion.div>
);

/* ====================== Progress Bar Component ====================== */
const ProgressBar = ({ subscribed, total }: { subscribed: number; total: number }) => {
    const progress = Math.min((subscribed / total) * 100, 100);
    
    // Determine color based on progress
    let progressColor = '';
    if (subscribed > total) {
        progressColor = 'bg-gradient-to-r from-red-500 to-red-600'; // Red when over limit
    } else if (subscribed === total) {
        progressColor = 'bg-gradient-to-r from-green-500 to-green-600'; // Green when exactly at limit
    } else {
        progressColor = 'bg-gradient-to-r from-[#5B50D9] to-[#8B5CF6]'; // Purple when under limit
    }

    return (
        <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                    className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>0%</span>
                <span className={`font-medium ${
                    subscribed > total ? 'text-red-600' : 
                    subscribed === total ? 'text-green-600' : 'text-[#5B50D9]'
                }`}>
                    {progress.toFixed(1)}%
                </span>
                <span>100%</span>
            </div>
        </div>
    );
};

/* ====================== Main Page Component ====================== */
const AboutBondPage = ({ params }: { params: Promise<{ bondId: string }> }) => {
  const { bondId } = use(params);
  const router = useRouter();

  const [bond, setBond] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState(false);
  const [allocError, setAllocError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'prorata' | 'equal' | null>(null);

  useEffect(() => {
    async function getBond() {
      try {
        setLoading(true);
        const data = await fetchBondById(bondId);
        setBond(data);
      } catch (error) {
        console.error('Bond not found:', error);
      } finally {
        setLoading(false);
      }
    }
    getBond();
  }, [bondId]);

  const isSubscriptionEnded = bond ? new Date() > new Date(bond.subscription_end_date) : false;

  const isAllocated = !!bond?.allocated

  async function handleAllocate(alg: 'prorata' | 'equal') {
    setSelectedAlgorithm(alg);
    setAllocError(null);
    setAllocLoading(true);

    try {
      const result = await allocateBondAndPersist(bond, alg);
      setTxDigest(result?.digest ?? null);
      setAllocSuccess(true);
      setShowAllocModal(false);
      
      // Refresh bond data to show allocation status
      const updatedBond = await fetchBondById(bondId);
      setBond(updatedBond);
    } catch (err: any) {
      console.error('Error allocating bond:', err);
      setAllocError(err?.message || 'Allocation failed. Please try again.');
      setAllocSuccess(false);
    } finally {
      setAllocLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    alert("Bond deleted! (Connect this to your server action)");
    router.push('/admin');
  }

  const closeSuccessModal = () => {
    setAllocSuccess(false);
    setAllocError(null);
  };

  const goToAdmin = () => {
    router.push('/admin');
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!bond) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Bond Not Found</h2>
          <p className="text-gray-600 mb-4">The bond you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-2 bg-[#5B50D9] text-white rounded-xl font-semibold hover:bg-[#4a40b9] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const subscribedUnits = Number(bond.tl_unit_subscribed) / 10;
  const totalUnits = Number(bond.tl_unit_offered) / 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          {...fadeIn}
          className="flex items-center gap-4 mb-8"
        >
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100/80 text-gray-600 transition-colors group"
          >
            <IoArrowBack className="w-6 h-6 group-hover:text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Bond</h1>
            <p className="text-gray-600 mt-1">Complete bond overview and management</p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="whileInView"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* Left Column: Details & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bond Header Card */}
            <motion.section
              {...fadeIn}
              className="bg-gradient-to-br from-blue-50/80 to-indigo-100/50 rounded-2xl p-6 border border-blue-200/60 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-2xl border-2 border-white bg-white grid place-items-center shadow-lg">
                  <Image src="/logo.png" alt="Bond Icon" width={36} height={36} className="object-contain" />
                  <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ${
                    isSubscriptionEnded ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{bond.name}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200/60">
                      <IoDocumentTextOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{bond.bondSymbol}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200/60">
                      <IoBusinessOutline className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{bond.organization_name}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                      <IoTrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">
                        +{bond.interest_rate}% / yr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Key Metrics Grid */}
            <motion.section
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <StatCard 
                title="Face Value" 
                value={`${Number(bond.face_value) / 10} BTN`}
                icon={IoCashOutline}
              />
              <StatCard 
                title="Total Units Offered" 
                value={totalUnits}
                icon={IoStatsChart}
              />
              <StatCard 
                title="Issued Date" 
                value={formatDMY(bond.created_at)}
                icon={IoCalendarOutline}
              />
              <StatCard 
                title="Maturity Date" 
                value={formatDMY(bond.maturity)}
                icon={IoCalendarOutline}
              />
            </motion.section>

            {/* Subscription Progress */}
            <motion.section
              {...fadeIn}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoStatsChart className="w-5 h-5 text-[#5B50D9]" />
                Subscription Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Subscribed Units</span>
                  <span className={`text-lg font-bold ${
                    subscribedUnits > totalUnits ? 'text-red-600' : 
                    subscribedUnits === totalUnits ? 'text-green-600' : 'text-[#5B50D9]'
                  }`}>
                    {subscribedUnits} / {totalUnits}
                  </span>
                </div>
                
                <ProgressBar subscribed={subscribedUnits} total={totalUnits} />

                {subscribedUnits > totalUnits && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <IoAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">
                      <strong>Over-subscribed:</strong> Subscription has exceeded the total units offered by {subscribedUnits - totalUnits} units.
                    </p>
                  </div>
                )}

                {subscribedUnits === totalUnits && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <IoCheckmarkCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      <strong>Fully Subscribed:</strong> All units have been successfully subscribed.
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Purpose & Description */}
            <motion.section
              {...fadeIn}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9]" />
                Purpose & Description
              </h3>
              <div className="prose prose-gray max-w-none">
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {bond.purpose || "No description available for this bond."}
                  </p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Stats & Actions */}
          <motion.div
            variants={staggerChildren}
            className="lg:col-span-1 space-y-6"
          >
            {/* Timeline Card */}
            <motion.div
              {...fadeIn}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IoTimeOutline className="w-5 h-5 text-[#5B50D9]" />
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Subscription Ends</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatDMY(bond.subscription_end_date)}</p>
                    <p className="text-xs text-gray-500">
                      {isSubscriptionEnded ? (
                        <span className="text-red-500">Closed</span>
                      ) : (
                        <BondCountDown endDate={bond.subscription_end_date} />
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isSubscriptionEnded 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isSubscriptionEnded ? 'Subscription Closed' : 'Subscription Open'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Cards */}
            <motion.div
              {...fadeIn}
              className="space-y-4"
            >
              {/* Allocation Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100/50 rounded-2xl border border-emerald-200/60 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-emerald-900">Bond Allocation</h4>
                  
                  {/* Allocation Method Tag */}
                  {isAllocated && bond.allocated_method && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                      {bond.allocated_method === 'prorata' ? 'Pro-rata' : 'Equal'} Allocation
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-emerald-700 mb-4">
                  {!isSubscriptionEnded
                    ? 'Allocation will be available after subscription ends.'
                    : isAllocated
                    ? `This bond has already been allocated using the ${bond.allocated_method === 'prorata' ? 'pro-rata' : 'equal'} method. No further allocation is required.`
                    : 'Subscription period has ended. You can now allocate the bond.'}
                </p>
                
                {isAllocated && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Allocation Method: </span>
                      <span className="text-gray-900">{bond.allocated_method === 'prorata' ? 'Pro-rata Allocation' : 'Equal Allocation'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {bond.allocated_method === 'prorata' 
                        ? 'Units were distributed based on subscription share percentage' 
                        : 'Units were distributed equally among all subscribers'}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setShowAllocModal(true)}
                  disabled={!isSubscriptionEnded || allocLoading || isAllocated}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2
                    ${(!isSubscriptionEnded || allocLoading || isAllocated)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 active:scale-[0.98]'
                    }
                  `}
                >
                  {allocLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Allocating...
                    </>
                  ) : !isSubscriptionEnded ? (
                    <>
                      <IoTimeOutline className="w-5 h-5" />
                      Allocation Locked
                    </>
                  ) : isAllocated ? (
                    <>
                      <IoCheckmarkCircle className="w-5 h-5" />
                      Already Allocated
                    </>
                  ) : (
                    <>
                      <IoTrendingUp className="w-5 h-5" />
                      Allocate Bond
                    </>
                  )}
                </button>
              </div>

              {/* Management Actions */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm space-y-4">
                <Link 
                  href={`/admin/bonds/${bondId}/details`} 
                  className="w-full py-3.5 px-4 bg-[#5B50D9] hover:bg-[#4a40b9] text-white rounded-xl font-semibold text-center shadow-sm shadow-indigo-200 transition-all active:scale-[0.98] block"
                >
                  View More Details
                </Link>

                <button
                  onClick={() => setShowDeletePanel(true)}
                  className="w-full py-3.5 px-4 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <IoTrashOutline className="w-5 h-5" />
                  Delete Bond
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AllocationModal
        isOpen={showAllocModal}
        onClose={() => setShowAllocModal(false)}
        onAllocate={handleAllocate}
        loading={allocLoading}
        error={allocError}
      />

      <SuccessModal
        isOpen={allocSuccess}
        onClose={closeSuccessModal}
        onDashboard={goToAdmin}
        algorithm={selectedAlgorithm}
        txDigest={txDigest}
      />

      {/* Loading Overlay */}
      {allocLoading && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-[#5B50D9]/30 border-t-[#5B50D9] rounded-full animate-spin mb-4"></div>
          <p className="text-[#5B50D9] font-medium text-lg animate-pulse">Finalizing allocation on-chain...</p>
        </div>
      )}

      <DeleteBondPanel 
        open={showDeletePanel} 
        onClose={() => setShowDeletePanel(false)} 
        onConfirm={handleDeleteConfirm}
        bond={{
          name: bond.name,
          symbol: bond.bondSymbol,
          interestRate: `+${bond.interest_rate}% / yr`,
          issuer: bond.organization_name
        }} 
      />
    </div>
  );
};

export default AboutBondPage;