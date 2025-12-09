"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import {
  Copy,
  Wallet,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Download,
  Share2,
  Filter,
  SortAsc,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchInvestorEarnings } from "@/server/db_actions/action";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number; // 0.05 -> 5%
  interestAccrued: number; // e.g. 10, 20 ...
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
  purchaseDate: string;
  bondType: string;
  faceValue: number;
  totalInvestment: number;
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const dropdownAnimation = {
  initial: { opacity: 0, scale: 0.95, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -8 },
  transition: { duration: 0.15, ease: "easeOut" },
};

/* ========================= Helpers ========================= */

const nfInt = new Intl.NumberFormat("en-IN");

const shortenHash = (value: string, prefixLength = 6, suffixLength = 4) => {
  if (!value) return "";
  if (value.length <= prefixLength + suffixLength + 3) return value;
  return `${value.slice(0, prefixLength)}...${value.slice(-suffixLength)}`;
};

/* ========================= Loading Animation ========================= */

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center px-4">
      <div className="relative max-w-xs sm:max-w-sm">
        <svg
          id="svg-global"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 94 136"
          height="200"
          width="140"
          className="mx-auto"
        >
          {/* SVG content unchanged */}
          {/* ... (SVG paths exactly as in your original code) ... */}
          {/* I’m keeping your entire SVG unchanged for brevity in this explanation,
              but in your actual file, keep the full SVG block exactly the same. */}
        </svg>
      </div>
      <p className="text-lg sm:text-xl font-semibold text-gray-700 mt-8 text-center">
        Loading earnings data...
      </p>
      <p className="text-sm sm:text-base text-gray-500 mt-2 text-center">
        Please wait while we fetch your earnings information
      </p>

      <style jsx>{`
        #svg-global {
          zoom: 1.2;
          overflow: visible;
        }

        @keyframes fade-particles {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }

        #particles {
          animation: fade-particles 5s infinite alternate;
        }
        .particle {
          animation: floatUp linear infinite;
        }

        .p1 {
          animation-duration: 2.2s;
          animation-delay: 0s;
        }
        .p2 {
          animation-duration: 2.5s;
          animation-delay: 0.3s;
        }
        .p3 {
          animation-duration: 2s;
          animation-delay: 0.6s;
        }
        .p4 {
          animation-duration: 2.8s;
          animation-delay: 0.2s;
        }
        .p5 {
          animation-duration: 2.3s;
          animation-delay: 0.4s;
        }
        .p6 {
          animation-duration: 3s;
          animation-delay: 0.1s;
        }
        .p7 {
          animation-duration: 2.1s;
          animation-delay: 0.5s;
        }
        .p8 {
          animation-duration: 2.6s;
          animation-delay: 0.2s;
        }
        .p9 {
          animation-duration: 2.4s;
          animation-delay: 0.3s;
        }

        @keyframes bounce-lines {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        #line-v1,
        #line-v2,
        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation: bounce-lines 3s ease-in-out infinite alternate;
        }
        #line-v2 {
          animation-delay: 0.2s;
        }

        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

/* ========================= Wallet Header ========================= */

function WalletStrip({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {
      // ignore
    }
  };

  const displayAddress = shortenHash(walletAddress, 8, 6);

  return (
    <motion.div
      {...fadeIn}
      className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#5B50D9] to-[#8B50D9] text-white shadow-sm">
            <Wallet className="w-5 h-5" strokeWidth={1.75} />
          </span>
          <div className="space-y-1">
            <span className="font-semibold text-gray-700 text-sm sm:text-base">
              Wallet address
            </span>
            <code
              className="inline-flex items-center gap-2 mt-0.5 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 border border-gray-200 break-all font-mono text-xs sm:text-sm"
              title={walletAddress}
            >
              {displayAddress || "Not connected"}
            </code>
            {walletAddress && (
              <p className="text-xs text-gray-500">
                Full address is copied, even though it&apos;s shortened here.
              </p>
            )}
          </div>
        </div>

        <div className="relative flex items-center gap-2 justify-start sm:justify-end">
          <button
            onClick={copy}
            disabled={!walletAddress}
            className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              copied
                ? "bg-emerald-50 border border-emerald-500 text-emerald-700 shadow-sm"
                : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
            } ${!walletAddress ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label="Copy wallet address"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="absolute -bottom-7 right-0 inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-xs px-2 py-1 shadow-md"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                Copied!
              </motion.div>
            )}
          </AnimatePresence>

          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Wallet address copied" : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================= Status Indicator ========================= */

function StatusIndicator({ status }: { status: Status }) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "up":
        return {
          icon: TrendingUp,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          label: "Growing",
        };
      case "down":
        return {
          icon: TrendingDown,
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          label: "Declining",
        };
      case "flat":
        return {
          icon: Minus,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Stable",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-[0.8rem] font-medium ${config.borderColor} ${config.bgColor}`}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}

