"use client";

import { useMemo, useState, useEffect } from "react";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import WalletSection from "@/Components/Coin"; // ⬅️ new
import Image from "next/image";
import { motion } from "framer-motion";

// ========================= Types =========================

type Status = "up" | "down" | "flat";
type Market = "current" | "resale";

type Row = {
  id: string;
  name: string;
  ratePct: number; // 0.05 => 5%
  totalUnits: number;
  availableUnits: number;
  faceValueNu: number; // in Nu.
  status?: Status;
  disabled?: boolean;
  market: Market;
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
  {
    id: "ricb-1",
    name: "RICB Bond",
    ratePct: 0.05,
    totalUnits: 1000,
    availableUnits: 900,
    faceValueNu: 1_500_000,
    status: "up",
    market: "current",
  },
  {
    id: "gmc-1",
    name: "GMC Bond",
    ratePct: 0.07,
    totalUnits: 1000,
    availableUnits: 1000,
    faceValueNu: 50_000_000,
    status: "up",
    market: "current",
  },
  {
    id: "rta-1",
    name: "RTA Bond",
    ratePct: 0.05,
    totalUnits: 1000,
    availableUnits: 305,
    faceValueNu: 500_000,
    status: "down",
    disabled: true,
    market: "current",
  },
  {
    id: "govt-1",
    name: "GovTech Bond",
    ratePct: 0.02,
    totalUnits: 1000,
    availableUnits: 306,
    faceValueNu: 9_000_000,
    status: "down",
    disabled: true,
    market: "current",
  },
  // Resale market samples
  {
    id: "ricb-r-1",
    name: "RICB Bond (Lot #A17)",
    ratePct: 0.05,
    totalUnits: 200,
    availableUnits: 60,
    faceValueNu: 1_500_000,
    status: "flat",
    market: "resale",
  },
  {
    id: "gmc-r-1",
    name: "GMC Bond (Lot #B03)",
    ratePct: 0.068,
    totalUnits: 150,
    availableUnits: 0,
    faceValueNu: 50_000_000,
    status: "down",
    disabled: true,
    market: "resale",
  },
  {
    id: "rseb-r-2",
    name: "RSEB Index Note (Lot #C12)",
    ratePct: 0.045,
    totalUnits: 500,
    availableUnits: 480,
    faceValueNu: 750_000,
    status: "up",
    market: "resale",
  },
];

// Number formatters
const nfInt = new Intl.NumberFormat("en-IN");
const nfCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "BTN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

// ========================= Component =========================

