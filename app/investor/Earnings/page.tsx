"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, FileText, Currency } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser } from "@/server/action/currentUser";
import { useCurrentUser } from "@/context/UserContext";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number;           // 0.05 -> 5%
  interestAccrued: number;   // e.g. 10, 20 ...
  maturity: string;          // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

/* ========================= Data ========================= */

const INITIAL_ROWS: Row[] = [
  { id: "1", name: "RICB Bond", ratePct: 0.05, interestAccrued: 10, maturity: "25/12/2026", status: "up" },
  { id: "2", name: "RICB Bond", ratePct: 0.05, interestAccrued: 20, maturity: "25/12/2027", status: "up" },
  { id: "3", name: "RICB Bond", ratePct: 0.05, interestAccrued: 30, maturity: "25/12/2028", status: "up" },
  { id: "4", name: "RICB Bond", ratePct: 0.05, interestAccrued: 60, maturity: "25/12/2029", status: "up" },
  { id: "5", name: "RICB Bond", ratePct: 0.05, interestAccrued: 70, maturity: "25/11/2027", status: "up" },
  { id: "6", name: "RICB Bond", ratePct: 0.05, interestAccrued: 90, maturity: "25/12/2026", status: "up" },
  { id: "7", name: "RICB Bond", ratePct: 0.05, interestAccrued: 65, maturity: "25/12/2026", status: "up" },
];

const nfInt = new Intl.NumberFormat("en-IN");

/* ========================= Wallet Header ========================= */

function WalletStrip({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {}
  };

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
    </motion.div>
  );
}

/* ========================= Page ========================= */



export default function EarningsPage() {
  const  currentUser = useCurrentUser();

  const walletAddress = currentUser.wallet_address;

  const [query, setQuery] = useState("");
  const rows = useMemo(() => INITIAL_ROWS, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar currentUser={currentUser}/>

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        {/* Wallet strip */}
        <WalletStrip walletAddress={walletAddress} />

        {/* Title + optional search */}
        <motion.header {...fadeIn} className="mt-6 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Your earnings
            </h1>

            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Search earnings
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
                placeholder="Search by bond name"
              />
            </div>
          </div>
        </motion.header>

        {/* Container */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden"
          aria-labelledby="earnings-title"
        >
          {/* Desktop table */}
          {filtered.length > 0 ? (
            <div className="hidden sm:block p-2">
              <table
                aria-labelledby="earnings-title"
                className="min-w-full text-left bg-white rounded-2xl overflow-hidden"
              >
                <caption id="earnings-title" className="sr-only">
                  Earnings across your purchased bonds
                </caption>
                <thead>
                  <tr className="text-[13px] text-neutral-600">
                    <th scope="col" className="py-3 pr-3 pl-4 font-medium">
                      Bond
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Interest Rate
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Interest accumulated
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Maturity Date
                    </th>
                    <th scope="col" className="py-3 pl-3 pr-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((row) => {
                    const rateCol =
                      row.status === "down"
                        ? "text-red-600"
                        : row.status === "flat"
                        ? "text-neutral-600"
                        : "text-emerald-600";

                    return (
                      <tr key={row.id} className="align-middle">
                        {/* Bond */}
                        <td className="py-5 pr-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                              <Image src="/RSEB.png" alt="Issuer" width={22} height={22} />
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
                            <span className="text-[15px] font-medium text-neutral-900">{row.name}</span>
                          </div>
                        </td>

                        {/* Interest rate */}
                        <td className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}>
                          + {(row.ratePct * 100).toFixed(0)}% yr
                        </td>

                        {/* Interest accumulated */}
                        <td className="py-5 px-3 text-[14px] text-neutral-900">
                          {nfInt.format(row.interestAccrued)}
                        </td>

                        {/* Maturity */}
                        <td className="py-5 px-3 text-[14px] text-neutral-900">{row.maturity}</td>

                        {/* Action */}
                        <td className="py-5 pl-3 pr-4">
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                            aria-label={`Open ${row.name}`}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-neutral-600">No earnings found.</div>
          )}

          {/* Mobile cards */}
          <ul className="sm:hidden divide-y divide-neutral-100" role="list" aria-label="Earnings list">
            {filtered.map((row) => {
              const rateCol =
                row.status === "down"
                  ? "text-red-600"
                  : row.status === "flat"
                  ? "text-neutral-600"
                  : "text-emerald-600";

              return (
                <li key={row.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                        <Image src="/RSEB.png" alt="Issuer" width={22} height={22} />
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
                        <p className="text-[15px] font-medium text-neutral-900">{row.name}</p>
                        <p className={`text-[13px] ${rateCol}`}>+ {(row.ratePct * 100).toFixed(0)}% yr</p>
                      </div>
                    </div>

                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                      aria-label={`Open ${row.name}`}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <p className="text-neutral-500">Interest accumulated</p>
                      <p className="text-neutral-900">{nfInt.format(row.interestAccrued)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Maturity</p>
                      <p className="text-neutral-900">{row.maturity}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.section>
      </main>
    </div>
  );
}
