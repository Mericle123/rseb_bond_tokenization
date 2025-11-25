"use client";

import {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";

import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import WalletSection from "@/Components/Coin";
import { fetchBonds } from "@/server/bond/creation"; // ✅ new
import { Market } from "@/generated/prisma";
import { useCurrentUser } from "@/context/UserContext";
import { fetchResaleBonds } from "@/server/blockchain/bond";

// ========================= Types =========================

type Status = "up" | "down" | "flat";

interface Bond {
  id: string;
  bond_name: string;
  interest_rate: string; // 0.05 => 5%
  tl_unit_offered: number;
  tl_unit_subscribed: number;
  listing_onchain?: Number;
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

const PAGE_SIZE = 10;

export default function InvestorPage() {
  const currentUser = useCurrentUser();

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [currentBonds, setCurrentBonds] = useState<Bond[]>([]);
  const [resaleBonds, setResaleBonds] = useState<Bond[]>([]);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Market>("current");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const walletAddress = currentUser?.wallet_address;
  const mnemonics = currentUser?.hashed_mnemonics;
  const [resaleLoading, setResaleLoading] = useState(false);

  // -------- Load one page of bonds --------
  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (loadingMore && pageToLoad !== 1) return;
      try {
        if (pageToLoad === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        const data = await fetchBonds(pageToLoad, PAGE_SIZE, false);

        if (pageToLoad === 1) {
          setCurrentBonds(data || []);
        } else {
          setCurrentBonds((prev) => [...prev, ...(data || [])]);
        }

        setHasMore((data?.length ?? 0) === PAGE_SIZE);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        if (pageToLoad === 1) {
          setInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [loadingMore]
  );

  // Initial load
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Memoized derived data (search + tab filter)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = activeTab === "current" ? currentBonds : resaleBonds;

    if (!q) return source;
    return source.filter((b) =>
      b.bond_name.toLowerCase().includes(q)
    );
  }, [currentBonds, resaleBonds, activeTab, query]);

  const counts = useMemo(
    () => ({
      current: currentBonds.length,
      resale: resaleBonds.length,
    }),
    [currentBonds, resaleBonds]
  );


  useEffect(() => {
    if (activeTab !== "resale") return;
    if (resaleBonds.length > 0) return; // already loaded

    (async () => {
      try {
        setResaleLoading(true);
        const data = await fetchResaleBonds(1, PAGE_SIZE);
        // adapt returned shape to Bond interface
        const mapped: Bond[] = (data || []).map((l) => ({
          id: l.id, // listing id
          bond_name: l.bond_name,
          interest_rate: l.interest_rate,
          tl_unit_offered: l.tl_unit_subscribed,
          listing_onchain: l.listing_onchain,
          // tl_unit_subscribed: l.tl_unit_subscribed,
          face_value: l.face_value,
          market: "resale",
        }));
        setResaleBonds(mapped);
      } catch (e) {
        console.error("Error fetching resale bonds:", e);
      } finally {
        setResaleLoading(false);
      }
    })();
  }, [activeTab, resaleBonds.length]);

  // -------- IntersectionObserver for lazy loading --------
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (initialLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          // load next page
          loadPage(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [initialLoading, hasMore, loadingMore, loadPage, page]
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
        <WalletSection walletAddress={walletAddress} mnemonics={mnemonics} />

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
                  Marketplace
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
                    Search Market
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
                    className="h-10 w-full sm:w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Search by name"
                  />
                </div>
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
            {filtered.length === 0 && !initialLoading && (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                <p className="text-sm text-neutral-600">
                  No{" "}
                  {activeTab === "current"
                    ? "current offerings"
                    : "resale listings"}{" "}
                  match "{query}".
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

            {/* Loading state */}
            {initialLoading && (
              <div className="mt-6 text-center py-8">
                <p className="text-sm text-neutral-600">Loading bonds...</p>
              </div>
            )}

            {/* Desktop Table */}
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
                      <th className="py-3 px-3 font-medium">
                        Face value (Nu.)
                      </th>
                      <th className="py-3 pl-3 pr-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((bond, index) => {
                      const isLast =
                        activeTab === "current" && index === filtered.length - 1;

                      return (
                        <BondRow
                          key={bond.id}
                          bond={bond}
                          variant={activeTab === "current" ? "primary" : "resale"}
                          ref={isLast ? lastRowRef : undefined}
                        />
                      );
                    })}
                  </tbody>
                </table>

                {loadingMore && (
                  <p className="py-3 text-center text-sm text-neutral-500">
                    Loading more...
                  </p>
                )}
              </div>
            )}

            {/* Mobile Cards */}
            {filtered.length > 0 && (
              <div className="mt-6 sm:hidden space-y-4">
                {filtered.map((bond, index) => {
                  const isLast =
                    activeTab === "current" && index === filtered.length - 1;

                  return (
                    <MobileBondCard
                      key={bond.id}
                      bond={bond}
                      variant={activeTab === "current" ? "primary" : "resale"}
                      ref={isLast ? lastRowRef : undefined}
                    />
                  );
                })}

                {loadingMore && (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-500">Loading more...</p>
                  </div>
                )}
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
      className={`relative -mb-px inline-flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium ${active
        ? "border-b-2 border-[#5B50D9] text-neutral-900"
        : "text-neutral-500 hover:text-neutral-800"
        }`}
    >
      <span>{children}</span>
      {typeof badge === "number" && (
        <span
          className={`inline-flex items-center justify-center text-[11px] leading-none rounded-full px-2 py-1 ring-1 ring-black/10 ${active
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

// forwardRef so we can attach an IntersectionObserver ref to the <tr>
const BondRow = forwardRef<
  HTMLTableRowElement,
  { bond: Bond; variant: "primary" | "resale" }
>(({ bond, variant }, ref) => {
  const dim = bond.disabled ? "text-neutral-300" : "text-neutral-900";
  const rateCol = bond.disabled
    ? "text-neutral-300"
    : bond.status === "down"
      ? "text-red-600"
      : bond.status === "flat"
        ? "text-neutral-600"
        : "text-emerald-600";

  return (
    <tr ref={ref} className="align-middle">
      {/* Bond + status dot */}
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
              className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${bond.status === "up"
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

      {/* Interest rate (same for both) */}
      <td className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}>
        {bond.interest_rate}% / yr
      </td>

      {/* Different middle columns depending on tab */}
      {variant === "primary" ? (
        <>
          {/* Total units offered */}
          <td className={`py-5 px-3 text-[14px] ${dim}`}>
            {Number(bond.tl_unit_offered) / 10}
          </td>
          {/* Subscribed / Offered */}
          <td className={`py-5 px-3 text-[14px] ${dim}`}>
            {nfInt.format(Number(bond.tl_unit_subscribed) / 10)} /{" "}
            {nfInt.format(Number(bond.tl_unit_offered) / 10)}
          </td>
        </>
      ) : (
        <>
          {/* For resale, maybe "Units listed" & "—" or something else */}
          <td className={`py-5 px-3 text-[14px] ${dim}`}>
            {nfInt.format(bond.tl_unit_offered)} Units
          </td>
          <td className={`py-5 px-3 text-[14px] ${dim}`}>
            {nfInt.format(bond.tl_unit_offered)} Units
          </td>
        </>
      )}

      {/* Face value (same for both) */}
      <td className={`py-5 px-3 text-[14px] ${dim}`}>
        {nfCurrency.format(Number(bond.face_value) / 10)}
      </td>

      {/* Action changes too if you want */}
      <td className="py-5 pl-3 pr-2">
        {variant === "primary" ? (
          <Link href={`/investor/AboutBond/${bond.id}`}>
            <IoDocumentTextOutline className="w-5 h-5 hover:text-[#5B50D9] transition-colors" />
          </Link>
        ) : (
          <Link href={`/investor/resale/${bond.id}`}>
            <IoDocumentTextOutline className="w-5 h-5 hover:text-[#5B50D9] transition-colors" />
          </Link>
        )}
      </td>
    </tr>
  );
});

BondRow.displayName = "BondRow";

// Mobile Bond Card Component
const MobileBondCard = forwardRef<
  HTMLDivElement,
  { bond: Bond; variant: "primary" | "resale" }
>(({ bond, variant }, ref) => {
  const dim = bond.disabled ? "text-neutral-300" : "text-neutral-900";
  const rateCol = bond.disabled
    ? "text-neutral-300"
    : bond.status === "down"
      ? "text-red-600"
      : bond.status === "flat"
        ? "text-neutral-600"
        : "text-emerald-600";

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200"
    >
      {/* Header with Bond name and status */}
      <div className="flex items-center justify-between mb-3">
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
              className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${bond.status === "up"
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
        <div className={`text-[14px] font-medium ${rateCol}`}>
          {bond.interest_rate}% / yr
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {variant === "primary" ? (
          <>
            <div className="space-y-1">
              <p className="text-neutral-500 text-xs">Total Units</p>
              <p className={dim}>{Number(bond.tl_unit_offered) / 10}</p>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500 text-xs">Available</p>
              <p className={dim}>
                {nfInt.format(Number(bond.tl_unit_subscribed) / 10)} /{" "}
                {nfInt.format(Number(bond.tl_unit_offered) / 10)}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-neutral-500 text-xs">Units Listed</p>
              <p className={dim}>{nfInt.format(bond.tl_unit_offered)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500 text-xs">Total Units</p>
              <p className={dim}>{nfInt.format(bond.tl_unit_offered)}</p>
            </div>
          </>
        )}

        <div className="space-y-1">
          <p className="text-neutral-500 text-xs">Face Value</p>
          <p className={dim}>{nfCurrency.format(Number(bond.face_value) / 10)}</p>
        </div>

        <div className="space-y-1 flex items-end">
          {variant === "primary" ? (
            <Link 
              href={`/investor/AboutBond/${bond.id}`}
              className="inline-flex items-center gap-1 text-[#5B50D9] hover:text-[#4a45b5] transition-colors"
            >
              <IoDocumentTextOutline className="w-4 h-4" />
              <span className="text-sm font-medium">View Details</span>
            </Link>
          ) : (
            <Link 
              href={`/investor/resale/${bond.id}`}
              className="inline-flex items-center gap-1 text-[#5B50D9] hover:text-[#4a45b5] transition-colors"
            >
              <IoDocumentTextOutline className="w-4 h-4" />
              <span className="text-sm font-medium">View Listing</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

MobileBondCard.displayName = "MobileBondCard";