export default function InvestorPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Market>("current");

  const walletAddress = "0i4u1290nfkjd809214190poij";

  useEffect(() => {
    // page mount/unmount hooks (kept for parity; nothing needed here now)
  }, []);

  const rows = useMemo(() => INITIAL_ROWS, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byTab = rows.filter((r) => r.market === activeTab);
    if (!q) return byTab;
    return byTab.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, activeTab, query]);

  const counts = useMemo(
    () => ({
      current: rows.filter((r) => r.market === "current").length,
      resale: rows.filter((r) => r.market === "resale").length,
    }),
    [rows]
  );

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      {/* min-w-0 is important so sticky sidebar doesn’t force overflow */}
      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <motion.header {...fadeIn} className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Investor Dashboard
          </h1>
        </motion.header>

        {/* Wallet Summary (extracted) */}
        <WalletSection walletAddress={walletAddress} />

        {/* ======================= Tokens Available ======================= */}
        <section className="w-full mt-10" aria-labelledby="tokens-title">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
              <div>
                <h2
                  id="tokens-title"
                  className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-900"
                >
                  Available tokens
                </h2>
                <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 max-w-3xl">
                  View pricing and availability of listed instruments on the
                  Royal Securities Exchange of Bhutan (RSEB).
                </p>
              </div>

              {/* Search + Filter */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <label htmlFor="search" className="sr-only">
                    Search tokens
                  </label>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    {/* magnifier icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
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
                    className="h-10 w-[min(270px,75vw)] sm:w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Search by name"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  aria-label="Filter"
                  title="Filter"
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 10h4M18 16h4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-neutral-200">
              <div
                role="tablist"
                aria-label="Token markets"
                className="flex gap-2"
              >
                <TabButton
                  id="tab-current"
                  active={activeTab === "current"}
                  onClick={() => setActiveTab("current")}
                  badge={counts.current}
                >
                  Current offering
                </TabButton>
                <TabButton
                  id="tab-resale"
                  active={activeTab === "resale"}
                  onClick={() => setActiveTab("resale")}
                  badge={counts.resale}
                >
                  Resale market
                </TabButton>
              </div>
            </div>

            {/* Empty search state */}
            {filtered.length === 0 && (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg_white p-6 text-center bg-white">
                <p className="text-sm text-neutral-600">
                  No {activeTab === "current" ? "current offerings" : "resale listings"} match “{query}”.
                </p>
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
            <ul
              className="mt-6 grid sm:hidden gap-3"
              role="tabpanel"
              aria-labelledby={
                activeTab === "current" ? "tab-current" : "tab-resale"
              }
            >
              {filtered.map((row) => {
                const dim = row.disabled
                  ? "text-neutral-300"
                  : "text-neutral-900";
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
                            alt="RSEB logo"
                            width={22}
                            height={22}
                            className={`object-contain ${
                              row.disabled ? "opacity-40" : ""
                            }`}
                          />
                          <span
                            aria-hidden="true"
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
                          <p className={`text-[15px] font-medium ${dim}`}>
                            {row.name}
                          </p>
                          <p className={`text-[13px] ${rateCol}`}>
                            {(row.ratePct * 100).toFixed(2)}% / yr
                          </p>
                        </div>
                      </div>

                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                        aria-label={`Open ${row.name}`}
                        disabled={row.disabled}
                        aria-disabled={row.disabled || undefined}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
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
                        <p className="text-neutral-500">Total</p>
                        <p className={`${dim}`}>{nfInt.format(row.totalUnits)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Available</p>
                        <p className={`${dim}`}>
                          {nfInt.format(row.availableUnits)} /{" "}
                          {nfInt.format(row.totalUnits)}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Face value (Nu.)</p>
                        <p className={`${dim}`}>
                          {nfCurrency.format(row.faceValueNu)}
                        </p>
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
                  aria-labelledby="tokens-title"
                  className="min-w-full text-left bg-white rounded-2xl overflow-hidden"
                >
                  <caption className="sr-only">
                    {activeTab === "current"
                      ? "Current offerings"
                      : "Resale market"}{" "}
                    on the Royal Securities Exchange of Bhutan
                  </caption>
                  <thead>
                    <tr className="text-[13px] text-neutral-500">
                      <th scope="col" className="py-3 pr-3 pl-2 font-medium">
                        Bond
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Interest rate
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Total units offered
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Units available
                      </th>
                      <th scope="col" className="py-3 px-3 font-medium">
                        Face value (Nu.)
                      </th>
                      <th scope="col" className="py-3 pl-3 pr-2 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((row) => {
                      const dim = row.disabled
                        ? "text-neutral-300"
                        : "text-neutral-900";
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
                                  alt="RSEB logo"
                                  width={22}
                                  height={22}
                                  className={`object-contain ${
                                    row.disabled ? "opacity-40" : ""
                                  }`}
                                />
                                <span
                                  aria-hidden="true"
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

                              <span className={`text-[15px] font-medium ${dim}`}>
                                {row.name}
                              </span>
                            </div>
                          </td>

                          {/* Interest */}
                          <td
                            className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}
                          >
                            {(row.ratePct * 100).toFixed(2)}% / yr
                          </td>

                          <td className={`py-5 px-3 text-[14px] ${dim}`}>
                            {nfInt.format(row.totalUnits)}
                          </td>
                          <td className={`py-5 px-3 text-[14px] ${dim}`}>
                            {nfInt.format(row.availableUnits)} /{" "}
                            {nfInt.format(row.totalUnits)}
                          </td>
                          <td className={`py-5 px-3 text-[14px] ${dim}`}>
                            {nfCurrency.format(row.faceValueNu)}
                          </td>

                          <td className="py-5 pl-3 pr-2">
                            <button
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                              aria-label={`Open ${row.name}`}
                              disabled={row.disabled}
                              aria-disabled={row.disabled || undefined}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >
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

        {/* <Footer /> */}
      </main>
    </div>
  );
}

// ========================= UI bits =========================

function TabButton({
  id,
  active,
  onClick,
  children,
  badge,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={`${id}-panel`}
      onClick={onClick}
      className={
        "relative -mb-px inline-flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium " +
        (active
          ? "border-b-2 border-[#5B50D9] text-neutral-900"
          : "text-neutral-500 hover:text-neutral-800")
      }
    >
      <span>{children}</span>
      {typeof badge === "number" && (
        <span
          className={`inline-flex items-center justify-center text-[11px] leading-none rounded-full px-2 py-1 ring-1 ring-black/10 ${
            active
              ? "bg-[#5B50D9]/10 text-[#5B50D9]"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
