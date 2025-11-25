"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
// Icons
import { IoSearch, IoDocumentTextOutline, IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
// Logic
import { fetchBonds } from "@/server/bond/creation";
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "@/server/blockchain/btnc";


export default function AdminHomePage() {
  const [bonds, setBonds] = useState<any[]>([]);
  
  // --- STATE ---
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [copied, setCopied] = useState(false); // State for copy feedback

  // --- LOADING STATES ---
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [bondsLoading, setBondsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentUser, setCurrentUser] = useState(useCurrentUser());
  const [walletAddress, setWalletAddress] = useState(currentUser.wallet_address);
  const [balance, setBalance] = useState<string | null>(null);

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const BONDS_PER_PAGE = 10; 

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
    loadBalance();
  }, [walletAddress]);


  // --- INITIAL BONDS ---
  useEffect(() => {
    async function getInitialBonds() {
      setBondsLoading(true);
      try {
        const data = await fetchBonds(1, BONDS_PER_PAGE, false);
        setBonds(data);
        setPage(2);
        setHasMore(data.length === BONDS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setBondsLoading(false);
      }
    }
    getInitialBonds();
  }, []); 


  // --- LOAD MORE ---
  const loadMoreBonds = async () => {
    if (loadingMore || !hasMore) return; 

    setLoadingMore(true);
    try {
      const data = await fetchBonds(page, BONDS_PER_PAGE, false);
      setBonds((prevBonds) => [...prevBonds, ...data]); 
      setPage((prevPage) => prevPage + 1); 
      setHasMore(data.length === BONDS_PER_PAGE); 
    } catch (error) {
      console.error("Error fetching more bonds:", error);
    } finally {
      setLoadingMore(false);
    }
  };


  // --- OBSERVER ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBondElementRef = useCallback(
    (node: HTMLDivElement) => { 
      if (bondsLoading) return; 
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

    result.sort((a, b) => {
      switch (sortBy) {
        case "latest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "a-z": return a.bond_name.localeCompare(b.bond_name);
        case "z-a": return b.bond_name.localeCompare(a.bond_name);
        case "interest-high": return (Number(b.interest_rate) || 0) - (Number(a.interest_rate) || 0);
        case "interest-low": return (Number(a.interest_rate) || 0) - (Number(b.interest_rate) || 0);
        default: return 0;
      }
    });
    return result;
  }, [bonds, filterText, sortBy]);

  // --- HANDLE COPY ADDRESS ---
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    // Reduced padding-top (pt-4) to fix the "too big spacing" issue
    <div className="min-h-screen bg-gray-50/30 pt-4 px-4 pb-10 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto w-full space-y-6"> {/* Reduced space-y from 10 to 6 */}
      
        {/* === SECTION 1: HEADER & WALLET === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            
            {/* Wallet Address Chip */}
            <div className="mt-3 flex items-center gap-3">
                <div 
                    onClick={handleCopyAddress}
                    className={`group flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer w-full md:w-auto
                    ${copied 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#5A4BDA] hover:shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`w-2 h-2 shrink-0 rounded-full ${walletAddress ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        {/* break-all ensures the long address wraps on mobile if needed */}
                        <span className="font-mono text-sm break-all">
                            {walletAddress || 'Connecting...'}
                        </span>
                    </div>
                    
                    <button 
                        className={`shrink-0 p-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 group-hover:bg-[#5A4BDA] group-hover:text-white'}`}
                        title="Copy Address"
                    >
                        {copied ? <IoCheckmark size={14} /> : <IoCopyOutline size={14} />}
                    </button>
                </div>
                
                {copied && <span className="text-xs font-medium text-green-600 animate-in fade-in slide-in-from-left-2">Copied!</span>}
            </div>
          </div>

          <div className="text-left md:text-right bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-[240px] w-full md:w-auto">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Available Balance</p>
            {balanceLoading ? (
               <div className="h-9 w-32 bg-gray-200 rounded animate-pulse md:ml-auto"></div>
            ) : (
                <div className="text-3xl font-bold text-gray-900">
                     {balance && parseFloat(balance.replace(",", "")) > 0 ? balance : "0.00"} 
                     <span className="text-lg text-[#5A4BDA] ml-1">BTN₵</span>
                </div>
            )}
          </div>
        </div>


        {/* === SECTION 2: STATS === */}
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">System Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-[#E4E2FB] text-[#5A4BDA] group-hover:scale-110 transition-transform">
                        <BsFileEarmarkTextFill />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Active Offerings</p>
                        {bondsLoading ? (
                             <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                             <p className="text-gray-900 text-3xl font-bold">{bonds.length}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>


        {/* === SECTION 3: OFFERINGS CONTROL & TABLE === */}
        <div className="space-y-6">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">Active Offerings</h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative group flex-1">
                        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A4BDA] transition-colors" size={18} />
                        <input 
                        type="text" 
                        placeholder="Search bonds..." 
                        className="w-full sm:w-64 pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] transition-all shadow-sm"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        />
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
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>

                    {/* Create Button */}
                    <Link href="/admin/create-bond" className="flex items-center justify-center gap-2 bg-[#5A4BDA] text-white px-6 h-11 rounded-xl font-semibold hover:bg-[#4a3ec0] active:scale-[0.98] transition-all shadow-md shadow-[#5A4BDA]/20 whitespace-nowrap">
                        Create Bond <FaPlus size={14} />
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 font-semibold text-gray-500 text-xs uppercase tracking-wider min-w-[800px]">
                    <div>Bond Name</div>
                    <div>Created Date</div>
                    <div>Interest Rate</div>
                    <div>Units Offered</div>
                    <div className="text-center">Action</div>
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="min-w-[800px]">
                        
                        {bondsLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-5 border-b border-gray-50 items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
                                        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-8 w-8 mx-auto bg-gray-100 rounded animate-pulse"></div>
                                </div>
                            ))
                        ) : filteredBonds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <IoSearch size={48} className="mb-4 opacity-20" />
                                <p>No bonds found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredBonds.map((bond: any, index: number) => {
                                const isLastElement = filteredBonds.length === index + 1;
                                
                                return (
                                    <div 
                                    key={bond.id} 
                                    ref={isLastElement ? lastBondElementRef : null}
                                    className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/80 transition-colors text-sm group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex items-center justify-center bg-white rounded-full border border-gray-200 w-11 h-11 p-1 shrink-0 group-hover:border-[#5A4BDA]/30 transition-colors">
                                                <Image src="/logo.png" alt="Bond Icon" width={36} height={36} className="object-contain" />
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <span className="font-semibold text-gray-900 truncate text-base">{bond.bond_name}</span>
                                        </div>
                                        <div className="text-gray-600 font-medium">
                                            {new Date(bond.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                                                +{bond.interest_rate}% / yr
                                            </span>
                                        </div>
                                        <div className="text-gray-900 font-bold font-mono text-base">
                                            {bond.tl_unit_offered / 10}
                                        </div>
                                        <div className="flex justify-center">
                                            <Link 
                                                href={`/admin/bonds/${bond.id}`} 
                                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#5A4BDA] hover:bg-[#5A4BDA]/10 transition-all"
                                            >
                                                <IoDocumentTextOutline size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        
                        {loadingMore && (
                            <div className="py-6 flex justify-center items-center gap-2 text-gray-500 text-sm">
                                <CgSpinner className="animate-spin text-[#5A4BDA]" size={24} />
                                <span>Loading more offerings...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}