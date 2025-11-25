'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPortal } from "react-dom"; // Required for the panel
import { IoArrowBack, IoCheckmarkCircle, IoAlertCircle, IoTimeOutline, IoTrashOutline } from 'react-icons/io5';
import { fetchBondById } from '@/server/bond/creation';
import BondCountDown from '../../countdown';
import { allocateBondAndPersist } from '@/server/blockchain/bond';

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

/* --- Main Page Component --- */

const AboutBondPage = ({ params }: { params: Promise<{ bondId: string }> }) => {
  const { bondId } = use(params);
  const router = useRouter();

  const [bond, setBond] = useState<any>(null);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [showDeletePanel, setShowDeletePanel] = useState(false); // New state for delete panel
  
  // Allocation state
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState(false);
  const [allocError, setAllocError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'prorata' | 'equal' | null>(null);

  useEffect(() => {
    async function getBond() {
      try {
        const data = await fetchBondById(bondId);
        setBond(data);
      } catch (error) {
        console.error('Bond not found:', error);
      }
    }
    getBond();
  }, [bondId]);

  // Loading Guard
  if (!bond) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
  }

  // Logic: Check if time is over
  const isSubscriptionEnded = new Date() > new Date(bond.subscription_end_date);

  // Handle Allocation
  async function handleAllocate(alg: 'prorata' | 'equal') {
    setSelectedAlgorithm(alg);
    setAllocError(null);
    setAllocLoading(true);

    try {
      const result = await allocateBondAndPersist(bond, alg);
      setTxDigest(result?.digest ?? null);
      setAllocSuccess(true);
      setShowAllocModal(false);
    } catch (err: any) {
      console.error('Error allocating bond:', err);
      setAllocError(err?.message || 'Allocation failed. Please try again.');
      setAllocSuccess(false);
    } finally {
      setAllocLoading(false);
    }
  }

  // Handle Delete (Mock logic - replace with actual server action)
  async function handleDeleteConfirm() {
    // Call your delete server action here, e.g.:
    // await deleteBond(bondId);
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

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 max-w-7xl mx-auto font-sans">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors" 
          onClick={() => router.back()}
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">About Bond</h1>
      </div>

      {/* --- Top Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-8 mb-8 gap-6">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-full border border-gray-200 shadow-sm shrink-0">
            <Image src="/logo.png" alt="Bond Icon" width={40} height={40} className="object-contain" />
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-gray-100 ${isSubscriptionEnded ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{bond.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">{bond.bondSymbol}</span>
                <span>•</span>
                <span>From: {bond.organization_name}</span>
            </div>
            <p className="text-emerald-500 font-semibold mt-1">Interest rate: +{bond.interest_rate}% / yr</p>
          </div>
        </div>

        <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl w-full md:w-auto">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Subscription Closes In</p>
          <div className="text-2xl font-bold text-gray-900">
            {isSubscriptionEnded ? (
                <span className="text-red-500">Closed</span>
            ) : (
                <BondCountDown endDate={bond.subscription_end_date} />
            )}
          </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <DetailItem label="Bond Name" value={bond.bond_name} />
                    <DetailItem label="Bond Symbol" value={bond.bond_symbol} />
                    <DetailItem label="Issuer" value={bond.organization_name} />
                    <DetailItem label="Issued Date" value={formatDMY(bond.created_at)} />
                    <DetailItem label="Maturity Date" value={formatDMY(bond.maturity)} />
                    <DetailItem label="Face Value" value={Number(bond.face_value) / 10} />
                    <DetailItem label="Total Units Offered" value={Number(bond.tl_unit_offered) / 10} />
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Purpose & Description</h3>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p>{bond.purpose}</p>
                </div>
            </section>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#F8F7FF] border border-[#DDEBFF] p-6 rounded-2xl shadow-sm">
                <p className="text-gray-600 text-sm mb-2">Total Subscribed Units</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#5B50D9]">
                        {Number(bond.tl_unit_subscribed) / 10}
                    </span>
                    <span className="text-gray-400 font-medium text-lg">
                        / {Number(bond.tl_unit_offered) / 10}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div 
                        className="bg-[#5B50D9] h-2.5 rounded-full" 
                        style={{ width: `${Math.min(((Number(bond.tl_unit_subscribed)/Number(bond.tl_unit_offered)) * 100), 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative group">
                    <button
                        onClick={() => setShowAllocModal(true)}
                        disabled={!isSubscriptionEnded || allocLoading}
                        className={`w-full py-3.5 px-4 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2
                            ${!isSubscriptionEnded || allocLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 active:scale-[0.98]'
                            }
                        `}
                    >
                        {allocLoading ? 'Allocating...' : !isSubscriptionEnded ? <><IoTimeOutline size={18} /> Allocation Locked</> : 'Allocate Bond'}
                    </button>
                    {!isSubscriptionEnded && !allocLoading && (
                        <p className="text-center text-xs text-gray-400 mt-2">Available after subscription ends.</p>
                    )}
                </div>

                <Link 
                    href={`/admin/bonds/${bondId}/details`} 
                    className="w-full py-3.5 px-4 bg-[#5B50D9] hover:bg-[#4a40b9] text-white rounded-xl font-semibold text-center shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                    View More Details
                </Link>

                {/* UPDATED: Delete Button triggers the Panel now */}
                <button
                    onClick={() => setShowDeletePanel(true)}
                    className="w-full py-3.5 px-4 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                    <IoTrashOutline size={18} />
                    Delete Bond
                </button>
            </div>
        </div>
      </div>


      {/* --- MODALS & PANELS --- */}

      {/* 1. Allocation Method Modal */}
      {showAllocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Allocation Method</h3>
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={() => handleAllocate('prorata')} disabled={allocLoading} className="p-4 rounded-xl border border-gray-200 hover:border-[#5B50D9] hover:bg-[#F8F7FF] transition-all text-left group">
                <span className="block font-semibold text-gray-800 group-hover:text-[#5B50D9]">Pro-rata Allocation</span>
                <span className="text-sm text-gray-500">Distribute units based on subscription share.</span>
              </button>
              <button onClick={() => handleAllocate('equal')} disabled={allocLoading} className="p-4 rounded-xl border border-gray-200 hover:border-[#5B50D9] hover:bg-[#F8F7FF] transition-all text-left group">
                <span className="block font-semibold text-gray-800 group-hover:text-[#5B50D9]">Equal Allocation</span>
                <span className="text-sm text-gray-500">Distribute units equally among subscribers.</span>
              </button>
            </div>
            {allocError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><IoAlertCircle size={18} />{allocError}</div>}
            <button onClick={() => setShowAllocModal(false)} disabled={allocLoading} className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* 2. Loading Overlay */}
      {allocLoading && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-[#5B50D9]/30 border-t-[#5B50D9] rounded-full animate-spin mb-4"></div>
          <p className="text-[#5B50D9] font-medium text-lg animate-pulse">Finalizing allocation on-chain...</p>
        </div>
      )}

      {/* 3. Success Popup */}
      {allocSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><IoCheckmarkCircle size={32} /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Allocation Completed</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Allocation finalized successfully{selectedAlgorithm ? ` using the ${selectedAlgorithm} method.` : '.'}</p>
            {txDigest && <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200"><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transaction Digest</p><code className="text-xs font-mono text-gray-800 break-all">{txDigest}</code></div>}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors" onClick={closeSuccessModal}>Close</button>
              <button className="py-3 px-4 bg-[#5B50D9] text-white font-semibold rounded-xl hover:bg-[#4a40b9] shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]" onClick={goToAdmin}>Dashboard</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Bond Panel */}
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

/* --------------------------- Helper Components --------------------------- */

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</span>
        <span className="text-gray-900 font-medium text-lg truncate">{value}</span>
    </div>
);


/* --------------------------- Delete Bond Panel --------------------------- */

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

    // Reset text when panel opens/closes
    useEffect(() => {
        if (!open) setConfirmationText('');
    }, [open]);

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Backdrop */}
            <button 
                type="button" 
                onClick={onClose} 
                aria-label="Close overlay" 
                className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} 
            />
            
            {/* Slide-in Panel */}
            <aside 
                className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-l-[18px] border-l border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`} 
                role="dialog"
            >
                {/* Panel Header */}
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

                {/* Panel Content */}
                <div className="flex flex-col justify-between flex-1 p-6 text-center overflow-y-auto">
                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Are you sure you want to Delete this bond? Doing so will remove this from the marketplace permanently.
                        </p>
                        
                        {/* Bond Summary Card */}
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

                        {/* Confirmation Input */}
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

                    {/* Action Button */}
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

export default AboutBondPage;