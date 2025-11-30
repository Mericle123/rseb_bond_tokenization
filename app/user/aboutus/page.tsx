"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoFilter, IoDocumentTextOutline, IoClose, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from "react-icons/io5";
import Navbar from "@/Components/UserNavbar";
import Footer from "../../../Components/UserFooter";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, y: -10 }
};

export default function BondsSection() {
  const bonds = [
    { name: "RICB Bond", rate: "+5% yr", amount: "Nu 1,000,000" },
    { name: "GMC Bond", rate: "+7% yr", amount: "Nu 1,000,000,000" },
    { name: "RTA Bond", rate: "+5% yr", amount: "Nu 5,000,000" },
    { name: "GovTech Bond", rate: "+2% yr", amount: "Nu 60,000" },
  ];

  const rows = [
    { id: "1", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "900/1000", face: "1.5M", status: "up" },
    { id: "2", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "1000/1000", face: "50M", status: "up" },
    { id: "3", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "305/1000", face: "5Lhaks", status: "down", disabled: true },
    { id: "4", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "306/1000", face: "9M", status: "down", disabled: true },
    { id: "5", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "2000/1000", face: "8M", status: "up" },
    { id: "6", name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "309/1000", face: "7M", status: "up" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter bonds based on search and filter
  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || 
        (activeFilter === "active" && !row.disabled) ||
        (activeFilter === "inactive" && row.disabled);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const FilterDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">Filter Bonds</span>
      </div>
      {[
        { key: "all", label: "All Bonds" },
        { key: "active", label: "Active Only" },
        { key: "inactive", label: "Inactive Only" }
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() => {
            setActiveFilter(filter.key);
            setShowFilterDropdown(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
            activeFilter === filter.key
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            filter.key === "all" ? "bg-gray-400" :
            filter.key === "active" ? "bg-emerald-500" : "bg-red-500"
          }`} />
          <span>{filter.label}</span>
        </button>
      ))}
    </motion.div>
  );

  return (
    <main className="bg-white w-full min-h-screen">
      <Navbar/>
      
      {/* BONDS SECTION */}
      <section className="w-full bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT CARD */}
            <motion.div 
              {...fadeIn}
              className="bg-white border border-gray-200 rounded-2xl px-6 sm:px-8 py-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">
                  Newly added bonds
                </h2>
                <span className="flex-1 ml-3 h-[2px] bg-indigo-700 rounded"></span>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {bonds.map((bond, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between text-[14px] sm:text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt={bond.name}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">{bond.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-500 font-medium bg-green-50 px-2 py-1 rounded-md">
                        {bond.rate}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {bond.amount}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* RIGHT CARD */}
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <div className="relative h-20 w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                  <Image
                    src="/coin.png"
                    alt="BTN Coin"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-[15px] sm:text-lg font-semibold text-gray-800 leading-snug">
                  Turn your Ngultrum into Digital BTN Coins
                </h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Subscribe instantly, own your share of Bhutan's digital future.
                </p>
                <button className="mt-4 bg-[#2F2A7B] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5">
                  Get BTN Coins Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TOKEN TABLE SECTION */}
      <section className="w-full mt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            {...fadeIn}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
          >
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Token available
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-3xl">
                View real-time prices, trading volumes, market changes, and capitalization
                of all listed companies on the Royal Securities Exchange of Bhutan (RSEB).
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-0">
                <div className="relative">
                  <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search bonds..."
                  />
                </div>
              </div>
              
              {/* Filter Button with Dropdown */}
              <div className="filter-dropdown-container relative">
                <button 
                  className="h-11 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center sm:justify-start min-w-[100px]"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  aria-expanded={showFilterDropdown}
                  aria-haspopup="true"
                >
                  <IoFilter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter</span>
                </button>
                
                <AnimatePresence>
                  {showFilterDropdown && <FilterDropdown />}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Active Filter Badge */}
          {activeFilter !== "all" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="text-sm text-gray-600">Active filter:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>
                  {activeFilter === "all" ? "All Bonds" : 
                   activeFilter === "active" ? "Active Only" : "Inactive Only"}
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
          <motion.div 
            {...fadeIn}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Desktop Table */}
            <div className="hidden lg:block">
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
                      Total Unit offered
                    </th>
                    <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                      Unit available
                    </th>
                    <th scope="col" className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                      Face value(Nu)
                    </th>
                    <th scope="col" className="py-4 pl-4 pr-6 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <AnimatePresence>
                    {filteredRows.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Bond Details */}
                        <td className="py-5 pl-6 pr-3">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="relative h-12 w-12 rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                  src="/RSEB.png"
                                  alt="Bond"
                                  width={24}
                                  height={24}
                                  className={`object-contain ${row.disabled ? "opacity-40" : ""}`}
                                />
                              </div>
                              <span
                                aria-hidden="true"
                                className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white ${
                                  row.status === "up"
                                    ? "bg-emerald-500"
                                    : row.status === "down"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              />
                            </div>
                            <div>
                              <span className={`text-base font-semibold ${row.disabled ? "text-gray-400" : "text-gray-900"} block`}>
                                {row.name}
                              </span>
                              <span className={`text-sm ${row.disabled ? "text-gray-300" : "text-gray-500"} mt-0.5 block`}>
                                Royal Securities Exchange
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Interest Rate */}
                        <td className="py-5 px-4">
                          <div className={`text-lg font-bold ${row.disabled ? "text-gray-300" : "text-emerald-600"}`}>
                            {row.rate}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">per annum</div>
                        </td>

                        {/* Total Units */}
                        <td className="py-5 px-4">
                          <div className={`text-base font-medium ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                            {row.total}
                          </div>
                        </td>

                        {/* Available Units */}
                        <td className="py-5 px-4">
                          <div className={`text-base font-medium ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                            {row.available}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                              className="h-1.5 rounded-full bg-blue-600 transition-all duration-500" 
                              style={{ 
                                width: `${parseInt(row.available.split('/')[0]) / parseInt(row.total) * 100}%` 
                              }}
                            />
                          </div>
                        </td>

                        {/* Face Value */}
                        <td className="py-5 px-4">
                          <div className={`text-base font-bold ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                            {row.face}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">per unit</div>
                        </td>

                        {/* Action */}
                        <td className="py-5 pl-4 pr-6">
                          <Link 
                            href={`/tokens/${row.id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#5B50D9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <IoDocumentTextOutline className="w-4 h-4" />
                            View Details
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              <AnimatePresence>
                {filteredRows.map((row) => (
                  <motion.div
                    key={row.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="relative h-12 w-12 rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm">
                            <Image
                              src="/RSEB.png"
                              alt="Bond"
                              width={24}
                              height={24}
                              className={`object-contain ${row.disabled ? "opacity-40" : ""}`}
                            />
                          </div>
                          <span
                            aria-hidden="true"
                            className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white ${
                              row.status === "up"
                                ? "bg-emerald-500"
                                : row.status === "down"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${row.disabled ? "text-gray-400" : "text-gray-900"}`}>
                            {row.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Royal Securities Exchange
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${row.disabled ? "text-gray-300" : "text-emerald-600"}`}>
                        {row.rate}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">Total Units</p>
                        <p className={`text-base font-semibold ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                          {row.total}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">Available</p>
                        <p className={`text-base font-semibold ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                          {row.available}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-blue-600" 
                            style={{ 
                              width: `${parseInt(row.available.split('/')[0]) / parseInt(row.total) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">Face Value</p>
                        <p className={`text-base font-bold ${row.disabled ? "text-gray-300" : "text-gray-900"}`}>
                          {row.face}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-gray-100">
                      <Link 
                        href={`/tokens/${row.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B50D9] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm transform hover:-translate-y-0.5"
                      >
                        <IoDocumentTextOutline className="w-4 h-4" />
                        View Bond Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredRows.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoDocumentTextOutline className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bonds found
                </h3>
                <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                  {searchQuery || activeFilter !== "all"
                    ? "No bonds match your current filters. Try adjusting your search or filters."
                    : "No bond offerings available at the moment."
                  }
                </p>
                {(searchQuery || activeFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      <Footer/>
    </main>
  );
}