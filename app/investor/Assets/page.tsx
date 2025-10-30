"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser } from "@/server/action/currentUser";
import { useCurrentUser, UserContext } from "@/context/UserContext";


// ========================= Types =========================

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number; // 0.05 -> 5%
  total: number; // total units bought (as in original component)
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
};

// ========================= Motion presets =========================

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

// ========================= Data =========================

const INITIAL_ROWS: Row[] = [
  { id: "1", name: "RICB Bond", ratePct: 0.05, total: 100, maturity: "25/12/2026", status: "up" },
  { id: "2", name: "RICB Bond", ratePct: 0.05, total: 200, maturity: "25/12/2027", status: "up" },
  { id: "3", name: "RICB Bond", ratePct: 0.05, total: 300, maturity: "25/12/2028", status: "up" },
  { id: "4", name: "RICB Bond", ratePct: 0.05, total: 500, maturity: "25/12/2029", status: "up" },
  { id: "5", name: "RICB Bond", ratePct: 0.05, total: 700, maturity: "25/11/2027", status: "up" },
  { id: "6", name: "RICB Bond", ratePct: 0.05, total: 900, maturity: "25/12/2026", status: "up" },
  { id: "7", name: "RICB Bond", ratePct: 0.05, total: 101, maturity: "25/12/2026", status: "up" },
];

// Number formatter
const nfInt = new Intl.NumberFormat("en-IN");

// ========================= Subcomponents =========================

function WalletSection({ walletAddress, balance = 0 }: { walletAddress: string; balance?: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {}
  };

  return (
    <motion.section
      {...fadeIn}
      className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden"
      aria-labelledby="wallet-summary-title"
    >
      {/* Address row (matches earlier UI) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-black/5 bg-gradient-to-b from-white to-white/80">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
            <Wallet className="w-4 h-4 text-[#5B50D9]" strokeWidth={1.75} />
          </span>

          <span className="font-medium">Wallet address:</span>
          <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all">
            {walletAddress}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all"
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

      {/* Balance summary (same coin pill as earlier page) */}
      <div className="p-5 text-center">
        <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
          <Image src="/coin.png" alt="coin" width={24} height={24} />
        </div>
        <p className="mt-2 text-[13px] sm:text-[14px]">
          <span className="block font-semibold leading-tight">Your wallet has</span>
          <span className="text-black/80">{balance} coins</span>
        </p>
      </div>
    </motion.section>
  );
}

// ========================= Main =========================

