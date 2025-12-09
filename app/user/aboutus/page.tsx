"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearch,
  IoFilter,
  IoDocumentTextOutline,
  IoClose,
  IoTrendingUp,
  IoStatsChart,
  IoWallet,
} from "react-icons/io5";

import Navbar from "@/Components/UserNavbar";
import Footer from "../../../Components/UserFooter";

// ========================= Types =========================

type Status = "up" | "down" | "flat";
type MarketTab = "primary" | "resale";

interface TableBond {
  id: string;
  name: string;
  interestRate: number;
  totalUnits: number;
  availableUnits: number;
  faceValue: number; // per unit (store as integer for nicer formatting)
  status: Status;
  disabled?: boolean;
  market: MarketTab;
}

// ========================= Animation variants =========================

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
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, y: -10 },
};

// ========================= Number formatters =========================

const nfInt = new Intl.NumberFormat("en-IN");
const nfCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "BTN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

// ========================= Static marketplace data (demo) =========================

const ALL_BONDS: TableBond[] = [
  // Primary market
  {
    id: "1",
    name: "RICB 5-Year Bond",
    interestRate: 5.0,
    totalUnits: 1000,
    availableUnits: 900,
    faceValue: 1500_00, // 1,500 BTN
    status: "up",
    market: "primary",
  },
  {
    id: "2",
    name: "GMC 7-Year Bond",
    interestRate: 7.0,
    totalUnits: 2000,
    availableUnits: 1200,
    faceValue: 1000_00,
    status: "up",
    market: "primary",
  },
  {
    id: "3",
    name: "RTA Infrastructure Bond",
    interestRate: 5.0,
    totalUnits: 1500,
    availableUnits: 300,
    faceValue: 500_00,
    status: "down",
    disabled: true,
    market: "primary",
  },
  {
    id: "4",
    name: "GovTech Digital Bond",
    interestRate: 4.2,
    totalUnits: 800,
    availableUnits: 0,
    faceValue: 600_00,
    status: "flat",
    disabled: true,
    market: "primary",
  },

  // Resale market
  {
    id: "5",
    name: "RICB 5-Year Bond (Resale)",
    interestRate: 5.1,
    totalUnits: 300,
    availableUnits: 120,
    faceValue: 1500_00,
    status: "up",
    market: "resale",
  },
  {
    id: "6",
    name: "GMC 7-Year Bond (Resale)",
    interestRate: 7.1,
    totalUnits: 500,
    availableUnits: 80,
    faceValue: 1000_00,
    status: "up",
    market: "resale",
  },
];

// ========================= Filter Dropdown =========================

