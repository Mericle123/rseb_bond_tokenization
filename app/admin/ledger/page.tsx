"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, Eye, X, User, Calendar, FileText, DollarSign, CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp, Copy, Wallet, Send, ShoppingCart, Ticket, Coins, Hash, Package, TrendingUp, TrendingDown, Minus, Percent } from "lucide-react";
import Image from "next/image";
import { useCurrentUser } from "@/context/UserContext";
import { getCurrentUser } from "@/server/action/currentUser";

// ========================= Types =========================
type ActivityKind = "event" | "peer" | "allocation" | "subscription" | "buy_sell" | "send" | "redeem" | "buy";

type Status = "Completed" | "Complete" | "Pending" | "In progress" | "Failed";

type ActivityRow = {
  id: string;
  asset: string; // we will put the bond name here
  bondName?: string; // optional helper if your API sends this
  type: "Purchased" | "Transfer In" | "Transfer Out" | "Owner transfer" | "Airdrop" | "Redeem" | "Subscription" | "Send" | "Buy";
  date: string;
  amountLabel: string;
  status: Status;
  detail: string;
  tx_hash: string;
  kind: ActivityKind;
  amount: number;
  balance: number;
  investor?: string;
  investorId?: string;
  transactionId?: string;
  notes?: string;
};

// ========================= Motion =========================
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};


