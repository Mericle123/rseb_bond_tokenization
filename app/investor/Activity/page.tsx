"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, FileText } from "lucide-react";
import { motion } from "framer-motion";

/* ========================= Types ========================= */

type Status = "Completed" | "Complete" | "Pending" | "In progress";

type ActivityRow = {
  id: string;
  asset: "RICB Bond" | "BTN coin";
  type:
    | "Purchased"
    | "Transfer In"
    | "Transfer Out"
    | "Owner transfer"
    | "Airdrop"
    | "Redeem";
  date: string;           // YYYY-MM-DD
  amountLabel: string;    // e.g. "BTN coin 100"
  status: Status;
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

/* ========================= Mock Data ========================= */

const INITIAL_ROWS: ActivityRow[] = [
  { id: "1", asset: "RICB Bond", type: "Purchased",    date: "2025-11-01", amountLabel: "BTN coin 100", status: "Completed" },
  { id: "2", asset: "BTN coin",  type: "Transfer Out", date: "2025-11-01", amountLabel: "BTN coin 100", status: "Pending" },
  { id: "3", asset: "BTN coin",  type: "Transfer In",  date: "2025-11-01", amountLabel: "BTN coin 100", status: "In progress" },
  { id: "4", asset: "RICB Bond", type: "Owner transfer", date: "2025-11-01", amountLabel: "BTN coin 100", status: "Complete" },
  { id: "5", asset: "RICB Bond", type: "Purchased",    date: "2025-11-01", amountLabel: "BTN coin 100", status: "Completed" },
  { id: "6", asset: "BTN coin",  type: "Transfer Out", date: "2025-11-01", amountLabel: "BTN coin 100", status: "Pending" },
  { id: "7", asset: "BTN coin",  type: "Transfer In",  date: "2025-11-01", amountLabel: "BTN coin 100", status: "In progress" },
  { id: "8", asset: "RICB Bond", type: "Owner transfer", date: "2025-11-01", amountLabel: "BTN coin 100", status: "Complete" },
  { id: "9", asset: "BTN coin",  type: "Transfer In",  date: "2025-11-01", amountLabel: "BTN coin 100", status: "In progress" },
];

/* ========================= Small bits ========================= */

function StatusBadge({ value }: { value: Status }) {
  const map: Record<Status, string> = {
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "In progress": "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 ${map[value]}`}
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
  return (
    <motion.div {...fadeIn} className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
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

export default function ActivityPage() {
  const walletAddress = "0i4u1290nfkjd809214190poij"; // mock address

  const [query, setQuery] = useState("");
  const rows = useMemo(() => INITIAL_ROWS, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.asset.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        {/* Wallet strip */}
        <WalletStrip walletAddress={walletAddress} />

        {/* Title + search */}
        <motion.header {...fadeIn} className="mt-6 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Your Ledger
            </h1>

            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Search activity
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
                placeholder="Search by type, asset or status"
              />
            </div>
          </div>
        </motion.header>

        {/* Activity table/card container */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden"
          aria-labelledby="activity-title"
        >
          {/* Desktop table */}
          {filtered.length > 0 ? (
            <div className="hidden sm:block p-2">
              <table className="min-w-full text-left bg-white rounded-2xl overflow-hidden">
                <caption id="activity-title" className="sr-only">
                  Ledger activity
                </caption>
                <thead>
                  <tr className="text-[13px] text-neutral-600">
                    <th scope="col" className="py-3 pr-3 pl-4 font-medium">Bond</th>
                    <th scope="col" className="py-3 px-3 font-medium">Type</th>
                    <th scope="col" className="py-3 px-3 font-medium">Date</th>
                    <th scope="col" className="py-3 px-3 font-medium">Amount</th>
                    <th scope="col" className="py-3 pl-3 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((row) => (
                    <tr key={row.id} className="align-middle">
                      {/* Bond / Asset */}
                      <td className="py-5 pr-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                            {row.asset === "RICB Bond" ? (
                              <Image src="/RSEB.png" alt="RICB" width={22} height={22} />
                            ) : (
                              <Image src="/coin.png" alt="BTN coin" width={22} height={22} />
                            )}
                          </div>
                          <span className="text-[15px] font-medium text-neutral-900">{row.asset}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-5 px-3 text-[14px] text-neutral-900">{row.type}</td>

                      {/* Date */}
                      <td className="py-5 px-3 text-[14px] text-neutral-900">{row.date}</td>

                      {/* Amount */}
                      <td className="py-5 px-3 text-[14px] text-neutral-900">{row.amountLabel}</td>

                      {/* Status */}
                      <td className="py-5 pl-3 pr-4">
                        <StatusBadge value={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-neutral-600">No activity found.</div>
          )}

          {/* Mobile list */}
          <ul className="sm:hidden divide-y divide-neutral-100" role="list" aria-label="Ledger list">
            {filtered.map((row) => (
              <li key={row.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                      {row.asset === "RICB Bond" ? (
                        <Image src="/RSEB.png" alt="RICB" width={22} height={22} />
                      ) : (
                        <Image src="/coin.png" alt="BTN coin" width={22} height={22} />
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-neutral-900">{row.asset}</p>
                      <p className="text-[13px] text-neutral-600">{row.type}</p>
                    </div>
                  </div>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                    aria-label="Open details"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                  <div>
                    <p className="text-neutral-500">Date</p>
                    <p className="text-neutral-900">{row.date}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Amount</p>
                    <p className="text-neutral-900">{row.amountLabel}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-neutral-500">Status</p>
                    <StatusBadge value={row.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </main>
    </div>
  );
}
