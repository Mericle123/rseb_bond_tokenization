"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
// Icons
import { IoSearch, IoDocumentTextOutline, IoFilter, IoClose } from 'react-icons/io5';
import { CgSpinner } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
import { TrendingUp, TrendingDown, Minus, Percent, Package, X } from "lucide-react";
// Logic
import { fetchBonds } from '@/server/bond/creation';

// ========================= Types =========================
type Status = "up" | "down" | "flat";

type Bond = {
  id: string;
  bond_name: string;
  interest_rate: number;
  tl_unit_offered: number;
  tl_unit_subscribed: number;
  status: string;
  created_at: string;
  statusIndicator?: Status;
};

// ========================= Motion presets =========================
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

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
    { key: "up", label: "Growing" },
    { key: "down", label: "Declining" },
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

export default function AssetsPage() {
  const [bonds, setBonds] = useState<Bond[]>([]); 

  // --- FILTER & SORT STATE ---
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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
        // Add status indicators for demo purposes
        const bondsWithStatus = data.map((bond: any) => ({
          ...bond,
          statusIndicator: ["up", "down", "flat"][Math.floor(Math.random() * 3)] as Status
        }));
        setBonds(bondsWithStatus);
        setPage(2); 
        setHasMore(data.length === BONDS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
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
      const bondsWithStatus = data.map((bond: any) => ({
        ...bond,
        statusIndicator: ["up", "down", "flat"][Math.floor(Math.random() * 3)] as Status
      }));
      setBonds((prevBonds) => [...prevBonds, ...bondsWithStatus]); 
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

    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter((bond) => bond.statusIndicator === activeFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sortBy) {
        case "latest": 
            return dateB - dateA;
        case "oldest": 
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
  }, [bonds, filterText, sortBy, activeFilter]);

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

  // Stats calculations
  const totalBonds = filteredBonds.length;
  const totalUnits = filteredBonds.reduce((sum, bond) => sum + (bond.tl_unit_subscribed / 10), 0);
  const avgInterestRate = filteredBonds.length > 0 
    ? (filteredBonds.reduce((sum, bond) => sum + Number(bond.interest_rate), 0) / filteredBonds.length).toFixed(2)
    : "0.00";

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "up": return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] pt-4 px-4 pb-10 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto w-full space-y-6">

        {/* --- HEADER SECTION - Updated to match reference --- */}
        <motion.header {...fadeIn} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Allocated Assets
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Keep track of past bonds
              </p>
            </div>
          </div>
        </motion.header>

        {/* Stats Overview - Responsive grid */}
        {filteredBonds.length > 0 && (
          <motion.div 
            {...fadeIn}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Bonds</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalBonds}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Units</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {totalUnits.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Interest Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {avgInterestRate}%
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Assets Section */}
        <section className="w-full" aria-labelledby="assets-title">
          <div className="mx-auto max-w-7xl">
            {/* Header - Improved responsive layout */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex-1 min-w-0">
                <h2
                  id="assets-title"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900"
                >
                  Bond Series
                </h2>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base max-w-3xl">
                 
                </p>
                
                {/* Active Filter Badge */}
                {activeFilter !== "all" && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-gray-600">Active filter:</span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <span>
                        {activeFilter === "up" ? "Growing" : 
                         activeFilter === "down" ? "Declining" : "Stable"}
                      </span>
                      <button
                        onClick={() => setActiveFilter("all")}
                        className="hover:text-blue-900"
                        aria-label="Clear filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search and Filters - Improved responsive behavior */}
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
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      placeholder="Search bonds..."
                    />
                  </div>
                </div>
                
                {/* Sorting */}
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    className="w-full sm:w-auto h-10 sm:h-11 pl-3 pr-10 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none shadow-sm font-medium text-gray-700"
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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

            {/* Empty state */}
            {!bondsLoading && filteredBonds.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 sm:p-12 text-center"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {filterText || activeFilter !== "all" ? "No matching bonds found" : "No bonds in your portfolio"}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto">
                  {filterText 
                    ? `We couldn't find any bonds matching "${filterText}". Try adjusting your search terms.`
                    : activeFilter !== "all"
                    ? `No bonds match the "${activeFilter === "up" ? "Growing" : activeFilter === "down" ? "Declining" : "Stable"}" filter. Try a different filter.`
                    : "You haven't purchased any bonds yet. Start building your portfolio by exploring available bonds."
                  }
                </p>
                {(filterText || activeFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterText("");
                      setActiveFilter("all");
                    }}
                    className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Mobile list - Improved responsive design */}
            <ul
              className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:hidden"
              role="list"
              aria-label="Your bonds"
            >
              {filteredBonds.map((bond, index) => {
                const isLastElement = filteredBonds.length === index + 1;
                const isInactive = bond.status === 'inactive';
                const dim = isInactive ? "text-gray-300" : "text-gray-900";
                const rateCol = isInactive ? "text-gray-300" : 
                  bond.statusIndicator === "down" ? "text-red-600" :
                  bond.statusIndicator === "flat" ? "text-gray-600" : "text-emerald-600";

                return (
                  <motion.li
                    key={bond.id}
                    ref={isLastElement ? lastBondElementRef : undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                    aria-disabled={isInactive || undefined}
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm">
                          <Image
                            src="/logo.png"
                            alt="Issuer"
                            width={20}
                            height={20}
                            className={`object-contain ${isInactive ? "opacity-40" : ""}`}
                          />
                          <span
                            aria-hidden
                            className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ring-2 ring-white ${
                              bond.statusIndicator === "up"
                                ? "bg-emerald-500"
                                : bond.statusIndicator === "down"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                            }`}
                          />
                          <span className="sr-only">
                            {bond.statusIndicator === "up"
                              ? "Trending up"
                              : bond.statusIndicator === "down"
                                ? "Trending down"
                                : "No change"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm sm:text-base font-semibold truncate ${dim}`}>
                            {bond.bond_name}
                          </p>
                          <p className={`text-xs sm:text-sm ${rateCol} font-medium flex items-center gap-1`}>
                            {getStatusIcon(bond.statusIndicator!)}
                            +{bond.interest_rate}% / yr
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Units Allocated</p>
                        <p className={`text-base sm:text-lg font-bold ${dim}`}>
                          {(bond.tl_unit_subscribed / 10).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Offered</p>
                        <p className={`text-sm sm:text-base font-semibold ${dim}`}>
                          {(bond.tl_unit_offered / 10).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Button for Mobile */}
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex h-9 sm:h-10 px-4 sm:px-6 items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                         shadow-sm hover:shadow-md focus:outline-none disabled:opacity-50 transition-all duration-200"
                        onClick={() => window.open(`/admin/bonds/${bond.id}`, '_blank')}
                        disabled={isInactive}
                        aria-disabled={isInactive || undefined}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {/* Desktop table - Improved responsive behavior */}
            {filteredBonds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 sm:mt-6 overflow-hidden rounded-xl sm:rounded-2xl hidden lg:block border border-gray-200 bg-white shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table
                    aria-labelledby="assets-title"
                    className="w-full min-w-[800px]"
                  >
                    <caption className="sr-only">
                      Your purchased bonds
                    </caption>
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/80">
                        <th scope="col" className="py-3 sm:py-4 pl-4 sm:pl-6 pr-3 sm:pr-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Bond Details</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Interest Rate</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Units Held</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Offered</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 pl-3 sm:pl-4 pr-4 sm:pr-6 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredBonds.map((bond, index) => {
                        const isLastElement = filteredBonds.length === index + 1;
                        const isInactive = bond.status === 'inactive';
                        const dim = isInactive ? "text-gray-300" : "text-gray-900";
                        const rateCol = isInactive ? "text-gray-300" : 
                          bond.statusIndicator === "down" ? "text-red-600" :
                          bond.statusIndicator === "flat" ? "text-gray-600" : "text-emerald-600";

                        return (
                          <tr 
                            key={bond.id} 
                            ref={isLastElement ? lastBondElementRef : null}
                            className="group hover:bg-gray-50/50 transition-colors duration-200"
                          >
                            <td className="py-4 sm:py-5 pl-4 sm:pl-6 pr-3 sm:pr-4">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
                                  <Image
                                    src="/logo.png"
                                    alt="Issuer"
                                    width={22}
                                    height={22}
                                    className={`object-contain ${isInactive ? "opacity-40" : ""}`}
                                  />
                                  <span
                                    aria-hidden
                                    className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ring-2 ring-white ${
                                      bond.statusIndicator === "up"
                                        ? "bg-emerald-500"
                                        : bond.statusIndicator === "down"
                                          ? "bg-red-500"
                                          : "bg-gray-400"
                                    }`}
                                  />
                                  <span className="sr-only">
                                    {bond.statusIndicator === "up"
                                      ? "Trending up"
                                      : bond.statusIndicator === "down"
                                        ? "Trending down"
                                        : "No change"}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <span
                                    className={`text-sm sm:text-base font-semibold truncate ${dim} group-hover:text-gray-700 transition-colors`}
                                  >
                                    {bond.bond_name}
                                  </span>
                                  {isInactive && (
                                    <span className="text-[10px] uppercase text-red-500 font-bold tracking-wide block mt-1">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className={`py-4 sm:py-5 px-3 sm:px-4 text-sm sm:text-base font-semibold ${rateCol}`}>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(bond.statusIndicator!)}
                                +{bond.interest_rate}%
                                <span className="text-xs sm:text-sm font-normal text-gray-500">/yr</span>
                              </div>
                            </td>

                            <td className={`py-4 sm:py-5 px-3 sm:px-4 text-sm sm:text-base font-bold ${dim}`}>
                              {(bond.tl_unit_subscribed / 10).toLocaleString()}
                              <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">units</span>
                            </td>
                            
                            <td className={`py-4 sm:py-5 px-3 sm:px-4 text-sm sm:text-base font-semibold ${dim}`}>
                              {(bond.tl_unit_offered / 10).toLocaleString()}
                              <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">units</span>
                            </td>

                            <td className="py-4 sm:py-5 pl-3 sm:pl-4 pr-4 sm:pr-6">
                              <Link 
                                href={`/admin/bonds/${bond.id}`} 
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              >
                                <IoDocumentTextOutline size={20} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Infinite Scroll Loading Spinner */}
                {loadingMore && (
                  <div className="py-6 flex justify-center items-center gap-2 text-gray-500 text-sm border-t border-gray-100">
                    <CgSpinner className="animate-spin text-blue-600" size={24} />
                    <span>Loading more assets...</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Loading skeleton for desktop */}
            {bondsLoading && (
              <div className="mt-4 sm:mt-6 overflow-hidden rounded-xl sm:rounded-2xl hidden lg:block border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/80">
                        <th scope="col" className="py-3 sm:py-4 pl-4 sm:pl-6 pr-3 sm:pr-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Bond Details</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Interest Rate</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Units Held</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 px-3 sm:px-4 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Offered</span>
                        </th>
                        <th scope="col" className="py-3 sm:py-4 pl-3 sm:pl-4 pr-4 sm:pr-6 text-left">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50 animate-pulse">
                          <td className="py-4 sm:py-5 pl-4 sm:pl-6 pr-3 sm:pr-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-200"></div>
                              <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                          <td className="py-4 sm:py-5 px-3 sm:px-4">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-4 sm:py-5 px-3 sm:px-4">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-4 sm:py-5 px-3 sm:px-4">
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-4 sm:py-5 pl-3 sm:pl-4 pr-4 sm:pr-6">
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}