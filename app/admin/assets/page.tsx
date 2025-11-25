"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// Icons
import { IoSearch, IoDocumentTextOutline } from 'react-icons/io5';
import { CgSpinner } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
// Logic
import { fetchBonds } from '@/server/bond/creation';

export default function AssetsPage() {
  const [bonds, setBonds] = useState<any[]>([]); 

  // --- FILTER & SORT STATE ---
  const [filterText, setFilterText] = useState("");
  // DEFAULT SORT IS SET TO "latest" HERE
  const [sortBy, setSortBy] = useState("latest");

  // --- LOADING STATES ---
  const [bondsLoading, setBondsLoading] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false); 

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const BONDS_PER_PAGE = 15; 

  // --- INITIAL LOAD ---
  useEffect(() => {
    async function getInitialBonds() {
      setBondsLoading(true);
      try {
        const data = await fetchBonds(1, BONDS_PER_PAGE, true);
        setBonds(data);
        setPage(2); 
        setHasMore(data.length === BONDS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        // Small delay for the animation
        setTimeout(() => setBondsLoading(false), 500);
      }
    }
    getInitialBonds();
  }, []); 

  // --- LOAD MORE FUNCTION ---
  const loadMoreBonds = async () => {
    if (loadingMore || !hasMore) return; 

    setLoadingMore(true);
    try {
      const data = await fetchBonds(page, BONDS_PER_PAGE, true);
      setBonds((prevBonds) => [...prevBonds, ...data]); 
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.length === BONDS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more bonds:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- INTERSECTION OBSERVER ---
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

  // --- FILTERING & SORTING LOGIC ---
  const filteredBonds = useMemo(() => {
    let result = bonds.filter((bond) => 
      bond.bond_name.toLowerCase().includes(filterText.toLowerCase())
    );

    result.sort((a, b) => {
      // Safe date parsing helper
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sortBy) {
        case "latest": 
            // Descending Order (Newest date - Oldest date)
            return dateB - dateA;
        case "oldest": 
            // Ascending Order (Oldest date - Newest date)
            return dateA - dateB;
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
  }, [bonds, filterText, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/30 pt-4 px-4 pb-10 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto w-full space-y-6">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-[#E4E2FB] rounded-xl text-[#5A4BDA]">
                    <BsBoxSeam size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Allocated Assets</h1>
                    <p className="text-sm text-gray-500">Manage your bond portfolio</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative group flex-1">
                    <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A4BDA] transition-colors" size={18} />
                    <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="w-full sm:w-64 pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] transition-all shadow-sm"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>

                {/* Sorting */}
                <div className="relative flex-1 sm:flex-none">
                    <select 
                    className="w-full sm:w-auto h-11 pl-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]/20 focus:border-[#5A4BDA] cursor-pointer appearance-none shadow-sm font-medium text-gray-700"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="latest">Latest Added</option>
                        <option value="oldest">Oldest Added</option>
                        <option value="a-z">Name (A-Z)</option>
                        <option value="z-a">Name (Z-A)</option>
                        <option value="interest-high">Interest (High-Low)</option>
                        <option value="interest-low">Interest (Low-High)</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 font-semibold text-gray-500 text-xs uppercase tracking-wider min-w-[800px]">
                <div>Bond Name</div>
                <div>Interest Rate</div>
                <div>Total Units Offered</div>
                <div>Units Subscribed</div>
                <div className="text-center">Action</div>
            </div>

            {/* Table Body */}
            <div className="overflow-y-auto flex-1">
                <div className="min-w-[800px]">
                    
                    {bondsLoading ? (
                        // --- SKELETON LOADING ANIMATION (Pulse Effect) ---
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-5 border-b border-gray-50 items-center animate-pulse">
                                {/* Icon + Name Skeleton */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                </div>
                                {/* Interest Rate Skeleton */}
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                {/* Units Skeleton */}
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                {/* Subscribed Skeleton */}
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                {/* Action Button Skeleton */}
                                <div className="h-8 w-8 mx-auto bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : filteredBonds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <IoSearch size={48} className="mb-4 opacity-20" />
                            <p>No allocated bonds found.</p>
                        </div>
                    ) : (
                        filteredBonds.map((bond: any, index: number) => {
                            const isLastElement = filteredBonds.length === index + 1;
                            
                            return (
                                <div 
                                    key={bond.id} 
                                    ref={isLastElement ? lastBondElementRef : null}
                                    className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)_80px] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/80 transition-colors text-sm group animate-in fade-in duration-300"
                                >
                                    {/* Bond Name */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex items-center justify-center bg-white rounded-full border border-gray-200 w-11 h-11 p-1 shrink-0 group-hover:border-[#5A4BDA]/30 transition-colors">
                                            <Image src="/logo.png" alt="Bond Icon" width={36} height={36} className="object-contain" />
                                            {/* Status Dot */}
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${bond.status === 'inactive' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-base truncate ${bond.status === 'inactive' ? 'text-gray-400' : 'text-gray-900'}`}>
                                                {bond.bond_name}
                                            </span>
                                            {bond.status === 'inactive' && <span className="text-[10px] uppercase text-red-500 font-bold tracking-wide">Inactive</span>}
                                        </div>
                                    </div>

                                    {/* Interest Rate */}
                                    <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                                            +{bond.interest_rate}% / yr
                                        </span>
                                    </div>

                                    {/* Units Offered */}
                                    <div className="text-gray-600 font-medium">
                                        {bond.tl_unit_offered / 10}
                                    </div>

                                    {/* Units Subscribed */}
                                    <div className="text-gray-900 font-bold font-mono text-base">
                                        {bond.tl_unit_subscribed / 10}
                                    </div>

                                    {/* Action */}
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

                    {/* Infinite Scroll Loading Spinner */}
                    {loadingMore && (
                        <div className="py-6 flex justify-center items-center gap-2 text-gray-500 text-sm">
                            <CgSpinner className="animate-spin text-[#5A4BDA]" size={24} />
                            <span>Loading more assets...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};