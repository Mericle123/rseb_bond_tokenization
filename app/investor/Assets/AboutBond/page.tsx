"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

/* ====================== Motion ====================== */
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

/* ====================== Mock data ====================== */
type Bond = {
  id: string;
  name: string;
  symbol: string;
  issuer: string;
  couponPct: number;        // 0.05 -> 5%
  totalUnitsOffered: number;
  issued: string;           // "2024-09-02"
  maturity: string;         // "2026-09-02"
  faceValue: number;        // BTN coin per unit
  unitsBought: number;      // user-owned
  about: string;
};

const BONDS: Record<string, Bond> = {
  "1": {
    id: "1",
    name: "RSEB Bond",
    symbol: "BNK002",
    issuer: "Royal Security exchange of Bhutan",
    couponPct: 0.05,
    totalUnitsOffered: 100,
    issued: "2024-09-02",
    maturity: "2026-09-02",
    faceValue: 10,
    unitsBought: 100,
    about:
      "The Royal Securities Exchange of Bhutan (RSEB) is proud to introduce this digital bond as part of its mission to mobilize domestic capital for Bhutan’s long-term national development projects. These projects are vital to driving sustainable growth, modernizing infrastructure, and empowering communities across the country. By offering this bond on a secure, blockchain-based platform, RSEB opens the door for Bhutanese individuals and institutions to actively participate in shaping the nation’s financial future.\n\nFor investors, this bond represents more than just an opportunity to earn stable and transparent returns. It is also a chance to be directly involved in strengthening Bhutan’s financial ecosystem, supporting critical infrastructure initiatives, and fostering innovation in capital markets. Through digital participation, investors contribute to a collective effort that balances economic progress with Bhutan’s values of sustainability and community empowerment.",
  },
};

