"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import {
  Copy,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Download,
  Share2,
  Filter,
  SortAsc,
  Building,
  Landmark,
  Factory,
  Globe,
  Banknote,
  Percent,
  Calendar,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Clock,
  Eye,
  Layers,
  Sparkles,
  ChevronDown,
  BarChart3,
  Grid,
  List,
  Search,
  ArrowLeft,
  Coins,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchInvestorEarnings } from "@/server/db_actions/action";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number;
  interestAccrued: number;
  maturity: string;
  status: Status;
  disabled?: boolean;
  purchaseDate: string;
  bondType: string;
  faceValue: number;
  totalInvestment: number;
  issuer?: string;
  bondSymbol?: string;
  purchaseDateISO?: string;
  unitsAllocated?: number;
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
      staggerChildren: 0.06,
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const dropdownAnimation = {
  initial: { opacity: 0, scale: 0.95, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -8 },
  transition: { duration: 0.15, ease: "easeOut" },
};

const cardHover = {
  whileHover: { y: -2, boxShadow: "0 12px 24px -6px rgba(91, 80, 217, 0.12)" },
  transition: { duration: 0.2, ease: "easeOut" }
};

/* ========================= Loading Animation ========================= */

function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center">
      <div className="container_SevMini">
        <div className="SevMini">
          <svg
            width="74"
            height="90"
            viewBox="0 0 74 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ... (keep the existing SVG content) ... */}
          </svg>
        </div>
        <div className="Ghost">
          <svg
            width="60"
            height="36"
            viewBox="0 0 60 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ... (keep the existing SVG content) ... */}
          </svg>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 mt-6">Loading your portfolio...</p>
      <p className="text-gray-500 text-sm mt-2">Fetching your bond earnings information</p>

      <style jsx>{`
        .container_SevMini {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .Ghost {
          transform: translate(0px, -25px);
          z-index: -1;
          animation: opacidad 4s infinite ease-in-out;
        }

        @keyframes opacidad {
          0% {
            opacity: 1;
            scale: 1;
          }

          50% {
            opacity: 0.5;
            scale: 0.9;
          }

          100% {
            opacity: 1;
            scale: 1;
          }
        }

        @keyframes estroboscopico {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          51% {
            opacity: 1;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes rebote {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes estroboscopico1 {
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

        @keyframes estroboscopico2 {
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

        .SevMini {
          animation: rebote 4s infinite ease-in-out;
        }

        #strobe_led1 {
          animation: estroboscopico 0.5s infinite;
        }

        #strobe_color1 {
          animation: estroboscopico2 0.8s infinite;
        }

        #strobe_color3 {
          animation: estroboscopico1 0.8s infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}

/* ========================= Helpers ========================= */

const nfInt = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nf4 = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 2,
});

const shortenHash = (value: string, prefixLength = 6, suffixLength = 4) => {
  if (!value) return "";
  if (value.length <= prefixLength + suffixLength + 3) return value;
  return `${value.slice(0, prefixLength)}...${value.slice(-suffixLength)}`;
};

// IMPROVED DATE PARSING FUNCTION
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Try multiple date formats
  const formats = [
    // DD/MM/YYYY or DD-MM-YYYY
    (str: string) => {
      const match = str.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (match) {
        const [, day, month, year] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      return null;
    },
    // YYYY-MM-DD
    (str: string) => {
      const match = str.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
      if (match) {
        const [, year, month, day] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      return null;
    },
    // Month Day, Year format (like "12th December 2029")
    (str: string) => {
      const match = str.match(/(\d{1,2})(?:th|st|nd|rd)?\s+([A-Za-z]+)\s+(\d{4})/i);
      if (match) {
        const [, day, monthName, year] = match;
        const monthNames = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ];
        const monthIndex = monthNames.findIndex(m => m === monthName.toLowerCase());
        if (monthIndex !== -1) {
          return new Date(parseInt(year), monthIndex, parseInt(day));
        }
      }
      return null;
    },
    // Standard Date.parse
    (str: string) => {
      const date = new Date(str);
      return !isNaN(date.getTime()) ? date : null;
    }
  ];
  
  for (const format of formats) {
    const date = format(dateString);
    if (date) return date;
  }
  
  console.warn("Could not parse date:", dateString);
  return null;
};

// ACCURATE INTEREST CALCULATION FUNCTION
const calculateInterestAccrued = (row: Row): number => {
  // If we have pre-calculated interest from server, use it
  if (row.interestAccrued && row.interestAccrued > 0) {
    return row.interestAccrued;
  }
  
  const principal = row.totalInvestment || row.faceValue || 0;
  const annualRate = row.ratePct > 1 ? row.ratePct / 100 : row.ratePct; // Convert to decimal
  
  const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
  const maturityDate = parseDate(row.maturity);
  const currentDate = new Date();
  
  if (!purchaseDate) {
    console.warn("Could not parse purchase date for bond:", row.name);
    return 0;
  }
  
  let daysHeld: number;
  
  if (maturityDate) {
    // Bond has a maturity date
    const purchaseTime = purchaseDate.getTime();
    const maturityTime = maturityDate.getTime();
    const currentTime = currentDate.getTime();
    
    // If bond is matured, calculate interest up to maturity date
    if (currentTime >= maturityTime) {
      daysHeld = Math.max(1, Math.floor((maturityTime - purchaseTime) / (1000 * 3600 * 24)));
    } else {
      // Otherwise calculate interest from purchase to current date
      daysHeld = Math.max(1, Math.floor((currentTime - purchaseTime) / (1000 * 3600 * 24)));
    }
  } else {
    // No maturity date, calculate from purchase to current date
    const timeDiff = currentDate.getTime() - purchaseDate.getTime();
    daysHeld = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
  }
  
  // Simple interest calculation: Principal * Rate * Time
  const dailyRate = annualRate / 365;
  const interest = principal * dailyRate * daysHeld;
  
  return Math.round(interest * 100) / 100; // Round to 2 decimal places
};

/* ========================= Dynamic Bond Icons ========================= */

const getBondIcon = (bondName: string, bondType: string) => {
  const name = bondName.toLowerCase();
  const type = bondType.toLowerCase();

  if (name.includes("sovereign") || name.includes("government") || name.includes("treasury") || name.includes("national")) {
    return { icon: Landmark, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", text: "Gov", iconColor: "text-blue-100" };
  }
  
  if (name.includes("corporate") || name.includes("industrial") || name.includes("manufacturing")) {
    return { icon: Building, color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-50", text: "Corp", iconColor: "text-emerald-100" };
  }
  
  if (name.includes("municipal") || name.includes("local") || name.includes("city")) {
    return { icon: Building, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", text: "Mun", iconColor: "text-purple-100" };
  }
  
  if (name.includes("infrastructure") || name.includes("development") || name.includes("construction")) {
    return { icon: Factory, color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50", text: "Infra", iconColor: "text-amber-100" };
  }
  
  if (name.includes("green") || name.includes("sustainable") || name.includes("environmental") || name.includes("eco")) {
    return { icon: Globe, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", text: "Green", iconColor: "text-green-100" };
  }
  
  if (name.includes("high yield") || name.includes("high-yield") || name.includes("junk")) {
    return { icon: DollarSign, color: "from-rose-500 to-pink-600", bgColor: "bg-rose-50", text: "High", iconColor: "text-rose-100" };
  }
  
  if (name.includes("financial") || name.includes("bank") || name.includes("insurance")) {
    return { icon: Banknote, color: "from-cyan-500 to-blue-600", bgColor: "bg-cyan-50", text: "Fin", iconColor: "text-cyan-100" };
  }
  
  if (type.includes("corporate")) {
    return { icon: Building, color: "from-gray-500 to-gray-700", bgColor: "bg-gray-50", text: "Bond", iconColor: "text-gray-100" };
  }
  if (type.includes("government")) {
    return { icon: Landmark, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", text: "Gov", iconColor: "text-blue-100" };
  }
  if (type.includes("municipal")) {
    return { icon: Building, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", text: "Mun", iconColor: "text-purple-100" };
  }
  
  return { icon: PieChart, color: "from-indigo-500 to-purple-600", bgColor: "bg-indigo-50", text: "Bond", iconColor: "text-indigo-100" };
};

const getBondCategory = (bondName: string) => {
  const name = bondName.toLowerCase();
  
  if (name.includes("government") || name.includes("sovereign") || name.includes("treasury")) {
    return "Government Bond";
  }
  if (name.includes("corporate") || name.includes("industrial")) {
    return "Corporate Bond";
  }
  if (name.includes("municipal") || name.includes("local")) {
    return "Municipal Bond";
  }
  if (name.includes("infrastructure") || name.includes("development")) {
    return "Infrastructure Bond";
  }
  if (name.includes("green") || name.includes("sustainable")) {
    return "Green Bond";
  }
  if (name.includes("high yield") || name.includes("high-yield")) {
    return "High-Yield Bond";
  }
  
  return "Issuer";
};

/* ========================= Stats Card Component ========================= */

function StatsCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <motion.div
      {...fadeIn}
      className="rounded-2xl bg-white border border-gray-200/80 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-gray-100/80">
          <Icon className="w-5 h-5 text-[#5B50D9]" />
        </div>
        {change && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
    </motion.div>
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
      className="rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_-6px_rgba(91,80,217,0.12)] overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#5B50D9] to-[#8B50D9] text-white shadow-sm">
            <Wallet className="w-5 h-5" strokeWidth={1.75} />
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm sm:text-base">
                Wallet address
              </span>
              {copied && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Copied
                </span>
              )}
            </div>
            <code
              className="inline-flex items-center gap-2 mt-0.5 px-3 py-2 rounded-lg bg-gray-50/80 text-gray-900 border border-gray-200/50 break-all font-mono text-xs sm:text-sm"
              title={walletAddress}
            >
              {displayAddress || "Not connected"}
            </code>
            {walletAddress && (
              <p className="text-xs text-gray-500/80">
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
                ? "bg-emerald-50 border border-emerald-500/30 text-emerald-700 shadow-sm"
                : "bg-white border border-gray-300/80 text-gray-700 hover:border-gray-400 hover:shadow-md"
            } ${!walletAddress ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label="Copy wallet address"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ========================= "PDF" Export (TXT) ========================= */

const generateBondPDF = (row: Row) => {
  const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
  const maturityDate = parseDate(row.maturity);
  const currentDate = new Date();
  
  let daysToMaturity = 0;
  let isMatured = false;
  
  if (maturityDate) {
    const timeDiff = maturityDate.getTime() - currentDate.getTime();
    daysToMaturity = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    isMatured = timeDiff <= 0;
  }
  
  const formatted = isMatured ? "Matured" : `${daysToMaturity} days`;
  const interestAccrued = calculateInterestAccrued(row);

  const pdfContent = `
BOND EARNINGS REPORT
====================

Bond Details:
-------------
Bond Name: ${row.name}
Bond ID: ${row.id}
Bond Type: ${row.bondType}
Issuer: ${row.issuer || row.bondType}
Category: ${getBondCategory(row.name)}
Bond Symbol: ${row.bondSymbol || "N/A"}

Financial Information:
----------------------
Face Value: BTNC ${nfInt.format(row.faceValue)}
Total Investment: BTNC ${nfInt.format(row.totalInvestment)}
Interest Rate: ${(row.ratePct * 100).toFixed(2)}% per annum
Interest Accrued: BTNC ${nfInt.format(interestAccrued)}
Units Allocated: ${row.unitsAllocated || "N/A"}

Timeline:
---------
Purchase Date: ${row.purchaseDate}
${row.purchaseDateISO ? `Purchase Date (ISO): ${row.purchaseDateISO}` : ''}
Maturity Date: ${row.maturity}
Time to Maturity: ${formatted}
Days Held: ${purchaseDate ? Math.max(1, Math.floor((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24))) : "N/A"}

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

/* ========================= Enhanced Sort Component ========================= */

function SortDropdown({
  activeSort,
  onSortChange,
}: {
  activeSort: string;
  onSortChange: (sort: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { 
      key: "interest-desc", 
      label: "Highest Interest", 
      icon: TrendingUp,
      color: "text-emerald-600"
    },
    { 
      key: "interest-asc", 
      label: "Lowest Interest", 
      icon: TrendingDown,
      color: "text-rose-600"
    },
    { 
      key: "maturity-asc", 
      label: "Nearest Maturity", 
      icon: Calendar,
      color: "text-blue-600"
    },
    { 
      key: "name-asc", 
      label: "Name A-Z", 
      icon: ArrowUpRight,
      color: "text-indigo-600"
    },
    { 
      key: "investment-desc", 
      label: "Highest Investment", 
      icon: DollarSign,
      color: "text-amber-600"
    },
  ];

  const activeOption = sortOptions.find(opt => opt.key === activeSort) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSortChange = (key: string) => {
    onSortChange(key);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-3 rounded-xl border border-gray-300/80 bg-white hover:bg-gray-50/80 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:shadow-sm transition-all duration-200 w-full sm:w-auto"
      >
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500 group-hover:text-gray-600" />
          <span className="font-medium hidden sm:inline">Sort by:</span>
          <span className="font-medium sm:hidden">Sort</span>
        </div>
        <span className="inline-flex items-center gap-2 text-[#5B50D9] font-semibold ml-auto">
          <span className="hidden sm:inline">{activeOption.label}</span>
          <span className="sm:hidden">({activeOption.label.split(" ")[0]})</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-[#5B50D9]" />
          </motion.div>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-48 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200/80 py-2"
          >
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeSort === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => handleSortChange(option.key)}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm transition-all duration-150 hover:bg-gray-50/80 ${isActive ? 'bg-[#5B50D9]/5' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#5B50D9]' : option.color}`} />
                  <span className={`font-medium ${isActive ? 'text-[#5B50D9]' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#5B50D9]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================= Combined Filter Bar with Search ========================= */

function FilterBar({
  onFilterChange,
  activeFilter,
  query,
  onQueryChange,
  onSortChange,
  activeSort,
  viewMode,
  onViewChange,
}: {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  activeSort: string;
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}) {
  const filters = [
    { key: "all", label: "All Bonds", icon: Layers, color: "from-indigo-500 to-purple-600" },
  ];

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section: Search Bar */}
        <div className="flex-1 min-w-0">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search bonds by name, issuer, or symbol..."
              className="w-full h-11 sm:h-12 rounded-xl border border-gray-300/80 bg-gray-50/80 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-[#5B50D9]/20 focus:border-[#5B50D9] focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section: Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const active = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={`group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-md`
                      : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">All</span>
                </button>
              );
            })}
          </div>

          {/* Sort and View Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <SortDropdown activeSort={activeSort} onSortChange={onSortChange} />
            </div>
            
            <div className="flex items-center gap-1 rounded-xl border border-gray-300/80 bg-white p-1">
              <button
                onClick={() => onViewChange("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[#5B50D9] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-[#5B50D9] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sort Dropdown */}
      <div className="sm:hidden mt-4">
        <SortDropdown activeSort={activeSort} onSortChange={onSortChange} />
      </div>
    </div>
  );
}

/* ========================= Performance Card (Grid View) ========================= */

function PerformanceCard({ row }: { row: Row }) {
  const bondIcon = getBondIcon(row.name, row.bondType);
  const Icon = bondIcon.icon;
  const category = getBondCategory(row.name);
  const interestAccrued = calculateInterestAccrued(row);
  const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
  const maturityDate = parseDate(row.maturity);
  const currentDate = new Date();
  
  let daysToMaturity = 0;
  let isMatured = false;
  
  if (maturityDate) {
    const timeDiff = maturityDate.getTime() - currentDate.getTime();
    daysToMaturity = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    isMatured = timeDiff <= 0;
  }
  
  let daysHeld = 0;
  if (purchaseDate) {
    daysHeld = Math.max(1, Math.floor((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24)));
  }

  return (
    <motion.div
      {...cardHover}
      className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm hover:shadow-[0_12px_24px_-6px_rgba(91,80,217,0.12)] transition-all duration-200 h-full flex flex-col"
    >
      {/* Header - Clean design without status */}
      <div className="flex items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${bondIcon.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight line-clamp-2">
              {row.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-500 truncate">{category}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 truncate">{row.issuer || row.bondType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics - Clean 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 flex-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Percent className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Rate</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {(row.ratePct * 100).toFixed(2)}%
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Accrued</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-emerald-600">
            BTNC {nfInt.format(interestAccrued)}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Maturity</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {maturityDate?.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }) || row.maturity}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Time Left</span>
          </div>
          {isMatured ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-600">Matured</span>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-900">
              {daysToMaturity}d
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section with Investment Info */}
      <div className="mb-4 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Invested</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              BTNC {nfInt.format(row.totalInvestment)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Issuer</span>
            </div>
            <p className="text-xs font-medium text-gray-900 truncate">
              {row.issuer || row.bondType || "Fixed Income"}
            </p>
          </div>
        </div>
        {row.unitsAllocated && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Units:</span>
              <span className="text-sm font-semibold text-gray-900">
                {row.unitsAllocated}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href={`/investor/Earnings/${row.id}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#5B50D9] hover:text-[#4a40c8] hover:gap-2 transition-all duration-200"
        >
          View Details
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
        <span className="text-xs text-gray-500" title={row.bondSymbol}>
          {row.bondSymbol || shortenHash(row.id, 4, 4)}
        </span>
      </div>
    </motion.div>
  );
}

/* ========================= Responsive List View Component ========================= */

function ResponsiveListRow({ row }: { row: Row }) {
  const bondIcon = getBondIcon(row.name, row.bondType);
  const Icon = bondIcon.icon;
  const category = getBondCategory(row.name);
  const interestAccrued = calculateInterestAccrued(row);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
  const maturityDate = parseDate(row.maturity);
  const currentDate = new Date();
  
  let daysToMaturity = 0;
  let isMatured = false;
  
  if (maturityDate) {
    const timeDiff = maturityDate.getTime() - currentDate.getTime();
    daysToMaturity = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    isMatured = timeDiff <= 0;
  }

  return (
    <motion.div
      variants={itemAnimation}
      className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm hover:shadow-[0_12px_24px_-6px_rgba(91,80,217,0.12)] transition-all duration-200"
    >
      {/* Header - Clean without status indicator */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${bondIcon.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
              {row.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-500">{category}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {row.issuer || row.bondType}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-xs text-gray-500 truncate">
          {row.bondSymbol || shortenHash(row.id, 4, 4)}
        </div>
      </div>

      {/* Metrics Grid - Responsive */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Percent className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Rate</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {(row.ratePct * 100).toFixed(2)}%
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Accrued</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-emerald-600">
            BTNC {nfInt.format(interestAccrued)}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Maturity</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {maturityDate?.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }) || row.maturity}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 sm:gap-2">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Time Left</span>
          </div>
          {isMatured ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-600">Matured</span>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-900">
              {daysToMaturity}d
            </p>
          )}
        </div>
      </div>

      {/* Additional Info (Collapsible on mobile) */}
      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 pt-4 mt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Investment</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  BTNC {nfInt.format(row.totalInvestment)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Issuer</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {row.issuer || row.bondType || "Fixed Income"}
                </p>
              </div>
              {row.unitsAllocated && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">Units</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {row.unitsAllocated}
                  </p>
                </div>
              )}
              {row.purchaseDateISO && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">Purchase Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(row.purchaseDateISO).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            href={`/investor/Earnings/${row.id}`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-gray-900 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-gray-900 transition-all duration-200"
          >
            {isExpanded ? "Show Less" : "More Info"}
          </button>
        </div>
        <div className="hidden sm:block text-xs text-gray-500 truncate">
          Symbol: {row.bondSymbol || shortenHash(row.id, 4, 4)}
        </div>
      </div>
    </motion.div>
  );
}

/* ========================= Desktop Table Row Component ========================= */

function DesktopTableRow({ row }: { row: Row }) {
  const bondIcon = getBondIcon(row.name, row.bondType);
  const Icon = bondIcon.icon;
  const category = getBondCategory(row.name);
  const interestAccrued = calculateInterestAccrued(row);
  const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
  const maturityDate = parseDate(row.maturity);
  const currentDate = new Date();
  
  let daysToMaturity = 0;
  let isMatured = false;
  
  if (maturityDate) {
    const timeDiff = maturityDate.getTime() - currentDate.getTime();
    daysToMaturity = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
    isMatured = timeDiff <= 0;
  }

  return (
    <motion.tr variants={itemAnimation} className="hover:bg-gray-50/50">
      <td className="py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${bondIcon.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight line-clamp-1">
              {row.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-500">{category}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 truncate max-w-[100px]">
                {row.issuer || row.bondType}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">{(row.ratePct * 100).toFixed(2)}%</div>
          <div className="text-xs text-gray-500">Interest Rate</div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-emerald-600">BTNC {nfInt.format(interestAccrued)}</div>
          <div className="text-xs text-gray-500">Interest Accrued</div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">BTNC {nfInt.format(row.totalInvestment)}</div>
          <div className="text-xs text-gray-500">Total Investment</div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {maturityDate?.toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }) || row.maturity}
          </div>
          <div className="text-xs text-gray-500">Maturity Date</div>
        </div>
      </td>
      <td className="py-4 px-3">
        <div className="space-y-1">
          {isMatured ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-600">Matured</span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-gray-900">{daysToMaturity} days</div>
          )}
          <div className="text-xs text-gray-500">Time to Maturity</div>
        </div>
      </td>
      <td className="py-4 pl-3 pr-4 sm:pr-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/investor/Earnings/${row.id}`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-gray-900 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </Link>
        </div>
      </td>
    </motion.tr>
  );
}

/* ========================= Main Page ========================= */

export default function EarningsPage() {
  const currentUser = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("interest-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
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
        
        // Transform the fetched data with accurate interest calculation
        const transformedData = data.map((row: any) => {
          // Calculate accurate interest
          const principal = row.totalInvestment || row.faceValue || 0;
          const annualRate = row.ratePct > 1 ? row.ratePct / 100 : row.ratePct;
          const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
          const currentDate = new Date();
          
          let daysHeld = 180; // Default fallback
          
          if (purchaseDate) {
            const timeDiff = currentDate.getTime() - purchaseDate.getTime();
            daysHeld = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
          }
          
          const dailyRate = annualRate / 365;
          const accurateInterest = principal * dailyRate * daysHeld;
          
          return {
            id: row.id || "",
            name: row.name || "",
            ratePct: row.ratePct || 0,
            interestAccrued: Math.round(accurateInterest * 100) / 100, // Use accurate calculation
            maturity: row.maturity || "",
            status: row.status || "flat",
            purchaseDate: row.purchaseDate || "",
            purchaseDateISO: row.purchaseDateISO || row.purchaseDate || "",
            bondType: row.bondType || "",
            faceValue: row.faceValue || 0,
            totalInvestment: row.totalInvestment || 0,
            issuer: row.issuer || row.bondType || "", // Ensure issuer is available
            bondSymbol: row.bondSymbol || "",
            unitsAllocated: row.unitsAllocated || 0
          };
        });
        
        setRows(transformedData);
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
      const matchesSearch = 
        query === "" ||
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        (row.issuer && row.issuer.toLowerCase().includes(query.toLowerCase())) ||
        row.bondType?.toLowerCase().includes(query.toLowerCase()) ||
        row.bondSymbol?.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all";
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      const aInterest = calculateInterestAccrued(a);
      const bInterest = calculateInterestAccrued(b);
      
      switch (activeSort) {
        case "interest-desc":
          return bInterest - aInterest;
        case "interest-asc":
          return aInterest - bInterest;
        case "maturity-asc":
          // Sort by remaining time
          const aDate = parseDate(a.maturity);
          const bDate = parseDate(b.maturity);
          const today = new Date();
          
          if (!aDate || !bDate) return 0;
          
          const aDiff = aDate.getTime() - today.getTime();
          const bDiff = bDate.getTime() - today.getTime();
          
          if (aDiff <= 0 && bDiff > 0) return -1;
          if (bDiff <= 0 && aDiff > 0) return 1;
          
          return aDiff - bDiff;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "investment-desc":
          return b.totalInvestment - a.totalInvestment;
        default:
          return 0;
      }
    });
  }, [rows, query, activeFilter, activeSort]);

  const totalEarnings = useMemo(
    () => filteredAndSorted.reduce((sum, row) => sum + calculateInterestAccrued(row), 0),
    [filteredAndSorted]
  );

  const totalInvestment = useMemo(
    () => filteredAndSorted.reduce((sum, row) => sum + row.totalInvestment, 0),
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
        text: `Check out my earnings from ${row.name}: BTNC ${nfInt.format(
          calculateInterestAccrued(row)
        )}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `My ${row.name} Earnings: BTNC ${nfInt.format(
          calculateInterestAccrued(row)
        )} - Maturity: ${row.maturity}`
      );
      alert("Earnings data copied to clipboard!");
    }
  };

  const handleExportAll = () => {
    const csvContent = [
      [
        "Bond Name",
        "Bond Symbol",
        "Issuer",
        "Category",
        "Interest Rate",
        "Interest Accrued",
        "Maturity Date",
        "Remaining Days",
        "Face Value",
        "Total Investment",
        "Purchase Date",
        "Units Allocated",
      ],
      ...filteredAndSorted.map((row) => {
        const purchaseDate = parseDate(row.purchaseDateISO || row.purchaseDate);
        const maturityDate = parseDate(row.maturity);
        const currentDate = new Date();
        
        let daysToMaturity = 0;
        let isMatured = false;
        
        if (maturityDate) {
          const timeDiff = maturityDate.getTime() - currentDate.getTime();
          daysToMaturity = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
          isMatured = timeDiff <= 0;
        }
        
        return [
          row.name,
          row.bondSymbol || "N/A",
          row.issuer || row.bondType || "Fixed Income",
          getBondCategory(row.name),
          `${(row.ratePct * 100).toFixed(2)}%`,
          `BTNC ${nfInt.format(calculateInterestAccrued(row))}`,
          row.maturity,
          isMatured ? "Matured" : `${daysToMaturity} days`,
          `BTNC ${nfInt.format(row.faceValue)}`,
          `BTNC ${nfInt.format(row.totalInvestment)}`,
          row.purchaseDateISO || row.purchaseDate,
          row.unitsAllocated || "N/A",
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-bond-portfolio.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar currentUser={currentUser} />
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50/50 via-slate-50/50 to-blue-50/30">
      <InvestorSideNavbar currentUser={currentUser} />

      <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Wallet strip */}
          <WalletStrip walletAddress={walletAddress} />

          {/* Header Section */}
          <motion.header {...fadeIn} className="mt-3 sm:mt-4 lg:mt-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B50D9]/10 to-[#8B50D9]/10 px-3 py-1.5 text-sm font-medium text-[#5B50D9] border border-[#5B50D9]/20">
                  <Sparkles className="w-4 h-4" />
                  Bond Portfolio Performance
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                    Your Bond Portfolio
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600/80 mt-1 sm:mt-2 max-w-2xl">
                    Detailed view of all your bond earnings, investments, and performance metrics.
                    Monitor maturity dates, interest accruals, and portfolio health in real-time.
                  </p>
                </div>

                {/* Stats Overview */}
                <motion.div 
                  {...fadeIn}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3"
                >
                  <StatsCard
                    icon={Layers}
                    label="Total Bonds"
                    value={filteredAndSorted.length.toString()}
                  />
                  <StatsCard
                    icon={TrendingUp}
                    label="Total Earnings"
                    value={`BTNC ${nfInt.format(totalEarnings)}`}
                    change={`${avgRate}% avg`}
                  />
                  <StatsCard
                    icon={BarChart3}
                    label="Avg. Return"
                    value={`${avgRate}%`}
                  />
                  <StatsCard
                    icon={Banknote}
                    label="Total Investment"
                    value={`BTNC ${nfInt.format(totalInvestment)}`}
                  />
                </motion.div>
              </div>

              {/* Export Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full lg:w-auto">
                <button
                  onClick={handleExportAll}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium bg-gradient-to-r from-[#5B50D9] to-[#8B50D9] text-white hover:shadow-lg hover:from-[#4a45b5] hover:to-[#7545b5] transition-all duration-200 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export Portfolio</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
          </motion.header>

          {/* Combined Filter, Sort, Search & View Controls */}
          <motion.div
            {...fadeIn}
          >
            <FilterBar
              onFilterChange={setActiveFilter}
              activeFilter={activeFilter}
              query={query}
              onQueryChange={setQuery}
              onSortChange={setActiveSort}
              activeSort={activeSort}
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
          </motion.div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 px-2">
            Showing {filteredAndSorted.length} of {rows.length} bonds
          </div>

          {/* Main Content */}
          <motion.section
            {...fadeIn}
            className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/80 overflow-hidden"
            aria-labelledby="earnings-title"
          >
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="p-3 sm:p-4 lg:p-6">
                {filteredAndSorted.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                  >
                    {filteredAndSorted.map((row) => (
                      <motion.div key={row.id} variants={itemAnimation}>
                        <PerformanceCard row={row} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="p-6 sm:p-8 md:p-10 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No bonds found
                      </h3>
                      <p className="text-gray-500/80 mb-4 sm:mb-6 text-xs sm:text-sm">
                        {query || activeFilter !== "all"
                          ? "Try adjusting your search or filter terms"
                          : "You don't have any bonds in your portfolio yet"}
                      </p>
                      {(query || activeFilter !== "all") && (
                        <button
                          onClick={() => {
                            setQuery("");
                            setActiveFilter("all");
                          }}
                          className="text-[#5B50D9] hover:text-[#4a40c8] font-medium text-xs sm:text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="p-3 sm:p-4 lg:p-6">
                {filteredAndSorted.length > 0 ? (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full min-w-[1000px]">
                        <thead>
                          <tr className="border-b border-gray-200/80 bg-gray-50/60">
                            <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bond Details</th>
                            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Accrued</th>
                            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Investment</th>
                            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Maturity</th>
                            <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Left</th>
                            <th className="py-3 pl-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <motion.tbody
                          className="divide-y divide-gray-100"
                          variants={staggerChildren}
                          initial="initial"
                          animate="animate"
                        >
                          {filteredAndSorted.map((row) => (
                            <DesktopTableRow key={row.id} row={row} />
                          ))}
                        </motion.tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden">
                      <motion.div
                        className="space-y-3 sm:space-y-4"
                        variants={staggerChildren}
                        initial="initial"
                        animate="animate"
                      >
                        {filteredAndSorted.map((row) => (
                          <ResponsiveListRow key={row.id} row={row} />
                        ))}
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 sm:p-8 md:p-10 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No bonds found
                      </h3>
                      <p className="text-gray-500/80 mb-4 sm:mb-6 text-xs sm:text-sm">
                        {query || activeFilter !== "all"
                          ? "Try adjusting your search or filter terms"
                          : "You don't have any bonds in your portfolio yet"}
                      </p>
                      {(query || activeFilter !== "all") && (
                        <button
                          onClick={() => {
                            setQuery("");
                            setActiveFilter("all");
                          }}
                          className="text-[#5B50D9] hover:text-[#4a40c8] font-medium text-xs sm:text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}