export default function AssetsPage() {
  const currentUser = useCurrentUser();

  const walletAddress = currentUser.wallet_address; // mock wallet

  const [query, setQuery] = useState("");
  const rows = useMemo(() => INITIAL_ROWS, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        {/* Page title */}
        <motion.header {...fadeIn} className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Investor Assets</h1>
        </motion.header>

        {/* Wallet */}
        <WalletSection walletAddress={walletAddress} balance={1000} />

        {/* ======================= Market Place ======================= */}
        <section className="w-full mt-10" aria-labelledby="market-title">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
              <div>
                <h2
                  id="market-title"
                  className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-900"
                >
                  Market Place
                </h2>
                <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 max-w-3xl">
                  View your purchased units and their stated coupon rates and maturities.
                </p>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <label htmlFor="search" className="sr-only">
                    Search bonds
                  </label>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
                    className="h-10 w-[min(270px,75vw)] sm:w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Search by name"
                  />
                </div>
              </div>
            </div>

            {/* Empty search state */}
            {filtered.length === 0 && (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                <p className="text-sm text-neutral-600">No bonds match “{query}”.</p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-3 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Mobile list (cards) */}
            <ul className="mt-6 grid sm:hidden gap-3" role="list" aria-label="Your bonds">
              {filtered.map((row) => {
                const dim = row.disabled ? "text-neutral-300" : "text-neutral-900";
                const rateCol = row.disabled
                  ? "text-neutral-300"
                  : row.status === "down"
                  ? "text-red-600"
                  : row.status === "flat"
                  ? "text-neutral-600"
                  : "text-emerald-600";

                return (
                  <li
                    key={row.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                    aria-disabled={row.disabled || undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                          <Image
                            src="/RSEB.png"
                            alt="Issuer"
                            width={22}
                            height={22}
                            className={`object-contain ${row.disabled ? "opacity-40" : ""}`}
                          />
                          <span
                            aria-hidden
                            className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                              row.status === "up"
                                ? "bg-emerald-500"
                                : row.status === "down"
                                ? "bg-red-500"
                                : "bg-neutral-300"
                            }`}
                          />
                          <span className="sr-only">
                            {row.status === "up"
                              ? "Trending up"
                              : row.status === "down"
                              ? "Trending down"
                              : "No change"}
                          </span>
                        </div>
                        <div>
                          <p className={`text-[15px] font-medium ${dim}`}>{row.name}</p>
                          <p className={`text-[13px] ${rateCol}`}>{(row.ratePct * 100).toFixed(2)}% / yr</p>
                        </div>
                      </div>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                        aria-label={`Open ${row.name}`}
                        disabled={row.disabled}
                        aria-disabled={row.disabled || undefined}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 3v5h5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-[13px]">
                      <div>
                        <p className="text-neutral-500">Units bought</p>
                        <p className={`${dim}`}>{nfInt.format(row.total)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Maturity</p>
                        <p className={`${dim}`}>{row.maturity}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Status</p>
                        <p className={`${dim}`}>{row.status}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop table */}
            {filtered.length > 0 && (
              <div className="mt-6 overflow-x-auto rounded-2xl hidden sm:block">
                <table
                  aria-labelledby="market-title"
                  className="min-w-full text-left bg-white rounded-2xl overflow-hidden"
                >
                  <caption className="sr-only">Your purchased bonds</caption>
                  <thead>
                    <tr className="text-[13px] text-neutral-500">
                      <th scope="col" className="py-3 pr-3 pl-2 font-medium">
                        Bond
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Interest rate
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Total unit bought
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Maturity date
                      </th>
                      <th scope="col" className="py-3 pl-3 pr-2 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((row) => {
                      const dim = row.disabled ? "text-neutral-300" : "text-neutral-900";
                      const rateCol = row.disabled
                        ? "text-neutral-300"
                        : row.status === "down"
                        ? "text-red-600"
                        : row.status === "flat"
                        ? "text-neutral-600"
                        : "text-emerald-600";

                      return (
                        <tr key={row.id} className="align-middle">
                          {/* Bond */}
                          <td className="py-5 pr-3 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                                <Image
                                  src="/RSEB.png"
                                  alt="Issuer"
                                  width={22}
                                  height={22}
                                  className={`object-contain ${row.disabled ? "opacity-40" : ""}`}
                                />
                                <span
                                  aria-hidden
                                  className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                    row.status === "up"
                                      ? "bg-emerald-500"
                                      : row.status === "down"
                                      ? "bg-red-500"
                                      : "bg-neutral-300"
                                  }`}
                                />
                                <span className="sr-only">
                                  {row.status === "up"
                                    ? "Trending up"
                                    : row.status === "down"
                                    ? "Trending down"
                                    : "No change"}
                                </span>
                              </div>
                              <span className={`text-[15px] font-medium ${dim}`}>{row.name}</span>
                            </div>
                          </td>

                          {/* Interest */}
                          <td className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}>
                            {(row.ratePct * 100).toFixed(2)}% / yr
                          </td>

                          <td className={`py-5 px-3 text-[14px] ${dim}`}>{nfInt.format(row.total)}</td>
                          <td className={`py-5 px-3 text-[14px] ${dim}`}>{row.maturity}</td>

                          <td className="py-5 pl-3 pr-2">
                            <button
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                              aria-label={`Open ${row.name}`}
                              disabled={row.disabled}
                              aria-disabled={row.disabled || undefined}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                  d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 3v5h5"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