/* ====================== Helpers ====================== */
function formatDMY(dateISO: string) {
  const d = new Date(dateISO);
  const day = d.getDate();
  const suffix = (n: number) =>
    n % 10 === 1 && n % 100 !== 11
      ? "st"
      : n % 10 === 2 && n % 100 !== 12
      ? "nd"
      : n % 10 === 3 && n % 100 !== 13
      ? "rd"
      : "th";
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${day}${suffix(day)} ${month} ${year}`;
}

function useCountdown(toISO: string) {
  const [text, setText] = useState<string>("—");
  useEffect(() => {
    const target = new Date(toISO).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setText(
        `${String(days).padStart(2, "0")} Days : ${String(hours).padStart(
          2,
          "0"
        )} Hours : ${String(minutes).padStart(2, "0")} Minutes`
      );
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [toISO]);
  return text;
}

const nf = new Intl.NumberFormat("en-IN");

/* ====================== Wallet strip ====================== */
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

/* ====================== Slide-over (generic) ====================== */
function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const firstRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-[18px] border border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex items-center border-b border-black/10 px-4 py-3">
          <button
            ref={firstRef}
            onClick={onClose}
            aria-label="Back"
            className="relative z-20 p-2 rounded-full hover:bg-black/5 active:bg-black/10"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium tracking-[0.2px] pointer-events-none">
            {title ?? ""}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

/* ====================== Trade Sheet (Buy/Sell) ====================== */
function TradeSheet({
  mode,            // "sell" | "buy"
  walletCoins,
  bond,
  onClose,
}: {
  mode: "sell" | "buy";
  walletCoins: number;
  bond: Bond;
  onClose: () => void;
}) {
  const [units, setUnits] = useState("1000");
  const [cap, setCap] = useState("1,000,000");

  // formatting helpers
  const fmtInput = (v: string) =>
    v.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // --- Dynamic conversion logic ---
  const numericUnits = parseInt(units.replace(/,/g, "")) || 0;
  const numericCap = parseFloat(cap.replace(/,/g, "")) || 0;
  const conversionRate = numericUnits > 0 ? numericCap / numericUnits : 1;
  const conversionText = `1 BTN Coin ≈ BTN Nu ${conversionRate.toFixed(2)}`;

  const labelVerb = mode === "sell" ? "sell" : "buy";
  const title = mode === "sell" ? "Sell" : "Buy";

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[420px]">
        {/* top coin pill */}
        <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
          <Image src="/coin.png" alt="coin" width={24} height={24} />
        </div>
        <p className="mt-2 text-center text-[13px]">
          <span className="font-semibold">Your wallet has</span>
          <br />
          {nf.format(walletCoins)} coins
        </p>

        {/* Bond header (centered) */}
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="relative h-14 w-14 rounded-full border border-neutral-200 bg-white grid place-items-center">
            <Image src="/RSEB.png" alt="Issuer" width={30} height={30} />
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-500"
            />
          </div>
          <h3 className="mt-3 text-[18px] font-semibold leading-tight">
            {bond.name}
          </h3>
          <p className="text-[13px] text-neutral-600 mt-1">
            <span className="font-semibold">Symbol:</span> {bond.symbol}
          </p>
        </div>

        <h4 className="mt-6 text-center text-[16px] font-semibold">{title}</h4>

        {/* Units */}
        <label className="block text-left mt-4 text-[13px] font-medium text-black/60">
          Units to {labelVerb}
        </label>
        <input
          value={units}
          onChange={(e) => setUnits(fmtInput(e.target.value))}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
          inputMode="numeric"
        />

        {/* Dynamic conversion */}
        <div className="mt-1 flex items-center gap-1 text-[12px] text-black/60">
          <Image src="/coin.png" alt="" width={14} height={14} />
          <span>{conversionText}</span>
        </div>

        {/* Cap Face value */}
        <label className="block text-left mt-4 text-[13px] font-medium text-black/60">
          Cap Face value
        </label>
        <input
          value={cap}
          onChange={(e) => setCap(fmtInput(e.target.value))}
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
          inputMode="numeric"
        />

        <p className="mt-3 text-[12px] text-red-600">
          Warning: Blockchain transfers are irreversible. Double-check the address before sending.
        </p>

        <button
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold"
          type="button"
          onClick={onClose}
        >
          {title}
        </button>
      </div>
    </div>
  );
}

/* ====================== Page ====================== */
export default function AboutBondPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bondId = params.get("bond") ?? "1";
  const bond = useMemo(() => BONDS[bondId] ?? BONDS["1"], [bondId]);

  const walletAddress = "0i4u1290nfkjd809214190poij"; // mock
  const countdown = useCountdown(bond.maturity);

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <WalletStrip walletAddress={walletAddress} />

        <motion.section
          {...fadeIn}
          className="mt-6 rounded-2xl border border-black/15 bg-white px-4 sm:px-6 py-5 sm:py-6 shadow-sm"
        >
          {/* Back + title */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-neutral-100"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              About Bond
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 rounded-full border border-neutral-200 bg-white grid place-items-center shrink-0">
                  <Image src="/RSEB.png" alt="Issuer" width={28} height={28} />
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-500"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{bond.name}</h2>
                  <p className="text-[13px] text-neutral-600">
                    <span className="font-semibold">Symbol:</span> {bond.symbol}
                  </p>
                  <p className="text-[13px] text-emerald-600 mt-1">
                    Interest rate : + {(bond.couponPct * 100).toFixed(0)}% yr
                  </p>
                  <p className="text-[13px] text-neutral-500 mt-1">From : {bond.issuer}</p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Details</h3>
                <dl className="mt-3 space-y-1 text-[14px]">
                  <div><dt className="font-semibold inline">Bond Name :</dt> <dd className="inline"> {bond.name}</dd></div>
                  <div><dt className="font-semibold inline">Bond Symbol :</dt> <dd className="inline"> {bond.symbol}</dd></div>
                  <div><dt className="font-semibold inline">Issuer :</dt> <dd className="inline"> {bond.issuer}</dd></div>
                  <div><dt className="font-semibold inline">Total Units Offered :</dt> <dd className="inline"> {bond.totalUnitsOffered}</dd></div>
                  <div><dt className="font-semibold inline">Issued Date :</dt> <dd className="inline"> {formatDMY(bond.issued)}</dd></div>
                  <div><dt className="font-semibold inline">Maturity Date :</dt> <dd className="inline"> {formatDMY(bond.maturity)}</dd></div>
                  <div><dt className="font-semibold inline">Face value :</dt> <dd className="inline"> {bond.faceValue} BTN Coin</dd></div>
                </dl>

                <div className="mt-5 rounded-xl border border-neutral-200 p-4">
                  <p className="text-[13px] text-neutral-600">Days Till Maturity</p>
                  <p className="mt-1 text-lg font-semibold">{countdown}</p>
                </div>

                <button
                  className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#5B50D9] px-5 py-2.5 text-white font-medium"
                  onClick={() => setSheetOpen(true)}
                  type="button"
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Right column */}
            <div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <p className="text-[14px]">
                  <span className="font-semibold">Total Unit bought:</span> {bond.unitsBought} units
                </p>
                <p className="text-[13px] text-neutral-600 mt-1">
                  <span className="font-semibold">Total Unit Value :</span>{" "}
                  {bond.unitsBought * bond.faceValue} BTN Coin
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-neutral-700">
                  {bond.about}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Slide-over with dynamic conversion */}
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Re-Account">
          <TradeSheet mode="sell" walletCoins={1000} bond={bond} onClose={() => setSheetOpen(false)} />
        </Sheet>
      </main>
    </div>
  );
}