// ========================= Components =========================
function StatusBadge({ value }: { value: Status }) {
  const map: Record<Status, string> = {
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In progress": "bg-sky-50 text-sky-700 ring-sky-200",
    Failed: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 ring-inset ${map[value]}`}
    >
      {value}
    </span>
  );
}

function WalletStrip({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {}
  };
  if (!walletAddress) return null;

  return (
    <motion.div
      {...fadeIn}
      className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
            <Wallet className="w-4 h-4 text-[#5B50D9]" strokeWidth={1.75} />
          </span>
          <span className="font-medium">Wallet address:</span>
          <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all font-mono text-sm">
            {walletAddress}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all font-medium"
            aria-label="Copy wallet address"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Wallet address copied" : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Notification({ show, message, type = "success", onClose }) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pointer-events-none">
      <div className={`${getBackgroundColor()} border rounded-xl shadow-lg p-4 max-w-sm mx-3 pointer-events-auto transform transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Dropdown Component for better mobile experience
function FilterDropdown({ label, value, options, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span>{options.find(opt => opt.value === value)?.label || value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================= Main Component =========================
export default function LedgerPage() {
  const currentUser = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedKind, setSelectedKind] = useState("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ActivityRow | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter options
  const kindOptions = [
    { value: "all", label: "All" },
    { value: "peer", label: "Peer-to-peer" },
    { value: "allocation", label: "Allocations" },
    { value: "subscription", label: "Subscriptions" },
    { value: "event", label: "Events" },
    { value: "send", label: "Send" },
    { value: "buy", label: "Buy" },
    { value: "redeem", label: "Redeem" },
  ];

  const typeOptions = [
    { value: "All", label: "All Types" },
    { value: "Purchased", label: "Purchased" },
    { value: "Transfer In", label: "Transfer In" },
    { value: "Transfer Out", label: "Transfer Out" },
    { value: "Redeem", label: "Redeem" },
    { value: "Send", label: "Send" },
    { value: "Buy", label: "Buy" },
  ];

  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Failed", label: "Failed" },
  ];

  // Mock data matching the reference structure
  const [ledgerData, setLedgerData] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = ledgerData.filter(entry => {
      const matchesSearch = entry.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.investor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || entry.type === selectedType;
      const matchesStatus = selectedStatus === "All" || entry.status === selectedStatus;
      const matchesKind = selectedKind === "all" || entry.kind === selectedKind;
      
      return matchesSearch && matchesType && matchesStatus && matchesKind;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [ledgerData, searchTerm, selectedType, selectedStatus, sortConfig, selectedKind]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Stats calculations
  const stats = useMemo(() => {
    const totalDebits = ledgerData.filter(entry => entry.type === "Transfer Out" || entry.type === "Purchased").reduce((sum, entry) => sum + entry.amount, 0);
    const totalCredits = ledgerData.filter(entry => entry.type === "Transfer In" || entry.type === "Redeem").reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalCredits - totalDebits;
    const pendingTransactions = ledgerData.filter(entry => entry.status === "Pending").length;
    const totalTransactions = ledgerData.length;

    return { totalDebits, totalCredits, netBalance, pendingTransactions, totalTransactions };
  }, [ledgerData]);

  // Show notification
  const showNotification = (message: string, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Sorting handler
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Action Handlers
  const handleView = (entry: ActivityRow) => {
    setSelectedEntry(entry);
    setViewModalOpen(true);
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : 
      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "Send": return <Send className="w-4 h-4 text-purple-600" />;
      case "Buy": return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "Redeem": return <Ticket className="w-4 h-4 text-blue-600" />;
      case "Purchased": return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "Transfer In": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus, selectedKind]);

useEffect(() => {
  async function loadLedger() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/ledger", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Failed to load ledger (${res.status})`);
      }

      // Whatever your API returns (just assume it includes bond_name or bondName)
      const raw = await res.json();

      const data: ActivityRow[] = raw.map((row: any) => ({
        ...row,
        // prioritize explicit bond name from API, fallback to existing asset
        asset: row.bondName ?? row.bond_name ?? row.asset ?? "Unknown bond",
      }));

      setLedgerData(data);
    } catch (err: any) {
      console.error("Error loading ledger:", err);
      setError(err?.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  }

  loadLedger();
}, []);

if (loading && ledgerData.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5B50D9]/30 border-t-[#5B50D9] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading transaction ledger...</p>
        </div>
      </div>
    );
  }

  if (error && ledgerData.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FB] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load ledger
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-[#5B50D9] text-white rounded-lg text-sm font-medium hover:bg-[#4a40b9] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F7F8FB] p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Wallet Strip */}
        {/* <WalletStrip walletAddress/> */}

        {/* Header */}
        <motion.header {...fadeIn} className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                Transaction Ledger
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Track all your bond and coin transactions in one place
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <label htmlFor="search" className="sr-only">
                  Search transactions
                </label>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  id="search"
                  type="search"
                  enterKeyHint="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-lg sm:rounded-xl border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5B50D9]/20 focus:border-[#5B50D9] transition-colors"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Stats Overview */}
        <motion.div 
          {...fadeIn}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats.totalTransactions}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Debits</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mt-1">BTN {stats.totalDebits.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">BTN {stats.totalCredits.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold mt-1 ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  BTN {stats.netBalance.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Controls - Fully Responsive */}
        <motion.div {...fadeIn} className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Header with Export Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-medium text-gray-700">Filter Transactions</h3>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto justify-center">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors justify-between"
                >
                  <span>Filter Options</span>
                  <Filter className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Filter Grid - Responsive */}
              <div className={`grid gap-4 ${mobileFiltersOpen ? 'grid-cols-1' : 'hidden lg:grid lg:grid-cols-1 xl:grid-cols-3'} lg:gap-4`}>
                {/* Kind Filter */}
                <FilterDropdown
                  label="Transaction Kind"
                  value={selectedKind}
                  options={kindOptions}
                  onChange={setSelectedKind}
                />

                {/* Type Filter */}
                <FilterDropdown
                  label="Transaction Type"
                  value={selectedType}
                  options={typeOptions}
                  onChange={setSelectedType}
                />

                {/* Status Filter */}
                <FilterDropdown
                  label="Status"
                  value={selectedStatus}
                  options={statusOptions}
                  onChange={setSelectedStatus}
                />
              </div>

              {/* Active Filters Summary - Mobile */}
              {(selectedKind !== "all" || selectedType !== "All" || selectedStatus !== "All") && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedKind !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Kind: {kindOptions.find(opt => opt.value === selectedKind)?.label}
                      <button onClick={() => setSelectedKind("all")} className="ml-1 hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedType !== "All" && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Type: {selectedType}
                      <button onClick={() => setSelectedType("All")} className="ml-1 hover:text-green-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedStatus !== "All" && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      Status: {selectedStatus}
                      <button onClick={() => setSelectedStatus("All")} className="ml-1 hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
              
        {/* Ledger Table */}
        <motion.section
          {...fadeIn}
          className="rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          aria-labelledby="ledger-title"
        >
          
          {filteredData.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 sm:py-4 pl-4 sm:pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="py-3 sm:py-4 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="py-3 sm:py-4 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3 sm:py-4 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="py-3 sm:py-4 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="py-3 sm:py-4 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-3 sm:py-4 pl-3 pr-4 sm:pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 sm:py-4 pl-3 pr-4 sm:pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((row) => (
                      <tr
                        key={row.id}
                        className="align-middle hover:bg-gray-50/50 transition-colors group"
                      >
                        {/* Asset */}
                        <td className="py-3 sm:py-4 pl-4 sm:pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow transition-shadow">
                              {row.asset ? (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center overflow-hidden">
                                  <Image 
                                    src="/RSEB.png" 
                                    alt="RICB Bond" 
                                    width={24} 
                                    height={24}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center overflow-hidden">
                                  <Image 
                                    src="/coin.png" 
                                    alt="BTN Coin" 
                                    width={24} 
                                    height={24}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-sm sm:text-[15px] font-semibold text-gray-900 block">
                                {row.asset}
                              </span>
                              <span className="text-xs sm:text-[13px] text-gray-500">
                                {row.amountLabel}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-3 sm:py-4 px-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(row.type)}
                            <span className="text-sm sm:text-[14px] font-medium text-gray-900">
                              {row.type}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3 sm:py-4 px-3">
                          <div className="flex items-center gap-2 text-sm sm:text-[14px] text-gray-700">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            {row.date}
                          </div>
                        </td>

                        {/* Transaction Hash */}
                        <td className="py-3 sm:py-4 px-3">
                          <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[200px]">
                            <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <code className="text-xs font-mono text-gray-600 truncate bg-gray-50 px-2 py-1 rounded border border-gray-200">
                              {row.tx_hash || "N/A"}
                            </code>
                            {row.tx_hash && (
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  navigator.clipboard.writeText(row.tx_hash);
                                  showNotification("Transaction hash copied!", "success");
                                }}
                              >
                                <Copy className="w-3 h-3 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Details */}
                        <td className="py-3 sm:py-4 px-3">
                          <span className="text-sm sm:text-[14px] text-gray-700 line-clamp-2">
                            {row.detail}
                          </span>
                          {row.investor && (
                            <div className="text-xs text-gray-500 mt-1">
                              {row.investor} ({row.investorId})
                            </div>
                          )}
                        </td>

                        {/* Amount */}
                        <td className={`py-3 sm:py-4 px-3 text-sm sm:text-[14px] font-semibold ${
                          row.type === "Transfer In" || row.type === "Redeem" ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {row.amountLabel}
                        </td>

                        {/* Status */}
                        <td className="py-3 sm:py-4 pl-3 pr-4 sm:pr-6">
                          <StatusBadge value={row.status} />
                        </td>

                        {/* Actions - Only View button */}
                        <td className="py-3 sm:py-4 pl-3 pr-4 sm:pr-6">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button 
                              onClick={() => handleView(row)}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="lg:hidden">
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {paginatedData.map((row) => (
                    <div
                      key={row.id}
                      className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-gray-200 bg-white grid place-items-center shadow-sm">
                            {row.asset === "RICB Bond" ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden">
                                <Image 
                                  src="/RSEB.png" 
                                  alt="RICB Bond" 
                                  width={32} 
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden">
                                <Image 
                                  src="/coin.png" 
                                  alt="BTN Coin" 
                                  width={32} 
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm sm:text-[15px] font-semibold text-gray-900">
                              {row.asset}
                            </p>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(row.type)}
                              <p className="text-xs sm:text-[13px] text-gray-600">{row.type}</p>
                            </div>
                          </div>
                        </div>
                        <StatusBadge value={row.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-[13px] mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Date</span>
                          </div>
                          <p className="text-gray-900 font-medium">{row.date}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Amount</span>
                          </div>
                          <p className={`font-medium ${
                            row.type === "Transfer In" || row.type === "Redeem" ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {row.amountLabel}
                          </p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Transaction Hash</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-gray-600 truncate bg-gray-50 px-2 py-1 rounded border border-gray-200 flex-1">
                              {row.tx_hash || "N/A"}
                            </code>
                            {row.tx_hash && (
                              <button
                                className="p-1 sm:p-1.5 hover:bg-gray-100 rounded transition-colors"
                                onClick={() => {
                                  navigator.clipboard.writeText(row.tx_hash);
                                  showNotification("Transaction hash copied!", "success");
                                }}
                              >
                                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <p className="text-gray-500">Details</p>
                          <p className="text-gray-900 text-sm leading-5">{row.detail}</p>
                          {row.investor && (
                            <p className="text-xs text-gray-500 mt-1">
                              {row.investor} ({row.investorId})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mobile Actions - Only View button */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => handleView(row)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 sm:p-2 rounded hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="text-xs sm:text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
                      <span className="font-medium">{filteredData.length}</span> results
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span>Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
                {searchTerm
                  ? "No transactions match your search criteria."
                  : "Your transaction history will appear here once you start trading."}
              </p>
            </div>
          )}
        </motion.section>

        {/* Summary stats */}
        {filteredData.length > 0 && (
          <motion.div
            {...fadeIn}
            className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600"
          >
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-gray-900">{filteredData.length}</span>{" "}
              transactions total
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-emerald-600">
                {
                  filteredData.filter(
                    (r) => r.status === "Completed" || r.status === "Complete"
                  ).length
                }
              </span>{" "}
              completed
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-amber-600">
                {filteredData.filter((r) => r.status === "Pending").length}
              </span>{" "}
              pending
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-purple-600">
                {filteredData.filter((r) => r.kind === "send").length}
              </span>{" "}
              sends
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-green-600">
                {filteredData.filter((r) => r.kind === "buy").length}
              </span>{" "}
              buys
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200">
              <span className="font-medium text-blue-600">
                {filteredData.filter((r) => r.kind === "redeem").length}
              </span>{" "}
              redeems
            </div>
          </motion.div>
        )}
      </div>

      {/* Notification */}
      <Notification 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: "", type: "success" })}
      />

      {/* View Modal */}
      <ViewModal 
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        entry={selectedEntry}
      />
    </div>
  );
}

// ========================= Enhanced View Modal Component =========================
function ViewModal({ isOpen, onClose, entry }: { isOpen: boolean; onClose: () => void; entry: ActivityRow | null }) {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-2xl px-4 pt-4 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <p className="text-sm text-gray-600 mt-1">Complete transaction information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Transaction Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-semibold text-gray-900">{entry.transactionId || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{entry.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className={`font-semibold ${entry.type === 'Transfer In' || entry.type === 'Redeem' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.amountLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Investor</p>
                    <p className="font-semibold text-gray-900">{entry.investor || "N/A"}</p>
                    <p className="text-sm text-gray-500">{entry.investorId || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className={`p-2 rounded-lg ${
                    entry.type === 'Transfer In' || entry.type === 'Redeem' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-sm font-semibold ${
                      entry.type === 'Transfer In' || entry.type === 'Redeem' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900">{entry.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className={`p-2 rounded-lg ${
                    entry.status === 'Completed' ? 'bg-green-100' : 
                    entry.status === 'Pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <StatusBadge value={entry.status} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-gray-900">{entry.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Information */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Asset Information</h4>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full border-2 border-white bg-white grid place-items-center shadow-sm">
                  {entry.asset === "RICB Bond" ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/RSEB.png" 
                        alt="RICB Bond" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/coin.png" 
                        alt="BTN Coin" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{entry.asset}</p>
                  <p className="text-sm text-gray-600">{entry.amountLabel}</p>
                </div>
              </div>
            </div>

            {/* Description and Notes */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-900">{entry.detail}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-900">{entry.notes || "No additional notes"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Transaction Hash</p>
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <code className="text-sm font-mono text-gray-600 break-all flex-1">
                    {entry.tx_hash || "N/A"}
                  </code>
                  {entry.tx_hash && (
                    <button
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      onClick={() => navigator.clipboard.writeText(entry.tx_hash)}
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}