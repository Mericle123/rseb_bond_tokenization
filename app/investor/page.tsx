"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";

import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import WalletSection from "@/Components/Coin";
import { getCurrentUser } from "@/server/action/currentUser";
import { fetchBond } from "@/server/bond/creation";
import { Market } from "@/generated/prisma";
import { useCurrentUser } from "@/context/UserContext";

// ✅ Still directly calling server action (you said to keep this)

// ========================= Types =========================

type Status = "up" | "down" | "flat";

interface Bond {
  id: string;
  bond_name: string;
  interest_rate: string; // 0.05 => 5%
  tl_unit_offered: number;
  tl_unit_subscribed: number;
  // tl_units_available: number;
  face_value: number; // in Nu.
  market: Market;
  status?: Status;
  disabled?: boolean;
}

// ========================= Motion presets =========================

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

// ========================= Number formatters =========================

const nfInt = new Intl.NumberFormat("en-IN");
const nfCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "BTN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

// ========================= Component =========================

export default function InvestorPage() {
  const currentUser = useCurrentUser()

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Market>("current");

  const walletAddress = currentUser?.wallet_address;
  const mnemonics = currentUser?.hashed_mnemonics;

  // Fetch bonds on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBond();
        setBonds(data || []);
        console.log("Fetched bonds:", data);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      }
    })();
  }, []);

  // Memoized derived data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filteredByTab = bonds.filter((b) => b.market === activeTab);
    if (!q) return filteredByTab;
    return filteredByTab.filter((b) =>
      b.bond_name.toLowerCase().includes(q)
    );
  }, [bonds, activeTab, query]);

  const counts = useMemo(
    () => ({
      current: bonds.filter((b) => b.market === "current").length,
      resale: bonds.filter((b) => b.market === "resale").length,
    }),
    [bonds]
  );


  // ========================= Render =========================

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <motion.header {...fadeIn} className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Investor Dashboard
          </h1>
        </motion.header>

        {/* Wallet Summary */}
        <WalletSection walletAddress={walletAddress} mnemonics={mnemonics}/>

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

              {/* Search */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <label htmlFor="search" className="sr-only">
                    Search tokens
                  </label>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
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
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-10 w-[min(270px,75vw)] sm:w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Search by name"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-neutral-200">
              <div role="tablist" aria-label="Token markets" className="flex gap-2">
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
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
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

            {/* Table */}
            {filtered.length > 0 && (
              <div className="mt-6 overflow-x-auto rounded-2xl hidden sm:block">
                <table
                  aria-labelledby="tokens-title"
                  className="min-w-full text-left bg-white rounded-2xl overflow-hidden"
                >
                  <thead>
                    <tr className="text-[13px] text-neutral-500">
                      <th className="py-3 pr-3 pl-2 font-medium">Bond</th>
                      <th className="py-3 px-3 font-medium">Interest rate</th>
                      <th className="py-3 px-3 font-medium">Total units</th>
                      <th className="py-3 px-3 font-medium">Available</th>
                      <th className="py-3 px-3 font-medium">Face value (Nu.)</th>
                      <th className="py-3 pl-3 pr-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((bond) => (
                      <BondRow key={bond.id} bond={bond} />
                    ))}
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

// ========================= Subcomponents =========================

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
      onClick={onClick}
      className={`relative -mb-px inline-flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium ${
        active
          ? "border-b-2 border-[#5B50D9] text-neutral-900"
          : "text-neutral-500 hover:text-neutral-800"
      }`}
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

function BondRow({ bond }: { bond: Bond }) {
  const dim = bond.disabled ? "text-neutral-300" : "text-neutral-900";
  const rateCol = bond.disabled
    ? "text-neutral-300"
    : bond.status === "down"
    ? "text-red-600"
    : bond.status === "flat"
    ? "text-neutral-600"
    : "text-emerald-600";

  return (
    <tr className="align-middle">
      <td className="py-5 pr-3 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
            <Image
              src="/RSEB.png"
              alt="RSEB logo"
              width={22}
              height={22}
              className={`object-contain ${bond.disabled ? "opacity-40" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                bond.status === "up"
                  ? "bg-emerald-500"
                  : bond.status === "down"
                  ? "bg-red-500"
                  : "bg-neutral-300"
              }`}
            />
          </div>
          <span className={`text-[15px] font-medium ${dim}`}>
            {bond.bond_name}
          </span>
        </div>
      </td>

      <td className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}>
        {bond.interest_rate} / yr
      </td>
      <td className={`py-5 px-3 text-[14px] ${dim}`}>
        {Number(bond.tl_unit_offered)}
      </td>
      <td className={`py-5 px-3 text-[14px] ${dim}`}>
        {nfInt.format(Number(bond.tl_unit_subscribed))} / {nfInt.format(bond.tl_unit_offered)}
      </td>
      <td className={`py-5 px-3 text-[14px] ${dim}`}>
        {nfCurrency.format(bond.face_value)}
      </td>
      <td className="py-5 pl-3 pr-2">
        {/* <button
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
          aria-label={`Open ${bond.bond_name}`}
          disabled={bond.disabled}
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
        </button> */}
        <Link href={`/investor/AboutBond/${bond.id}`}>
                  <IoDocumentTextOutline />
                </Link>
      </td>
    </tr>
  );
}
