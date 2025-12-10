// app/investor/earnings/page.tsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { fetchInvestorEarnings } from "@/server/db_actions/action";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoTimeOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoEyeOutline,
  IoLockClosed,
  IoInformationCircle,
  IoTrendingUp,
  IoStatsChart,
  IoCalendarOutline,
  IoCashOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

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

/* ========================= Helpers ========================= */

// Parse "DD/MM/YYYY" into a Date
const parseMaturity = (dateStr: string): Date | null => {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

// Check if maturity date is in the past or today
const isMatured = (maturityStr: string): boolean => {
  const maturityDate = parseMaturity(maturityStr);
  if (!maturityDate) return false;
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const maturityMidnight = new Date(
    maturityDate.getFullYear(),
    maturityDate.getMonth(),
    maturityDate.getDate()
  );
  return maturityMidnight.getTime() <= todayMidnight.getTime();
};

/* ========================= Component ========================= */

export default function EarningsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [sortBy, setSortBy] = useState<"maturity" | "rate" | "interest">(
    "maturity"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // list vs cards (desktop behaviour)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInvestorEarnings();
        setRows(data as Row[]);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load earnings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedRows = useMemo(() => {
    const copy = [...rows];

    copy.sort((a, b) => {
      if (sortBy === "maturity") {
        const aDate = parseMaturity(a.maturity)?.getTime() ?? 0;
        const bDate = parseMaturity(b.maturity)?.getTime() ?? 0;
        return sortDir === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === "rate") {
        return sortDir === "asc" ? a.ratePct - b.ratePct : b.ratePct - a.ratePct;
      }
      if (sortBy === "interest") {
        return sortDir === "asc"
          ? a.interestAccrued - b.interestAccrued
          : b.interestAccrued - a.interestAccrued;
      }
      return 0;
    });

    return copy;
  }, [rows, sortBy, sortDir]);

  const toggleSort = (field: "maturity" | "rate" | "interest") => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + r.interestAccrued, 0),
    [rows]
  );

  const totalInvested = useMemo(
    () => rows.reduce((sum, r) => sum + r.totalInvestment, 0),
    [rows]
  );

  const averageRate = useMemo(() => {
    if (!rows.length) return 0;
    const sum = rows.reduce((acc, r) => acc + r.ratePct, 0);
    return sum / rows.length;
  }, [rows]);

  const handleRedeem = (row: Row) => {
    if (!isMatured(row.maturity)) return;
    // TODO: plug actual redeem backend/blockchain logic here
    console.log("Redeem clicked for", row.id);
  };

  const handleExportCSV = () => {
    if (!sortedRows.length) return;

    const header = [
      "Bond Name",
      "Bond Type",
      "Coupon Rate (%)",
      "Interest Earned",
      "Principal",
      "Face Value",
      "Purchase Date",
      "Maturity",
      "Status",
    ];

    const lines = sortedRows.map((r) => {
      const cells = [
        r.name,
        r.bondType,
        (r.ratePct * 100).toFixed(2),
        r.interestAccrued.toFixed(2),
        r.totalInvestment.toFixed(2),
        r.faceValue.toFixed(2),
        r.purchaseDate,
        r.maturity,
        isMatured(r.maturity) ? "Matured" : "Ongoing",
      ];
      // Wrap each cell in quotes to be safe for CSV
      return cells.map((c) => `"${c}"`).join(",");
    });

    const csvContent = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "earnings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!rows.length) return;

    const summary = [
      "RSEB Earnings Summary",
      "",
      `Total Interest Earned: Nu. ${totalInterest.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Total Principal: Nu. ${totalInvested.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Average Coupon Rate: ${(averageRate * 100).toFixed(2)}%`,
      "",
      "Shared from the RSEB Bond Tokenization Platform.",
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "RSEB Earnings Summary",
          text: summary,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        alert("Earnings summary copied to clipboard.");
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  // Simple loading state (no animation)
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading your earnings...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header {...fadeIn} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Earnings & Redemptions
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Track your coupon earnings, monitor maturity timelines, and redeem
            matured bond positions.
          </p>
        </motion.header>

        {/* KPI cards – light theme, consistent with marketplace */}
        <motion.section
          {...fadeIn}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {/* Total Interest */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Interest Earned
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInterest.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <IoTrendingUp className="w-4 h-4" />
                  <span>Accruing over time</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoCashOutline className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Principal */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Principal
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInvested.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>Across all active bonds</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoDocumentTextOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Average Rate */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Average Coupon Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {(averageRate * 100).toFixed(2)}%
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoStatsChart className="w-4 h-4" />
                  <span>Weighted by holdings</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B50D9]" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Toolbar – info + Export / Share with working handlers */}
        <motion.div
          {...fadeIn}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <div className="mt-0.5">
              <IoInformationCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p>
              <span className="font-medium text-gray-800">
                Redemption rules:
              </span>{" "}
              Bonds can be redeemed only after reaching maturity. The{" "}
              <span className="text-[#5B50D9] font-medium">Redeem</span>{" "}
              button will be enabled automatically when eligible.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoDownloadOutline className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoShareSocialOutline className="w-4 h-4" />
              Share Summary
            </button>
          </div>
        </motion.div>

        {/* Desktop view toggle (list/table vs box/cards) */}
        <motion.div
          {...fadeIn}
          className="hidden lg:flex items-center justify-between mb-3"
        >
          <h2 className="text-sm font-semibold text-gray-800">
            Earning Positions
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "cards"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Card view"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "table"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Table view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Desktop table (list view) */}
        {viewMode === "table" && (
          <motion.div
            {...fadeIn}
            className="hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Bond
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("rate")}
                    >
                      Rate
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("interest")}
                    >
                      Interest Earned
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Principal
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("maturity")}
                    >
                      Maturity
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {error && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-red-500 text-sm"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!error && sortedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-gray-500 text-sm"
                      >
                        No earnings to display yet.
                      </td>
                    </tr>
                  )}

                  {!error &&
                    sortedRows.map((row) => {
                      const matured = isMatured(row.maturity);
                      const redeemDisabled = !matured || row.disabled;

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Bond */}
                          <td className="px-6 py-4 align-top">
                            <div className="space-y-0.5">
                              <p className="text-sm font-semibold text-gray-900">
                                {row.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {row.bondType}
                              </p>
                              <p className="text-xs text-gray-400">
                                Purchased on {row.purchaseDate}
                              </p>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-emerald-600">
                              {(row.ratePct * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Fixed coupon rate
                            </p>
                          </td>

                          {/* Interest */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {row.interestAccrued.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Accrued to date
                            </p>
                          </td>

                          {/* Principal */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {row.totalInvestment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Face value: Nu.{" "}
                              {row.faceValue.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </td>

                          {/* Maturity */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {row.maturity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {matured ? "Maturity reached" : "Ongoing tenure"}
                            </p>
                          </td>

                          {/* Status pill */}
                          <td className="px-4 py-4 align-top">
                            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs bg-gray-50 border-gray-200">
                              {matured ? (
                                <>
                                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-700 font-medium">
                                    Ready to redeem
                                  </span>
                                </>
                              ) : (
                                <>
                                  <IoLockClosed className="w-4 h-4 text-amber-500" />
                                  <span className="text-amber-700 font-medium">
                                    Locked till maturity
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRow(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                              >
                                <IoEyeOutline className="w-4 h-4" />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRedeem(row)}
                                disabled={redeemDisabled}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                                  redeemDisabled
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                                }`}
                              >
                                <IoCheckmarkCircle className="w-4 h-4" />
                                Redeem
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Desktop cards (box view) */}
        {viewMode === "cards" && !error && sortedRows.length > 0 && (
          <motion.div
            {...fadeIn}
            className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 mt-2"
          >
            {sortedRows.map((row) => {
              const matured = isMatured(row.maturity);
              const redeemDisabled = !matured || row.disabled;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Bond
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.name}
                        </p>
                        <p className="text-xs text-gray-500">{row.bondType}</p>
                        <p className="text-xs text-gray-400">
                          Purchased on {row.purchaseDate}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                        <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-0.5">Rate</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {(row.ratePct * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Interest</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.interestAccrued.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Principal</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.totalInvestment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Maturity</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.maturity}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                        {matured ? (
                          <>
                            <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">
                              Ready to redeem
                            </span>
                          </>
                        ) : (
                          <>
                            <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-amber-700 font-medium">
                              Locked till maturity
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRedeem(row)}
                      disabled={redeemDisabled}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                        redeemDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-3.5 h-3.5" />
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Desktop cards view error / empty messaging (when cards selected) */}
        {viewMode === "cards" && error && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-red-500 bg-white rounded-2xl border border-gray-200 py-8">
            {error}
          </div>
        )}
        {viewMode === "cards" && !error && sortedRows.length === 0 && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-gray-500 bg-white rounded-2xl border border-gray-200 py-8">
            No earnings to display yet.
          </div>
        )}

        {/* Mobile / small screens – horizontal slider with fixed-size cards */}
        <motion.div {...fadeIn} className="lg:hidden mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Swipe horizontally to view all of your bond earnings.
          </p>
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {!error &&
              sortedRows.map((row) => {
                const matured = isMatured(row.maturity);
                const redeemDisabled = !matured || row.disabled;

                return (
                  <div
                    key={row.id}
                    className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Bond
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {row.bondType}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {row.purchaseDate}
                          </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                          <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-0.5">Rate</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {(row.ratePct * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Interest</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.interestAccrued.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Principal</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.totalInvestment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Maturity</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.maturity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                          {matured ? (
                            <>
                              <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">
                                Ready to redeem
                              </span>
                            </>
                          ) : (
                            <>
                              <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-amber-700 font-medium">
                                Locked till maturity
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fixed-size action strip */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRedeem(row)}
                        disabled={redeemDisabled}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                          redeemDisabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                        }`}
                      >
                        <IoCheckmarkCircle className="w-3.5 h-3.5" />
                        Redeem
                      </button>
                    </div>
                  </div>
                );
              })}

            {error && (
              <div className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-center text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Slide-over details modal */}
        <AnimatePresence>
          {selectedRow && (
            <motion.div
              className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-gray-200 shadow-xl p-5 sm:p-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="absolute right-4 top-4 w-7 h-7 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <div className="space-y-4 pt-4 sm:pt-2">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                      <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bond Details
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedRow.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedRow.bondType} · Purchased on{" "}
                        {selectedRow.purchaseDate}
                      </p>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500">Coupon Rate</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedRow.ratePct * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Earned</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.interestAccrued.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Principal</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.totalInvestment.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Face Value</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.faceValue.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Maturity</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedRow.maturity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="text-gray-900 font-semibold">
                        {isMatured(selectedRow.maturity)
                          ? "Maturity reached"
                          : "Still in tenure"}
                      </p>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                    <div className="flex items-start gap-2">
                      <IoTimeOutline className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">
                          How redemption works
                        </p>
                        <p>
                          Once this bond reaches maturity, your principal and
                          final coupon are eligible for redemption. The{" "}
                          <span className="font-semibold">Redeem</span> button
                          will be enabled and the transaction will be processed
                          on-chain via the RSEB tokenization platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRedeem(selectedRow)}
                      disabled={
                        !isMatured(selectedRow.maturity) || selectedRow.disabled
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                        !isMatured(selectedRow.maturity) ||
                        selectedRow.disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-4 h-4" />
                      Redeem
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ========================= View Icons ========================= */

function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}