function FilterDropdown({
  activeFilter,
  setActiveFilter,
  close,
}: {
  activeFilter: "all" | "active" | "inactive";
  setActiveFilter: (f: "all" | "active" | "inactive") => void;
  close: () => void;
}) {
  return (
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
        { key: "inactive", label: "Inactive Only" },
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() => {
            setActiveFilter(filter.key as "all" | "active" | "inactive");
            close();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
            activeFilter === filter.key ? "bg-blue-50 text-blue-600" : "text-gray-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              filter.key === "all"
                ? "bg-gray-400"
                : filter.key === "active"
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
          />
          <span>{filter.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ========================= Main Component =========================

export default function BondsSection() {
  const router = useRouter();

  // "Newly added bonds" card – demo content
  const newlyAdded = [
    { name: "RICB Bond", rate: "+5% yr", amount: "Nu 1,000,000" },
    { name: "GMC Bond", rate: "+7% yr", amount: "Nu 1,000,000,000" },
    { name: "RTA Bond", rate: "+5% yr", amount: "Nu 5,000,000" },
    { name: "GovTech Bond", rate: "+4.2% yr", amount: "Nu 60,000" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeMarket, setActiveMarket] = useState<MarketTab>("primary");

  // Navigate to tokens page (fixed path as you requested)
  const goToBondDetails = () => {
    router.push("/user/aboutus/tokens");
  };

  // Filter rows based on search, filter, and active market
  const baseRowsForMarket = useMemo(
    () => ALL_BONDS.filter((b) => b.market === activeMarket),
    [activeMarket]
  );

  const filteredRows = useMemo(() => {
    return baseRowsForMarket.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && !row.disabled) ||
        (activeFilter === "inactive" && row.disabled);

      return matchesSearch && matchesFilter;
    });
  }, [baseRowsForMarket, searchQuery, activeFilter]);

  // Simple stats for active market
  const stats = useMemo(() => {
    if (baseRowsForMarket.length === 0) return null;

    const totalOfferings = baseRowsForMarket.length;
    const avgInterest =
      baseRowsForMarket.reduce((sum, b) => sum + b.interestRate, 0) /
      baseRowsForMarket.length;
    const totalUnits = baseRowsForMarket.reduce((sum, b) => sum + b.totalUnits, 0);
    const avgFaceValue =
      baseRowsForMarket.reduce((sum, b) => sum + b.faceValue, 0) /
      baseRowsForMarket.length;

    return { totalOfferings, avgInterest, totalUnits, avgFaceValue };
  }, [baseRowsForMarket]);

  const primaryCount = ALL_BONDS.filter((b) => b.market === "primary").length;
  const resaleCount = ALL_BONDS.filter((b) => b.market === "resale").length;

  return (
    <main className="bg-white w-full min-h-screen">
      <Navbar />

      {/* BONDS SECTION – hero + newly added + BTN coin card */}
      <section className="w-full bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT: Newly added bonds */}
            <motion.div
              {...fadeIn}
              className="bg-white border border-gray-200 rounded-2xl px-6 sm:px-8 py-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">
                  Newly added bonds
                </h2>
                <span className="flex-1 ml-3 h-[2px] bg-indigo-700 rounded" />
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {newlyAdded.map((bond, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
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
                      <span className="text-gray-900 font-semibold">{bond.amount}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* RIGHT: BTN Coin CTA */}
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
                  Subscribe instantly, own your share of Bhutan&apos;s digital future.
                </p>
                <button
                  onClick={goToBondDetails}
                  className="mt-4 bg-[#2F2A7B] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  Get BTN Coins Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TOKEN TABLE / MARKETPLACE SECTION */}
      <section className="w-full mt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            {...fadeIn}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
          >
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Bond marketplace
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-3xl">
                Explore Bhutanese government and corporate bonds in both primary and
                resale markets. View interest rates, available units, and indicative
                face values.
              </p>

              {/* Active Filter Badge */}
              {activeFilter !== "all" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 mt-3"
                >
                  <span className="text-sm text-gray-600">Active filter:</span>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <span>
                      {activeFilter === "all"
                        ? "All Bonds"
                        : activeFilter === "active"
                        ? "Active Only"
                        : "Inactive Only"}
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
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Filter
                  </span>
                </button>

                <AnimatePresence>
                  {showFilterDropdown && (
                    <FilterDropdown
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      close={() => setShowFilterDropdown(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          {stats && (
            <motion.div
              {...fadeIn}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total {activeMarket === "primary" ? "offerings" : "resale listings"}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {stats.totalOfferings}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <IoDocumentTextOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Avg. Interest
                    </p>
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
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Units
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {nfInt.format(stats.totalUnits)}
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
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Avg. Face Value
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {nfCurrency.format(stats.avgFaceValue / 100)}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <IoWallet className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs for Primary / Resale */}
          <div className="mt-4 border-b border-gray-200">
            <div className="flex gap-1" role="tablist" aria-label="Bond markets">
              <button
                role="tab"
                aria-selected={activeMarket === "primary"}
                onClick={() => setActiveMarket("primary")}
                className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors rounded-t-lg ${
                  activeMarket === "primary"
                    ? "text-[#5B50D9] border-b-2 border-[#5B50D9] bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Primary Offerings</span>
                <span
                  className={`inline-flex items-center justify-center text-xs font-medium rounded-full px-2 py-1 min-w-6 ${
                    activeMarket === "primary"
                      ? "bg-[#5B50D9]/10 text-[#5B50D9]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {primaryCount}
                </span>
              </button>

              <button
                role="tab"
                aria-selected={activeMarket === "resale"}
                onClick={() => setActiveMarket("resale")}
                className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors rounded-t-lg ${
                  activeMarket === "resale"
                    ? "text-[#5B50D9] border-b-2 border-[#5B50D9] bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Resale Market</span>
                <span
                  className={`inline-flex items-center justify-center text-xs font-medium rounded-full px-2 py-1 min-w-6 ${
                    activeMarket === "resale"
                      ? "bg-[#5B50D9]/10 text-[#5B50D9]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {resaleCount}
                </span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredRows.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center"
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
                  : "No bond offerings available at the moment."}
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

          {/* Desktop Table */}
          {filteredRows.length > 0 && (
            <motion.div
              {...fadeIn}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mt-6 hidden lg:block"
            >
              <div className="hidden lg:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Bond Details
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Interest Rate
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Units
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Unit Available
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-4 text-left text-sm font-semibold text-gray-900"
                      >
                        Face Value (Nu)
                      </th>
                      <th
                        scope="col"
                        className="py-4 pl-4 pr-6 text-left text-sm font-semibold text-gray-900"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    <AnimatePresence>
                      {filteredRows.map((row) => {
                        const disabled = !!row.disabled;
                        const dimClass = disabled ? "text-gray-300" : "text-gray-900";

                        const pct =
                          row.totalUnits > 0
                            ? (row.availableUnits / row.totalUnits) * 100
                            : 0;

                        let progressColor = "#2563EB"; // blue
                        if (pct === 0) progressColor = "#9CA3AF"; // gray
                        else if (pct === 100) progressColor = "#10B981"; // green

                        return (
                          <motion.tr
                            key={row.id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="group hover:bg-gray-50/50 transition-colors"
                          >
                            {/* Bond details */}
                            <td className="py-5 pl-6 pr-3">
                              <div className="flex items-center gap-4">
                                <div className="relative flex-shrink-0">
                                  <div className="relative h-12 w-12 rounded-xl border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <Image
                                      src="/RSEB.png"
                                      alt="Bond"
                                      width={24}
                                      height={24}
                                      className={`object-contain ${disabled ? "opacity-40" : ""}`}
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
                                  <span className={`text-base font-semibold ${dimClass} block`}>
                                    {row.name}
                                  </span>
                                  <span
                                    className={`text-sm ${
                                      disabled ? "text-gray-300" : "text-gray-500"
                                    } mt-0.5 block`}
                                  >
                                    {row.market === "primary"
                                      ? "Primary Offering"
                                      : "Resale Listing"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Interest rate */}
                            <td className="py-5 px-4">
                              <div
                                className={`text-lg font-bold ${
                                  disabled ? "text-gray-300" : "text-emerald-600"
                                }`}
                              >
                                {row.interestRate.toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                per annum
                              </div>
                            </td>

                            {/* Total Units */}
                            <td className="py-5 px-4">
                              <div
                                className={`text-base font-medium ${
                                  disabled ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {nfInt.format(row.totalUnits)}
                              </div>
                            </td>

                            {/* Available Units */}
                            <td className="py-5 px-4">
                              <div
                                className={`text-base font-medium ${
                                  disabled ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {nfInt.format(row.availableUnits)}
                                <span className="text-sm text-gray-500 font-normal ml-1">
                                  / {nfInt.format(row.totalUnits)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className="h-1.5 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(100, pct)}%`,
                                    backgroundColor: progressColor,
                                  }}
                                />
                              </div>
                            </td>

                            {/* Face Value */}
                            <td className="py-5 px-4">
                              <div
                                className={`text-base font-bold ${
                                  disabled ? "text-gray-300" : "text-gray-900"
                                }`}
                              >
                                {nfCurrency.format(row.faceValue / 100)}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                per unit
                              </div>
                            </td>

                            {/* Action */}
                            <td className="py-5 pl-4 pr-6">
                              <button
                                type="button"
                                onClick={goToBondDetails}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#5B50D9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              >
                                <IoDocumentTextOutline className="w-4 h-4" />
                                View Details
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Mobile Cards */}
          {filteredRows.length > 0 && (
            <div className="lg:hidden space-y-4 p-4 mt-4">
              <AnimatePresence>
                {filteredRows.map((row) => {
                  const disabled = !!row.disabled;
                  const dimClass = disabled ? "text-gray-300" : "text-gray-900";
                  const rateClass = disabled ? "text-gray-300" : "text-emerald-600";

                  const pct =
                    row.totalUnits > 0
                      ? (row.availableUnits / row.totalUnits) * 100
                      : 0;

                  let progressColor = "#2563EB";
                  if (pct === 0) progressColor = "#9CA3AF";
                  else if (pct === 100) progressColor = "#10B981";

                  return (
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
                                className={`object-contain ${disabled ? "opacity-40" : ""}`}
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
                            <h3 className={`text-lg font-semibold ${dimClass}`}>
                              {row.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {row.market === "primary"
                                ? "Primary Offering"
                                : "Resale Listing"}
                            </p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${rateClass}`}>
                          {row.interestRate.toFixed(2)}%
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">
                            Total Units
                          </p>
                          <p className={`text-base font-semibold ${dimClass}`}>
                            {nfInt.format(row.totalUnits)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">
                            Available
                          </p>
                          <p className={`text-base font-semibold ${dimClass}`}>
                            {nfInt.format(row.availableUnits)}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(100, pct)}%`,
                                backgroundColor: progressColor,
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">
                            Face Value
                          </p>
                          <p className={`text-base font-bold ${dimClass}`}>
                            {nfCurrency.format(row.faceValue / 100)}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-top border-gray-100">
                        <button
                          type="button"
                          onClick={goToBondDetails}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B50D9] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4a45b5] transition-colors shadow-sm transform hover:-translate-y-0.5"
                        >
                          <IoDocumentTextOutline className="w-4 h-4" />
                          View Bond Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