/* ========================= “PDF” Export (TXT) ========================= */

const generateBondPDF = (row: Row) => {
  const pdfContent = `
BOND EARNINGS REPORT
====================

Bond Details:
-------------
Bond Name: ${row.name}
Bond ID: ${row.id}
Bond Type: ${row.bondType}

Financial Information:
----------------------
Face Value: Nu ${nfInt.format(row.faceValue)}
Total Investment: Nu ${nfInt.format(row.totalInvestment)}
Interest Rate: ${(row.ratePct * 100).toFixed(2)}% per annum
Interest Accrued: Nu ${nfInt.format(row.interestAccrued)}

Timeline:
---------
Purchase Date: ${row.purchaseDate}
Maturity Date: ${row.maturity}

Performance:
------------
Status: ${
    row.status === "up"
      ? "Growing"
      : row.status === "down"
      ? "Declining"
      : "Stable"
  }

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

--- END OF REPORT ---
`;

  const blob = new Blob([pdfContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `bond-report-${row.name
    .toLowerCase()
    .replace(/\s+/g, "-")}-${new Date().getTime()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ========================= Action Dropdown ========================= */

function ActionDropdown({
  row,
  isOpen,
  onClose,
  onExportPDF,
  onShare,
}: {
  row: Row;
  isOpen: boolean;
  onClose: () => void;
  onExportPDF: (row: Row) => void;
  onShare: (row: Row) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    {
      icon: Download,
      label: "Export as PDF",
      onClick: () => onExportPDF(row),
      color: "text-emerald-600",
    },
    {
      icon: Share2,
      label: "Share",
      onClick: () => onShare(row),
      color: "text-purple-600",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          {...dropdownAnimation}
          className="absolute right-6 top-12 z-50 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className={item.color}>{item.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========================= Filter & Sort Component ========================= */

function FilterSortBar({
  onFilterChange,
  onSortChange,
  activeFilter,
  activeSort,
}: {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  activeFilter: string;
  activeSort: string;
}) {
  const filters = [
    { key: "all", label: "All Bonds" },
    { key: "up", label: "Growing" },
    { key: "down", label: "Declining" },
    { key: "flat", label: "Stable" },
  ];

  const sortOptions = [
    { key: "interest-desc", label: "Highest Interest" },
    { key: "interest-asc", label: "Lowest Interest" },
    { key: "maturity-asc", label: "Nearest Maturity" },
    { key: "name-asc", label: "Name A-Z" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-white border-b border-gray-200">
      {/* Filter Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full">
        <div className="inline-flex items-center gap-2 text-sm text-gray-700">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.key
                  ? "bg-[#5B50D9] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Sort:</span>
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B50D9]/20 focus:border-[#5B50D9]"
        >
          {sortOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ========================= Page ========================= */

export default function EarningsPage() {
  const currentUser = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("interest-desc");
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");

  const walletAddress = currentUser?.wallet_address ?? "";

  useEffect(() => {
    async function loadEarnings() {
      if (!currentUser?.id) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await fetchInvestorEarnings(currentUser.id);
        setRows(data);
      } catch (e) {
        console.error("Failed to load earnings", e);
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadEarnings();
  }, [currentUser?.id]);

  const filteredAndSorted = useMemo(() => {
    let filtered = rows.filter((row) => {
      const matchesSearch = row.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || row.status === (activeFilter as Status);
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (activeSort) {
        case "interest-desc":
          return b.interestAccrued - a.interestAccrued;
        case "interest-asc":
          return a.interestAccrued - b.interestAccrued;
        case "maturity-asc":
          return a.maturity.localeCompare(b.maturity);
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [rows, query, activeFilter, activeSort]);

  const totalEarnings = useMemo(
    () => filteredAndSorted.reduce((sum, row) => sum + row.interestAccrued, 0),
    [filteredAndSorted]
  );

  const avgRate =
    filteredAndSorted.length > 0
      ? (
          (filteredAndSorted.reduce((sum, row) => sum + row.ratePct, 0) /
            filteredAndSorted.length) *
          100
        ).toFixed(1)
      : "0.0";

  const handleExportPDF = (row: Row) => {
    setActiveDropdown(null);
    generateBondPDF(row);
  };

  const handleShare = (row: Row) => {
    setActiveDropdown(null);
    if (navigator.share) {
      navigator.share({
        title: `My ${row.name} Earnings`,
        text: `Check out my earnings from ${row.name}: Nu ${nfInt.format(
          row.interestAccrued
        )}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `My ${row.name} Earnings: Nu ${nfInt.format(
          row.interestAccrued
        )} - Maturity: ${row.maturity}`
      );
      alert("Earnings data copied to clipboard!");
    }
  };

  const handleExportAll = () => {
    const csvContent = [
      [
        "Bond Name",
        "Interest Rate",
        "Interest Accrued",
        "Maturity Date",
        "Status",
        "Bond Type",
        "Face Value",
        "Total Investment",
      ],
      ...filteredAndSorted.map((row) => [
        row.name,
        `${(row.ratePct * 100).toFixed(1)}%`,
        `Nu ${nfInt.format(row.interestAccrued)}`,
        row.maturity,
        row.status,
        row.bondType,
        `Nu ${nfInt.format(row.faceValue)}`,
        `Nu ${nfInt.format(row.totalInvestment)}`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-bond-earnings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50/40">
      <InvestorSideNavbar currentUser={currentUser} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
          {/* Wallet strip */}
          <WalletStrip walletAddress={walletAddress} />

          {/* Header Section */}
          <motion.header {...fadeIn} className="mt-4 sm:mt-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                  Earnings Overview
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                  Your Earnings
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                  Track your bond investments and interest accruals in one
                  place. Monitor performance, maturity dates, and export your
                  data easily.
                </p>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Total Bonds
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredAndSorted.length}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Total Earnings
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      Nu {nfInt.format(totalEarnings)}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Avg. Return
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {avgRate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Export */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full lg:w-auto">
                <div className="relative w-full sm:w-72 lg:w-80">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="search"
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 sm:h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-3 text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#5B50D9]/20 focus:border-[#5B50D9] transition-all duration-200"
                    placeholder="Search by bond name..."
                  />
                </div>
                <button
                  onClick={handleExportAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 text-gray-700 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>
          </motion.header>

          {/* Filter & Sort Bar */}
          <FilterSortBar
            onFilterChange={setActiveFilter}
            onSortChange={setActiveSort}
            activeFilter={activeFilter}
            activeSort={activeSort}
          />

          {/* Main Content */}
          <motion.section
            {...fadeIn}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
            aria-labelledby="earnings-title"
          >
            {/* Desktop table */}
            {filteredAndSorted.length > 0 ? (
              <div className="hidden lg:block">
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/40 border-b border-gray-200">
                  <h2
                    id="earnings-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Bond Portfolio Performance
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Detailed view of all your bond earnings.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/60">
                        <th
                          scope="col"
                          className="py-4 pl-6 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Bond Details
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Interest Rate
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Interest Accrued
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Maturity Date
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="py-4 pl-4 pr-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <motion.tbody
                      className="divide-y divide-gray-100"
                      variants={staggerChildren}
                      initial="initial"
                      animate="animate"
                    >
                      {filteredAndSorted.map((row) => (
                        <motion.tr
                          key={row.id}
                          variants={itemAnimation}
                          className="group hover:bg-gray-50/80 transition-colors duration-200 relative"
                        >
                          {/* Bond Details */}
                          <td className="py-5 pl-6 pr-4">
                            <div className="flex items-center gap-4">
                              <div className="relative flex-shrink-0">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                                  <Image
                                    src="/RSEB.png"
                                    alt="Issuer"
                                    width={24}
                                    height={24}
                                    className="filter brightness-0 invert"
                                  />
                                </div>
                                <span
                                  aria-hidden
                                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white ${
                                    row.status === "up"
                                      ? "bg-emerald-500"
                                      : row.status === "down"
                                      ? "bg-rose-500"
                                      : "bg-amber-500"
                                  }`}
                                />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                  {row.name}
                                </h3>
                                <p
                                  className="text-sm text-gray-500 mt-0.5"
                                  title={`Bond #${row.id}`}
                                >
                                  {row.bondType} • Bond #
                                  {shortenHash(row.id, 6, 4)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Interest Rate */}
                          <td className="py-5 px-4">
                            <div className="text-base font-semibold text-gray-900">
                              {(row.ratePct * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              per annum
                            </div>
                          </td>

                          {/* Interest Accrued */}
                          <td className="py-5 px-4">
                            <div className="text-base font-bold text-gray-900">
                              Nu {nfInt.format(row.interestAccrued)}
                            </div>
                          </td>

                          {/* Maturity Date */}
                          <td className="py-5 px-4">
                            <div className="text-base font-medium text-gray-900">
                              {row.maturity}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              DD/MM/YYYY
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-5 px-4">
                            <StatusIndicator status={row.status} />
                          </td>

                          {/* Actions */}
                          <td className="py-5 pl-4 pr-6">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/investor/Earnings/${row.id}`}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 focus:outline-none transition-all duration-200 group/action"
                                aria-label={`View interest details for ${row.name}`}
                              >
                                <FileText className="w-4 h-4" />
                                <span>Details</span>
                              </Link>

                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setActiveDropdown(
                                      activeDropdown === row.id ? null : row.id
                                    )
                                  }
                                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                  aria-label="More options"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                <ActionDropdown
                                  row={row}
                                  isOpen={activeDropdown === row.id}
                                  onClose={() => setActiveDropdown(null)}
                                  onExportPDF={handleExportPDF}
                                  onShare={handleShare}
                                />
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-10 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No earnings found
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base">
                    {query || activeFilter !== "all"
                      ? "Try adjusting your search or filter terms"
                      : "You don't have any bond earnings yet"}
                  </p>
                  {(query || activeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setActiveFilter("all");
                      }}
                      className="text-[#5B50D9] hover:text-[#4a40c8] font-medium text-sm"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mobile / Tablet cards */}
            <div className="lg:hidden">
              {filteredAndSorted.length > 0 ? (
                <motion.ul
                  className="divide-y divide-gray-100"
                  role="list"
                  aria-label="Earnings list"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {filteredAndSorted.map((row) => (
                    <motion.li
                      key={row.id}
                      variants={itemAnimation}
                      className="p-5 hover:bg-gray-50/80 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                              <Image
                                src="/RSEB.png"
                                alt="Issuer"
                                width={20}
                                height={20}
                                className="filter brightness-0 invert"
                              />
                            </div>
                            <span
                              aria-hidden
                              className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                row.status === "up"
                                  ? "bg-emerald-500"
                                  : row.status === "down"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {row.name}
                            </h3>
                            <p
                              className="text-xs text-gray-500"
                              title={`Bond #${row.id}`}
                            >
                              {row.bondType} • Bond #
                              {shortenHash(row.id, 6, 4)}
                            </p>
                          </div>
                        </div>
                        <StatusIndicator status={row.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Interest Rate
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {(row.ratePct * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Interest Accrued
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu {nfInt.format(row.interestAccrued)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Maturity Date
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {row.maturity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3">
                        <Link
                          href={`/investor/Earnings/${row.id}`}
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 focus:outline-none transition-all duration-200"
                          aria-label={`View interest details for ${row.name}`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>

                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === row.id ? null : row.id
                            )
                          }
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mobile Dropdown */}
                      <AnimatePresence>
                        {activeDropdown === row.id && (
                          <motion.div
                            {...dropdownAnimation}
                            className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleExportPDF(row)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Export PDF
                              </button>
                              <button
                                onClick={() => handleShare(row)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    No earnings found
                  </h3>
                  <p className="text-sm text-gray-500">
                    {query || activeFilter !== "all"
                      ? "Try adjusting your search or filter terms"
                      : "You don't have any bond earnings yet"}
                  </p>
                  {(query || activeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setActiveFilter("all");
                      }}
                      className="text-[#5B50D9] hover:text-[#4a40c8] font-medium text-sm mt-2"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.section>

          {/* Footer Stats */}
          {filteredAndSorted.length > 0 && (
            <motion.div
              {...fadeIn}
              className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSorted.length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total Bonds</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  Nu {nfInt.format(totalEarnings)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Total Earnings
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(
                    (filteredAndSorted.filter((row) => row.status === "up")
                      .length /
                      filteredAndSorted.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Performing Well
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
